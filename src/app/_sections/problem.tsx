"use client";

import { motion } from "framer-motion";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";
import { painPoints } from "../_data";

export function ProblemSection() {
  return (
    <section id="problem" className="relative border-t border-black/[0.06] py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            The Problem
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary">
            India speaks 22 languages.{" "}
            <span className="text-secondary">
              Your support team doesn&apos;t.
            </span>
          </h2>
        </motion.div>

        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="grid gap-8 md:grid-cols-3"
        >
          {painPoints.map((p) => (
            <motion.div
              key={p.title}
              variants={staggerItem}
              className="group rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm transition-colors hover:border-pran-orange/30"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pran-orange/10">
                <p.icon className="h-6 w-6 text-pran-orange" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-primary">{p.title}</h3>
              <p className="leading-relaxed text-secondary">
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
