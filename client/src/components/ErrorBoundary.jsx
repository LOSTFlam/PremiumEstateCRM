import React, { Component } from "react";
import { Box, Text, Button, Heading, VStack, Icon } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });

    // Log to error reporting service (e.g., Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    // }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="linear-gradient(180deg, #fbfbfd 0%, #eef1f5 100%)"
          p={6}
        >
          <VStack
            spacing={6}
            maxW="xl"
            w="full"
            textAlign="center"
            bg="rgba(255, 255, 255, 0.82)"
            border="1px solid rgba(148, 163, 184, 0.18)"
            borderRadius="28px"
            boxShadow="0 24px 60px rgba(15, 23, 42, 0.08)"
            backdropFilter="blur(20px)"
            p={{ base: 6, md: 8 }}
          >
            <Icon as={WarningIcon} boxSize={16} color="orange.500" />
            <Heading size="lg" color="gray.800" fontFamily="body">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600" maxW="lg">
              We're sorry for the inconvenience. Please try refreshing the page.
            </Text>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <Box
                bg="rgba(255, 255, 255, 0.72)"
                p={4}
                borderRadius="2xl"
                textAlign="left"
                w="full"
                fontSize="sm"
                color="gray.800"
                border="1px solid rgba(248, 113, 113, 0.18)"
              >
                <Text fontWeight="bold" mb={2} color="red.600">
                  Error Details:
                </Text>
                <Box
                  as="pre"
                  whiteSpace="pre-wrap"
                  fontSize="xs"
                  lineHeight="1.6"
                  color="gray.700"
                >
                  {this.state.error.toString()}
                </Box>
                {this.state.errorInfo?.componentStack && (
                  <Box mt={4}>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={2}>
                      Component Stack:
                    </Text>
                    <Box
                      as="pre"
                      whiteSpace="pre-wrap"
                      fontSize="xs"
                      lineHeight="1.6"
                      color="gray.600"
                    >
                      {this.state.errorInfo.componentStack}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
            <Button
              colorScheme="blue"
              onClick={this.handleRetry}
              size="lg"
              borderRadius="full"
              px={8}
            >
              Refresh Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
