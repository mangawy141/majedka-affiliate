"use client";

import { TrendingUp, Zap, Award, Target } from "lucide-react";
import Link from "next/link";

export default function AffiliatePromoSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "عمولة تنافسية",
      description: "احصل على 10% على كل عملية بيع",
    },
    {
      icon: Zap,
      title: "دفع فوري",
      description: "احصل على أرباحك كل أسبوع",
    },
    {
      icon: Award,
      title: "حوافز إضافية",
      description: "مكافآت للأداء العالي والروابط الحصرية",
    },
    {
      icon: Target,
      title: "دعم وأدوات",
      description: "لافتات، روابط تتبع، وتقارير تفصيلية",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA Box */}
        <div className="glass rounded-2xl overflow-hidden border-2 border-cyan-500/40 hover:border-cyan-500/80 transition-all duration-300">
          <div className="border-gradient-separator p-8 md:p-16">
            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left Section */}
              <div>
                <div className="mb-4 inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-sm text-cyan-300">
                  💰 فرصة ذهبية
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                  اربح معنا الآن
                </h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  انضم إلى برنامج شركاء مجيدكا واكسب عمولة على كل عملية بيع.
                  آلاف المعلنين يكسبون معنا بالفعل — هذا يمكن أن يكون دورك!
                </p>

                <Link
                  href="/apply"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 group"
                >
                  ابدأ الآن
                  <span className="group-hover:translate-x-1 transition">
                    →
                  </span>
                </Link>
              </div>

              {/* Right Section - Stats */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: "5000+", label: "شريك نشط" },
                  { number: "10%", label: "عمولة فورية" },
                  { number: "$1M+", label: "أرباح مدفوعة" },
                  { number: "24/7", label: "دعم فني" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="glass-sm p-4 border-cyan-500/30 rounded-lg text-center hover-scale"
                  >
                    <div className="text-2xl font-bold text-cyan-400 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div key={i} className="card-base text-center">
                <div className="inline-block p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-4">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-slate-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* FAQ Preview */}
        <div className="mt-16 p-8 glass rounded-xl border-cyan-500/30">
          <h3 className="text-2xl font-bold mb-8 text-center gradient-text">
            أسئلة شائعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "كيف أبدأ؟",
                a: "ملء النموذج، الموافقة خلال 48 ساعة، ثم ابدأ باكسب الأرباح",
              },
              {
                q: "متى أحصل على أرباحي؟",
                a: "يتم دفع الأرباح كل أسبوع الجمعة إلى حسابك المصرفي",
              },
              {
                q: "كم نсبة العمولة؟",
                a: "10% على كل عملية بيع، مع مكافآت إضافية للأداء العالي",
              },
              {
                q: "هل هناك متطلبات دنيا؟",
                a: "لا، كل من لديه موقع أو متابعين يمكنه الانضمام",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-sm p-4 rounded-lg border-cyan-500/20"
              >
                <p className="font-bold text-cyan-300 mb-2">{item.q}</p>
                <p className="text-sm text-slate-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
