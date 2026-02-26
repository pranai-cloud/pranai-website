"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import { ANIMATION_TIMING, ANIMATION_VARIANTS } from "@/lib/constants";
import { roles, languages, indianLanguages, globalLanguages } from "../_data";
import { LeadCaptureForm } from "../components/LeadCaptureForm";
import { InteractiveVoiceWidget } from "../components/InteractiveVoiceWidget";
import { LanguageTooltip } from "@/components/LanguageTooltip";

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [langIndex, setLangIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(prefersReducedMotion);

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
      2200,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden pt-28 md:pt-32 pb-8 md:pb-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="hidden md:block absolute top-1/4 -left-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="hidden md:block absolute bottom-1/4 -right-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(234,88,12,0.05),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full lg:w-[60%] xl:w-[65%] text-center lg:text-left lg:pt-4 xl:pt-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={ANIMATION_VARIANTS.SPRING_TRANSITION}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-pran-orange/25 bg-pran-orange/10 px-4 py-1.5 text-sm font-medium text-pran-orange"
            >
              <Zap className="h-3.5 w-3.5" />
              Never miss an after-hours call again.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_SHORT }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter text-primary min-h-[3.5em] sm:min-h-[3em] lg:min-h-[2.5em]"
            >
              Hire a 24/7 AI{" "}
              <AnimatePresence initial={false} mode={shouldReduceMotion ? "sync" : "wait"}>
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
                  transition={{ duration: shouldReduceMotion ? 0.3 : 0.2, ease: "easeOut" }}
                  className="inline-block bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-transparent pb-2 ml-2"
                  style={{ willChange: "opacity, transform", transform: "translateZ(0)" }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
              <br className="hidden sm:block" />
              {" "}that speaks{" "}
              <AnimatePresence initial={false} mode={shouldReduceMotion ? "sync" : "wait"}>
                <motion.span
                  key={langIndex}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  transition={{ duration: shouldReduceMotion ? 0.3 : 0.2, ease: "easeOut" }}
                  className="inline-block text-pran-orange-light underline decoration-pran-orange/30 underline-offset-4 pb-2 ml-2"
                  style={{ willChange: "opacity, transform", transform: "translateZ(0)" }}
                >
                  {languages[langIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_MEDIUM }}
              className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary md:text-xl lg:mx-0 mx-auto"
            >
              pran.ai deploys native-speaking, hyper-realistic voice and chat
              agents directly into your business. Never miss a lead or a support
              ticket again.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_MEDIUM + 0.1 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#live-voice-demo"
                onClick={(e) => {
                  e.preventDefault();
                  const demoSection = document.getElementById("live-voice-demo");
                  const demoAction = document.getElementById("live-voice-demo-action");
                  if (demoSection) {
                    demoSection.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                  if (demoAction) {
                    setTimeout(() => demoAction.focus(), 300);
                  }
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("pranai:voice-demo-start"));
                  }, 320);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-pran-orange px-8 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-pran-orange/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pran-orange/30 hover:bg-pran-orange-light"
              >
                Experience pran.ai
              </a>
              <a
                href="#lead-form"
                onClick={(e) => {
                  e.preventDefault();
                  const emailInput = document.getElementById("pranai-email");
                  if (emailInput) {
                    emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    setTimeout(() => emailInput.focus(), 300);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.1] bg-white px-8 py-4 text-base font-semibold tracking-wide text-primary transition-all hover:-translate-y-0.5 hover:border-pran-orange/40 hover:text-pran-orange"
              >
                Book a Demo
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG }}
            className="w-full lg:w-[44%] xl:w-[40%] mt-10 lg:mt-0 flex flex-col gap-4"
          >
            <div id="live-voice-demo" className="order-1">
              <InteractiveVoiceWidget />
            </div>
            <div id="lead-form" className="order-2">
              <LeadCaptureForm />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}