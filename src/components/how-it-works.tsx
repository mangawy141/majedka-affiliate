export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "قدّم طلبك",
      description: "سجّل معلومات قنواتك الإعلامية والشبكات الاجتماعية بسهولة",
      icon: "📝",
    },
    {
      number: "02",
      title: "احصل على الموافقة",
      description: "سيراجع فريقنا طلبك ويوافق عليه في غضون 24-48 ساعة",
      icon: "✅",
    },
    {
      number: "03",
      title: "ابدأ في الربح",
      description: "استقبل كودك الخاص واكسب 10% عمولة من كل عملية شراء",
      icon: "💰",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-800/50" id="how-it-works">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          كيفية التئام الموقع
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line */}

              <div className="hidden md:block absolute top-16 left-full w-[calc(100%-2rem)] h-1 bg-gradient-to-r from-blue-500 to-transparent" />

              {/* Card */}
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-sm font-bold text-blue-400 mb-2">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
