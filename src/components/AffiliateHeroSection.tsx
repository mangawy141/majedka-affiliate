"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import type { SiteContentMap } from "@/lib/site-content";

type HeroProps = {
  title: SiteContentMap["hero.title"];
  subtitle: SiteContentMap["hero.subtitle"];
  badge: SiteContentMap["hero.badge"];
  primaryCtaLabel: SiteContentMap["hero.primaryCtaLabel"];
  secondaryCtaLabel: SiteContentMap["hero.secondaryCtaLabel"];
};

export default function AffiliateHeroSection({
  title,
  subtitle,
  badge,
  primaryCtaLabel,
  secondaryCtaLabel,
}: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-float" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-slide-in">
          <div className="glass-sm px-4 py-2 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium">{badge}</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-slide-in">
          <span className="gradient-text">{title}</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 animate-slide-in">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-slide-in">
          <a
            href="#apply"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-lg hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
          >
            {primaryCtaLabel}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-4 glass border-cyan-500/50 text-cyan-300 font-bold text-lg hover:bg-cyan-500/20 transition-all duration-300 rounded-lg hover:scale-105"
          >
            {secondaryCtaLabel}
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-in">
          {[
            { number: "10%", label: "ربح فوري من كل طلب" },
            { number: "10%", label: "خصم خاص لمتابعينك" },
            { number: "95%", label: "من منتجات المتجر تحت يديك" },
          ].map((stat, i) => (
            <div key={i} className="glass-sm p-4 rounded-lg">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
    </section>
  );
}
