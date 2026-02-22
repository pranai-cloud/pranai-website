import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PranFooter } from "../_sections/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <header className="border-b border-black/[0.06]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-6 md:px-12 lg:px-20">
          <Link href="/" aria-label="Pran.ai Home">
            <svg
              viewBox="0 0 160 40"
              className="h-7 w-auto"
              aria-label="pran.ai"
            >
              <defs>
                <linearGradient
                  id="legal-orange-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fb923c" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="30"
                fontFamily="var(--font-space-grotesk), 'Space Grotesk', sans-serif"
                fontWeight="700"
                fontSize="28"
                letterSpacing="-1.4"
              >
                <tspan fill="#1A1A1A">pran</tspan>
                <tspan fill="url(#legal-orange-grad)">.ai</tspan>
              </text>
            </svg>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-black/[0.02] px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-black/[0.05] hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        {children}
      </main>

      <PranFooter />
    </div>
  );
}
