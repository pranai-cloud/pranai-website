import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund & Cancellation", href: "/refund-and-cancellation-policy" },
  { label: "Shipping & Delivery", href: "/shipping-and-delivery" },
  { label: "Trust Center", href: "/trust-center" },
  { label: "Contact & Support", href: "/contact" },
];

const PRODUCT_LINKS = [
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#solution" },
  { label: "Pricing", href: "/#pricing" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export function PranFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-white/40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
        {/* Main footer grid */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & About */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Pran.ai Home">
              <svg
                viewBox="0 0 160 40"
                className="h-7 w-auto"
                aria-label="pran.ai"
              >
                <defs>
                  <linearGradient
                    id="footer-orange-grad"
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
                  <tspan fill="url(#footer-orange-grad)">.ai</tspan>
                </text>
              </svg>
            </Link>
            <p className="text-sm leading-relaxed text-secondary">
              AI-powered digital workforce for India. Deploy native-speaking,
              hyper-realistic voice and chat agents for customer support and
              sales — on autopilot.
            </p>
            <p className="text-xs text-stone-muted">
              A product by{" "}
              <a
                href="https://fluxenta.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-secondary hover:text-primary transition-colors"
              >
                Fluxenta Technologies
              </a>
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Product</h3>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Legal</h3>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:founder@pranai.cloud"
                  className="inline-flex items-start gap-2 text-sm text-secondary transition-colors hover:text-primary"
                >
                  <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  founder@pranai.cloud
                </a>
              </li>
              <li>
                <a
                  href="tel:+919304117405"
                  className="inline-flex items-start gap-2 text-sm text-secondary transition-colors hover:text-primary"
                >
                  <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  +91 93041 17405
                </a>
              </li>
              <li>
                <span className="inline-flex items-start gap-2 text-sm text-secondary">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>
                    302, Sreenidhi Pristine, Kodichikkanahalli Main Rd,
                    Bommanahalli, Bengaluru, Karnataka 560076
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] py-6 text-xs text-stone-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} Fluxenta Technologies. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>GSTIN: 29LBAPS2132R1ZW</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Udyam: UDYAM-KR-03-0660792
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
