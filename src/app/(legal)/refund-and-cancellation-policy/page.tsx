import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Pran.ai",
  description:
    "Refund and cancellation policy for Pran.ai services by Fluxenta Technologies.",
};

export default function RefundPolicyPage() {
  return (
    <article className="legal-content space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-sm text-secondary">
          Last updated: February 2026
        </p>
      </header>

      <p className="text-secondary leading-relaxed">
        This policy applies to all services offered by Fluxenta Technologies
        through the Pran.ai platform (pranai.cloud). Please review your order
        carefully before making any payment.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Cancellation Terms
        </h2>
        <p className="text-secondary leading-relaxed">
          Fluxenta Technologies does not accept cancellation requests for
          services already commenced or delivered. If you wish to cancel a
          service before commencement, please contact us immediately at{" "}
          <a
            href="mailto:founder@pranai.cloud"
            className="text-pran-orange hover:underline"
          >
            founder@pranai.cloud
          </a>
          . Cancellation requests will be reviewed on a case-by-case basis.
        </p>
        <p className="text-secondary leading-relaxed">
          For subscription-based services, you may cancel your subscription
          before the next billing cycle to avoid future charges. Cancellation
          will take effect at the end of the current billing period.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Refund Terms
        </h2>
        <p className="text-secondary leading-relaxed">
          Fluxenta Technologies generally does not accept refund requests once
          services have been rendered or AI agents have been deployed and
          configured for your business. Please review your order and service
          scope before making payments.
        </p>
        <p className="text-secondary leading-relaxed">
          In exceptional circumstances, refund requests may be considered at
          our sole discretion. Any approved refunds will be processed within
          5–7 business days to the original payment method.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Replacement Terms
        </h2>
        <p className="text-secondary leading-relaxed">
          As our services are digital in nature and custom-configured per
          client, we do not offer replacements. If you experience issues with
          the AI agents deployed for your business, our support team will work
          with you to resolve them.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Service-Level Disputes
        </h2>
        <p className="text-secondary leading-relaxed">
          If you believe the services delivered do not match the agreed scope,
          please raise the concern within 7 days of delivery. We will review
          the matter and work towards an amicable resolution.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-black/[0.06] bg-white/60 p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Contact Information
        </h2>
        <p className="text-secondary leading-relaxed">
          For any cancellation, refund, or service-related requests, please
          contact us:
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
            <strong className="text-primary">Address:</strong> 302, Sreenidhi
            Pristine, (9/10), Kodichikkanahalli Main Rd, Seenappa Layout,
            Bommanahalli, Bengaluru, Karnataka 560076
          </li>
        </ul>
      </section>
    </article>
  );
}
