import { useEffect, useState } from "react";

export default function useHideOnScroll({
  offset = 96,
  delta = 12,
  disabled = false,
  targetId,
} = {}) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === "undefined") {
      setIsHidden(false);
      return undefined;
    }

    const scrollContainer =
      typeof document !== "undefined" && targetId ? document.getElementById(targetId) : null;
    const scrollTargets =
      scrollContainer && scrollContainer !== window ? [window, scrollContainer] : [window];

    const readScrollPosition = () => Math.max(window.scrollY || 0, scrollContainer?.scrollTop || 0);

    let lastScrollY = readScrollPosition();

    const handleScroll = () => {
      const nextScrollY = readScrollPosition();
      const scrollDelta = nextScrollY - lastScrollY;

      if (nextScrollY <= offset) {
        setIsHidden(false);
        lastScrollY = nextScrollY;
        return;
      }

      if (Math.abs(scrollDelta) < delta) {
        return;
      }

      setIsHidden(scrollDelta > 0);
      lastScrollY = nextScrollY;
    };

    handleScroll();

    scrollTargets.forEach((target) => {
      target.addEventListener("scroll", handleScroll, { passive: true });
    });

    return () => {
      scrollTargets.forEach((target) => {
        target.removeEventListener("scroll", handleScroll);
      });
    };
  }, [delta, disabled, offset, targetId]);

  return isHidden;
}
