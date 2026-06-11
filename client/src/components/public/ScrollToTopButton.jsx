import { IconButton, useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { publicBrand } from "views/public/publicBrand";

const MotionIconButton = motion.create(IconButton);

export default function ScrollToTopButton() {
  const [isMobile] = useMediaQuery("(max-width: 767px)", { ssr: false });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7635/ingest/37b9eb23-aad3-484d-8f4e-2ad56c907247", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "054d26" },
      body: JSON.stringify({
        sessionId: "054d26",
        runId: "scroll-unmount-fix",
        hypothesisId: "H1-motion-display",
        location: "ScrollToTopButton.jsx:mount",
        message: "Footer scroll-to-top render gate",
        data: {
          isMobile,
          willRender: !isMobile,
          viewportWidth: typeof window !== "undefined" ? window.innerWidth : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible ? (
        <MotionIconButton
          aria-label="Scroll to top"
          icon={<FiArrowUp />}
          position="fixed"
          right={6}
          bottom={6}
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
