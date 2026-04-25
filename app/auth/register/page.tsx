"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TrendingUp, DollarSign, Mail } from "lucide-react";
import type { UserRole } from "@/types";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as UserRole) || "earner";

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, phone: phone || "" },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If session exists the user is immediately logged in (email confirm off)
    if (authData.session) {
      router.push(role === "creator" ? "/creator" : "/earner");
      router.refresh();
      return;
    }

    // No session = email confirmation required
    setNeedsConfirmation(true);
    setLoading(false);
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-violet-600" />
          </div>
          <h1 className="text-2xl font-black mb-2">Check your email</h1>
          <p className="text-gray-500 mb-2">
            We sent a confirmation link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-8">
            Click the link in the email to activate your account, then come back and sign in.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-violet-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black text-violet-600">
            UPLIFT
          </Link>
          <h1 className="text-2xl font-bold mt-4 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm">Free to join. Pick your role.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Role picker */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === "creator"
                  ? "border-violet-600 bg-violet-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <TrendingUp
                size={24}
                className={role === "creator" ? "text-violet-600" : "text-gray-400"}
              />
              <div className="text-center">
                <div className="font-semibold text-sm">Creator</div>
                <div className="text-xs text-gray-500">Boost my videos</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("earner")}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                role === "earner"
                  ? "border-amber-400 bg-amber-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <DollarSign
                size={24}
                className={role === "earner" ? "text-amber-500" : "text-gray-400"}
              />
              <div className="text-center">
                <div className="font-semibold text-sm">Earner</div>
                <div className="text-xs text-gray-500">Watch &amp; earn money</div>
              </div>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Jean Paul Mugisha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Phone (MTN or Airtel)
                <span className="text-gray-400 font-normal ml-1">— for payments</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="07X XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                role === "creator"
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-amber-400 text-gray-900 hover:bg-amber-500"
              }`}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-violet-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
