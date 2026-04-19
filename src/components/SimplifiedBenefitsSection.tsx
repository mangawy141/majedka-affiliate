"use client";

export function SimplifiedBenefitsSection() {
  const benefits = [
    {
      title: "ابدأ بسحب أرباحك",
      description: "من 100 ريال فقط",
      icon: "💰",
    },
    {
      title: "حوافز خاصة",
      description: "لأفضل صناع المحتوى أداءً",
      icon: "🏆",
    },
    {
      title: "تحكم كامل",
      description: "أدارة أكوادك الخاصة بسهولة",
      icon: "⚙️",
    },
    {
      title: "دعم 24/7",
      description: "فريق متخصص لمساعدتك",
      icon: "💬",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            لماذا تختار <span className="gradient-text">برنامجنا</span>
          </h2>
          <p className="text-xl text-slate-300">
            كل ما تحتاجه لتحقيق أرباح حقيقية من المنزل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="glass p-8 rounded-xl text-center hover:scale-105 transition-all duration-300 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                {benefit.title}
              </h3>
              <p className="text-slate-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
