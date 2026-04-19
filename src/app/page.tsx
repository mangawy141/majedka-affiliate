import Navbar from "@/components/Navbar";
import { SimplifiedHeroSection } from "@/components/SimplifiedHeroSection";
import { SimplifiedBenefitsSection } from "@/components/SimplifiedBenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/faq-section";
import { DynamicAffiliateForm } from "@/components/DynamicAffiliateForm";
import { CTABanner } from "@/components/CTABanner";
import { DynamicFooter } from "@/components/DynamicFooter";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <Navbar
        middleLabel={content["nav.middleLabel"]}
        middleUrl={content["nav.middleUrl"]}
        ctaLabel={content["nav.ctaLabel"]}
      />
      <SimplifiedHeroSection />
      <SimplifiedBenefitsSection />
      <HowItWorksSection />
      <FAQSection
        title={content["faq.title"]}
        description={content["faq.description"]}
        items={content["faq.items"]}
      />
      <CTABanner />

      {/* Application Form Section */}
      <section id="form" className="py-20 px-4 bg-gradient-to-br from-slate-900/50 to-blue-950/30 border-y border-slate-800">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">ابدأ رحلتك الآن</span>
            </h2>
            <p className="text-xl text-slate-300">
              املأ النموذج التالي وسننقل بك لعالم الربح من الألعاب
            </p>
          </div>
          <DynamicAffiliateForm />
        </div>
      </section>

      <DynamicFooter />
      <FloatingWhatsAppButton />
    </main>
  );
}
