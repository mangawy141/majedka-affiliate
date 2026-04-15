export function BenefitsSection() {
  const benefits = [
    {
      icon: "🎯",
      title: "كود خاص بك",
      description: "احصل على كود تسويقي فريد وسهل التذكر",
    },
    {
      icon: "💵",
      title: "عمولة لكل عملية",
      description: "10% عمولة من قيمة كل عملية شراء تتم بواسطة كودك",
    },
    {
      icon: "📊",
      title: "نظام تتبع كامل",
      description: "تابع الكليكات والمبيعات والأرباح في الوقت الفعلي",
    },
    {
      icon: "🆓",
      title: "تسجيل مجاني",
      description: "لا توجد رسوم اشتراك أو تكاليف خفية",
    },
    {
      icon: "📢",
      title: "دعم تسويقي",
      description: "احصل على مواد تسويقية واستراتيجيات من فريقنا",
    },
    {
      icon: "🏆",
      title: "برامج حوافز",
      description: "انضم لبرامج خاصة وحقق مكافآت إضافية",
    },
  ];

  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">المميزات</h2>
          <p className="text-slate-300 text-lg">
            كل ما تحتاجه لتصبح شريك نجاح مع مجيدكا
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="text-3xl mb-3">{benefit.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">
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
