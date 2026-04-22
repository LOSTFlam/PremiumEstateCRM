import React, { useState, useEffect as _useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  useColorModeValue,
  Image,
  Heading,
  IconButton,
  Tooltip,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { FiMapPin as _FiMapPin, FiList, FiMaximize } from "react-icons/fi";
import { getPrimaryImage, formatPrice } from "views/public/catalog/catalogData";
import _ModernPropertyCard from "components/ModernPropertyCard";
import MortgageCalculator from "./MortgageCalculator";

// Simple interactive map component (can be replaced with Google Maps/Mapbox)
const PropertyMap = ({ properties, onPropertySelect, selectedProperty }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  // Generate pseudo-random positions for demo (replace with real coordinates)
  const getPropertyPosition = (property, index) => {
    // This is a demo - in production use property.latitude/longitude
    const _gridWidth = 100;
    const _gridHeight = 100;
    const col = index % 5;
    const row = Math.floor(index / 5);

    return {
      left: `${10 + col * 20}%`,
      top: `${10 + row * 20}%`,
    };
  };

  return (
    <Box
      position="relative"
      w="100%"
      h="600px"
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
      bgImage="url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=12&size=800x600&key=YOUR_API_KEY')"
      bgSize="cover"
      bgPosition="center"
    >
      {/* Property Markers */}
      {properties.map((property, index) => {
        const position = getPropertyPosition(property, index);
        const isSelected = selectedProperty?._id === property._id;

        return (
          <Tooltip
            key={property._id}
            label={
              <Box>
                <Text fontWeight="bold">{property.name}</Text>
                <Text fontSize="sm">{formatPrice(property.listingPrice)}</Text>
              </Box>
            }
            placement="top"
            hasArrow
          >
            <Box
              position="absolute"
              {...position}
              transform="translate(-50%, -50%)"
              cursor="pointer"
              zIndex={isSelected ? 10 : 1}
              onClick={() => onPropertySelect(property)}
            >
              <Box
                position="relative"
                w={isSelected ? "60px" : "40px"}
                h={isSelected ? "60px" : "40px"}
                transition="all 0.3s"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg={isSelected ? "blue.500" : "red.500"}
                  borderRadius="50% 50% 50% 0"
                  transform="rotate(-45deg)"
                  boxShadow="2px 2px 5px rgba(0,0,0,0.3)"
                />

                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                  zIndex={1}
                >
                  ${Math.round(property.listingPrice / 1000)}K
                </Box>
              </Box>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

// Map View with Property Details
export const PropertyMapView = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { isOpen: _isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const [showCalculator, setShowCalculator] = useState(false);
  const detailBg = useColorModeValue("white", "gray.800");

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    onOpen();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Property Map</Heading>
        <Flex gap={2}>
          <IconButton
            icon={<FiList />}
            aria-label="List view"
            onClick={() => {
              /* Switch to list view */
            }}
          />

          <IconButton
            icon={<FiMaximize />}
            aria-label="Fullscreen"
            onClick={() => {
              /* Fullscreen map */
            }}
          />
        </Flex>
      </Flex>

      <PropertyMap
        properties={properties}
        onPropertySelect={handlePropertySelect}
        selectedProperty={selectedProperty}
      />

      {/* Property Detail Modal */}
      {selectedProperty && (
        <Box mt={4} p={6} bg={detailBg} borderRadius="xl" boxShadow="xl">
          <Flex gap={6}>
            <Box w="300px">
              <Image
                src={getPrimaryImage(selectedProperty)}
                alt={selectedProperty.name}
                borderRadius="lg"
                w="100%"
                h="200px"
                objectFit="cover"
              />
            </Box>
            <Box flex={1}>
              <Heading size="lg" mb={2}>
                {selectedProperty.name}
              </Heading>
              <Text fontSize="xl" color="blue.500" fontWeight="bold" mb={2}>
                {formatPrice(selectedProperty.listingPrice)}
              </Text>
              <Flex gap={2} mb={4}>
                <Badge colorScheme="blue">{selectedProperty.propertyType}</Badge>
                <Badge colorScheme="green">{selectedProperty.listingStatus}</Badge>
              </Flex>
              <Text mb={4}>{selectedProperty.propertyDescription}</Text>
              <Flex gap={4}>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    /* Contact agent */
                  }}
                >
                  Contact Agent
                </Button>
                <Button colorScheme="green" onClick={() => setShowCalculator(true)}>
                  Calculate Mortgage
                </Button>
                <Button variant="outline">Schedule Tour</Button>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      <MortgageCalculator
        propertyPrice={selectedProperty?.listingPrice}
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />
    </Box>
  );
};

export default PropertyMap;
