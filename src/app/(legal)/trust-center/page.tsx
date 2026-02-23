import type { Metadata } from "next";
import { Shield, Server, Lock, Code, Eye, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Trust Center — pran.ai",
  description:
    "Security practices, data protection, and compliance information for pran.ai by Fluxenta Technologies.",
};

const TRUST_SECTIONS = [
  {
    icon: Shield,
    title: "1. Data Protection",
    items: [
      "All client data is encrypted in transit (TLS 1.2+) and at rest using industry-standard AES-256 encryption.",
      "Access to client data is restricted on a need-to-know basis and protected by multi-factor authentication.",
      "We conduct regular security reviews and vulnerability assessments of our infrastructure.",
      "AI voice recordings and transcripts are encrypted and stored separately from personally identifiable information.",
    ],
  },
  {
    icon: Server,
    title: "2. Infrastructure Security",
    items: [
      "Our deployments run on trusted cloud providers (AWS, Vercel) with SOC 2 and ISO 27001 certifications.",
      "Automated backups ensure data resilience with point-in-time recovery capability.",
      "Continuous monitoring and alerting are in place for anomaly detection and incident response.",
      "AI agent infrastructure is isolated per client to prevent cross-contamination of data.",
    ],
  },
  {
    icon: Lock,
    title: "3. AI Model & Voice Data Security",
    items: [
      "Voice models and AI configurations are stored in secure, access-controlled environments.",
      "Client-specific AI training data is never shared across accounts or used for other clients.",
      "All AI interactions are logged with tamper-proof audit trails for compliance purposes.",
      "Voice data is retained only for the duration necessary (typically 90 days) and then securely deleted.",
    ],
  },
  {
    icon: Code,
    title: "4. Secure Development Practices",
    items: [
      "We follow OWASP best practices to guard against common vulnerabilities (XSS, CSRF, SQL injection, etc.).",
      "Dependency scanning and automated security audits are part of our CI/CD pipeline.",
      "Environment secrets are managed via encrypted vaults — never hardcoded.",
      "All code changes undergo peer review before deployment to production.",
    ],
  },
  {
    icon: Eye,
    title: "5. Transparency & Communication",
    items: [
      "In the unlikely event of a security incident, affected clients will be notified within 48 hours with a full incident report and remediation plan.",
      "We welcome questions about our security posture at any time — reach out and we'll be transparent.",
      "Regular security updates and best-practice recommendations are shared with clients.",
    ],
  },
];

export default function TrustCenterPage() {
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trust Center
        </h1>
        <p className="text-lg text-secondary leading-relaxed">
          At Fluxenta Technologies, trust is the foundation of every
          engagement. We take the security of your data, intellectual property,
          and business operations seriously. This page outlines the practices
          and principles that keep your information safe when using pran.ai.
        </p>
      </header>

      {TRUST_SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <section.icon className="h-5 w-5 text-pran-orange" />
            {section.title}
          </h2>
          <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-xl border border-black/[0.06] bg-white/60 p-6 space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Building2 className="h-5 w-5 text-pran-orange" />
          6. Business Registration
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-secondary">
          <div>
            <p className="font-medium text-primary">GSTIN</p>
            <p>29LBAPS2132R1ZW</p>
          </div>
          <div>
            <p className="font-medium text-primary">Udyam Registration No.</p>
            <p>UDYAM-KR-03-0660792</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-black/[0.06] bg-white/60 p-6 space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">7. Contact</h2>
        <p className="text-secondary leading-relaxed">
          If you have any security concerns or questions about our practices,
          please contact us:
        </p>
        <ul className="space-y-1.5 text-secondary leading-relaxed text-sm">
          <li>
            <strong className="text-primary">Email:</strong>{" "}
            <a
              href="mailto:founder@pranai.cloud"
              className="text-pran-orange hover:underline"
            >
              founder@pranai.cloud
            </a>
          </li>
          <li>
            <strong className="text-primary">Phone:</strong>{" "}
            <a
              href="tel:+919304117405"
              className="text-pran-orange hover:underline"
            >
              +91 93041 17405
            </a>
          </li>
        </ul>
      </section>
    </article>
  );
}
