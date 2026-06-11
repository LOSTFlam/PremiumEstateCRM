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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <MotionIconButton
          aria-label="Scroll to top"
          icon={<FiArrowUp />}
          position="fixed"
          right={{ base: 4, md: 6 }}
          bottom={{ base: "calc(92px + var(--safe-bottom))", md: 6 }}
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
