import type { SiteContentMap } from "@/lib/site-content";

type RewardsSectionProps = {
  title: SiteContentMap["rewards.title"];
  description: SiteContentMap["rewards.description"];
};

export function RewardsSection({ title, description }: RewardsSectionProps) {
  const rewards = [
    {
      tier: "البرونزي",
      description: "50-200 عملية بيع شهريًا",
      incentives: ["+2% عمولة إضافية", "وصول لمحتوى تسويقي premium"],
      icon: "🥉",
    },
    {
      tier: "الفضي",
      description: "200-500 عملية بيع شهريًا",
      incentives: [
        "+5% عمولة إضافية",
        "لعبة مجانية كل شهر",
        "دعم مخصص من الفريق",
      ],
      icon: "🥈",
    },
    {
      tier: "الذهبي",
      description: "500+ عملية بيع شهريًا",
      incentives: [
        "+10% عمولة إضافية",
        "3 لعب مجانية كل شهر",
        "اجتماع شهري مع الفريق",
        "ترويج إضافي على القنوات الرسمية",
      ],
      icon: "🏆",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-slate-300 text-lg">{description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rewards.map((reward, index) => (
            <div
              key={index}
              className={`rounded-lg p-8 border transition-all duration-300 ${
                index === 2
                  ? "bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/50 shadow-lg shadow-blue-500/20"
                  : "bg-slate-800/50 border-slate-700 hover:border-blue-500/30"
              }`}
            >
              <div className="text-5xl mb-4">{reward.icon}</div>
              <h3
                className={`text-2xl font-bold mb-2 ${
                  index === 2 ? "text-blue-300" : "text-white"
                }`}
              >
                {reward.tier}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {reward.description}
              </p>
              <ul className="space-y-2">
                {reward.incentives.map((incentive, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-slate-300 text-sm"
                  >
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{incentive}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
