import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublicVideoCard from "@/components/public-video-card";
import { TrendingUp, DollarSign } from "lucide-react";
import type { Campaign } from "@/types";

export default async function BrowsePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in earners belong on their dashboard where they can actually earn
  if (user) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "earner") redirect("/earner");
  }

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-violet-600">
            UPLIFT
          </Link>
          <div className="flex gap-3 items-center">
            {user ? (
              <Link
                href="/creator"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
              >
                My dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
                  Sign in
                </Link>
                <Link href="/auth/register?role=earner" className="px-4 py-2 text-sm font-semibold bg-amber-400 text-gray-900 rounded-lg hover:bg-amber-500 transition-colors">
                  Sign up &amp; earn
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Videos available to watch</h1>
          <p className="text-gray-500">
            Watch any video below.{" "}
            <Link href="/auth/register?role=earner" className="text-amber-600 font-semibold hover:underline">
              Sign up free
            </Link>{" "}
            to get paid for every video you watch.
          </p>
        </div>

        {/* Sign-up nudge banner */}
        {!user && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="text-gray-900" size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900">Get paid to watch these videos</p>
                <p className="text-sm text-gray-600">Earn RWF directly to your MTN MoMo. Free to join.</p>
              </div>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/auth/register?role=earner"
                className="bg-amber-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-500 transition-colors"
              >
                Start earning free
              </Link>
              <Link
                href="/auth/register?role=creator"
                className="bg-white text-violet-700 border border-violet-200 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-violet-50 transition-colors flex items-center gap-2"
              >
                <TrendingUp size={14} />
                Boost my video
              </Link>
            </div>
          </div>
        )}

        {/* Video grid */}
        {!campaigns?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <p className="text-4xl mb-4">🎬</p>
            <h3 className="font-bold text-lg mb-2">No videos live yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              Be the first creator to launch a campaign.
            </p>
            <Link
              href="/auth/register?role=creator"
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors"
            >
              <TrendingUp size={16} />
              Launch a campaign
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign: Campaign) => (
              <PublicVideoCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
