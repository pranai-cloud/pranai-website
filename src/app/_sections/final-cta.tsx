"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { sectionHeader, createViewportAnimation } from "@/lib/animations";
import { useContactSafe } from "@/components/contact-provider";

export function FinalCTASection() {
  const contact = useContactSafe();

  return (
    <section
      id="cta"
      className="relative isolate overflow-hidden border-t border-black/[0.06] py-16 md:py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(249,115,22,0.06),transparent)]" />
      </div>

      <motion.div
        {...createViewportAnimation(sectionHeader)}
        className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-primary">
          Ready to scale your workforce?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary">
          Start giving your customers the localized, instant support they
          expect.
        </p>
        <div className="mt-10">
          <button
            onClick={() => contact?.openContact()}
            className="group inline-flex items-center gap-2.5 rounded-full bg-pran-orange px-10 py-5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-pran-orange/20 transition-all hover:bg-pran-orange-light hover:shadow-pran-orange-light/30"
          >
            <Calendar className="h-5 w-5" />
            Book Your Setup Call
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <p className="mt-6 text-sm text-secondary">
          No credit card required · Live in under 30 minutes
        </p>
      </motion.div>
    </section>
  );
}
