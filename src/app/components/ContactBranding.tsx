import type { ContactModalBranding } from "@/components/contact-modal";

export const PranContactBranding: ContactModalBranding = {
  logo: (
    <span className="text-xl font-black tracking-tighter text-primary">
      pran<span className="bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-transparent">.ai</span>
    </span>
  ),
  heading: (
    <>
      See Your AI Agent{" "}
      <br />
      <span className="text-pran-orange">In Action.</span>
    </>
  ),
  description:
    "Book a live demo and we\u2019ll deploy a native-speaking AI agent tailored to your business \u2014 in under 30 minutes. No credit card, no commitment.",
  footerLabel: "Powered by Pranai AI Pvt. Ltd.",
};
