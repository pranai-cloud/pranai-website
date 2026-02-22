import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Pran.ai",
  description:
    "Terms and conditions governing the use of Pran.ai services by Fluxenta Technologies.",
};

export default function TermsOfServicePage() {
  return (
    <article className="legal-content space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="text-sm text-secondary">
          Last updated: February 2026
        </p>
      </header>

      <p className="text-secondary leading-relaxed">
        These Terms and Conditions (&ldquo;Terms&rdquo;) constitute a binding
        agreement between Fluxenta Technologies (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) and you (&ldquo;you&rdquo; or
        &ldquo;your&rdquo;), governing your use of the Pran.ai platform
        available at pranai.cloud and/or purchase of services from us
        (collectively, &ldquo;Services&rdquo;).
      </p>
      <p className="text-secondary leading-relaxed">
        By using our website and/or making a purchase from us, you expressly
        agree to the following Terms.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          1. Use of Services
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            You shall not use our website and/or Services for any purpose that
            is unlawful, illegal, or prohibited under Indian laws, or any other
            local laws that might apply to you.
          </li>
          <li>
            You agree not to misuse, reverse-engineer, or attempt to extract the
            source code or underlying algorithms of our AI agents, voice models,
            or any proprietary technology.
          </li>
          <li>
            It is your responsibility to ensure that any services or information
            available through our platform meet your specific requirements.
          </li>
          <li>
            You shall not use the AI agents deployed via Pran.ai for any
            fraudulent, deceptive, harassing, or illegal purposes.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          2. Account &amp; Access
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            You are responsible for maintaining the confidentiality of any
            account credentials, API keys, or access tokens provided to you.
          </li>
          <li>
            You agree to notify us immediately of any unauthorised use of your
            account or any security breach.
          </li>
          <li>
            We reserve the right to suspend or terminate access to the platform
            at our discretion if we detect misuse, abuse, or violation of these
            Terms.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          3. AI Agent Usage &amp; Limitations
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            Pran.ai provides AI-powered voice and chat agents for customer
            support and sales development. While we strive for accuracy and
            reliability, AI agents may occasionally produce incorrect or
            unexpected responses.
          </li>
          <li>
            You acknowledge that AI-generated communications are not a
            substitute for human professional advice (legal, medical, financial,
            or otherwise).
          </li>
          <li>
            You are responsible for monitoring and supervising the AI agents
            deployed in your business and for ensuring compliance with
            applicable regulations in your industry and jurisdiction.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          4. Orders &amp; Availability
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            You agree to provide accurate and complete information for order
            fulfilment and service delivery. We shall not be liable for issues
            resulting from incorrect or incomplete information you provide to us.
          </li>
          <li>All purchases and subscriptions are subject to availability.</li>
          <li>
            We reserve the right to cancel orders at our discretion, including
            but not limited to cases of suspected fraud or violation of these
            Terms.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">5. Payments</h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            Payments must be made in full at the time of purchase unless
            otherwise agreed upon by us in writing.
          </li>
          <li>
            You must ensure that the payment details provided are valid and
            belong to you.
          </li>
          <li>
            All fees are exclusive of applicable taxes (including GST) unless
            explicitly stated otherwise.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          6. Intellectual Property
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            All content, branding, AI models, voice models, software, and
            technology on the Pran.ai platform are the intellectual property of
            Fluxenta Technologies unless otherwise stated.
          </li>
          <li>
            You may not copy, modify, distribute, or create derivative works
            based on our proprietary technology without prior written consent.
          </li>
          <li>
            Any data, scripts, or custom configurations created specifically for
            your business remain your property, subject to our usage rights as
            outlined in the Privacy Policy.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">7. Liability</h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            We shall not be liable for any loss or damage arising from the use
            of our Services, whether direct, indirect, or consequential.
          </li>
          <li>
            We shall not be liable for any loss or damage arising directly or
            indirectly from the decline of authorisation for any transaction due
            to the cardholder exceeding the preset limit mutually agreed upon
            with our acquiring bank.
          </li>
          <li>
            We shall not be held responsible for any issues arising from AI
            agent responses, including but not limited to inaccuracies, missed
            communications, or unintended statements.
          </li>
          <li>
            Our total aggregate liability under these Terms shall not exceed the
            amount paid by you for the Services in the preceding 12 months.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          8. Service Availability
        </h2>
        <p className="text-secondary leading-relaxed">
          We strive to maintain 99.9% uptime for our AI agents. However, we do
          not guarantee uninterrupted availability and shall not be liable for
          downtime caused by scheduled maintenance, third-party service
          failures, force majeure events, or circumstances beyond our reasonable
          control.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          9. Age Requirement
        </h2>
        <p className="text-secondary leading-relaxed">
          You must be at least 18 years of age to use our Services or enter
          into these Terms. By using the Pran.ai platform, you represent and
          warrant that you are at least 18 years old and have the legal
          capacity to enter into a binding agreement. If you are using the
          Services on behalf of an organisation, you represent that you have
          the authority to bind that organisation to these Terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          10. Governing Law &amp; Disputes
        </h2>
        <p className="text-secondary leading-relaxed">
          Any dispute arising out of the use of our website, purchase from us, or
          any engagement with us shall be subject to the laws of India. The
          courts of Bengaluru, Karnataka shall have exclusive jurisdiction over
          any disputes arising from these Terms.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-black/[0.06] bg-white/60 p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          11. Contact Information
        </h2>
        <p className="text-secondary leading-relaxed">
          If you have any questions regarding these Terms, please contact us:
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
        </ul>
      </section>
    </article>
  );
}
