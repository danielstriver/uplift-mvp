import { createClient } from "@/lib/supabase/server";
import { formatRWF } from "@/lib/utils";
import VideoCard from "@/components/video-card";
import type { Campaign } from "@/types";

export default async function EarnerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get active campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Get earner's completed watch sessions so we can mark already-watched
  const { data: watchSessions } = await supabase
    .from("watch_sessions")
    .select("campaign_id, completed, earned_rwf")
    .eq("earner_id", user!.id);

  const watchedCampaignIds = new Set(
    watchSessions?.filter((s) => s.completed).map((s) => s.campaign_id) ?? []
  );

  const totalEarned = watchSessions?.reduce((sum, s) => sum + (s.earned_rwf ?? 0), 0) ?? 0;

  const available = campaigns?.filter((c: Campaign) => !watchedCampaignIds.has(c.id)) ?? [];
  const completed = campaigns?.filter((c: Campaign) => watchedCampaignIds.has(c.id)) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Available videos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Watch 70% or more of each video to earn. One earn per video.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Available to watch</p>
          <p className="text-2xl font-black text-amber-500">{available.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Videos watched</p>
          <p className="text-2xl font-black text-violet-600">{watchedCampaignIds.size}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Total earned</p>
          <p className="text-2xl font-black text-green-600">{formatRWF(totalEarned)}</p>
        </div>
      </div>

      {/* Available videos */}
      {available.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-4">🎬</p>
          <h3 className="font-bold text-lg mb-2">No new videos right now</h3>
          <p className="text-gray-500 text-sm">
            Check back soon — new campaigns are added regularly.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {available.map((campaign: Campaign) => (
            <VideoCard key={campaign.id} campaign={campaign} earnerId={user!.id} />
          ))}
        </div>
      )}

      {/* Watched videos */}
      {completed.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold mb-4 text-gray-400">Already watched</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-60">
            {completed.map((campaign: Campaign) => (
              <VideoCard key={campaign.id} campaign={campaign} earnerId={user!.id} alreadyWatched />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
