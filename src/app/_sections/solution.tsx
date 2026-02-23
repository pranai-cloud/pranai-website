"use client";

import { motion } from "framer-motion";
import {
  Headphones,
  Target,
  CheckCircle2,
  Palette,
  Share2,
  Phone,
  Wrench,
  Filter,
  UserSearch,
  Package,
  type LucideIcon,
} from "lucide-react";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";

const CS_FEATURES = [
  "Level-1 tech triage — resolves common issues instantly",
  "Instant FAQ resolution across voice & chat",
  "Multilingual voice support with <500ms latency",
  "Seamless escalation to human agents with full context",
];

const SDR_FEATURES = [
  "Reactivates dead leads with personalized outreach",
  "Qualifies prospects using your custom scoring criteria",
  "Books meetings directly on your team's calendar",
  "Follows up persistently without being pushy",
];

interface WorkforceRole {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
}

const EXTENDED_ROLES: WorkforceRole[] = [
  {
    icon: Phone,
    badge: "Inbound",
    title: "24/7 Virtual Receptionist",
    description:
      "Answers FAQs, routes urgent queries, and books appointments directly into your calendar—even at 3 AM.",
  },
  {
    icon: Target,
    badge: "Outbound",
    title: "Lead Qualification Engine",
    description:
      "Instantly calls back new web leads within 30 seconds to qualify budget and intent before your sales team steps in.",
  },
  {
    icon: Package,
    badge: "Operations",
    title: "COD & Logistics Assistant",
    description:
      "Automates Cash-on-Delivery confirmation calls and updates shipping addresses, reducing your RTO rate.",
  },
];

function ExtendedRoleCard({ icon: Icon, badge, title, description }: WorkforceRole) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 lg:p-8 shadow-sm h-full"
    >
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pran-orange/[0.04] blur-2xl" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-pran-orange/20 bg-pran-orange/10 px-3.5 py-1 text-sm font-medium text-pran-orange">
          <Icon className="h-4 w-4" />
          {badge}
        </div>
        <h3 className="mb-2 text-lg font-bold text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-secondary">{description}</p>
      </div>
    </motion.div>
  );
}

function RoleCard({
  icon: Icon,
  badge,
  title,
  features,
}: {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  title: string;
  features: string[];
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 lg:p-10 shadow-sm"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pran-orange/[0.04] blur-2xl" />
      <div className="relative">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-pran-orange/20 bg-pran-orange/10 px-4 py-1.5 text-sm font-medium text-pran-orange">
          <Icon className="h-4 w-4" />
          {badge}
        </div>
        <h3 className="mb-4 text-2xl font-bold text-primary">{title}</h3>
        <ul className="space-y-3 text-secondary">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pran-orange/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative border-t border-black/[0.06] py-16 md:py-20"
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-12 lg:px-20">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            The Solution
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary">
            Your new digital workforce.
          </h2>
        </motion.div>

        {/* Primary 2-column role cards */}
        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="grid gap-8 lg:grid-cols-2"
        >
          <RoleCard
            icon={Headphones}
            badge="Inbound CS Rep"
            title="Customer Support that never sleeps"
            features={CS_FEATURES}
          />
          <RoleCard
            icon={Target}
            badge="Outbound SDR"
            title="Sales development on autopilot"
            features={SDR_FEATURES}
          />
        </motion.div>

        {/* Extended 3-column role cards */}
        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {EXTENDED_ROLES.map((role) => (
            <ExtendedRoleCard key={role.badge} {...role} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
