import Navbar from "@/components/Navbar";
import AffiliateHeroSection from "@/components/AffiliateHeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AffiliateApplicationForm from "@/components/AffiliateApplicationForm";
import AffiliateCTABanner from "@/components/AffiliateCTABanner";
import AffiliateTestimonialsSection from "@/components/AffiliateTestimonialsSection";
import Footer from "@/components/Footer";
import { RewardsSection } from "@/components/rewards-section";
import { FAQSection } from "@/components/faq-section";
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
      <AffiliateHeroSection
        title={content["hero.title"]}
        subtitle={content["hero.subtitle"]}
        badge={content["hero.badge"]}
        primaryCtaLabel={content["hero.primaryCtaLabel"]}
        secondaryCtaLabel={content["hero.secondaryCtaLabel"]}
      />
      <BenefitsSection
        title={content["benefits.title"]}
        description={content["benefits.description"]}
      />
      <HowItWorksSection />
      <RewardsSection
        title={content["rewards.title"]}
        description={content["rewards.description"]}
      />
      <FAQSection
        title={content["faq.title"]}
        description={content["faq.description"]}
        items={content["faq.items"]}
      />
      <AffiliateApplicationForm />
      <AffiliateCTABanner explanationText={content["affiliate.explanation"]} />
      <AffiliateTestimonialsSection />
      <Footer tagline={content["footer.tagline"]} />
    </main>
  );
}
