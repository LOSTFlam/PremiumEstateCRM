import { Box, Text, Button, Heading, VStack, Icon, useColorModeValue } from "@chakra-ui/react";
import { WarningIcon, RepeatIcon } from "@chakra-ui/icons";
import { Component } from "react";

const ErrorBoundaryFallback = ({ error, componentStack, resetError }) => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const errorBg = useColorModeValue("red.50", "red.900");
  const errorColor = useColorModeValue("red.700", "red.200");

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg={bg} p={4}>
      <VStack spacing={6} maxW="md" textAlign="center">
        <Icon as={WarningIcon} boxSize={16} color="red.500" />
        <Heading size="lg">Что-то пошло не так</Heading>
        <Text color="gray.600">Произошла непредвиденная ошибка. Попробуйте обновить страницу.</Text>
        <Button leftIcon={<RepeatIcon />} colorScheme="blue" onClick={resetError} size="lg">
          Обновить страницу
        </Button>
        {process.env.NODE_ENV === "development" && error && (
          <Box
            bg={errorBg}
            p={4}
            borderRadius="md"
            textAlign="left"
            w="full"
            fontSize="sm"
            color={errorColor}
          >
            <Text fontWeight="bold" mb={2}>
              Details:
            </Text>
            <Text>{error.toString()}</Text>
            {componentStack && (
              <Box mt={2} fontSize="xs">
                <Text fontWeight="bold" mb={1}>
                  Stack:
                </Text>
                <Box
                  as="pre"
                  whiteSpace="pre-wrap"
                  fontFamily="mono"
                  fontSize="xs"
                  overflow="auto"
                  maxH="40"
                >
                  {componentStack}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Console statement removed
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          componentStack: this.state.errorInfo?.componentStack,
          resetError: this.handleRetry,
        });
      }

      return (
        <ErrorBoundaryFallback
          error={this.state.error}
          componentStack={this.state.errorInfo?.componentStack}
          resetError={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
