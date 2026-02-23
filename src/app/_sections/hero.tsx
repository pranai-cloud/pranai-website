"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Phone } from "lucide-react";
import { ANIMATION_TIMING, ANIMATION_VARIANTS } from "@/lib/constants";
import { roles, languages, indianLanguages, globalLanguages } from "../_data";
import { LeadCaptureForm } from "../components/LeadCaptureForm";
import { InteractiveVoiceWidget } from "../components/InteractiveVoiceWidget";
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
    <section className="relative isolate overflow-hidden pt-28 md:pt-32 pb-8 md:pb-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-[36rem] h-[36rem] rounded-full bg-pran-orange/[0.04] blur-2xl md:blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(249,115,22,0.05),transparent)]" />
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
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="inline-block bg-gradient-to-r from-pran-orange to-pran-orange-light bg-clip-text text-transparent will-change-transform pb-2 ml-2"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
              <br className="hidden sm:block" />
              {" "}that speaks{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={langIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="inline-block text-pran-orange-light underline decoration-pran-orange/30 underline-offset-4 will-change-transform pb-2 ml-2"
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
              {/* Primary CTA */}
              <a
                href="#lead-form"
                onClick={(e) => {
                  e.preventDefault();
                  const emailInput = document.getElementById("pranai-email");
                  if (emailInput) {
                    emailInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    // slight delay to let the scroll complete before focusing
                    setTimeout(() => emailInput.focus(), 300);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-pran-orange px-8 py-4 text-base font-bold tracking-wide text-white shadow-lg shadow-pran-orange/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pran-orange/30 hover:bg-pran-orange-light"
              >
                Get Started
              </a>
            </motion.div>
          </div>

          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG }}
            className="w-full lg:w-[40%] xl:w-[35%] mt-10 lg:mt-0 flex flex-col gap-4"
          >
            <div id="lead-form">
              <LeadCaptureForm />
            </div>
            <InteractiveVoiceWidget />
          </motion.div>
        </div>

        {/* Full-width Secondary CTA Banner */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...ANIMATION_VARIANTS.SPRING_TRANSITION, delay: ANIMATION_TIMING.DELAY_LONG + 0.1 }}
          className="mt-6 sm:mt-10 relative w-full overflow-hidden rounded-3xl border border-pran-orange/10 bg-white px-6 py-6 sm:px-12 sm:py-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),0_4px_24px_-8px_rgba(249,115,22,0.08)]"
        >
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_right,rgba(249,115,22,0.08),transparent_50%)]" />
          <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
            <div className="text-center sm:text-left flex flex-col items-center sm:items-start">
              <div className="mb-3 inline-flex items-center rounded-full border border-pran-orange/20 bg-pran-orange/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-pran-orange backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pran-orange opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pran-orange"></span>
                </span>
                Live Demo
              </div>
              <h3 className="text-xl font-bold tracking-tight text-primary sm:text-2xl">
                Don't take our word for it.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary sm:max-w-md sm:text-base">
                Call our AI agent right now and experience the <span className="whitespace-nowrap">sub-500ms</span> response time yourself.
              </p>
            </div>

            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-full bg-pran-orange/30 blur animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-pran-orange/30 animate-ping opacity-20 [animation-duration:3s]" />
              <a
                href="tel:+918000000000"
                className="relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-pran-orange px-8 py-4 font-bold tracking-wide text-white shadow-xl shadow-pran-orange/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:bg-pran-orange-light"
              >
                <motion.div
                  animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1.5 }}
                >
                  <Phone className="h-5 w-5 shrink-0 text-white fill-white/20" />
                </motion.div>
                Try it live: +91-800-XXX-XXXX
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}