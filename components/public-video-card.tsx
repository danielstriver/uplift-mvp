"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Eye, DollarSign } from "lucide-react";
import { formatRWF } from "@/lib/utils";
import type { Campaign } from "@/types";

export default function PublicVideoCard({ campaign }: { campaign: Campaign }) {
  const [watching, setWatching] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {watching ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm truncate flex-1 mr-2">{campaign.title}</h3>
            <button onClick={() => setWatching(false)} className="text-xs text-gray-400 hover:text-gray-600 shrink-0">
              Close
            </button>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${campaign.youtube_video_id}?autoplay=1&modestbranding=1&rel=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Earn CTA banner */}
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-amber-800">
                Earn {formatRWF(campaign.cost_per_view_rwf)} for watching this
              </p>
              <p className="text-xs text-amber-600 mt-0.5">Sign up free — takes 30 seconds</p>
            </div>
            <Link
              href={`/auth/register?role=earner`}
              className="shrink-0 bg-amber-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-500 transition-colors"
            >
              Sign up to earn
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="relative group cursor-pointer" onClick={() => setWatching(true)}>
            <img
              src={`https://img.youtube.com/vi/${campaign.youtube_video_id}/mqdefault.jpg`}
              alt={campaign.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg">
                <Play size={14} className="fill-current" />
                Watch
              </div>
            </div>
            {/* Earn badge */}
            <div className="absolute top-2 right-2 bg-amber-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full">
              +{formatRWF(campaign.cost_per_view_rwf)}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{campaign.title}</h3>
            {campaign.description && (
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
            )}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Eye size={12} />
                {campaign.current_views.toLocaleString()} views
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                <DollarSign size={14} />
                {formatRWF(campaign.cost_per_view_rwf)} / view
              </div>
            </div>

            <Link
              href="/auth/register?role=earner"
              className="block text-center bg-amber-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 transition-colors"
            >
              Sign up to earn {formatRWF(campaign.cost_per_view_rwf)}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
