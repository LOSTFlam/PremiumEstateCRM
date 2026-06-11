import { Box, Button, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

export default function CabinetEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  children,
}) {
  const cardBg = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtleText = useColorModeValue("gray.500", "gray.400");

  return (
    <MotionBox
      className="cabinet-empty-state"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="24px"
      p={{ base: 8, md: 10 }}
      textAlign="center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {icon ? <Icon as={icon} boxSize={10} color="gold.500" mb={4} /> : null}
      <Text fontWeight="700" fontSize="lg">
        {title}
      </Text>
      {description ? (
        <Text color={subtleText} mt={2} maxW="520px" mx="auto">
          {description}
        </Text>
      ) : null}
      {children}
      {actionLabel && onAction ? (
        <Button mt={6} colorScheme="green" borderRadius="18px" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </MotionBox>
  );
}
