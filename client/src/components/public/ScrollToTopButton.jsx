import { IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { publicBrand } from "views/public/publicBrand";

const MOBILE_MAX_WIDTH = "(max-width: 767px)";

const MotionIconButton = motion.create(IconButton);

export default function ScrollToTopButton() {
  const [canShow, setCanShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MAX_WIDTH);
    const sync = () => setCanShow(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    // #region agent log
    fetch("http://127.0.0.1:7635/ingest/37b9eb23-aad3-484d-8f4e-2ad56c907247", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "054d26" },
      body: JSON.stringify({
        sessionId: "054d26",
        runId: "scroll-hydration-fix",
        hypothesisId: "H5-hydration-flash",
        location: "ScrollToTopButton.jsx:matchMedia",
        message: "Footer scroll-to-top viewport gate resolved",
        data: {
          isMobile: mq.matches,
          canShow: !mq.matches,
          viewportWidth: window.innerWidth,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canShow) {
      setVisible(false);
      return undefined;
    }
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [canShow]);

  if (!canShow) {
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
