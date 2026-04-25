import { createClient } from "@/lib/supabase/server";
import { formatRWF } from "@/lib/utils";
import { DollarSign, ArrowDownCircle, Clock } from "lucide-react";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const canWithdraw = (wallet?.balance_rwf ?? 0) >= 2000;

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black">My Wallet</h1>
        <p className="text-gray-500 text-sm mt-1">Withdraw to MTN MoMo or Airtel Money</p>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-8 text-white mb-6">
        <p className="text-violet-200 text-sm mb-2">Available balance</p>
        <p className="text-5xl font-black mb-6">
          {formatRWF(wallet?.balance_rwf ?? 0)}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-violet-300">Total earned</p>
            <p className="font-bold">{formatRWF(wallet?.total_earned_rwf ?? 0)}</p>
          </div>
          <div>
            <p className="text-violet-300">Withdrawn</p>
            <p className="font-bold">{formatRWF(wallet?.total_withdrawn_rwf ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Withdraw button */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold mb-1">Withdraw funds</h2>
        <p className="text-sm text-gray-500 mb-4">Minimum withdrawal: 2,000 RWF</p>

        {canWithdraw ? (
          <button className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-amber-500 transition-colors">
            <ArrowDownCircle size={18} />
            Withdraw to MoMo
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
            <Clock size={16} className="shrink-0" />
            Earn {formatRWF(2000 - (wallet?.balance_rwf ?? 0))} more to unlock withdrawal
          </div>
        )}
      </div>

      {/* Transaction history */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold mb-4">Transaction history</h2>

        {!transactions?.length ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <DollarSign size={32} className="mx-auto mb-2 opacity-30" />
            No transactions yet. Start watching videos to earn!
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{tx.description ?? tx.type}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString("en-RW", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span className={`font-bold text-sm ${tx.type === "earn" ? "text-green-600" : "text-red-500"}`}>
                  {tx.type === "earn" ? "+" : "-"}{formatRWF(tx.amount_rwf)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
