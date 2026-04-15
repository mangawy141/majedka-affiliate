"use client";

import { ArrowRight } from "lucide-react";
import type { SiteContentMap } from "@/lib/site-content";

type AffiliateCTABannerProps = {
  explanationText: SiteContentMap["affiliate.explanation"];
};

export default function AffiliateCTABanner({
  explanationText,
}: AffiliateCTABannerProps) {
  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-xl overflow-hidden border-cyan-500/30 relative">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10" />

          {/* Content */}
          <div className="relative z-10 py-12 px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              ابدأ الآن وخلي متابعينك مصدر دخلك
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              {explanationText}
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 group"
            >
              انضم الآن
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
