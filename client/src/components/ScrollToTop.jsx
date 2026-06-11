import {
  Box,
  IconButton,
  useColorModeValue,
  useDisclosure as _useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronUp } from "react-icons/fi";

const MOBILE_MAX_WIDTH = "(max-width: 767px)";

const ScrollToTop = () => {
  const [canShow, setCanShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const bgColor = useColorModeValue("brand.500", "brand.200");
  const hoverBg = useColorModeValue("brand.600", "brand.300");

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
        location: "ScrollToTop.jsx:matchMedia",
        message: "Scroll-to-top viewport gate resolved",
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

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!canShow) {
      setIsVisible(false);
      return undefined;
    }
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [canShow, toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!canShow) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          as={motion.div}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          position="fixed"
          bottom={6}
          right={6}
          zIndex={9999}
        >
          <IconButton
            icon={<FiChevronUp />}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            size="lg"
            borderRadius="full"
            bg={bgColor}
            color="white"
            _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
            _active={{ transform: "translateY(0)" }}
            boxShadow="lg"
            transition="all 0.2s ease-in-out"
          />
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
