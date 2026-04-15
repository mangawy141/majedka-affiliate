"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "أحمد محمد",
    role: "مؤثر على YouTube",
    earnings: "8000 ريال/شهر",
    text: "دخلي من Majedka تجاوز كل توقعاتي! الدفع سريع والدعم رائع، وأحب أن متابعي يستفيدون من الأسعار نفس المرة",
    rating: 5,
    avatar: "🎥",
  },
  {
    name: "فاطمة عبدالله",
    role: "منتج محتوى على TikTok",
    earnings: "5000 ريال/شهر",
    text: "ما ظنيت أن جمهوري بالتيك توك بالذات راح يكون مصدر دخل حقيقي. Majedka جعلتها ممكنة وسهلة!",
    rating: 5,
    avatar: "📱",
  },
  {
    name: "محمود الحربي",
    role: "مدونة تقنية",
    earnings: "12000 ريال/شهر",
    text: "كمدون تقني، البرنامج طبيعي معي جداً. عمولة عادلة وأدوات احترافية للتتبع والمراجعة",
    rating: 5,
    avatar: "💻",
  },
  {
    name: "ليلى الخالد",
    role: "مديرة مجموعة Discord",
    earnings: "3500 ريال/شهر",
    text: "حتى مع مجموعة صغيرة على Discord، أنا بكسب دخل إضافي لطيف كل شهر. ممتنة جداً",
    rating: 5,
    avatar: "👥",
  },
];

export default function AffiliateTestimonialsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background */}
      <div className="absolute -top-20 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            كلام شركاؤنا
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            اسمع من الشركاء الحقيقيين الذين يكسبون معنا
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="card-base">
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-cyan-500/30 mb-3" />

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
              <p className="text-sm text-slate-300 mb-6">
                "{testimonial.text}"
              </p>

              {/* Earnings Badge */}
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mb-4 text-center">
                <p className="text-xs text-slate-400">دخل شهري</p>
                <p className="text-lg font-bold text-cyan-400">
                  {testimonial.earnings}
                </p>
              </div>

              {/* Author */}
              <div className="border-t border-cyan-500/20 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mt-16 p-8 glass rounded-xl border-cyan-500/30 text-center">
          <p className="text-slate-300 mb-6">✨ انضم معهم و اكسب دخل حقيقي</p>
          <div className="flex flex-wrap justify-center gap-8">
            <div>
              <p className="text-2xl font-bold text-cyan-400">5000+</p>
              <p className="text-sm text-slate-400">شريك نشط</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">$1M+</p>
              <p className="text-sm text-slate-400">أرباح مدفوعة</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">99%</p>
              <p className="text-sm text-slate-400">معدل الرضا</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-cyan-400">24H</p>
              <p className="text-sm text-slate-400">موافقة سريعة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
