import { Variants, Transition } from 'framer-motion';
import { ANIMATION_TIMING } from './constants';

export const VIEWPORT_CONFIG = {
  once: { once: true, margin: "-100px" },
  always: { margin: "-100px", amount: 0.3 },
  partial: { margin: "-50px", amount: 0.5 },
} as const;

export const EASING = {
  smooth: ANIMATION_TIMING.EASE_SMOOTH,
  standard: ANIMATION_TIMING.EASE_STANDARD,
  easeOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
} as const;

const createTransition = (
  duration: number = ANIMATION_TIMING.NORMAL,
  delay: number = 0,
  ease: [number, number, number, number] = EASING.smooth
): Transition => ({
  duration,
  delay,
  ease,
});

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: createTransition(ANIMATION_TIMING.SLOW)
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition(ANIMATION_TIMING.SLOW)
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition(ANIMATION_TIMING.NORMAL)
  },
};

export const sectionHeader: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: createTransition(ANIMATION_TIMING.SLOW)
  },
};

export const createStaggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay + index * 0.1;
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const createViewportAnimation = (
  variants: Variants,
  viewport: keyof typeof VIEWPORT_CONFIG = 'once'
) => ({
  initial: 'hidden',
  whileInView: 'visible',
  viewport: VIEWPORT_CONFIG[viewport],
  variants,
});
