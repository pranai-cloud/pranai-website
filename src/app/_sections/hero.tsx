"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { ANIMATION_TIMING, ANIMATION_VARIANTS } from "@/lib/constants";
import { roles, languages } from "../_data";
import { LeadCaptureForm } from "../components/LeadCaptureForm";

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
              <span className="inline-block overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="inline-block bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-transparent will-change-transform"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <br className="hidden sm:block" />
              {" "}that speaks{" "}
              <span className="inline-flex h-[1.4em] items-center overflow-hidden align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={langIndex}
                    initial={{ opacity: 0, y: "0.4em" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-0.4em" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="inline-block text-pran-orange-light underline decoration-pran-orange/30 underline-offset-4 will-change-transform"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG }}
            className="flex-[2] mt-10 lg:mt-0"
          >
            <LeadCaptureForm />
            <p className="mt-4 text-center text-sm text-secondary">
              No credit card required · Live in under 30 minutes
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
