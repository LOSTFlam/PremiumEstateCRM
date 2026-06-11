import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { publicBrand } from "views/public/publicBrand";

const MotionBox = motion.create(Box);

export default function PublicEmptyState({
  title,
  description,
  actionLabel,
  actionTo = "/offers",
  onAction,
}) {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      borderRadius="28px"
      px={{ base: 6, md: 10 }}
      py={{ base: 10, md: 12 }}
      textAlign="center"
      bg="white"
      border="1px solid rgba(9,18,32,0.08)"
      boxShadow={publicBrand.shadows.soft}
    >
      <Box
        mx="auto"
        mb={5}
        w="72px"
        h="72px"
        borderRadius="full"
        bg="rgba(212,175,55,0.12)"
        display="grid"
        placeItems="center"
        fontSize="2xl"
      >
        🏠
      </Box>
      <Stack spacing={3} align="center">
        <Heading size="md" fontFamily="heading" color={publicBrand.colors.ink}>
          {title}
        </Heading>
        {description ? (
          <Text color={publicBrand.colors.textSoft} maxW="480px" lineHeight="1.8">
            {description}
          </Text>
        ) : null}
        {actionLabel ? (
          <Button
            as={onAction ? undefined : RouterLink}
            to={onAction ? undefined : actionTo}
            onClick={onAction}
            mt={2}
            borderRadius="full"
            bg={publicBrand.gradients.brass}
            color={publicBrand.colors.ink}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </MotionBox>
  );
}
