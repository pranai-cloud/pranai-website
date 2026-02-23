"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Bot,
  Zap,
  Phone,
  Settings,
  Database,
  PhoneIncoming,
  Mic,
  CheckCircle,
  Activity,
} from "lucide-react";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";
import { steps } from "../_data";

const pipelineSteps = [
  {
    number: "01",
    icon: Settings,
    title: "Configure Agent",
    description: "Select your agent's role, voice, and native Indian language.",
  },
  {
    number: "02",
    icon: Database,
    title: "Connect Knowledge",
    description: "Upload your FAQs and product catalogs. Our RAG pipeline learns your business instantly.",
  },
  {
    number: "03",
    icon: Zap,
    title: "The Trigger",
    description: "Customer dials your dedicated Telnyx number, or your CRM triggers an outbound campaign.",
  },
  {
    number: "04",
    icon: Mic,
    title: "Live Conversation",
    description: "The AI engages the customer with human-like dialogue and sub-500ms latency.",
  },
  {
    number: "05",
    icon: CheckCircle,
    title: "Post-Call Action",
    description: "Insights are extracted and sent directly to your calendar, CRM, or webhook.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative border-t border-black/[0.06] py-20 lg:py-32">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-12 lg:px-20">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-20 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-primary">
            Deployed in minutes, not months.
          </h2>
        </motion.div>

        {/* Desktop Pipeline Flowchart (Horizontal) */}
        <div className="relative hidden w-full lg:block select-none mt-10">
          {/* SVG Animated Snake Path (Background) */}
          <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M -50 50 L 100 50 C 200 50, 200 150, 300 150 S 400 50, 500 50 S 600 150, 700 150 S 800 50, 900 50 L 1050 50"
                fill="none"
                stroke="url(#snakeGradient)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                animate={{ strokeDashoffset: [-200, 0] }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  pathLength: { duration: 2, ease: "easeInOut" },
                  opacity: { duration: 2, ease: "easeInOut" },
                  strokeDashoffset: { duration: 15, repeat: Infinity, ease: "linear" }
                }}
              />
              <defs>
                <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div
            {...createViewportAnimation(staggerContainer)}
            className="relative z-10 grid grid-cols-5 gap-6 xl:gap-10"
          >
            {pipelineSteps.map((step, index) => {
              // Alternate Y positions to match the snake SVG
              const isDown = index % 2 !== 0;
              return (
                <motion.div
                  key={step.number}
                  variants={staggerItem}
                  className={`relative flex flex-col items-center bg-white border border-black/[0.06] rounded-2xl p-6 lg:p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${isDown ? 'mt-[100px]' : ''}`}
                >
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pran-orange/10 border border-pran-orange/20 text-pran-orange text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {step.number}
                  </div>
                  {/* Icon */}
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pran-orange/10 border border-pran-orange/20">
                    <step.icon className="h-5 w-5 text-pran-orange transition-colors group-hover:text-primary" />
                  </div>
                  {/* Content */}
                  <h3 className="text-center text-sm font-bold text-primary mb-2 leading-tight">{step.title}</h3>
                  <p className="text-center text-xs text-stone-600 leading-relaxed font-medium">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile Pipeline Flowchart (Vertical Stack) */}
        <div className="relative block lg:hidden w-full max-w-sm mx-auto">
          {/* Vertical Dashed Line */}
          <div className="absolute left-8 top-10 bottom-10 w-[2px] overflow-hidden z-0">
            <motion.div
              animate={{ translateY: ["-50%", "0%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="h-[200%] w-full border-l-2 border-dashed border-pran-orange/30"
            />
          </div>

          <motion.div
            {...createViewportAnimation(staggerContainer)}
            className="relative z-10 flex flex-col gap-8"
          >
            {pipelineSteps.map((step) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="flex gap-4 items-start"
              >
                <div className="relative z-10 flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-pran-orange/10 border border-pran-orange/20 shadow-sm">
                  <span className="text-[10px] font-bold text-pran-orange mb-0.5">{step.number}</span>
                  <step.icon className="h-4 w-4 text-pran-orange" />
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-bold text-primary mb-1">{step.title}</h3>
                  <p className="text-sm text-stone-600 font-medium leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
