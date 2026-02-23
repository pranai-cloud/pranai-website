"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Building2, ChevronDown } from "lucide-react";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";
import { useContactSafe } from "@/components/contact-provider";
import { globalLanguages, indianLanguages } from "../_data";
import { LanguageTooltip } from "@/components/LanguageTooltip";

interface Currency {
  code: string;
  symbol: string;
  rate: number;
  locale: string;
}

const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", rate: 1, locale: "en-US" },
  { code: "INR", symbol: "₹", rate: 85, locale: "en-IN" },
  { code: "EUR", symbol: "€", rate: 0.92, locale: "de-DE" },
  { code: "GBP", symbol: "£", rate: 0.79, locale: "en-GB" },
  { code: "AED", symbol: "د.إ", rate: 3.67, locale: "ar-AE" },
  { code: "SGD", symbol: "S$", rate: 1.34, locale: "en-SG" },
];

function formatPrice(usdAmount: number, currency: Currency): string {
  const converted = usdAmount * currency.rate;
  if (converted >= 1000) {
    return `${currency.symbol}${Math.round(converted).toLocaleString(currency.locale)}`;
  }
  const decimals = converted < 1 ? 2 : converted % 1 === 0 ? 0 : 2;
  return `${currency.symbol}${converted.toFixed(decimals)}`;
}

interface Plan {
  name: string;
  icon: typeof Zap;
  baseUSD: number | null;
  period: string;
  platformFeeUSD?: number;
  description: string;
  highlight: boolean;
  badge?: string;
  features: string[];
  cta: string;
}

const PLANS: Plan[] = [
  {
    name: "Pay As You Go",
    icon: Zap,
    baseUSD: 0.10,
    period: "/min",
    platformFeeUSD: 19,
    description: "On-demand pricing with no commitments — only pay for the AI talk time you use.",
    highlight: false,
    features: [
      "Billed per minute of active call time",
      "9 Regional Languages & Indian English support",
      "Standard Voice Models",
      "HD voice with <500ms latency",
      "7-Day Call Log Retention",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Scale",
    icon: Sparkles,
    baseUSD: 949,
    period: "/mo",
    description: "Predictable volume pricing for growing teams with advanced automation needs.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "10,000 Included Minutes/mo", // Safely anchors your COGS
      "40+ Global Languages & Dialects",
      "Premium Hyper-Realistic Voices",
      "Omnichannel — Voice, Chat & WhatsApp",
      "Custom Webhook & API Integrations",
      "1-Year Call Data Retention (India Region)", // Highlights Azure compliance
      "Priority SLA Support",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    icon: Building2,
    baseUSD: null,
    period: "",
    description: "Custom deployments with dedicated infrastructure and SLA guarantees.",
    highlight: false,
    features: [
      "Custom Minute Buckets & Volume Discounts",
      "Bring Your Own SIP Trunk (BYOC)",
      "Dedicated Azure Container Isolation", // Appeals to Enterprise security
      "Custom Vector RAG Fine-tuning",
      "24/7 Dedicated Account Manager",
      "SOC 2 & ISO 27001 Compliance",
    ],
    cta: "Talk to Sales",
  },
];

function CurrencySelector({
  selected,
  onChange,
}: {
  selected: Currency;
  onChange: (c: Currency) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-black/[0.03]"
      >
        <span className="text-pran-orange font-semibold">{selected.symbol}</span>
        {selected.code}
        <ChevronDown className={`size-3.5 text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 min-w-[140px] rounded-xl border border-black/[0.06] bg-white py-1 shadow-lg">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { onChange(c); setOpen(false); }}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-black/[0.03] ${c.code === selected.code ? "text-pran-orange font-semibold" : "text-primary"
                  }`}
              >
                <span className="w-5 text-center font-semibold">{c.symbol}</span>
                {c.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PricingSection() {
  const contact = useContactSafe();
  const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);

  return (
    <section
      id="pricing"
      className="relative border-t border-black/[0.06] py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary">
            Simple, transparent pricing.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary">
            No hidden fees. Start with pay-as-you-go or choose a plan
            that scales with your business.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-secondary">
            <span>Display prices in</span>
            <CurrencySelector selected={currency} onChange={setCurrency} />
          </div>
        </motion.div>

        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="grid gap-6 lg:grid-cols-3"
        >
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = plan.baseUSD !== null
              ? formatPrice(plan.baseUSD, currency)
              : "Custom";

            return (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 transition-shadow ${plan.highlight
                  ? "border-pran-orange/30 bg-gradient-to-b from-pran-orange/[0.04] to-white shadow-lg shadow-pran-orange/[0.08] ring-1 ring-pran-orange/20"
                  : "border-black/[0.06] bg-white shadow-sm"
                  }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-pran-orange px-4 py-1 text-xs font-bold text-white shadow-sm">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-pran-orange/20 bg-pran-orange/10 px-3 py-1.5 text-sm font-medium text-pran-orange">
                    <Icon className="size-4" />
                    {plan.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold tracking-tight text-primary">
                      {displayPrice}
                    </span>
                    {plan.period && (
                      <span className="text-base font-medium text-secondary">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.platformFeeUSD && (
                    <p className="mt-1.5 text-sm font-medium text-secondary">
                      + {formatPrice(plan.platformFeeUSD, currency)}/mo platform fee
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {plan.description}
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm text-secondary"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-pran-orange/70" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => contact?.openContact()}
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition-all ${plan.highlight
                    ? "bg-pran-orange text-white shadow-md shadow-pran-orange/20 hover:bg-pran-orange-light hover:shadow-lg hover:shadow-pran-orange/30"
                    : "border border-black/[0.08] bg-black/[0.03] text-primary hover:bg-black/[0.06]"
                    }`}
                >
                  {plan.cta}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mt-10 flex flex-col items-center gap-4 text-center"
        >
          <div className="inline-block rounded-2xl border border-black/5 bg-black/[0.02] px-5 py-3 text-sm text-secondary md:text-base shadow-sm">
            We offer <LanguageTooltip title="Global Languages" languages={globalLanguages}>33 global languages</LanguageTooltip> and{" "}
            <LanguageTooltip title="Indian Languages" languages={indianLanguages}>9 Indian languages</LanguageTooltip>.
          </div>
          <p className="inline-flex items-center gap-2 rounded-full border border-pran-orange/20 bg-pran-orange/[0.04] px-5 py-2.5 text-sm font-medium text-pran-orange">
            <Sparkles className="size-4" />
            14-day free trial on all plans · No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
