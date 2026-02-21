'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Globe } from 'lucide-react';
import { InlineWidget } from 'react-calendly';
import { CONTACT_CONFIG, SITE_STRINGS } from '@/lib/constants';

export interface ContactModalBranding {
  logo?: React.ReactNode;
  heading?: React.ReactNode;
  description?: string;
  accentColor?: string;
  footerLabel?: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding?: ContactModalBranding;
}

function CalendlyLoader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-surface z-10 transition-opacity duration-500">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-black/[0.06]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-primary text-sm font-semibold tracking-tight">Loading scheduler</p>
        <p className="text-secondary text-xs">Pick a time that works for you</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent/40"
            style={{
              animation: 'calendlyPulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes calendlyPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export function ContactModal({ isOpen, onClose, branding }: ContactModalProps) {
  const [calendlyLoaded, setCalendlyLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setCalendlyLoaded(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.event === 'calendly.event_type_viewed') {
        setCalendlyLoaded(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-xl"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring' as const, stiffness: 120, damping: 20 }}
              className="relative w-full max-w-6xl h-full md:h-[85vh] bg-surface border-0 md:border md:border-black/[0.06] rounded-none md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto"
            >
              <div className="hidden md:flex w-[35%] p-12 border-r border-black/[0.06] flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between items-center mb-12">
                    {branding?.logo ?? (
                      <span className="text-xl font-bold tracking-tighter text-primary">
                        {SITE_STRINGS.NAV.LOGO}<span className="text-accent">.</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl font-bold text-primary tracking-tighter mb-4 leading-none">
                    {branding?.heading ?? (
                      <>Let&apos;s Build Your <br /> <span className="text-accent">Vision.</span></>
                    )}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed mb-12">
                    {branding?.description ??
                      'Book a friendly call with us to discuss your goals. We will look at your current setup, listen to your ideas, and create a clear, step-by-step plan to help your business grow ten times bigger.'}
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-black/[0.06] flex items-center justify-center group-hover:border-accent transition-all">
                        <Mail size={16} className="text-accent" />
                      </div>
                      <span className="text-primary font-mono text-xs tracking-widest">fluxenta.dev@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-black/[0.06] flex items-center justify-center">
                        <Globe size={16} className="text-accent" />
                      </div>
                      <span className="text-primary font-mono text-xs uppercase tracking-widest">Remote</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-xs text-primary font-bold uppercase tracking-tighter">
                      {branding?.footerLabel ?? 'Reliable'}
                    </span>
                    <span className="text-xs text-primary font-bold uppercase">
                      {branding?.footerLabel ? '' : 'professionals.'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-surface relative flex flex-col">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-[120] p-3 bg-black/5 rounded-full md:hidden border border-black/[0.06]"
                >
                  <X size={20} className="text-primary" />
                </button>

                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-50 p-3 bg-black/5 hover:bg-black/10 rounded-full transition-all hidden md:block border border-black/[0.06]"
                >
                  <X size={18} className="text-primary" />
                </button>

                <div className="flex-1 w-full overflow-y-auto pt-12 md:pt-0 relative">
                  {!calendlyLoaded && <CalendlyLoader />}
                  <div
                    className="h-full transition-opacity duration-500"
                    style={{ opacity: calendlyLoaded ? 1 : 0 }}
                  >
                    <InlineWidget
                      url={CONTACT_CONFIG.CALENDLY_URL}
                      styles={{
                        height: '100%',
                        minHeight: '650px',
                        width: '100%'
                      }}
                      pageSettings={{
                        backgroundColor: 'fafaf8',
                        hideEventTypeDetails: true,
                        hideLandingPageDetails: true,
                        primaryColor: '0d9488',
                        textColor: '1a1a1a',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
