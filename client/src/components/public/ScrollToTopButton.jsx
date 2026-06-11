import { IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { publicBrand } from "views/public/publicBrand";

const MotionIconButton = motion.create(IconButton);

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const nav = document.querySelector(".mobile-bottom-nav");
    const buttons = document.querySelectorAll(
      '[aria-label="Scroll to top"], button[aria-label="Scroll to top"]'
    );
    const navRect = nav?.getBoundingClientRect();
    const btnRect = buttons[0]?.getBoundingClientRect();
    // #region agent log
    fetch("http://127.0.0.1:7635/ingest/37b9eb23-aad3-484d-8f4e-2ad56c907247", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "054d26" },
      body: JSON.stringify({
        sessionId: "054d26",
        runId: "layout-post-fix",
        hypothesisId: "scroll-overlap",
        location: "ScrollToTopButton.jsx:layout",
        message: "Scroll button vs bottom nav geometry",
        data: {
          viewportWidth: window.innerWidth,
          scrollButtonCount: buttons.length,
          docOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          navTop: navRect?.top ?? null,
          buttonBottom: btnRect?.bottom ?? null,
          overlapsNav: navRect && btnRect ? btnRect.bottom > navRect.top + 2 : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <MotionIconButton
          aria-label="Scroll to top"
          icon={<FiArrowUp />}
          position="fixed"
          display={{ base: "none", md: "inline-flex" }}
          right={{ md: 6 }}
          bottom={{ md: 6 }}
          zIndex={20}
          borderRadius="full"
          size="lg"
          bg={publicBrand.gradients.brass}
          color={publicBrand.colors.ink}
          boxShadow={publicBrand.shadows.glow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          _hover={{ transform: "translateY(-2px)" }}
        />
      ) : null}
    </AnimatePresence>
  );
}
