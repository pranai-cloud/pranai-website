"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ANIMATION_TIMING } from "@/lib/constants";
import {
  sectionHeader,
  staggerContainer,
  staggerItem,
  createViewportAnimation,
  EASING,
} from "@/lib/animations";
import { faqs, type FAQ } from "../_data";

function FAQItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: FAQ;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="rounded-2xl border border-black/[0.06] bg-white overflow-hidden shadow-sm hover:border-pran-orange/30 transition-colors"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-lg font-medium text-primary">{faq.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: ANIMATION_TIMING.FAST }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-secondary" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: ANIMATION_TIMING.FAST, ease: EASING.easeInOut }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-secondary leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = useCallback(
    (idx: number) => setOpenFaq((prev) => (prev === idx ? null : idx)),
    [],
  );

  return (
    <section id="faq" className="relative border-t border-black/[0.06] py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          {...createViewportAnimation(sectionHeader)}
          className="mb-12 text-center"
        >
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.15em] text-pran-orange">
            FAQ
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-primary">
            You probably have questions.
          </h2>
        </motion.div>

        <motion.div
          {...createViewportAnimation(staggerContainer)}
          className="space-y-4"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openFaq === i}
              onToggle={() => toggleFaq(i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
