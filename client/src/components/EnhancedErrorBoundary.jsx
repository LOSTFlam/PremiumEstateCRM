import React, { Component } from "react";
import { Box, Button, Heading, Text, VStack, Code, Collapse } from "@chakra-ui/react";

/**
 * Enhanced Error Boundary with better error handling and reporting
 */
class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }

    // Log to error reporting service in production
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  logErrorToService = (error, errorInfo) => {
    // TODO: Integrate with error reporting service (Sentry, LogRocket, etc.)
    const errorData = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // For now, just log to console in production
    if (process.env.NODE_ENV === "production") {
      console.error("Production Error:", errorData);
    }

    // Send to backend logging endpoint
    try {
      fetch("/api/log-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      }).catch(() => {
        // Silently fail if logging endpoint is not available
      });
    } catch {
      // Ignore logging errors
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;
      const isDev = process.env.NODE_ENV === "development";

      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
          p={4}
        >
          <VStack
            spacing={6}
            maxW="600px"
            w="full"
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
          >
            <Heading size="lg" color="red.500">
              Oops! Something went wrong
            </Heading>

            <Text textAlign="center" color="gray.600">
              We&apos;re sorry for the inconvenience. The application encountered an unexpected
              error.
            </Text>

            {isDev && error && (
              <Box w="full">
                <Button size="sm" variant="outline" onClick={this.toggleDetails} mb={2}>
                  {showDetails ? "Hide" : "Show"} Error Details
                </Button>

                <Collapse in={showDetails}>
                  <Box p={4} bg="red.50" borderRadius="md" borderLeft="4px" borderColor="red.500">
                    <Text fontWeight="bold" mb={2} color="red.700">
                      Error Message:
                    </Text>
                    <Code
                      display="block"
                      whiteSpace="pre-wrap"
                      p={2}
                      bg="white"
                      borderRadius="md"
                      fontSize="sm"
                      mb={4}
                    >
                      {error.toString()}
                    </Code>

                    {errorInfo && (
                      <>
                        <Text fontWeight="bold" mb={2} color="red.700">
                          Component Stack:
                        </Text>
                        <Code
                          display="block"
                          whiteSpace="pre-wrap"
                          p={2}
                          bg="white"
                          borderRadius="md"
                          fontSize="xs"
                          maxH="200px"
                          overflowY="auto"
                        >
                          {errorInfo.componentStack}
                        </Code>
                      </>
                    )}
                  </Box>
                </Collapse>
              </Box>
            )}

            <VStack spacing={3} w="full">
              <Button colorScheme="blue" size="lg" w="full" onClick={this.handleReset}>
                Try Again
              </Button>

              <Button
                variant="outline"
                size="lg"
                w="full"
                onClick={() => (window.location.href = "/")}
              >
                Go to Home
              </Button>
            </VStack>

            <Text fontSize="sm" color="gray.500" textAlign="center">
              If this problem persists, please contact support.
            </Text>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
