"use client";

import { useState, useEffect } from "react";

const testimonials = [
  {
    text: "This analytics platform is a game-changer! It's easy to use, provides valuable insights, and has helped me make smarter business decisions. I highly recommend it.",
    name: "Casey Bachmeyer",
    role: "Founder, Sisyphus Ventures",
  },
  {
    text: "I have been using this platform for my business and I am constantly amazed at the insights it provides. It has truly transformed the way I operate.",
    name: "Jordan Mitchell",
    role: "CEO, Apex Solutions",
  },
  {
    text: "The best analytics tool I've ever used. Clean interface, powerful features, and exceptional customer support. A must-have for any business owner.",
    name: "Taylor Reed",
    role: "Director, Nova Digital",
  },
];

export function HeroPanel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex flex-col justify-between bg-hero-bg text-hero-foreground rounded-3xl p-10 m-4 min-h-[calc(100vh-2rem)] w-1/2 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.25_0.02_180)] via-hero-bg to-[oklch(0.18_0.03_280)] opacity-60 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-auto">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Manage your Money
            <br />
            Anywhere
          </h1>
          <p className="text-hero-muted text-sm">
            View all the analytics and grow your business
            <br />
            from anywhere!
          </p>
        </div>

        {/* Testimonial carousel */}
        <div className="mb-8">
          <div className="flex gap-4 justify-center">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`bg-hero-card backdrop-blur-md rounded-2xl p-6 max-w-sm transition-all duration-500 ${
                  i === active
                    ? "opacity-100 scale-100"
                    : "opacity-40 scale-95 hidden md:block"
                }`}
              >
                <p className="text-sm text-hero-foreground leading-relaxed mb-5">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange/60" />
                  <div>
                    <p className="text-xs font-semibold text-hero-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-hero-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === active ? "bg-hero-foreground" : "bg-hero-muted/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
