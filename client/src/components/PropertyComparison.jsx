import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
  Divider,
  Heading,
  SimpleGrid,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import { formatPrice } from 'views/public/catalog/catalogData';

/**
 * Advanced Property Comparison Component
 * Compare up to 5 properties side-by-side with detailed metrics
 */
const PropertyComparison = ({ properties = [], onRemoveProperty = null }) => {
  const [selectedProps, setSelectedProps] = useState([]);
  const [metrics, setMetrics] = useState({});

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const headerBg = useColorModeValue('gray.100', 'gray.700');

  // Calculate price per sqm for comparison
  useEffect(() => {
    const newMetrics = {};
    properties.forEach((prop) => {
      if (prop._id) {
        const price = parseFloat(prop.listingPrice) || 0;
        const area = parseFloat(prop.squareFootage) || 0;
        newMetrics[prop._id] = {
          pricePerSqm: area > 0 ? (price / area).toFixed(2) : 0,
          hasPhotos: prop.propertyPhotos?.length > 0,
          photoCount: prop.propertyPhotos?.length || 0,
        };
      }
    });
    setMetrics(newMetrics);
  }, [properties]);

  const handleRemove = (propId) => {
    if (onRemoveProperty) {
      onRemoveProperty(propId);
    }
  };

  const handleExport = () => {
    const data = properties.map((prop) => ({
      Name: prop.name,
      Address: prop.propertyAddress,
      Price: formatPrice(prop.listingPrice),
      Area: prop.squareFootage,
      Bedrooms: prop.numberofBedrooms,
      Bathrooms: prop.numberofBathrooms,
      Type: prop.propertyType,
      Status: prop.listingStatus,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property-comparison-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (properties.length === 0) {
    return (
      <Box p={8} textAlign="center" bg={bgColor} borderRadius="lg" border={`1px solid ${borderColor}`}>
        <Text color="gray.500" fontSize="lg">
          Select properties to compare
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header with Export */}
      <Flex justify="space-between" align="center">
        <Heading size="md">Property Comparison ({properties.length})</Heading>
        <HStack spacing={2}>
          <Tooltip label="Export as CSV">
            <IconButton
              icon={<FiDownload />}
              onClick={handleExport}
              colorScheme="blue"
              variant="outline"
              aria-label="Export"
            />
          </Tooltip>
          <Tooltip label="Share Comparison">
            <IconButton icon={<FiShare2 />} colorScheme="green" variant="outline" aria-label="Share" />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Image Gallery */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} gap={4}>
        {properties.map((prop) => (
          <Box
            key={prop._id}
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            border={`2px solid ${borderColor}`}
            transition="all 0.2s"
            _hover={{ boxShadow: 'lg', borderColor: 'blue.500' }}
          >
            {prop.propertyPhotos?.[0]?.url ? (
              <Image
                src={prop.propertyPhotos[0].url}
                alt={prop.name}
                objectFit="cover"
                h="200px"
                w="100%"
              />
            ) : (
              <Box h="200px" bg={hoverBg} display="flex" align="center" justify="center">
                <Text color="gray.500" fontSize="sm">
                  No image
                </Text>
              </Box>
            )}
            <Box p={2}>
              <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
                {prop.name}
              </Text>
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                {prop.propertyAddress}
              </Text>
              <Flex justify="space-between" align="center" mt={2}>
                <Badge colorScheme="blue" fontSize="xs">
                  {prop.propertyType}
                </Badge>
                <IconButton
                  size="xs"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleRemove(prop._id)}
                  aria-label="Remove"
                />
              </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      {/* Detailed Comparison Table */}
      <Box overflowX="auto" borderRadius="lg" border={`1px solid ${borderColor}`}>
        <Table variant="simple" size="sm">
          <Thead bg={headerBg}>
            <Tr>
              <Th minW="150px">Property</Th>
              {properties.map((prop) => (
                <Th key={prop._id} minW="200px" textAlign="center">
                  {prop.name}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {/* Price Row */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Price</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center" fontWeight="bold" color="green.600">
                  {formatPrice(prop.listingPrice)}
                </Td>
              ))}
            </Tr>

            {/* Price per sqm */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Price/sqm</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  ${metrics[prop._id]?.pricePerSqm || 'N/A'}
                </Td>
              ))}
            </Tr>

            {/* Area */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Area (sqft)</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  {prop.squareFootage || 'N/A'}
                </Td>
              ))}
            </Tr>

            {/* Bedrooms */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Bedrooms</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  {prop.numberofBedrooms || '0'}
                </Td>
              ))}
            </Tr>

            {/* Bathrooms */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Bathrooms</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  {prop.numberofBathrooms || '0'}
                </Td>
              ))}
            </Tr>

            {/* Type */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Type</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  <Badge colorScheme="blue">{prop.propertyType}</Badge>
                </Td>
              ))}
            </Tr>

            {/* Status */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Status</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  <Badge colorScheme={prop.listingStatus === 'Available' ? 'green' : 'orange'}>
                    {prop.listingStatus}
                  </Badge>
                </Td>
              ))}
            </Tr>

            {/* Photos */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Photos</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  {metrics[prop._id]?.hasPhotos ? (
                    <HStack justify="center" spacing={1}>
                      <CheckIcon color="green.500" boxSize={4} />
                      <Text fontSize="sm">{metrics[prop._id]?.photoCount}</Text>
                    </HStack>
                  ) : (
                    <CloseIcon color="red.500" boxSize={4} />
                  )}
                </Td>
              ))}
            </Tr>

            {/* Year Built */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Year Built</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center">
                  {prop.yearBuilt || 'N/A'}
                </Td>
              ))}
            </Tr>

            {/* Description */}
            <Tr _hover={{ bg: hoverBg }}>
              <Td fontWeight="bold">Description</Td>
              {properties.map((prop) => (
                <Td key={prop._id} textAlign="center" fontSize="sm">
                  <Text noOfLines={2}>{prop.propertyDescription || 'N/A'}</Text>
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
        <Box p={4} bg={headerBg} borderRadius="lg">
          <Text fontSize="xs" color="gray.500">
            Avg Price
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {formatPrice(
              properties.reduce((sum, p) => sum + (parseFloat(p.listingPrice) || 0), 0) /
                properties.length
            )}
          </Text>
        </Box>
        <Box p={4} bg={headerBg} borderRadius="lg">
          <Text fontSize="xs" color="gray.500">
            Avg Area
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {(
              properties.reduce((sum, p) => sum + (parseFloat(p.squareFootage) || 0), 0) /
              properties.length
            ).toFixed(0)}{' '}
            sqft
          </Text>
        </Box>
        <Box p={4} bg={headerBg} borderRadius="lg">
          <Text fontSize="xs" color="gray.500">
            Total Properties
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {properties.length}
          </Text>
        </Box>
        <Box p={4} bg={headerBg} borderRadius="lg">
          <Text fontSize="xs" color="gray.500">
            With Photos
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            {properties.filter((p) => p.propertyPhotos?.length > 0).length} / {properties.length}
          </Text>
        </Box>
      </SimpleGrid>
    </VStack>
  );
};

export default PropertyComparison;
