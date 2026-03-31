import { useEffect, useState } from "react";

export default function useHideOnScroll({
  offset = 96,
  delta = 12,
  disabled = false,
} = {}) {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (disabled || typeof window === "undefined") {
      setIsHidden(false);
      return undefined;
    }

    let lastScrollY = window.scrollY || 0;

    const handleScroll = () => {
      const nextScrollY = window.scrollY || 0;
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

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [delta, disabled, offset]);

  return isHidden;
}
