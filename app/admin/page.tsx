import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatRWF } from "@/lib/utils";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import type { Campaign } from "@/types";

async function approveCampaign(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = createAdminClient();
  await supabase.from("campaigns").update({ status: "active" }).eq("id", id);
  revalidatePath("/admin");
}

async function rejectCampaign(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const supabase = createAdminClient();
  await supabase.from("campaigns").update({ status: "paused" }).eq("id", id);
  revalidatePath("/admin");
}

export default async function AdminPage() {
  const supabase = createAdminClient();

  const { data: pending } = await supabase
    .from("campaigns")
    .select("*, profiles(full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const { data: active } = await supabase
    .from("campaigns")
    .select("id")
    .eq("status", "active");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black">Campaign approvals</h1>
        <p className="text-gray-500 text-sm mt-1">
          Review and approve campaigns before they go live to earners.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Pending review</p>
          <p className="text-3xl font-black text-amber-500">{pending?.length ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Live campaigns</p>
          <p className="text-3xl font-black text-green-600">{active?.length ?? 0}</p>
        </div>
      </div>

      {/* Pending campaigns */}
      {!pending?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <CheckCircle className="text-green-400 mx-auto mb-4" size={40} />
          <h3 className="font-bold text-lg mb-1">All caught up</h3>
          <p className="text-gray-500 text-sm">No campaigns waiting for review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((campaign: Campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex gap-5 items-start">
                {/* Thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${campaign.youtube_video_id}/mqdefault.jpg`}
                  alt={campaign.title}
                  className="w-36 h-20 object-cover rounded-xl shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base">{campaign.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        by {campaign.profiles?.full_name ?? "Unknown creator"}
                      </p>
                      {campaign.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full shrink-0">
                      <Clock size={11} />
                      Pending
                    </span>
                  </div>

                  {/* Campaign meta */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <TrendingUp size={14} className="text-violet-500" />
                      {campaign.target_views.toLocaleString()} target views
                    </div>
                    <div className="text-gray-600">
                      {formatRWF(campaign.cost_per_view_rwf)} / view
                    </div>
                    <div className="font-semibold text-violet-700">
                      Budget: {formatRWF(campaign.budget_rwf)}
                    </div>
                  </div>

                  <a
                    href={campaign.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs text-violet-600 hover:underline"
                  >
                    Watch on YouTube →
                  </a>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                <form action={approveCampaign}>
                  <input type="hidden" name="id" value={campaign.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle size={15} />
                    Approve &amp; go live
                  </button>
                </form>

                <form action={rejectCampaign}>
                  <input type="hidden" name="id" value={campaign.id} />
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-50 transition-colors"
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
