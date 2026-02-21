"use client";

import { motion } from "framer-motion";
import {
  Headphones,
  Target,
  CheckCircle2,
  Palette,
  Share2,
  Lock,
  Phone,
  Wrench,
  Filter,
  UserSearch,
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

interface ComingSoonRole {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
}

const COMING_SOON_ROLES: ComingSoonRole[] = [
  {
    icon: Phone,
    badge: "Front Desk Receptionist",
    title: "Your 24/7 front desk",
    description:
      "Greets callers, routes inquiries, and schedules appointments — in any language.",
  },
  {
    icon: Wrench,
    badge: "Technical Support",
    title: "Level-1 triage, automated",
    description:
      "Walks users through troubleshooting steps and escalates complex issues with full context.",
  },
  {
    icon: Filter,
    badge: "Lead Qualifier",
    title: "Score & route every lead",
    description:
      "Qualifies inbound leads against your criteria and books meetings for your sales team.",
  },
  {
    icon: Palette,
    badge: "UI/UX Designer",
    title: "Design systems on demand",
    description:
      "AI-generated wireframes, user flows, and design audits — trained on your brand guidelines.",
  },
  {
    icon: Share2,
    badge: "Social Media Manager",
    title: "Content & engagement, automated",
    description:
      "AI-crafted posts, reply management, and scheduling across platforms — always on-brand.",
  },
  {
    icon: UserSearch,
    badge: "HR Recruiter",
    title: "Hire faster, screen smarter",
    description:
      "Screens resumes, conducts initial outreach, and schedules interviews autonomously.",
  },
];

function ComingSoonCard({ icon: Icon, badge, title, description }: ComingSoonRole) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 lg:p-8 shadow-sm h-full">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-pran-orange/[0.04] blur-2xl" />
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-pran-orange/20 bg-pran-orange/10 px-3.5 py-1 text-sm font-medium text-pran-orange">
          <Icon className="h-4 w-4" />
          {badge}
        </div>
        <h3 className="mb-2 text-lg font-bold text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-secondary">{description}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-pran-orange/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-pran-orange">
          <Lock className="h-3 w-3" />
          Coming Soon
        </div>
      </div>
    </div>
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
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
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

        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mt-20 mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-stone-50 px-4 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-secondary">
            <Lock className="h-3.5 w-3.5" />
            Coming Soon to the Workforce
          </div>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_SOON_ROLES.map((role) => (
            <ComingSoonCard key={role.badge} {...role} />
          ))}
        </div>
      </div>
    </section>
  );
}
