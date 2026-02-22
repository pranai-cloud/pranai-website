import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Pran.ai",
  description:
    "Learn how Pran.ai by Fluxenta Technologies collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="legal-content space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="text-sm text-secondary">
          Last updated: February 2026
        </p>
      </header>

      <p className="text-secondary leading-relaxed">
        Fluxenta Technologies (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
        &ldquo;our&rdquo;) operates Pran.ai (&ldquo;the Platform&rdquo;), an
        AI-powered digital workforce product available at pranai.cloud. We are
        committed to protecting your privacy. This Privacy Policy explains how
        we collect, use, disclose, and safeguard your information when you visit
        our website or engage with our services.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          1. Information We Collect
        </h2>
        <p className="text-secondary leading-relaxed">
          We may collect the following types of information:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            <strong className="text-primary">Personal Information:</strong>{" "}
            Name, email address, phone number, business name, job role, and
            billing details that you voluntarily provide when contacting us,
            booking a demo, submitting a lead form, or purchasing services.
          </li>
          <li>
            <strong className="text-primary">Usage Data:</strong> IP address,
            browser type, pages visited, time spent on pages, and other
            diagnostic data collected automatically through cookies and analytics
            tools.
          </li>
          <li>
            <strong className="text-primary">Communication Data:</strong>{" "}
            Records of correspondence when you contact us via email, forms, or
            scheduled calls.
          </li>
          <li>
            <strong className="text-primary">
              AI Interaction Data:
            </strong>{" "}
            When you interact with our AI voice or chat agents, we may collect
            voice recordings, transcripts, chat logs, and associated metadata
            for quality assurance and service improvement.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>To provide, operate, and maintain the Pran.ai Platform and our services.</li>
          <li>To process transactions and send related information such as invoices and confirmations.</li>
          <li>To communicate with you about projects, service updates, and promotional offers (with your consent).</li>
          <li>To improve our website, AI agents, and user experience.</li>
          <li>To train and enhance our AI models using anonymised and aggregated interaction data.</li>
          <li>To comply with legal obligations and resolve disputes.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          3. Session &amp; Analytics Data
        </h2>
        <p className="text-secondary leading-relaxed">
          We use third-party analytics tools to collect data regarding your
          interaction with our website. This includes capturing session
          recordings, device information, and engagement metrics to improve our
          platform&apos;s user experience.
        </p>
        <p className="text-secondary leading-relaxed">
          We use the following analytics tools:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            <strong className="text-primary">Google Analytics:</strong> Collects
            anonymised usage data such as pages visited, session duration, and
            device type.
          </li>
          <li>
            <strong className="text-primary">PostHog:</strong> Collects product
            analytics data including page views, feature usage, and session
            replays to help us improve our website. Data is processed by
            PostHog, Inc.
          </li>
        </ul>
        <p className="text-secondary leading-relaxed">
          You may withdraw consent at any time by clearing your browser cookies
          and revisiting the site, or by using your browser settings to block
          cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          4. Artificial Intelligence &amp; Communications
        </h2>
        <p className="text-secondary leading-relaxed">
          By providing your phone number and opting in via our contact or lead
          capture forms, you explicitly consent to receive communications from
          Fluxenta Technologies and its product Pran.ai. This may include
          qualification and scheduling calls conducted by our proprietary AI
          voice agents. These AI-driven calls are recorded, transcribed, and
          analysed solely for the purpose of quality assurance, lead
          qualification, and improving our customer service.
        </p>
        <p className="text-secondary leading-relaxed">
          You may opt out of AI communications at any time by stating so during
          the call or by contacting us at{" "}
          <a
            href="mailto:founder@pranai.cloud"
            className="font-medium text-pran-orange hover:underline"
          >
            founder@pranai.cloud
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          5. Data Sharing &amp; Disclosure
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>We do not sell, trade, or rent your personal information to third parties.</li>
          <li>
            We may share information with trusted service providers (payment
            processors, analytics platforms, cloud hosting, AI infrastructure
            providers) who assist us in operating our platform and conducting our
            business, subject to confidentiality agreements.
          </li>
          <li>We may disclose information if required by law, regulation, or legal process.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          6. Data Security
        </h2>
        <p className="text-secondary leading-relaxed">
          We implement industry-standard security measures to protect your
          personal information, including encryption in transit (TLS 1.2+) and
          at rest (AES-256). However, no method of transmission over the
          Internet or electronic storage is 100% secure. While we strive to
          protect your data, we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          7. Data Retention &amp; Storage
        </h2>
        <p className="text-secondary leading-relaxed">
          We retain your personal information only for as long as necessary to
          fulfil the purposes outlined in this policy, comply with legal
          obligations, resolve disputes, and enforce our agreements.
        </p>
        <p className="text-secondary leading-relaxed">
          Voice call transcripts and AI interaction data are retained only for as
          long as necessary to fulfil the business purpose (typically 90 days),
          after which they are securely deleted or anonymised.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          8. Your Rights
        </h2>
        <p className="text-secondary leading-relaxed">
          Depending on your location, you may have the following rights
          regarding your personal data:
        </p>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>Access, update, or delete your personal information.</li>
          <li>Opt out of marketing communications at any time.</li>
          <li>Request a copy of the data we hold about you.</li>
          <li>
            <strong className="text-primary">Withdraw consent</strong> for
            cookie-based analytics tracking at any time (GDPR, Art. 7).
          </li>
          <li>
            <strong className="text-primary">Right to erasure</strong> — request
            that we delete your personal data (GDPR, Art. 17).
          </li>
          <li>
            <strong className="text-primary">
              Opt out of the sale of personal information
            </strong>{" "}
            under the California Consumer Privacy Act (CCPA). We do not sell
            your data.
          </li>
        </ul>
        <p className="text-secondary leading-relaxed">
          To exercise any of these rights, please contact us using the details
          below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          9. Third-Party Links
        </h2>
        <p className="text-secondary leading-relaxed">
          Our website may contain links to third-party websites. We are not
          responsible for the privacy practices or content of these external
          sites. We encourage you to read their privacy policies before providing
          any personal information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          10. Changes to This Policy
        </h2>
        <p className="text-secondary leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date. Your continued
          use of our website after changes are posted constitutes acceptance of
          the revised policy.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-black/[0.06] bg-white/60 p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          11. Contact Information
        </h2>
        <p className="text-secondary leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="space-y-1.5 text-secondary leading-relaxed">
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
          <li>
            <strong className="text-primary">Registered Address:</strong> 302,
            Sreenidhi Pristine, (9/10), Kodichikkanahalli Main Rd, Seenappa
            Layout, Bommanahalli, Bengaluru, Karnataka 560076
          </li>
        </ul>
      </section>
    </article>
  );
}
