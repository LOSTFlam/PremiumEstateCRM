import { Box, Button, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { MdRefresh } from "react-icons/md";

export default function CabinetErrorState({
  title = "Не удалось загрузить данные",
  message,
  onRetry,
  retryLabel = "Повторить",
}) {
  const cardBg = useColorModeValue("red.50", "red.900");
  const borderColor = useColorModeValue("red.200", "red.700");
  const subtleText = useColorModeValue("red.700", "red.100");

  return (
    <Box
      className="cabinet-error-state"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="24px"
      p={{ base: 8, md: 10 }}
      textAlign="center"
    >
      <Text fontWeight="700" fontSize="lg" color={subtleText}>
        {title}
      </Text>
      {message ? (
        <Text color={subtleText} mt={2} opacity={0.9}>
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <Button
          mt={6}
          leftIcon={<Icon as={MdRefresh} />}
          variant="outline"
          colorScheme="red"
          borderRadius="18px"
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      ) : null}
    </Box>
  );
}
