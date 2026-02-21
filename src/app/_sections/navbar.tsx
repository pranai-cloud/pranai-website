"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Menu } from "lucide-react";
import { useContactSafe } from "@/components/contact-provider";

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Pricing", href: "#pricing" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function PranNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const contact = useContactSafe();

  const onScroll = useCallback(() => {
    const next = window.scrollY > 20;
    setScrolled((prev) => {
      if (prev !== next) return next;
      return prev;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 pt-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`w-full max-w-[1100px] rounded-full border transition-colors duration-300 ${
            scrolled
              ? "border-black/[0.08] bg-white/95 shadow-lg shadow-black/[0.04] supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:backdrop-blur-lg"
              : "border-black/[0.06] bg-white/90 shadow-sm"
          }`}
        >
          <div className="flex h-14 items-center justify-between px-5 sm:px-6">
            <svg viewBox="0 0 160 40" className="relative z-10 h-7 w-auto" aria-label="pran.ai">
              <defs>
                <linearGradient id="nav-orange-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#fb923c"/>
                </linearGradient>
              </defs>
              <text x="0" y="30" fontFamily="var(--font-space-grotesk), 'Space Grotesk', sans-serif" fontWeight="700" fontSize="28" letterSpacing="-1.4">
                <tspan fill="#1A1A1A">pran</tspan><tspan fill="url(#nav-orange-grad)">.ai</tspan>
              </text>
            </svg>

            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium text-secondary transition-colors hover:bg-black/[0.04] hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center relative z-10">
              <button
                onClick={() => contact?.openContact()}
                className="group inline-flex items-center gap-2 rounded-full bg-pran-orange px-5 py-2 text-[0.82rem] font-bold text-white shadow-sm transition-all hover:bg-pran-orange-light hover:shadow-md"
              >
                Book a Demo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden relative z-10 flex items-center justify-center h-9 w-9 rounded-full border border-black/[0.08] bg-black/[0.03] active:scale-95 transition-transform"
              aria-label="Open menu"
            >
              <Menu className="h-4.5 w-4.5 text-primary" />
            </button>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute top-0 right-0 h-full w-full max-w-sm bg-surface flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 h-16">
                <svg viewBox="0 0 160 40" className="h-7 w-auto" aria-label="pran.ai">
                  <defs>
                    <linearGradient id="mobile-orange-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316"/>
                      <stop offset="100%" stopColor="#fb923c"/>
                    </linearGradient>
                  </defs>
                  <text x="0" y="30" fontFamily="var(--font-space-grotesk), 'Space Grotesk', sans-serif" fontWeight="700" fontSize="28" letterSpacing="-1.4">
                    <tspan fill="#1A1A1A">pran</tspan><tspan fill="url(#mobile-orange-grad)">.ai</tspan>
                  </text>
                </svg>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-black/[0.08] bg-black/[0.03]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-primary" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col justify-center px-8">
                <ul className="space-y-2">
                  {NAV_LINKS.map((link, i) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-3 text-2xl font-bold tracking-tight text-primary transition-colors hover:text-pran-orange"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="px-8 pb-8 space-y-3">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    contact?.openContact();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-pran-orange px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-pran-orange-light"
                >
                  Book a Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
