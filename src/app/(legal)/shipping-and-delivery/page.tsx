import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — pran.ai",
  description:
    "Shipping and delivery policy for pran.ai digital services by Pranai AI Pvt. Ltd.",
};

export default function ShippingDeliveryPage() {
  return (
    <article className="legal-content space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-sm text-secondary">Last updated: February 2026</p>
      </header>

      <p className="text-secondary leading-relaxed">
        pran.ai is a digital product operated by Pranai AI Pvt. Ltd. All
        services are delivered electronically. No physical goods are shipped.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Nature of Service
        </h2>
        <p className="text-secondary leading-relaxed">
          pran.ai provides AI-powered voice and chat agents deployed digitally
          to your business. Our services include AI agent configuration,
          training, deployment, and ongoing management — all delivered remotely
          via our cloud platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Delivery Timeline
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-secondary leading-relaxed">
          <li>
            <strong className="text-primary">Account activation:</strong>{" "}
            Within 24 hours of payment confirmation.
          </li>
          <li>
            <strong className="text-primary">AI agent setup:</strong> Standard
            agent deployment is completed within 2–5 business days, depending
            on the scope of customisation and data provided.
          </li>
          <li>
            <strong className="text-primary">
              Phone number &amp; widget access:
            </strong>{" "}
            Dedicated phone numbers and web chat widgets are provisioned as
            part of the setup process and delivered alongside the AI agent
            deployment.
          </li>
          <li>
            <strong className="text-primary">Demo access:</strong> Following a
            successful demo booking, you will receive login credentials and
            onboarding materials via email.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Delivery Method
        </h2>
        <p className="text-secondary leading-relaxed">
          All services, credentials, documentation, and onboarding materials
          are delivered electronically via email and/or through your pran.ai
          dashboard. No physical shipping or courier delivery is involved.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Delays &amp; Issues
        </h2>
        <p className="text-secondary leading-relaxed">
          If you experience any delays in receiving your account credentials or
          service activation, please contact us immediately. We will
          investigate and resolve delivery issues within 24 hours of being
          notified.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-black/[0.06] bg-white/60 p-6">
        <h2 className="text-xl font-semibold tracking-tight">
          Contact Information
        </h2>
        <p className="text-secondary leading-relaxed">
          For any delivery-related queries, please contact us:
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
