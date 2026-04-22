import { useMemo } from "react";
import { usePrefersReducedMotion } from "@chakra-ui/react";

/**
 * Global Animation Styles Component
 * Injects CSS keyframes and animation classes for the entire application
 */
export default function GlobalAnimationStyles() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animationStyles = useMemo(() => {
    if (prefersReducedMotion) {
      return `
        /* Reduced motion mode - minimal animations */
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
    }

    return `
      /* ============================================
         GLOBAL ANIMATIONS - Premium Estate CRM
         ============================================ */

      /* --- Fade Animations --- */
      @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fade-in-up {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-down {
        from {
          opacity: 0;
          transform: translateY(-40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-in-left {
        from {
          opacity: 0;
          transform: translateX(-50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fade-in-right {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fade-in-scale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      @keyframes fade-in-zoom {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      /* --- Slide Animations --- */
      @keyframes slide-up {
        from {
          transform: translateY(60px);
        }
        to {
          transform: translateY(0);
        }
      }

      @keyframes slide-down {
        from {
          transform: translateY(-60px);
        }
        to {
          transform: translateY(0);
        }
      }

      @keyframes slide-left {
        from {
          transform: translateX(60px);
        }
        to {
          transform: translateX(0);
        }
      }

      @keyframes slide-right {
        from {
          transform: translateX(-60px);
        }
        to {
          transform: translateX(0);
        }
      }

      /* --- Scale Animations --- */
      @keyframes scale-up {
        from {
          transform: scale(0.95);
        }
        to {
          transform: scale(1);
        }
      }

      @keyframes scale-down {
        from {
          transform: scale(1.05);
        }
        to {
          transform: scale(1);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes pulse-soft {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.02);
        }
      }

      /* --- Bounce Animations --- */
      @keyframes bounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes bounce-soft {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes bounce-in {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      /* --- Rotate Animations --- */
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes rotate-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes wiggle {
        0%, 100% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(-3deg);
        }
        75% {
          transform: rotate(3deg);
        }
      }

      /* --- Glow Animations --- */
      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3),
                      0 0 40px rgba(212, 175, 55, 0.1);
        }
        50% {
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.6),
                      0 0 80px rgba(212, 175, 55, 0.3);
        }
      }

      @keyframes glow-soft {
        0%, 100% {
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }
        50% {
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
        }
      }

      /* --- Shimmer Animations --- */
      @keyframes shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      @keyframes shimmer-slide {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes shimmer-horizontal {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* --- Gradient Animations --- */
      @keyframes gradient-shift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      @keyframes gradient-flow {
        0% {
          background-position: 0% 0%;
        }
        50% {
          background-position: 100% 100%;
        }
        100% {
          background-position: 0% 0%;
        }
      }

      @keyframes gradient-spin {
        from {
          background-position: 0% 50%;
        }
        to {
          background-position: 200% 50%;
        }
      }

      /* --- Float Animations --- */
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }

      @keyframes float-slow {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes float-horizontal {
        0%, 100% {
          transform: translateX(0px);
        }
        50% {
          transform: translateX(20px);
        }
      }

      @keyframes levitate {
        0%, 100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-15px) scale(1.02);
        }
      }

      /* --- Wave Animations --- */
      @keyframes wave {
        0%, 100% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(10deg);
        }
        75% {
          transform: rotate(-10deg);
        }
      }

      /* --- Blur Animations --- */
      @keyframes blur-in {
        from {
          filter: blur(10px);
          opacity: 0;
        }
        to {
          filter: blur(0);
          opacity: 1;
        }
      }

      @keyframes blur-out {
        from {
          filter: blur(0);
          opacity: 1;
        }
        to {
          filter: blur(10px);
          opacity: 0;
        }
      }

      /* --- Skeleton Loading --- */
      @keyframes skeleton-loading {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* --- Border Animations --- */
      @keyframes border-draw {
        0% {
          stroke-dashoffset: 1000;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes border-glow {
        0%, 100% {
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
        }
        50% {
          border-color: rgba(212, 175, 55, 0.8);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
        }
      }

      /* --- Ripple Effect --- */
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }

      /* --- Spinner --- */
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      /* --- Elastic Animations --- */
      @keyframes elastic {
        0% {
          transform: scale3d(1, 1, 1);
        }
        30% {
          transform: scale3d(1.25, 0.75, 1);
        }
        40% {
          transform: scale3d(0.75, 1.25, 1);
        }
        50% {
          transform: scale3d(1.15, 0.85, 1);
        }
        65% {
          transform: scale3d(0.95, 1.05, 1);
        }
        75% {
          transform: scale3d(1.05, 0.95, 1);
        }
        100% {
          transform: scale3d(1, 1, 1);
        }
      }

      /* --- Shake Animation --- */
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(5px);
        }
      }

      /* --- Heartbeat --- */
      @keyframes heartbeat {
        0%, 100% {
          transform: scale(1);
        }
        14% {
          transform: scale(1.15);
        }
        28% {
          transform: scale(1);
        }
        42% {
          transform: scale(1.15);
        }
        70% {
          transform: scale(1);
        }
      }

      /* ============================================
         UTILITY CLASSES
         ============================================ */

      /* Animation Delays */
      .delay-100 { animation-delay: 0.1s; }
      .delay-200 { animation-delay: 0.2s; }
      .delay-300 { animation-delay: 0.3s; }
      .delay-400 { animation-delay: 0.4s; }
      .delay-500 { animation-delay: 0.5s; }
      .delay-600 { animation-delay: 0.6s; }
      .delay-700 { animation-delay: 0.7s; }
      .delay-800 { animation-delay: 0.8s; }
      .delay-900 { animation-delay: 0.9s; }
      .delay-1000 { animation-delay: 1s; }

      /* Animation Durations */
      .duration-100 { animation-duration: 0.1s; }
      .duration-200 { animation-duration: 0.2s; }
      .duration-300 { animation-duration: 0.3s; }
      .duration-400 { animation-duration: 0.4s; }
      .duration-500 { animation-duration: 0.5s; }
      .duration-600 { animation-duration: 0.6s; }
      .duration-700 { animation-duration: 0.7s; }
      .duration-800 { animation-duration: 0.8s; }
      .duration-1000 { animation-duration: 1s; }
      .duration-1500 { animation-duration: 1.5s; }
      .duration-2000 { animation-duration: 2s; }
      .duration-3000 { animation-duration: 3s; }

      /* Animation Easings */
      .ease-linear { animation-timing-function: linear; }
      .ease-in { animation-timing-function: cubic-bezier(0.4, 0, 1, 1); }
      .ease-out { animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
      .ease-in-out { animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
      .ease-bounce { animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      .ease-elastic { animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275); }

      /* Animation Fill Modes */
      .fill-none { animation-fill-mode: none; }
      .fill-forwards { animation-fill-mode: forwards; }
      .fill-backwards { animation-fill-mode: backwards; }
      .fill-both { animation-fill-mode: both; }

      /* Animation Iteration Counts */
      .iterate-once { animation-iteration-count: 1; }
      .iterate-twice { animation-iteration-count: 2; }
      .iterate-infinite { animation-iteration-count: infinite; }

      /* ============================================
         PRESET ANIMATION CLASSES
         ============================================ */

      /* Entry Animations */
      .animate-enter {
        animation: fade-in-up 0.6s ease-out forwards;
      }

      .animate-enter-left {
        animation: fade-in-left 0.6s ease-out forwards;
      }

      .animate-enter-right {
        animation: fade-in-right 0.6s ease-out forwards;
      }

      .animate-enter-scale {
        animation: fade-in-scale 0.6s ease-out forwards;
      }

      /* Continuous Animations */
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }

      .animate-float-slow {
        animation: float-slow 6s ease-in-out infinite;
      }

      .animate-pulse-soft {
        animation: pulse-soft 3s ease-in-out infinite;
      }

      .animate-glow {
        animation: glow 2s ease-in-out infinite;
      }

      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-shift 15s ease infinite;
      }

      .animate-shimmer {
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0) 0%,
          rgba(255,255,255,0.1) 50%,
          rgba(255,255,255,0) 100%
        );
        background-size: 200% 100%;
        animation: shimmer-horizontal 2s infinite;
      }

      /* Hover Animations */
      .hover-lift {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-lift:hover {
        transform: translateY(-6px);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2),
                    0 0 30px rgba(212, 175, 55, 0.08),
                    0 0 60px rgba(255, 255, 255, 0.04);
      }

      .hover-scale {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-scale:hover {
        transform: scale(1.05);
      }

      .hover-glow {
        transition: box-shadow 0.3s ease;
      }
      .hover-glow:hover {
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
      }

      .hover-shimmer {
        position: relative;
        overflow: hidden;
      }
      .hover-shimmer::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255,255,255,0.2),
          transparent
        );
        transition: left 0.5s ease;
      }
      .hover-shimmer:hover::after {
        left: 100%;
      }

      /* Stagger Delays for Grid Items */
      .stagger-1 { animation-delay: calc(0.1s * 1); }
      .stagger-2 { animation-delay: calc(0.1s * 2); }
      .stagger-3 { animation-delay: calc(0.1s * 3); }
      .stagger-4 { animation-delay: calc(0.1s * 4); }
      .stagger-5 { animation-delay: calc(0.1s * 5); }
      .stagger-6 { animation-delay: calc(0.1s * 6); }
      .stagger-7 { animation-delay: calc(0.1s * 7); }
      .stagger-8 { animation-delay: calc(0.1s * 8); }
      .stagger-9 { animation-delay: calc(0.1s * 9); }
      .stagger-10 { animation-delay: calc(0.1s * 10); }

      /* ============================================
         SCROLL REVEAL CLASSES (used with Intersection Observer)
         ============================================ */
      .reveal-up {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-up.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      .reveal-down {
        opacity: 0;
        transform: translateY(-50px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-down.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      .reveal-left {
        opacity: 0;
        transform: translateX(50px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-left.revealed {
        opacity: 1;
        transform: translateX(0);
      }

      .reveal-right {
        opacity: 0;
        transform: translateX(-50px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-right.revealed {
        opacity: 1;
        transform: translateX(0);
      }

      .reveal-scale {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-scale.revealed {
        opacity: 1;
        transform: scale(1);
      }

      .reveal-blur {
        opacity: 0;
        filter: blur(10px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    filter 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .reveal-blur.revealed {
        opacity: 1;
        filter: blur(0);
      }

      /* Staggered reveal delays */
      .reveal-delay-100 { transition-delay: 0.1s; }
      .reveal-delay-200 { transition-delay: 0.2s; }
      .reveal-delay-300 { transition-delay: 0.3s; }
      .reveal-delay-400 { transition-delay: 0.4s; }
      .reveal-delay-500 { transition-delay: 0.5s; }
      .reveal-delay-600 { transition-delay: 0.6s; }
      .reveal-delay-700 { transition-delay: 0.7s; }
      .reveal-delay-800 { transition-delay: 0.8s; }
      .reveal-delay-900 { transition-delay: 0.9s; }
      .reveal-delay-1000 { transition-delay: 1s; }

      /* ============================================
         SKELETON LOADING
         ============================================ */
      .skeleton {
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0.05) 0%,
          rgba(255,255,255,0.1) 50%,
          rgba(255,255,255,0.05) 100%
        );
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s ease-in-out infinite;
        border-radius: 8px;
      }

      /* ============================================
         PREMIUM ESTATE SPECIFIC
         ============================================ */

      /* Logo Animations */
      .logo-shimmer {
        animation: logo-shimmer 3s ease-in-out infinite;
      }
      @keyframes logo-shimmer {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.85; }
      }

      .logo-glow {
        animation: logo-glow 2s ease-in-out infinite;
      }
      @keyframes logo-glow {
        0%, 100% {
          filter: drop-shadow(0 0 2px rgba(212, 175, 55, 0.3));
        }
        50% {
          filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
        }
      }

      /* Card Hover Effects */
      .property-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .property-card:hover {
        transform: translateY(-10px) scale(1.01);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2),
                    0 0 30px rgba(212, 175, 55, 0.1),
                    0 0 60px rgba(255, 255, 255, 0.05);
      }

      /* Button Ripple */
      .btn-ripple {
        position: relative;
        overflow: hidden;
      }
      .btn-ripple::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      .btn-ripple:active::before {
        width: 300px;
        height: 300px;
      }

      /* Text Gradient Animation */
      .text-gradient-animated {
        background: linear-gradient(
          90deg,
          #F5D076 0%,
          #D4AF37 50%,
          #F5D076 100%
        );
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 3s linear infinite;
      }

      /* Orb Floating */
      .orb-float {
        animation: orb-float 20s ease-in-out infinite;
      }
      @keyframes orb-float {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(10%, 10%) scale(1.05);
        }
        50% {
          transform: translate(-5%, 15%) scale(0.95);
        }
        75% {
          transform: translate(-10%, -5%) scale(1.02);
        }
      }

      /* ============================================
         PREMIUM GLASS EFFECTS
         ============================================ */

      /* Glass Card Premium */
      .glass-card-premium {
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.03) 50%,
          rgba(212, 175, 55, 0.05) 100%);
        backdrop-filter: blur(30px) saturate(200%);
        -webkit-backdrop-filter: blur(30px) saturate(200%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3),
                    0 0 40px rgba(212, 175, 55, 0.12),
                    inset 0 1px 0 rgba(255, 255, 255, 0.25),
                    inset 0 0 60px rgba(255, 255, 255, 0.08);
      }

      /* Ethereal Glow */
      .ethereal-glow {
        box-shadow: 0 0 60px rgba(212, 175, 55, 0.2),
                    0 0 100px rgba(255, 255, 255, 0.1),
                    0 0 140px rgba(212, 175, 55, 0.05);
      }

      .ethereal-glow:hover {
        box-shadow: 0 0 80px rgba(212, 175, 55, 0.3),
                    0 0 140px rgba(255, 255, 255, 0.15),
                    0 0 200px rgba(212, 175, 55, 0.1);
      }

      /* Light Refraction */
      .light-refraction {
        position: relative;
      }
      .light-refraction::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          105deg,
          transparent 40%,
          rgba(255, 255, 255, 0.03) 45%,
          rgba(255, 255, 255, 0.08) 50%,
          rgba(255, 255, 255, 0.03) 55%,
          transparent 60%
        );
        background-size: 300% 100%;
        animation: shimmer 3s ease-in-out infinite;
        pointer-events: none;
      }

      /* Floating Effect */
      .float-premium {
        animation: float-premium 6s ease-in-out infinite;
      }
      @keyframes float-premium {
        0%, 100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-20px) scale(1.02);
        }
      }

      /* Breathing Glow */
      .breathing-glow {
        animation: breathing-glow 4s ease-in-out infinite;
      }
      @keyframes breathing-glow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.2),
                      0 0 60px rgba(255, 255, 255, 0.05);
          opacity: 0.8;
        }
        50% {
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.35),
                      0 0 100px rgba(255, 255, 255, 0.1);
          opacity: 1;
        }
      }

      /* Crystal Effect */
      .crystal-effect {
        background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(255, 255, 255, 0.02) 50%,
          rgba(212, 175, 55, 0.03) 100%);
        backdrop-filter: blur(40px) saturate(220%);
        -webkit-backdrop-filter: blur(40px) saturate(220%);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3),
                    0 0 60px rgba(212, 175, 55, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    inset 0 0 80px rgba(255, 255, 255, 0.1);
      }

      /* Aurora Effect */
      .aurora-effect {
        background: linear-gradient(135deg,
          rgba(212, 175, 55, 0.1) 0%,
          rgba(245, 208, 118, 0.05) 40%,
          rgba(255, 255, 255, 0.08) 70%,
          rgba(212, 175, 55, 0.1) 100%);
        background-size: 200% 200%;
        animation: gradient-shift 15s ease infinite;
      }

      /* Sparkle Effect */
      .sparkle {
        position: relative;
      }
      .sparkle::before {
        content: '✦';
        position: absolute;
        top: -10px;
        right: -10px;
        color: rgba(212, 175, 55, 0.6);
        font-size: 20px;
        animation: sparkle-appear 2s ease-in-out infinite;
        text-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
      }
      @keyframes sparkle-appear {
        0%, 100% {
          opacity: 0;
          transform: scale(0) rotate(0deg);
        }
        50% {
          opacity: 1;
          transform: scale(1) rotate(180deg);
        }
      }

      /* Halo Effect */
      .halo-effect {
        position: relative;
      }
      .halo-effect::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        background: radial-gradient(circle,
          rgba(255, 255, 255, 0.1) 0%,
          rgba(212, 175, 55, 0.05) 40%,
          transparent 70%);
        animation: rotate 20s linear infinite;
        pointer-events: none;
        z-index: -1;
      }

      /* Prism Effect */
      .prism-effect {
        position: relative;
        overflow: hidden;
      }
      .prism-effect::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 30%,
          rgba(255, 255, 255, 0.05) 40%,
          rgba(212, 175, 55, 0.08) 50%,
          rgba(255, 255, 255, 0.05) 60%,
          transparent 70%
        );
        animation: prism-rotate 10s linear infinite;
        pointer-events: none;
      }
      @keyframes prism-rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      /* ============================================
         ROUNDED CORNERS - NO ANGLES
         ============================================ */

      /* Fully rounded corners */
      .rounded-premium {
        border-radius: 40px !important;
      }

      .rounded-max {
        border-radius: 9999px !important;
      }

      /* Soft edges */
      .soft-edges {
        border-radius: 32px !important;
      }

      .soft-edges-sm {
        border-radius: 24px !important;
      }

      /* ============================================
         PREMIUM BUTTONS
         ============================================ */

      .btn-premium {
        position: relative;
        overflow: hidden;
        background: linear-gradient(135deg,
          rgba(243, 217, 161, 0.95) 0%,
          rgba(212, 175, 55, 0.92) 48%,
          rgba(166, 106, 45, 0.95) 100%);
        border-radius: 40px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .btn-premium:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 50px rgba(212, 175, 55, 0.3),
                    0 0 30px rgba(255, 255, 255, 0.1);
      }

      .btn-premium::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent);
        transition: left 0.6s ease;
      }

      .btn-premium:hover::before {
        left: 100%;
      }

      /* ============================================
         NEW PREMIUM EFFECTS
         ============================================ */

      /* Soft Hover Glow */
      .hover-soft-glow {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .hover-soft-glow:hover {
        box-shadow: 0 0 40px rgba(212, 175, 55, 0.15),
                    0 0 80px rgba(255, 255, 255, 0.08);
        transform: translateY(-4px);
      }

      /* Floating Animation */
      .animate-floating {
        animation: floating 6s ease-in-out infinite;
      }
      @keyframes floating {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-15px) scale(1.02); }
      }

      /* Gentle Pulse */
      .animate-gentle-pulse {
        animation: gentle-pulse 4s ease-in-out infinite;
      }
      @keyframes gentle-pulse {
        0%, 100% { 
          opacity: 0.6;
          transform: scale(1);
        }
        50% { 
          opacity: 1;
          transform: scale(1.05);
        }
      }

      /* Gradient Border Animation */
      .animated-gradient-border {
        position: relative;
        background: linear-gradient(135deg, #0F172A, #1E293B);
        border-radius: 40px;
      }
      .animated-gradient-border::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, #F5D076, #D4AF37, #B8962E, #F5D076);
        background-size: 300% 300%;
        border-radius: 42px;
        z-index: -1;
        animation: gradient-shift 8s ease infinite;
        filter: blur(10px);
        opacity: 0.5;
      }

      /* Shine Effect */
      .shine-effect {
        position: relative;
        overflow: hidden;
      }
      .shine-effect::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent 30%,
          rgba(255, 255, 255, 0.1) 40%,
          rgba(255, 255, 255, 0.15) 50%,
          rgba(255, 255, 255, 0.1) 60%,
          transparent 70%
        );
        transform: rotate(45deg);
        transition: all 0.6s ease;
      }
      .shine-effect:hover::after {
        left: 100%;
      }

      /* Elevated Card */
      .elevated-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15),
                    0 0 20px rgba(212, 175, 55, 0.05);
      }
      .elevated-card:hover {
        transform: translateY(-8px) scale(1.01);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2),
                    0 0 40px rgba(212, 175, 55, 0.12),
                    0 0 80px rgba(255, 255, 255, 0.06);
      }

      /* Subtle Scale */
      .subtle-scale {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .subtle-scale:hover {
        transform: scale(1.02);
      }

      /* Opacity Fade In */
      .fade-in-element {
        opacity: 0;
        animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
    `;
  }, [prefersReducedMotion]);

  return <style>{animationStyles}</style>;
}
