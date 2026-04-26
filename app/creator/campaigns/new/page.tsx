"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { extractYouTubeId, formatRWF } from "@/lib/utils";
import { ArrowLeft, Play, AlertCircle } from "lucide-react";

const COST_PER_VIEW_OPTIONS = [
  { label: "Budget", rwf: 20, desc: "Slower delivery, max reach per franc" },
  { label: "Standard", rwf: 35, desc: "Balanced speed and cost" },
  { label: "Fast", rwf: 50, desc: "Priority delivery, fastest views" },
];

export default function NewCampaignPage() {
  const router = useRouter();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetViews, setTargetViews] = useState(500);
  const [costPerView, setCostPerView] = useState(35);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const videoId = extractYouTubeId(youtubeUrl);
  const totalBudget = targetViews * costPerView;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!videoId) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    if (targetViews < 100) {
      setError("Minimum 100 views per campaign.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("campaigns").insert({
      creator_id: user!.id,
      youtube_url: youtubeUrl,
      youtube_video_id: videoId,
      title,
      description: description || null,
      target_views: targetViews,
      budget_rwf: totalBudget,
      cost_per_view_rwf: costPerView,
      status: "pending",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/creator");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/creator" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} />
          Back to campaigns
        </Link>
        <h1 className="text-2xl font-black">Launch a new campaign</h1>
        <p className="text-gray-500 text-sm mt-1">Real people will watch your video and you only pay per completed view.</p>
      </div>

      {error && (
        <div className="mb-6 flex gap-2 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold mb-4">Your YouTube video</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">YouTube URL</label>
              <input
                type="url"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Video preview */}
            {videoId && (
              <div className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt="Video thumbnail"
                  className="w-24 h-14 object-cover rounded-lg"
                />
                <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                  <Play size={14} className="fill-current" />
                  Video detected — looks good!
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">Campaign title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="What is this video about?"
                maxLength={80}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                placeholder="Help earners understand what they're watching"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold mb-4">Budget &amp; delivery</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3">Cost per view</label>
              <div className="grid grid-cols-3 gap-3">
                {COST_PER_VIEW_OPTIONS.map(({ label, rwf, desc }) => (
                  <button
                    key={rwf}
                    type="button"
                    onClick={() => setCostPerView(rwf)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      costPerView === rwf
                        ? "border-violet-600 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-bold text-sm">{formatRWF(rwf)}</div>
                    <div className="text-xs font-medium text-violet-700">{label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Target views: <span className="text-violet-600">{targetViews.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={targetViews}
                onChange={(e) => setTargetViews(Number(e.target.value))}
                className="w-full accent-violet-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>100</span>
                <span>10,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6">
          <h2 className="font-bold mb-4 text-violet-800">Campaign summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Target views</span>
              <span className="font-semibold">{targetViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cost per view</span>
              <span className="font-semibold">{formatRWF(costPerView)}</span>
            </div>
            <div className="border-t border-violet-200 pt-2 mt-2 flex justify-between">
              <span className="font-bold text-violet-800">Total budget</span>
              <span className="font-black text-violet-700 text-lg">{formatRWF(totalBudget)}</span>
            </div>
          </div>

          <p className="text-xs text-violet-600 mt-3">
            Payment via MTN MoMo, Airtel Money, or card after review. Campaign activates within 24 hours.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !videoId}
          className="w-full bg-violet-600 text-white py-4 rounded-xl font-bold text-base hover:bg-violet-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : `Submit campaign — ${formatRWF(totalBudget)}`}
        </button>
      </form>
    </div>
  );
}
