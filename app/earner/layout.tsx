import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EarnerNav from "@/components/earner-nav";

export default async function EarnerLayout({
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

  if (profile?.role !== "earner") redirect("/creator");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance_rwf")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <EarnerNav fullName={profile.full_name} balance={wallet?.balance_rwf ?? 0} />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
