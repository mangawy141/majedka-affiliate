"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "محمد أحمد",
    role: "مؤثر في وسائل التواصل",
    followers: "50K متابع",
    text: "دخلي من برنامج مجيدكا تجاوز 5000 ريال شهرياً! الدفع سريع والدعم ممتاز",
    rating: 5,
    avatar: "👨‍💼",
  },
  {
    name: "فاطمة سارة",
    role: "مدونة تقنية",
    followers: "30K متابع",
    text: "أفضل برنامج شركاء في السعودية، عمولة عادلة وأدوات احترافية",
    rating: 5,
    avatar: "👩‍💻",
  },
  {
    name: "علي الحربي",
    role: "صاحب موقع",
    followers: "100K زائر شهري",
    text: "زيادة الدخل من الموقع بـ 200% بعد الانضمام لمجيدكا",
    rating: 5,
    avatar: "👨‍🚀",
  },
  {
    name: "نور الدين",
    role: "منتج محتوى",
    followers: "80K متابع",
    text: "العملية سهلة جداً والأرباح حقيقية. توصي به بكل قلب",
    rating: 5,
    avatar: "🎬",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background */}
      <div className="absolute -top-20 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            ماذا يقول شركاؤنا
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            انضم إلى آلاف الشركاء الناجحين الذين يحققون أرباحاً حقيقية مع مجيدكا
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="card-base relative">
              {/* Quote Icon */}
              <Quote className="absolute top-4 left-4 w-8 h-8 text-cyan-500/30" />

              <div className="relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="border-t border-cyan-500/20 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 flex items-center justify-center text-xl">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-cyan-400">
                        {testimonial.followers}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 p-8 glass rounded-xl border-cyan-500/30 text-center">
          <p className="text-slate-300 mb-4">
            ✨ <span className="font-bold text-cyan-300">5000+ شريك نشط</span>{" "}
            يكسبون أموالهم معنا الآن
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div>
              <p className="text-2xl font-bold text-cyan-400">$500K+</p>
              <p className="text-sm text-slate-400">أرباح مدفوعة هذا العام</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">98%</p>
              <p className="text-sm text-slate-400">معدل الرضا</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">48 ساعة</p>
              <p className="text-sm text-slate-400">وقت الموافقة المتوسط</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
