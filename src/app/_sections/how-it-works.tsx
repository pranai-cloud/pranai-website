"use client";

import { motion } from "framer-motion";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";
import { steps } from "../_data";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative border-t border-black/[0.06] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary">
            Deployed in minutes, not months.
          </h2>
        </motion.div>

        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="relative grid gap-8 md:grid-cols-3"
        >
          <div className="pointer-events-none absolute left-0 right-0 top-[4.5rem] hidden h-px bg-gradient-to-r from-transparent via-pran-orange/30 to-transparent md:block" />

          {steps.map((s) => (
            <motion.div
              key={s.number}
              variants={staggerItem}
              className="relative rounded-2xl border border-black/[0.06] bg-white p-8 text-center shadow-sm"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pran-orange/10 ring-1 ring-pran-orange/20">
                <s.icon className="h-6 w-6 text-pran-orange" />
              </div>
              <span className="mb-2 block text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange/60">
                STEP {s.number}
              </span>
              <h3 className="mb-3 text-xl font-semibold text-primary">{s.title}</h3>
              <p className="leading-relaxed text-secondary">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
