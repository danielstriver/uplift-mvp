"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRWF } from "@/lib/utils";
import { CheckCircle, DollarSign } from "lucide-react";

interface Props {
  campaignId: string;
  videoId: string;
  earnPerView: number;
  earnerId: string;
  onEarned: (amount: number) => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  getDuration: () => number;
  getCurrentTime: () => number;
  destroy: () => void;
}

const EARN_THRESHOLD = 0.7;

export default function YouTubePlayer({ campaignId, videoId, earnPerView, earnerId, onEarned }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [watchPercent, setWatchPercent] = useState(0);
  const [earned, setEarned] = useState(false);
  const [earning, setEarning] = useState(false);
  const hasCredited = useRef(false);

  const creditEarner = useCallback(async () => {
    if (hasCredited.current) return;
    hasCredited.current = true;
    setEarning(true);

    const supabase = createClient();

    const { error } = await supabase.from("watch_sessions").upsert(
      {
        earner_id: earnerId,
        campaign_id: campaignId,
        completed: true,
        earned_rwf: earnPerView,
      },
      { onConflict: "earner_id,campaign_id" }
    );

    if (!error) {
      await supabase.rpc("increment_wallet", {
        p_user_id: earnerId,
        p_amount: earnPerView,
      });

      await supabase.from("transactions").insert({
        user_id: earnerId,
        type: "earn",
        amount_rwf: earnPerView,
        description: `Watched video on UPLIFT`,
      });

      await supabase.rpc("increment_campaign_views", {
        p_campaign_id: campaignId,
      });

      setEarned(true);
      onEarned(earnPerView);
    }

    setEarning(false);
  }, [campaignId, earnerId, earnPerView, onEarned]);

  // Keep a ref to the latest creditEarner so the player setup effect
  // never needs to re-run (and destroy/recreate the iframe) when it changes.
  const creditEarnerRef = useRef(creditEarner);
  useEffect(() => {
    creditEarnerRef.current = creditEarner;
  });

  useEffect(() => {
    function initPlayer() {
      if (!containerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { modestbranding: 1, rel: 0, autoplay: 0 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              intervalRef.current = setInterval(() => {
                if (!playerRef.current) return;
                const duration = playerRef.current.getDuration();
                const current = playerRef.current.getCurrentTime();
                if (duration > 0) {
                  const pct = current / duration;
                  setWatchPercent(pct);
                  if (pct >= EARN_THRESHOLD && !hasCredited.current) {
                    creditEarnerRef.current();
                  }
                }
              }, 2000);
            } else {
              if (intervalRef.current) clearInterval(intervalRef.current);
            }
          },
        },
      });
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, [videoId]); // stable — only recreates player if the video itself changes

  const progressPct = Math.min(watchPercent * 100, 100);
  const thresholdLeft = Math.max(0, (EARN_THRESHOLD - watchPercent) * 100);

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
        <div ref={containerRef} className="w-full h-full" />
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-600 font-medium">Watch progress</span>
          {earned ? (
            <span className="flex items-center gap-1.5 text-green-600 font-bold">
              <CheckCircle size={14} />
              Earned {formatRWF(earnPerView)}!
            </span>
          ) : (
            <span className="text-gray-500">
              {thresholdLeft > 0
                ? `${thresholdLeft.toFixed(0)}% more to earn`
                : "Almost there..."}
            </span>
          )}
        </div>

        <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              earned ? "bg-green-500" : "bg-violet-500"
            }`}
            style={{ width: `${progressPct}%` }}
          />
          <div className="absolute top-0 bottom-0 w-0.5 bg-amber-400" style={{ left: "70%" }} />
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span>
          <span className="text-amber-600 font-medium">70% — earn {formatRWF(earnPerView)}</span>
          <span>100%</span>
        </div>
      </div>

      {earning && !earned && (
        <div className="flex items-center gap-2 justify-center p-3 bg-amber-50 rounded-xl text-amber-700 text-sm font-medium">
          <DollarSign size={16} className="animate-bounce" />
          Crediting your earnings...
        </div>
      )}
    </div>
  );
}
