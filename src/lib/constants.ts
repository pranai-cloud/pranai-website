export const ANIMATION_TIMING = {
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
  VERY_SLOW: 1.2,
  DELAY_SHORT: 0.1,
  DELAY_MEDIUM: 0.2,
  DELAY_LONG: 0.4,
  DELAY_VERY_LONG: 0.6,
  EASE_SMOOTH: [0.22, 1, 0.36, 1] as [number, number, number, number],
  EASE_STANDARD: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

export const ANIMATION_VARIANTS = {
  TYPEWRITER_SPEED: 0.05,
  SUBTEXT_FADE_DELAY: 1.2,
  SPRING_TYPE: "spring",
  SPRING_DAMPING: 20,
  SPRING_STIFFNESS: 120,
  SPRING_TRANSITION: { type: "spring" as const, stiffness: 120, damping: 20 },
  FADE_IN: {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { type: "spring" as const, stiffness: 120, damping: 20 }
  }
} as const;

export const CONTACT_CONFIG = {
  CALENDLY_URL: "https://calendly.com/founder-pranai/30min",
  EMAIL: "founder@pranai.cloud",
  PHONE: "+919304117405",
  OFFICE: "Bengaluru, Karnataka",
  SOCIALS: [
    { name: "LinkedIn", href: "https://www.linkedin.com/company/111233174" },
  ]
} as const;

export const SITE_STRINGS = {
  NAV: {
    LOGO: "pran.ai",
  },
} as const;
