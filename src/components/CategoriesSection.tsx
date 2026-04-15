"use client";

import { Gamepad2, Zap, Cpu, Users, Trophy, Radio } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Game Pass",
    description: "اشتراك سنوي بخصم 60%",
    icon: Gamepad2,
    color: "from-cyan-500 to-blue-500",
    count: "1200+",
  },
  {
    id: 2,
    name: "ألعاب PC",
    description: "أحدث الإصدارات والكلاسيكيات",
    icon: Cpu,
    color: "from-purple-500 to-cyan-500",
    count: "4500+",
  },
  {
    id: 3,
    name: "بطاقات هدايا",
    description: "لجميع المنصات الشهيرة",
    icon: Zap,
    color: "from-orange-500 to-cyan-500",
    count: "8000+",
  },
  {
    id: 4,
    name: "ألعاب جماعية",
    description: "ألعاب متعددة اللاعبين",
    icon: Users,
    color: "from-pink-500 to-cyan-500",
    count: "2800+",
  },
  {
    id: 5,
    name: "الألعاب الحصرية",
    description: "عروض محدودة وخاصة",
    icon: Trophy,
    color: "from-yellow-500 to-cyan-500",
    count: "500+",
  },
  {
    id: 6,
    name: "بث مباشر",
    description: "شاهد المحترفين يلعبون",
    icon: Radio,
    color: "from-red-500 to-cyan-500",
    count: "100+",
  },
];

export default function CategoriesSection() {
  return (
    <section
      id="categories"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          تصفح التصنيفات
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          اختر من 6 تصنيفات متعددة واكتشف أفضل العروض
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-xl"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              {/* Card */}
              <div className="card-base relative z-10 h-full">
                {/* Icon Background */}
                <div className="absolute -top-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full group-hover:scale-150 transition-transform duration-500" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <div className="mb-4 inline-block p-3 rounded-lg bg-white/5 border border-cyan-500/20 group-hover:border-cyan-400 transition">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-300 transition">
                      {category.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-400 font-bold text-sm">
                      {category.count}
                    </span>
                    <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 group-hover:bg-cyan-500/20 transition">
                      استكشاف
                    </div>
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-cyan-500/50 pointer-events-none transition duration-300" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button className="px-8 py-4 glass border-cyan-500/50 text-cyan-300 font-bold hover:bg-cyan-500/20 transition-all duration-300 rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] group inline-flex items-center gap-2">
          عرض جميع التصنيفات
          <span className="group-hover:translate-x-1 transition">→</span>
        </button>
      </div>
    </section>
  );
}
