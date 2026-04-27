import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { FiDatabase, FiImage, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { getApi } from 'services/api';

/**
 * Database Health Dashboard
 * Displays database connection status, data quality, and image storage stats
 */
const DatabaseHealthDashboard = () => {
  const [health, setHealth] = useState(null);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const [healthData, imageData] = await Promise.all([
        getApi('api/health/status'),
        getApi('api/health/images'),
      ]);

      setHealth(healthData);
      setImages(imageData);
    } catch (err) {
      setError(err.message || 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justify="center" align="center" h="200px">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} bg="red.50" borderRadius="lg" border="1px solid" borderColor="red.200">
        <HStack spacing={2}>
          <Icon as={FiAlertCircle} color="red.600" boxSize={6} />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" color="red.800">
              Database Error
            </Text>
            <Text fontSize="sm" color="red.700">
              {error}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    return status === 'healthy' ? 'green' : status === 'unhealthy' ? 'red' : 'yellow';
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Connection Status */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
            <Icon as={FiDatabase} />
            Database Connection
          </Heading>

          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Box p={4} bg={cardBg} borderRadius="lg">
              <Text fontSize="xs" color="gray.500" mb={1}>
                Status
              </Text>
              <HStack spacing={2}>
                <Badge
                  colorScheme={getStatusColor(health?.database?.connected ? 'green' : 'red')}
                  fontSize="sm"
                  p={2}
                >
                  {health?.database?.connected ? 'Connected' : 'Disconnected'}
                </Badge>
              </HStack>
            </Box>

            <Box p={4} bg={cardBg} borderRadius="lg">
              <Text fontSize="xs" color="gray.500" mb={1}>
                Database
              </Text>
              <Text fontWeight="bold">{health?.database?.name}</Text>
            </Box>

            <Box p={4} bg={cardBg} borderRadius="lg">
              <Text fontSize="xs" color="gray.500" mb={1}>
                Host
              </Text>
              <Text fontWeight="bold" fontSize="sm">
                {health?.database?.host}:{health?.database?.port}
              </Text>
            </Box>

            <Box p={4} bg={cardBg} borderRadius="lg">
              <Text fontSize="xs" color="gray.500" mb={1}>
                Storage Size
              </Text>
              <Text fontWeight="bold">{health?.storage?.dataSize_mb} MB</Text>
            </Box>
          </Grid>
        </CardBody>
      </Card>

      {/* Collections Overview */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <Heading size="md" mb={4}>
            Collections ({health?.collections?.count})
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
            {Object.entries(health?.collections || {}).map(
              ([key, value]) =>
                typeof value === 'object' && value?.count !== undefined && (
                  <Box key={key} p={4} bg={cardBg} borderRadius="lg">
                    <Stat>
                      <StatLabel fontSize="sm">{key}</StatLabel>
                      <StatNumber>{value.count}</StatNumber>
                      <StatHelpText fontSize="xs" color="gray.500">
                        {value.count} documents
                      </StatHelpText>
                    </Stat>
                  </Box>
                )
            )}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Data Quality */}
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
        {/* User Quality */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Heading size="sm" mb={4}>
              User Data Quality
            </Heading>
            <VStack spacing={3} align="stretch">
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm">Data Completeness</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {health?.dataQuality?.users?.score?.toFixed(1) || 0}%
                  </Text>
                </HStack>
                <Progress
                  value={health?.dataQuality?.users?.score || 0}
                  colorScheme="blue"
                  borderRadius="full"
                />
              </Box>

              <HStack justify="space-between" fontSize="xs" color="gray.500">
                <Text>Total Users: {health?.dataQuality?.users?.total}</Text>
                <Text>Missing Email: {health?.dataQuality?.users?.issues?.missingEmail}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Property Quality */}
        <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
          <CardBody>
            <Heading size="sm" mb={4}>
              Property Data Quality
            </Heading>
            <VStack spacing={3} align="stretch">
              <Box>
                <HStack justify="space-between" mb={1}>
                  <Text fontSize="sm">Data Completeness</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {health?.dataQuality?.properties?.score?.toFixed(1) || 0}%
                  </Text>
                </HStack>
                <Progress
                  value={health?.dataQuality?.properties?.score || 0}
                  colorScheme="green"
                  borderRadius="full"
                />
              </Box>

              <HStack justify="space-between" fontSize="xs" color="gray.500">
                <Text>Total: {health?.dataQuality?.properties?.total}</Text>
                <Text>With Photos: {health?.dataQuality?.properties?.withPhotos}</Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Image Storage Stats */}
      <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
        <CardBody>
          <Heading size="md" mb={4} display="flex" alignItems="center" gap={2}>
            <Icon as={FiImage} />
            Image Storage
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
            <Stat p={3} bg={cardBg} borderRadius="lg">
              <StatLabel fontSize="xs">Properties with Images</StatLabel>
              <StatNumber>{images?.propertiesWithImages || 0}</StatNumber>
              <Progress
                value={
                  ((images?.propertiesWithImages || 0) /
                    ((images?.propertiesWithImages || 0) + (images?.propertiesWithoutImages || 1))) *
                  100
                }
                colorScheme="purple"
                size="sm"
                mt={2}
              />
            </Stat>

            <Stat p={3} bg={cardBg} borderRadius="lg">
              <StatLabel fontSize="xs">Properties without Images</StatLabel>
              <StatNumber>{images?.propertiesWithoutImages || 0}</StatNumber>
            </Stat>

            <Stat p={3} bg={cardBg} borderRadius="lg">
              <StatLabel fontSize="xs">Total Images</StatLabel>
              <StatNumber>{images?.totalImages || 0}</StatNumber>
            </Stat>

            <Stat p={3} bg={cardBg} borderRadius="lg">
              <StatLabel fontSize="xs">Coverage</StatLabel>
              <StatNumber fontSize="lg">{images?.coverage || '0%'}</StatNumber>
            </Stat>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Refresh Button */}
      <Button onClick={fetchHealth} colorScheme="blue" w="100%">
        Refresh Health Status
      </Button>

      {/* Last Update */}
      <Text fontSize="xs" color="gray.500" textAlign="center">
        Last updated: {new Date(health?.timestamp).toLocaleString()}
      </Text>
    </VStack>
  );
};

export default DatabaseHealthDashboard;
