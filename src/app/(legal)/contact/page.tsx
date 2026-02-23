import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Building2, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Support — pran.ai",
  description:
    "Get in touch with the pran.ai team by Fluxenta Technologies. Support, billing, and general inquiries.",
};

const CONTACT_CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: "founder@pranai.cloud",
    href: "mailto:founder@pranai.cloud",
    detail: "We typically respond within 24 hours.",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 93041 17405",
    href: "tel:+919304117405",
    detail: "Mon–Sat, 10:00 AM – 7:00 PM IST",
  },
  {
    icon: MapPin,
    label: "Office Address",
    value:
      "302, Sreenidhi Pristine, (9/10), Kodichikkanahalli Main Rd, Seenappa Layout, Bommanahalli, Bengaluru, Karnataka 560076",
    href: "https://maps.google.com/?q=302+Sreenidhi+Pristine+Kodichikkanahalli+Bengaluru+560076",
    detail: null,
  },
];

const HELP_TOPICS = [
  {
    title: "Product & Technical Support",
    description:
      "Questions about AI agent deployment, voice agent configuration, integrations, or technical issues. We'll loop in the right team member to get you unblocked.",
  },
  {
    title: "Billing & Payments",
    description:
      "Invoice queries, payment confirmations, subscription management, or any billing-related questions.",
  },
  {
    title: "Sales & Demos",
    description:
      "Interested in pran.ai for your business? Book a demo call and we'll walk you through how our AI workforce can help.",
  },
  {
    title: "General Inquiries",
    description:
      "Partnership opportunities, media inquiries, or anything else — we'd love to hear from you.",
  },
];

export default function ContactPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact &amp; Support
        </h1>
        <p className="text-lg text-secondary leading-relaxed">
          We&apos;re here to help. Whether you have a question about our AI
          agents, need technical assistance, or want to discuss a partnership,
          the pran.ai team is ready to assist you.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONTACT_CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            target={channel.label === "Office Address" ? "_blank" : undefined}
            rel={
              channel.label === "Office Address"
                ? "noopener noreferrer"
                : undefined
            }
            className="group rounded-xl border border-black/[0.06] bg-white/60 p-5 transition-all hover:border-pran-orange/20 hover:shadow-sm"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-pran-orange/10 text-pran-orange">
              <channel.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-primary">
              {channel.label}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-secondary group-hover:text-pran-orange transition-colors">
              {channel.value}
            </p>
            {channel.detail && (
              <p className="mt-1 text-xs text-stone-muted">{channel.detail}</p>
            )}
          </a>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          What We Can Help With
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {HELP_TOPICS.map((topic) => (
            <div
              key={topic.title}
              className="rounded-xl border border-black/[0.06] bg-white/60 p-5"
            >
              <h3 className="text-sm font-semibold text-primary">
                {topic.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Response Times
        </h2>
        <div className="overflow-hidden rounded-xl border border-black/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-white/80">
                <th className="px-5 py-3 text-left font-semibold text-primary">
                  Channel
                </th>
                <th className="px-5 py-3 text-left font-semibold text-primary">
                  Typical Response
                </th>
              </tr>
            </thead>
            <tbody className="text-secondary">
              <tr className="border-b border-black/[0.04]">
                <td className="px-5 py-3">Email</td>
                <td className="px-5 py-3">Within 24 hours</td>
              </tr>
              <tr className="border-b border-black/[0.04]">
                <td className="px-5 py-3">Phone</td>
                <td className="px-5 py-3">
                  Immediate (during business hours)
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">Technical queries</td>
                <td className="px-5 py-3">Within 12 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-black/[0.06] bg-white/60 p-6 space-y-4">
        <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Building2 className="h-5 w-5 text-pran-orange" />
          Business Details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-secondary">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-primary">Legal Entity</p>
              <p>Fluxenta Technologies</p>
            </div>
            <div>
              <p className="font-medium text-primary">Product</p>
              <p>pran.ai — AI Digital Workforce</p>
            </div>
            <div>
              <p className="font-medium text-primary">Website</p>
              <p>
                <a
                  href="https://pranai.cloud"
                  className="text-pran-orange hover:underline"
                >
                  pranai.cloud
                </a>
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-stone-muted" />
              <div>
                <p className="font-medium text-primary">GSTIN</p>
                <p>29LBAPS2132R1ZW</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-stone-muted" />
              <div>
                <p className="font-medium text-primary">
                  Udyam Registration No.
                </p>
                <p>UDYAM-KR-03-0660792</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-stone-muted" />
              <div>
                <p className="font-medium text-primary">Business Hours</p>
                <p>Mon–Sat, 10:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
