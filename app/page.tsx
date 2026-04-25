import Link from "next/link";
import { ArrowRight, Play, DollarSign, Eye, TrendingUp, Users, CheckCircle, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-2xl font-black tracking-tight text-violet-600">UPLIFT</span>
        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero — 10-second clarity: who, what, why */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <Zap size={12} />
          Built for Rwanda&apos;s creators &amp; everyday earners
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          Get your videos seen.
          <br />
          <span className="text-violet-600">Get paid to watch.</span>
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
          Creators pay for real views from real people. Earners get paid to
          watch videos they&apos;d scroll past anyway. No bots. No fake traffic. Just people.
        </p>

        {/* Dual CTA — the core two user types */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register?role=creator"
            className="group flex items-center gap-3 bg-violet-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-violet-700 transition-all shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5"
          >
            <TrendingUp size={20} />
            I&apos;m a Creator
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/auth/register?role=earner"
            className="group flex items-center gap-3 bg-amber-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5"
          >
            <DollarSign size={20} />
            I want to Earn
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* How it works — workflow thinking from the guide */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-4">How UPLIFT works</h2>
          <p className="text-center text-gray-500 mb-16">Simple loop. Real value on both sides.</p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Creator side */}
            <div className="bg-white rounded-2xl p-8 border border-violet-100 shadow-sm">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-violet-600" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-6 text-violet-700">For Creators</h3>
              <ol className="space-y-4">
                {[
                  { step: "1", text: "Paste your YouTube video URL" },
                  { step: "2", text: "Set your view target and budget" },
                  { step: "3", text: "Pay via MTN MoMo, Airtel, or card" },
                  { step: "4", text: "Watch your views grow — real people, real watch time" },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </span>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Earner side */}
            <div className="bg-white rounded-2xl p-8 border border-amber-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="text-amber-600" size={20} />
              </div>
              <h3 className="text-xl font-bold mb-6 text-amber-600">For Earners</h3>
              <ol className="space-y-4">
                {[
                  { step: "1", text: "Sign up free — takes 30 seconds" },
                  { step: "2", text: "Browse available videos on the platform" },
                  { step: "3", text: "Watch the video (at least 70% to earn)" },
                  { step: "4", text: "Withdraw your earnings via MTN MoMo" },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-gray-900 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step}
                    </span>
                    <span className="text-gray-700">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black text-center mb-4">Why UPLIFT is different</h2>
        <p className="text-center text-gray-500 mb-16">Built on trust. Designed for Rwanda.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="text-violet-600" size={24} />,
              title: "Real people, real views",
              desc: "Every view comes from a verified Rwandan earner watching your full video — not bots or click farms.",
            },
            {
              icon: <CheckCircle className="text-violet-600" size={24} />,
              title: "70% watch time required",
              desc: "Earners must watch at least 70% of your video to receive payment. You get genuine attention.",
            },
            {
              icon: <Eye className="text-violet-600" size={24} />,
              title: "Live campaign tracking",
              desc: "See your view count grow in real time. Know exactly where your budget is going.",
            },
            {
              icon: <DollarSign className="text-violet-600" size={24} />,
              title: "Instant MoMo payouts",
              desc: "Earners withdraw directly to MTN MoMo or Airtel Money. No bank account needed.",
            },
            {
              icon: <Play className="text-violet-600" size={24} />,
              title: "YouTube native",
              desc: "Your video plays natively from YouTube. Views are legitimate and count toward your channel analytics.",
            },
            {
              icon: <TrendingUp className="text-violet-600" size={24} />,
              title: "Pay what you can afford",
              desc: "Start with any budget. Set your price per view. No minimums, no hidden fees.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <h4 className="font-bold mb-1">{title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-violet-600 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-violet-200 text-lg mb-10">
            Join hundreds of Rwandan creators and earners already on the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register?role=creator"
              className="px-8 py-4 bg-white text-violet-700 font-bold rounded-xl hover:bg-violet-50 transition-colors"
            >
              Launch a campaign
            </Link>
            <Link
              href="/auth/register?role=earner"
              className="px-8 py-4 bg-violet-500 text-white font-bold rounded-xl border border-violet-400 hover:bg-violet-400 transition-colors"
            >
              Start earning today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xl font-black text-violet-600">UPLIFT</span>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} UPLIFT. Made with purpose in Rwanda.
          </p>
        </div>
      </footer>
    </div>
  );
}
