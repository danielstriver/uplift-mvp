import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CreatorNav from "@/components/creator-nav";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "creator") redirect("/earner");

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorNav fullName={profile.full_name} />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
