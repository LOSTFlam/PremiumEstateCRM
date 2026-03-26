import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Icon,
  Progress,
  SimpleGrid,
  VStack,
  HStack,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiBookOpen,
  FiActivity,
  FiAward,
} from 'react-icons/fi';

// Neighborhood Insights
export const NeighborhoodInsights = ({ property }) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  const neighborhoodData = {
    walkScore: 85,
    transitScore: 72,
    bikeScore: 68,
    schools: [
      { name: 'Lincoln Elementary', rating: 9, distance: '0.3 mi', type: 'Elementary' },
      { name: 'Washington Middle', rating: 8, distance: '0.8 mi', type: 'Middle' },
      { name: 'Roosevelt High', rating: 9, distance: '1.2 mi', type: 'High' },
    ],
    amenities: [
      { name: 'Central Park', distance: '0.2 mi', icon: FiActivity },
      { name: 'Whole Foods', distance: '0.4 mi', icon: FiShoppingBag },
      { name: 'Metro Station', distance: '0.5 mi', icon: FiMapPin },
      { name: 'City Library', distance: '0.6 mi', icon: FiBookOpen },
    ],
    demographics: {
      population: '45,230',
      medianAge: '34',
      medianIncome: '$85,000',
      employment: '96%',
    },
  };

  return (
    <Box>
      <Heading size="md" mb={6}>Neighborhood Insights</Heading>

      {/* Scores */}
      <SimpleGrid columns={3} gap={4} mb={6}>
        <Box p={4} bg="blue.50" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.600">Walk Score</Text>
          <Text fontSize="3xl" fontWeight="bold" color="blue.500">
            {neighborhoodData.walkScore}
          </Text>
          <Badge colorScheme="green">Very Walkable</Badge>
        </Box>
        <Box p={4} bg="purple.50" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.600">Transit Score</Text>
          <Text fontSize="3xl" fontWeight="bold" color="purple.500">
            {neighborhoodData.transitScore}
          </Text>
          <Badge colorScheme="blue">Excellent Transit</Badge>
        </Box>
        <Box p={4} bg="green.50" borderRadius="lg" textAlign="center">
          <Text fontSize="sm" color="gray.600">Bike Score</Text>
          <Text fontSize="3xl" fontWeight="bold" color="green.500">
            {neighborhoodData.bikeScore}
          </Text>
          <Badge colorScheme="yellow">Bikeable</Badge>
        </Box>
      </SimpleGrid>

      {/* Schools */}
      <Box mb={6}>
        <Heading size="md" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={FiAward} />
            Schools
          </Flex>
        </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Rating</Th>
              <Th>Distance</Th>
              <Th>Type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {neighborhoodData.schools.map((school, index) => (
              <Tr key={index}>
                <Td fontWeight="bold">{school.name}</Td>
                <Td>
                  <HStack>
                    <Icon as={FiStar} color="yellow.500" />
                    <Text>{school.rating}/10</Text>
                  </HStack>
                </Td>
                <Td>{school.distance}</Td>
                <Td>{school.type}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Nearby Amenities */}
      <Box mb={6}>
        <Heading size="md" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={FiMapPin} />
            Nearby Amenities
          </Flex>
        </Heading>
        <SimpleGrid columns={2} gap={4}>
          {neighborhoodData.amenities.map((amenity, index) => (
            <Box
              key={index}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              _hover={{ bg: 'gray.50' }}
            >
              <Flex align="center" gap={3}>
                <Icon as={amenity.icon} boxSize={6} color="blue.500" />
                <Box>
                  <Text fontWeight="bold">{amenity.name}</Text>
                  <Text fontSize="sm" color="gray.600">{amenity.distance}</Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Demographics */}
      <Box>
        <Heading size="md" mb={4}>
          <Flex align="center" gap={2}>
            <Icon as={FiUsers} />
            Demographics
          </Flex>
        </Heading>
        <SimpleGrid columns={4} gap={4}>
          <Box p={4} bg="gray.50" borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              {neighborhoodData.demographics.population}
            </Text>
            <Text fontSize="sm" color="gray.600">Population</Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              {neighborhoodData.demographics.medianAge}
            </Text>
            <Text fontSize="sm" color="gray.600">Median Age</Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              {neighborhoodData.demographics.medianIncome}
            </Text>
            <Text fontSize="sm" color="gray.600">Median Income</Text>
          </Box>
          <Box p={4} bg="gray.50" borderRadius="lg" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              {neighborhoodData.demographics.employment}
            </Text>
            <Text fontSize="sm" color="gray.600">Employment</Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

// Price History Chart
export const PriceHistory = ({ property }) => {
  const priceHistory = [
    { date: '2020-01', price: 450000 },
    { date: '2020-06', price: 465000 },
    { date: '2021-01', price: 480000 },
    { date: '2021-06', price: 495000 },
    { date: '2022-01', price: 510000 },
    { date: '2022-06', price: 525000 },
    { date: '2023-01', price: 540000 },
    { date: '2023-06', price: 555000 },
    { date: '2024-01', price: 570000 },
  ];

  const maxPrice = Math.max(...priceHistory.map(p => p.price));
  const minPrice = Math.min(...priceHistory.map(p => p.price));

  return (
    <Box>
      <Heading size="md" mb={6}>Price History</Heading>
      
      <Box position="relative" h="300px">
        {/* Simple line chart visualization */}
        <svg width="100%" height="100%" viewBox={`0 0 ${priceHistory.length * 100} 300`}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={50 + i * 50}
              x2={priceHistory.length * 100}
              y2={50 + i * 50}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}

          {/* Price line */}
          <polyline
            fill="none"
            stroke="#4299e1"
            strokeWidth="3"
            points={priceHistory.map((point, index) => {
              const x = index * 100 + 50;
              const y = 300 - ((point.price - minPrice) / (maxPrice - minPrice)) * 200 - 50;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Data points */}
          {priceHistory.map((point, index) => {
            const x = index * 100 + 50;
            const y = 300 - ((point.price - minPrice) / (maxPrice - minPrice)) * 200 - 50;
            return (
              <g key={index}>
                <circle cx={x} cy={y} r="6" fill="#4299e1" />
                <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill="#4a5568">
                  ${(point.price / 1000).toFixed(0)}K
                </text>
                <text x={x} y={320} textAnchor="middle" fontSize="10" fill="#718096">
                  {point.date}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>

      <Flex justify="space-between" mt={4} p={4} bg="green.50" borderRadius="lg">
        <Box>
          <Text fontSize="sm" color="gray.600">Price Change (Last Year)</Text>
          <Text fontSize="xl" fontWeight="bold" color="green.500">
            +${(priceHistory[priceHistory.length - 1].price - priceHistory[0].price).toLocaleString()}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Appreciation</Text>
          <Text fontSize="xl" fontWeight="bold" color="green.500">
            +{(((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100).toFixed(1)}%
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm" color="gray.600">Avg. Annual</Text>
          <Text fontSize="xl" fontWeight="bold" color="blue.500">
            +{((((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) / priceHistory[0].price) * 100) / 4).toFixed(1)}%
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

// Property Comparison
export const PropertyComparison = ({ properties }) => {
  if (properties.length < 2) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="lg" color="gray.500">
          Select at least 2 properties to compare
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" mb={6}>Property Comparison</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Feature</Th>
            {properties.map(property => (
              <Th key={property._id}>{property.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td fontWeight="bold">Price</Td>
            {properties.map(property => (
              <Td key={property._id} fontWeight="bold" color="blue.500">
                ${property.listingPrice?.toLocaleString()}
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Bedrooms</Td>
            {properties.map(property => (
              <Td key={property._id}>{property.numberofBedrooms || '-'}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Bathrooms</Td>
            {properties.map(property => (
              <Td key={property._id}>{property.numberofBathrooms || '-'}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Square Feet</Td>
            {properties.map(property => (
              <Td key={property._id}>{property.squareFootage || '-'}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Price/Sq Ft</Td>
            {properties.map(property => (
              <Td key={property._id}>
                ${property.squareFootage ? (property.listingPrice / property.squareFootage).toFixed(2) : '-'}
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Property Type</Td>
            {properties.map(property => (
              <Td key={property._id}>{property.propertyType || '-'}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Status</Td>
            {properties.map(property => (
              <Td key={property._id}>
                <Badge colorScheme={property.listingStatus === 'Available' ? 'green' : 'gray'}>
                  {property.listingStatus}
                </Badge>
              </Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default {
  NeighborhoodInsights,
  PriceHistory,
  PropertyComparison,
};
