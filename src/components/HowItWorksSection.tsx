"use client";

import { CheckCircle } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "قدّم في النموذج",
    description: "ملي النموذج ببيانات أساسية عن نفسك ومتابعينك",
  },
  {
    number: 2,
    title: "يتم مراجعتك",
    description: "فريقنا سيراجع طلبك في خلال 24-48 ساعة",
  },
  {
    number: 3,
    title: "تحصل على كود خاص",
    description: "بعد الموافقة، ستحصل على كود فريد للمشاركة مع متابعينك",
  },
  {
    number: 4,
    title: "ابدأ الربح",
    description: "شارك الكود وابدأ بكسب عمولة من كل عملية شراء",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Background Effects */}
      <div className="absolute -top-20 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Section Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          كيف يعمل البرنامج؟
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          عملية بسيطة وسهلة تبدأ من الآن
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* Card */}
            <div className="card-base h-full">
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-xl border-4 border-slate-950">
                {step.number}
              </div>

              <h3 className="text-lg font-bold mb-3 mt-4 text-white">
                {step.title}
              </h3>
              <p className="text-slate-400 text-sm">{step.description}</p>
            </div>

            {/* Connector Line (hidden on mobile) */}
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
