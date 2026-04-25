import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TrendingUp, Plus, Clock, CheckCircle, PauseCircle } from "lucide-react";
import { formatRWF } from "@/lib/utils";
import type { Campaign } from "@/types";

const statusConfig = {
  pending: { label: "Pending review", icon: Clock, color: "text-amber-600 bg-amber-50" },
  active: { label: "Active", icon: TrendingUp, color: "text-green-600 bg-green-50" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-blue-600 bg-blue-50" },
  paused: { label: "Paused", icon: PauseCircle, color: "text-gray-500 bg-gray-50" },
};

export default async function CreatorDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("creator_id", user!.id)
    .order("created_at", { ascending: false });

  const totalViews = campaigns?.reduce((sum, c) => sum + c.current_views, 0) ?? 0;
  const totalSpent = campaigns
    ?.filter((c) => c.status !== "pending")
    .reduce((sum, c) => sum + c.current_views * c.cost_per_view_rwf, 0) ?? 0;
  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">My Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">Track your video promotions</p>
        </div>
        <Link
          href="/creator/campaigns/new"
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} />
          New campaign
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total views", value: totalViews.toLocaleString() },
          { label: "Active campaigns", value: String(activeCampaigns) },
          { label: "Total spent", value: formatRWF(totalSpent) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-black text-violet-600">{value}</p>
          </div>
        ))}
      </div>

      {/* Campaigns list */}
      {!campaigns?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-violet-400" size={28} />
          </div>
          <h3 className="font-bold text-lg mb-2">No campaigns yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Launch your first campaign to start getting real views on your YouTube videos.
          </p>
          <Link
            href="/creator/campaigns/new"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus size={16} />
            Launch first campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign: Campaign) => {
            const progress = Math.round((campaign.current_views / campaign.target_views) * 100);
            const { label, icon: StatusIcon, color } = statusConfig[campaign.status];

            return (
              <div key={campaign.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <img
                      src={`https://img.youtube.com/vi/${campaign.youtube_video_id}/mqdefault.jpg`}
                      alt={campaign.title}
                      className="w-28 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{campaign.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {campaign.current_views.toLocaleString()} / {campaign.target_views.toLocaleString()} views
                        &nbsp;·&nbsp; {formatRWF(campaign.cost_per_view_rwf)}/view
                      </p>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full w-full max-w-xs">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${color}`}>
                    <StatusIcon size={12} />
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
