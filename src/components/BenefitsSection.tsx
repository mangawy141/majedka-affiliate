"use client";

import { TrendingUp, Zap, Award, Users, Clock, Shield } from "lucide-react";
import type { SiteContentMap } from "@/lib/site-content";

const benefits = [
  {
    icon: TrendingUp,
    title: "عمولة على كل طلب",
    description: "احصل على 10% من قيمة كل عملية شراء قام بها متابعوك",
  },
  {
    icon: Award,
    title: "كود خاص بك",
    description: "كود فريد قابل للتتبع لتابعك حتى تتمكن من عرض أرباحك",
  },
  {
    icon: Zap,
    title: "سحب أرباح بسهولة",
    description: "سحب أرباحك مباشرة كل أسبوع إلى حسابك البنكي",
  },
  {
    icon: Users,
    title: "دعم مستمر",
    description: "فريق دعم متخصص جاهز لمساعدتك 24/7",
  },
  {
    icon: Clock,
    title: "موافقة سريعة",
    description: "يتم الموافقة على طلبك في خلال 24-48 ساعة فقط",
  },
  {
    icon: Shield,
    title: "برنامج موثوق",
    description: "أكثر من 5000 شريك نشط يثقون بنا",
  },
];

type BenefitsProps = {
  title: SiteContentMap["benefits.title"];
  description: SiteContentMap["benefits.description"];
};

export default function BenefitsSection({ title, description }: BenefitsProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          {title}
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <div key={i} className="card-base">
              <div className="mb-4 inline-block p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {benefit.title}
              </h3>
              <p className="text-slate-400 text-sm">{benefit.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
