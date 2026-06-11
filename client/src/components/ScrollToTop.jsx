import {
  Box,
  IconButton,
  useColorModeValue,
  useDisclosure as _useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronUp } from "react-icons/fi";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const bgColor = useColorModeValue("brand.500", "brand.200");
  const hoverBg = useColorModeValue("brand.600", "brand.300");

  const toggleVisibility = useCallback(() => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <Box
          as={motion.div}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          display={{ base: "none", md: "block" }}
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
