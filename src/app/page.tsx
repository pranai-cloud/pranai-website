import { ContactProvider } from "@/components/contact-provider";
import { PranNavbar } from "./_sections/navbar";
import { HeroSection } from "./_sections/hero";
import { TrustBanner } from "./_sections/trust-banner";
import { ProblemSection } from "./_sections/problem";
import { SolutionSection } from "./_sections/solution";
import { MetricsSection } from "./_sections/metrics";
import { HowItWorksSection } from "./_sections/how-it-works";
import { PricingSection } from "./_sections/pricing";
import { FAQSection } from "./_sections/faq";
import { FinalCTASection } from "./_sections/final-cta";
import { PranFooter } from "./_sections/footer";
import { PranContactBranding } from "./components/ContactBranding";

export default function PranAIPage() {
  return (
    <ContactProvider branding={PranContactBranding}>
      <div className="min-h-screen bg-surface text-primary selection:bg-pran-orange/20">
        <PranNavbar />
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <MetricsSection />
        <HowItWorksSection />
        <TrustBanner />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
        <PranFooter />
      </div>
    </ContactProvider>
  );
}
