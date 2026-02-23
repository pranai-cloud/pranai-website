import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pranai.cloud"),
  title: "pran.ai — AI Digital Workforce for India",
  description:
    "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business. Customer support and sales development on autopilot.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pranai.cloud",
    siteName: "pran.ai",
    title: "pran.ai — AI Digital Workforce for India",
    description:
      "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business. Customer support and sales development on autopilot.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "pran.ai – AI-Powered Digital Workforce That Speaks Any Language",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "pran.ai — AI Digital Workforce for India",
    description:
      "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://pranai.cloud/#organization",
      name: "Fluxenta Technologies",
      url: "https://fluxenta.dev",
      logo: "https://pranai.cloud/logo.png",
      email: "founder@pranai.cloud",
      telephone: "+919304117405",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "302, Sreenidhi Pristine, (9/10), Kodichikkanahalli Main Rd, Seenappa Layout, Bommanahalli",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560076",
        addressCountry: "IN",
      },
      sameAs: ["https://www.linkedin.com/company/111233174"],
    },
    {
      "@type": "WebSite",
      "@id": "https://pranai.cloud/#website",
      url: "https://pranai.cloud",
      name: "pran.ai",
      description:
        "AI-powered digital workforce for India. Deploy native-speaking voice and chat agents for customer support and sales.",
      publisher: { "@id": "https://pranai.cloud/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://pranai.cloud/#product",
      name: "pran.ai",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business. Customer support and sales development on autopilot.",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "INR",
        lowPrice: "0",
        offerCount: "3",
      },
      provider: { "@id": "https://pranai.cloud/#organization" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://pranai.cloud/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Does it sound like a robot?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. pran.ai uses state-of-the-art regional voice models that sound indistinguishable from a native speaker. We fine-tune on real conversational data so intonation, pauses, and fillers feel completely natural.",
          },
        },
        {
          "@type": "Question",
          name: "What if the AI doesn't know the answer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It gracefully escalates the call or chat to your human team with a full transcript and context summary — so your agents pick up right where the AI left off, with zero repetition for the customer.",
          },
        },
        {
          "@type": "Question",
          name: "How do we integrate it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zero coding required. We provide a drop-in phone number and a lightweight JavaScript widget for your website. Most teams go live the same day.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-[family-name:var(--font-space-grotesk)] antialiased`}
      >
        {children}
        <CookieConsent />
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
