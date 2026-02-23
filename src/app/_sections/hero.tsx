"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Phone } from "lucide-react";
import { ANIMATION_TIMING, ANIMATION_VARIANTS } from "@/lib/constants";
import { roles, languages, indianLanguages, globalLanguages } from "../_data";
import { LeadCaptureForm } from "../components/LeadCaptureForm";
import { InteractiveVoiceShowcase } from "../components/InteractiveVoiceShowcase";
import { LanguageTooltip } from "@/components/LanguageTooltip";

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIndex((i) => (i + 1) % roles.length),
      3000,
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setLangIndex((i) => (i + 1) % languages.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden pt-36 md:pt-40 pb-16 md:pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(249,115,22,0.05),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          <div className="flex-[3] text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ANIMATION_VARIANTS.SPRING_TRANSITION}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-pran-orange/25 bg-pran-orange/10 px-4 py-1.5 text-sm font-medium text-pran-orange"
            >
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Digital Workforce for India
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_SHORT }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter text-primary"
            >
              Hire a 24/7 AI{" "}
              <span className="inline-grid *:[grid-area:1/1] align-bottom ml-2">
                <AnimatePresence>
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-transparent will-change-transform pb-2"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br className="hidden sm:block" />
              {" "}that speaks{" "}
              <span className="inline-grid *:[grid-area:1/1] align-bottom ml-2">
                <AnimatePresence>
                  <motion.span
                    key={langIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="text-pran-orange-light underline decoration-pran-orange/30 underline-offset-4 will-change-transform pb-2"
                  >
                    {languages[langIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_MEDIUM }}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary md:text-xl lg:mx-0 mx-auto"
            >
              Pran.ai deploys native-speaking, hyper-realistic voice and chat
              agents directly into your business. Never miss a lead or a support
              ticket again.
            </motion.p>

          </div>

          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG }}
            className="flex-[2] mt-10 lg:mt-0 flex flex-col gap-6"
          >
            <LeadCaptureForm />
            {/* <InteractiveVoiceShowcase /> */}
            <motion.p layout="position" className="mt-4 text-center text-sm text-secondary">
              No credit card required · Live in under 30 minutes
            </motion.p>
          </motion.div>
        </div>

        {/* Try It Live CTA Banner - Commented out for now
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG + 0.1 }}
          className="relative mt-12 sm:mt-16 flex w-full"
        >
          // Coming Soon Overlay
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-[2px]">
            <span className="rounded-full border border-pran-orange/20 bg-white px-3 py-1 text-xs font-semibold text-pran-orange shadow-sm">
              Coming Soon
            </span>
          </div>
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-pran-orange/20 bg-pran-orange/5 px-6 py-4 text-sm sm:text-base font-semibold text-pran-orange opacity-40 shadow-sm"
          >
            <Phone className="h-5 w-5 shrink-0" />
            Try it live: Call +91-XXX-XXX-XXXX
          </button>
        </motion.div>
        */}
      </div>
    </section>
  );
}