import { useEffect } from 'react';
import { useInView, useAnimation } from 'framer-motion';
import { useRef } from 'react';

// ============================================
// ANIMATION VARIANTS — Reusable preset motions
// ============================================

export const fadeInUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const slideInRight = {
  hidden: { opacity: 0, x: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      delay,
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  }),
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// ============================================
// CUSTOM HOOK — useScrollReveal
// ============================================

export function useScrollReveal(options?: { threshold?: number; once?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: options?.threshold ?? 0.15,
    once: options?.once ?? true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return { ref, controls, isInView };
}

// ============================================
// SPRING CONFIGS — Consistent physics
// ============================================

export const springBounce = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export const springGentle = {
  type: 'spring' as const,
  stiffness: 150,
  damping: 25,
};

export const springSnappy = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

// ============================================
// HOVER PRESETS — For whileHover / whileTap
// ============================================

export const hoverLift = {
  y: -4,
  scale: 1.02,
  transition: springGentle,
};

export const hoverGlow = {
  y: -2,
  boxShadow: '0 8px 30px rgba(156, 185, 83, 0.2)',
  transition: springGentle,
};

export const tapShrink = {
  scale: 0.98,
};
