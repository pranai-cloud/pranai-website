import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fluxenta.dev/pranai"),
  title: "Pran.ai — AI Digital Workforce for India",
  description:
    "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business. Customer support and sales development on autopilot.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fluxenta.dev/pranai",
    siteName: "Pran.ai",
    title: "Pran.ai — AI Digital Workforce for India",
    description:
      "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business. Customer support and sales development on autopilot.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pran.ai — AI Digital Workforce for India",
    description:
      "Deploy native-speaking, hyper-realistic AI voice and chat agents into your business.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} font-[family-name:var(--font-space-grotesk)] antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
