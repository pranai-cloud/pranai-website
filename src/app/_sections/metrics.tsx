"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItem,
  createViewportAnimation,
} from "@/lib/animations";
import { metrics } from "../_data";

export function MetricsSection() {
  return (
    <section className="relative border-t border-black/[0.06]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-20">
        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {metrics.map((m) => (
            <motion.div
              key={m.label}
              variants={staggerItem}
              className="text-center"
            >
              <p className="bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                {m.value}
              </p>
              <p className="mt-2 text-sm font-medium text-secondary">
                {m.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
