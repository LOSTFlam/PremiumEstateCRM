import React, { Component } from 'react';
import { Box, Text, Button, Heading, VStack, Icon } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

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
    console.error('Error caught by boundary:', error, errorInfo);
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
          bg="gray.50"
          p={4}
        >
          <VStack spacing={6} maxW="md" textAlign="center">
            <Icon as={WarningIcon} boxSize={16} color="red.500" />
            <Heading size="lg" color="gray.800">
              Oops! Something went wrong
            </Heading>
            <Text color="gray.600">
              We're sorry for the inconvenience. Please try refreshing the page.
            </Text>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                bg="red.50"
                p={4}
                borderRadius="md"
                textAlign="left"
                w="full"
                fontSize="sm"
                color="red.700"
              >
                <Text fontWeight="bold" mb={2}>
                  Error Details:
                </Text>
                <Text>{this.state.error.toString()}</Text>
                {this.state.errorInfo?.componentStack && (
                  <Text mt={2} fontSize="xs">
                    Component Stack:
                    <Text as="pre" whiteSpace="pre-wrap" mt={1}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </Text>
                )}
              </Box>
            )}
            <Button
              colorScheme="blue"
              onClick={this.handleRetry}
              size="lg"
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
