"use client";

import { useEffect, useState } from "react";
import { DynamicAffiliateForm } from "./DynamicAffiliateForm";

export function SimplifiedHeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 start-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 end-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="space-y-8">
          {/* Main heading with animated entrance */}
          <div className="space-y-4 animate-slide-in">
            <div className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full">
              <span className="text-cyan-300 text-sm font-semibold">
                🎮 برنامج التسويق بالعمولة
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">ابدأ الربح</span>
              <br />
              من الألعاب
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl leading-relaxed">
              انضم إلى برنامجنا وابدأ في كسب عمولة من كل عملية بيع
            </p>
          </div>

          {/* Key metrics - Updated per requirements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8">
            <div className="glass p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold gradient-text mb-2">10%</div>
              <p className="text-slate-300">ربح فوري من كل طلب</p>
            </div>
            <div className="glass p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold gradient-text mb-2">10%</div>
              <p className="text-slate-300">خصم خاص لمتابعينك</p>
            </div>
            <div className="glass p-6 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="text-3xl font-bold gradient-text mb-2">95%</div>
              <p className="text-slate-300">منتجات المتجر مشمولة</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() =>
                document
                  .getElementById("form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              انضم الآن وابدأ الربح
            </button>
            <a
              href="https://mjeedka.com/"
              className="px-8 py-4 border border-slate-500 text-slate-300 font-semibold rounded-lg hover:border-blue-400 hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              تعرف أكثر
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {!isScrolled && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-cyan-400 text-sm">اسحب للأسفل</div>
          <svg
            className="w-6 h-6 mx-auto text-cyan-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </section>
  );
}
