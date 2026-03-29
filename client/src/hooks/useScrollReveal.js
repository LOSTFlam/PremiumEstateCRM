import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal Hook
 * Triggers animations when elements scroll into view
 * Uses Intersection Observer API for performance
 */
export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsRevealed(true);
          }, delay);

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return [ref, isRevealed];
}

/**
 * useScrollRevealMultiple Hook
 * For revealing multiple elements with stagger effect
 */
export function useScrollRevealMultiple(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    triggerOnce = true,
    staggerDelay = 100,
  } = options;

  const refs = useRef([]);
  const [revealedIndices, setRevealedIndices] = useState(new Set());

  useEffect(() => {
    const elements = refs.current;
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elements.indexOf(entry.target);
          if (entry.isIntersecting) {
            setTimeout(() => {
              setRevealedIndices((prev) => new Set([...prev, index]));
            }, index * staggerDelay);

            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setRevealedIndices((prev) => {
              const next = new Set(prev);
              next.delete(index);
              return next;
            });
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    elements.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [threshold, rootMargin, triggerOnce, staggerDelay]);

  return [refs, revealedIndices];
}

/**
 * useParallax Hook
 * Creates parallax scrolling effect
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
        setOffset(scrollProgress * speed * 200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return [ref, offset];
}

/**
 * useMouseParallax Hook
 * Creates parallax effect based on mouse position
 */
export function useMouseParallax(speed = 0.02) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * speed;
      const deltaY = (e.clientY - centerY) * speed;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [speed]);

  return [ref, position];
}

/**
 * useCountUp Hook
 * Animates numbers counting up
 */
export function useCountUp(end, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * (end - start) + start));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration, start]);

  return [ref, count];
}

/**
 * useTypewriter Hook
 * Creates typewriter text effect
 */
export function useTypewriter(text, speed = 50, startDelay = 0) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let timeout;
    let index = 0;

    const type = () => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
        timeout = setTimeout(type, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeout = setTimeout(type, startDelay);

    return () => clearTimeout(timeout);
  }, [isVisible, text, speed, startDelay]);

  return [ref, displayText, isComplete];
}

export default useScrollReveal;
