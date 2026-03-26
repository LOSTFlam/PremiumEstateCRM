import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCompareIds, toggleCompareId } from 'views/public/catalog/catalogStorage';
import { getPrimaryImage, formatPrice } from 'views/public/catalog/catalogData';
import { getApi } from 'services/api';
import { FiX, FiHome, FiGitMerge } from 'react-icons/fi';

const ComparePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [compareIds, setCompareIdsState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompare = async () => {
      setLoading(true);
      try {
        const ids = getCompareIds();
        setCompareIdsState(ids);
        
        if (ids.length > 0) {
          const response = await getApi('api/property/public');
          const properties = Array.isArray(response) ? response : response?.data || [];
          const compareProperties = properties.filter(p => ids.includes(p._id));
          setProperties(compareProperties);
        }
      } catch (error) {
        console.error('Error fetching compare properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompare();
  }, []);

  const handleRemoveFromCompare = (propertyId) => {
    setCompareIdsState(toggleCompareId(propertyId));
    setProperties(properties.filter(p => p._id !== propertyId));
    
    toast({
      title: 'Removed from compare',
      status: 'info',
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={10}>
        <Heading mb={8}>Compare Properties</Heading>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (properties.length === 0) {
    return (
      <Container maxW="8xl" py={10}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={20}
          textAlign="center"
        >
          <FiGitMerge size={64} color="gray.300" mb={4} />
          <Heading size="lg" mb={2}>No Properties to Compare</Heading>
          <Text color="gray.500" mb={6}>
            Select properties to compare them side by side
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/offers')}
            leftIcon={<FiHome />}
          >
            Browse Properties
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="8xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading>
          Compare Properties ({properties.length})
        </Heading>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={() => {
            compareIds.forEach(id => toggleCompareId(id));
            setProperties([]);
            setCompareIdsState([]);
          }}
          leftIcon={<FiX />}
        >
          Clear All
        </Button>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" size="lg">
          <Thead>
            <Tr>
              <Th width="200px">Feature</Th>
              {properties.map(property => (
                <Th key={property._id} width="300px">
                  <Flex direction="column" align="center">
                    <Button
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveFromCompare(property._id)}
                      alignSelf="flex-end"
                    >
                      <FiX />
                    </Button>
                    <Image
                      src={getPrimaryImage(property)}
                      alt={property.name}
                      h="150px"
                      w="100%"
                      objectFit="cover"
                      borderRadius="md"
                      mb={2}
                    />
                    <Text fontWeight="bold" textAlign="center">
                      {property.name}
                    </Text>
                  </Flex>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td fontWeight="bold">Price</Td>
              {properties.map(property => (
                <Td key={property._id}>{formatPrice(property.listingPrice, t)}</Td>
              ))}
            </Tr>
            <Tr>
              <Td fontWeight="bold">Type</Td>
              {properties.map(property => (
                <Td key={property._id}>{property.propertyType}</Td>
              ))}
            </Tr>
            <Tr>
              <Td fontWeight="bold">Status</Td>
              {properties.map(property => (
                <Td key={property._id}>{property.listingStatus}</Td>
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
              <Td fontWeight="bold">Area</Td>
              {properties.map(property => (
                <Td key={property._id}>{property.squareFootage ? `${property.squareFootage} sq ft` : '-'}</Td>
              ))}
            </Tr>
            <Tr>
              <Td fontWeight="bold">Address</Td>
              {properties.map(property => (
                <Td key={property._id}>{property.propertyAddress || '-'}</Td>
              ))}
            </Tr>
            <Tr>
              <Td fontWeight="bold">Description</Td>
              {properties.map(property => (
                <Td key={property._id} maxW="300px">
                  <Text noOfLines={3}>
                    {property.propertyDescription || property.marketingDescription || '-'}
                  </Text>
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default ComparePage;
