"use client";

import { useState } from "react";
import { formatRWF } from "@/lib/utils";
import { Play, CheckCircle, DollarSign, Eye } from "lucide-react";
import YouTubePlayer from "@/components/youtube-player";
import type { Campaign } from "@/types";

interface Props {
  campaign: Campaign;
  earnerId: string;
  alreadyWatched?: boolean;
}

export default function VideoCard({ campaign, earnerId, alreadyWatched = false }: Props) {
  const [watching, setWatching] = useState(false);
  const [earned, setEarned] = useState(alreadyWatched);
  const [justEarned, setJustEarned] = useState(false);

  function handleEarned(_amount: number) {
    setEarned(true);
    setJustEarned(true);
    setTimeout(() => setJustEarned(false), 3000);
  }

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all ${
      justEarned ? "border-green-400 shadow-green-100 shadow-lg" : "border-gray-100"
    }`}>
      {watching ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm truncate flex-1 mr-2">{campaign.title}</h3>
            <button
              onClick={() => setWatching(false)}
              className="text-xs text-gray-400 hover:text-gray-600 shrink-0"
            >
              Close
            </button>
          </div>
          <YouTubePlayer
            campaignId={campaign.id}
            videoId={campaign.youtube_video_id}
            earnPerView={campaign.cost_per_view_rwf}
            earnerId={earnerId}
            onEarned={handleEarned}
          />
        </div>
      ) : (
        <>
          {/* Thumbnail */}
          <div className="relative">
            <img
              src={`https://img.youtube.com/vi/${campaign.youtube_video_id}/mqdefault.jpg`}
              alt={campaign.title}
              className="w-full aspect-video object-cover"
            />
            {earned ? (
              <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                  <CheckCircle size={16} />
                  Earned!
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setWatching(true)}
                  className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm"
                >
                  <Play size={14} className="fill-current" />
                  Watch &amp; Earn
                </button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{campaign.title}</h3>
            {campaign.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye size={12} />
                {campaign.current_views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                <DollarSign size={14} />
                {formatRWF(campaign.cost_per_view_rwf)}
              </div>
            </div>

            {!earned && (
              <button
                onClick={() => setWatching(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 transition-colors"
              >
                <Play size={14} className="fill-current" />
                Watch &amp; Earn {formatRWF(campaign.cost_per_view_rwf)}
              </button>
            )}
          </div>
        </>
      )}

      {/* Earned toast */}
      {justEarned && (
        <div className="bg-green-50 border-t border-green-200 px-4 py-3 text-center">
          <p className="text-green-700 font-bold text-sm earn-pulse">
            +{formatRWF(campaign.cost_per_view_rwf)} added to your wallet!
          </p>
        </div>
      )}
    </div>
  );
}
