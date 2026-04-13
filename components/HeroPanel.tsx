"use client";

import { useState, useEffect } from "react";

const stats = [
  { value: "2.4M", label: "Emails delivered" },
  { value: "98.7%", label: "Delivery rate" },
  { value: "4.2x", label: "Reply rate boost" },
];

const testimonials = [
  {
    text: "MailForge completely changed how we do outreach. The smart delays feel human — our reply rates tripled in the first month.",
    name: "Casey Bachmeyer",
    role: "Founder, Sisyphus Ventures",
    initials: "CB",
  },
  {
    text: "We went from manually sending 20 emails a day to automating hundreds. The timezone-aware scheduling is a killer feature.",
    name: "Jordan Mitchell",
    role: "CEO, Apex Solutions",
    initials: "JM",
  },
  {
    text: "Clean, fast, and reliable. MailForge is the only outreach tool that actually respects your domain reputation.",
    name: "Taylor Reed",
    role: "Director, Nova Digital",
    initials: "TR",
  },
];

export function HeroPanel() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % testimonials.length);
        setAnimating(false);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const t = testimonials[active];

  return (
    <div className="hidden lg:flex flex-col bg-zinc-950 text-white rounded-3xl m-4 min-h-[calc(100vh-2rem)] w-1/2 relative overflow-hidden">

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glows */}
      <div
        className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-80px] left-[-60px] w-[320px] h-[320px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 right-0 w-px h-full opacity-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(249,115,22,0.8), transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col h-full p-10">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-16">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4l6 5 6-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <span className="font-semibold text-white tracking-tight">MailForge</span>
        </div>

        {/* Main heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-orange-400 text-xs font-medium tracking-wide">Intelligent email outreach</span>
          </div>

          <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-white mb-4">
            Send smarter.
            <br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)" }}>
              Close faster.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed max-w-[340px]">
            Automate personalized outreach with human-like delays, timezone awareness, and real-time delivery tracking — all in one place.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s, i) => (
            <div key={i} className="relative">
              <div
                className="rounded-2xl p-4 border border-white/[0.06]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-2xl font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-zinc-500 text-xs leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mb-auto">
          {["Smart delays", "Timezone aware", "SMTP safe", "Live tracking", "Template engine"].map((f) => (
            <span
              key={f}
              className="text-xs text-zinc-400 border border-white/[0.08] rounded-full px-3 py-1"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-10">
          <div
            className="rounded-2xl p-6 border border-white/[0.07] transition-all duration-350"
            style={{
              background: "rgba(255,255,255,0.04)",
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            {/* Quote mark */}
            <div className="text-orange-500/40 text-4xl font-serif leading-none mb-3 select-none">"</div>

            <p className="text-zinc-300 text-sm leading-relaxed mb-5">
              {t.text}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-zinc-500 text-xs">{t.role}</p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAnimating(true);
                      setTimeout(() => { setActive(i); setAnimating(false); }, 350);
                    }}
                    className="transition-all duration-300"
                    style={{
                      width: i === active ? "20px" : "6px",
                      height: "6px",
                      borderRadius: "3px",
                      background: i === active ? "#f97316" : "rgba(255,255,255,0.15)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}