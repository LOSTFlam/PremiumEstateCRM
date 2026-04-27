import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  GridItem,
  Input,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Button,
  ButtonGroup,
  Badge,
  Flex,
  Collapse,
  Icon,
  Text,
  useColorModeValue,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { FiFilter, FiSearch } from 'react-icons/fi';

/**
 * Advanced Property Search & Filter Component
 * Features:
 * - Multi-filter search
 * - Price range slider
 * - Property type filters
 * - Amenities checkboxes
 * - Location autocomplete
 * - Saved searches
 */
const AdvancedPropertyFilter = ({
  onFilter = null,
  properties = [],
  showSaveFilter = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState({
    searchText: '',
    priceRange: [0, 1000000],
    propertyType: [],
    bedrooms: '',
    bathrooms: '',
    amenities: [],
    status: '',
    sortBy: 'newest',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Commercial', 'Land', 'Condo'];
  const amenities = [
    'Pool',
    'Gym',
    'Parking',
    'Garden',
    'Balcony',
    'Air Conditioning',
    'Security',
    'Elevator',
  ];
  const statuses = ['Available', 'Sold', 'Pending', 'Rented'];

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handlePriceChange = (range) => {
    handleFilterChange('priceRange', range);
  };

  const handleTypeToggle = (type) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const applyFilters = useCallback(() => {
    if (onFilter) {
      onFilter(filters);
    }
  }, [filters, onFilter]);

  const resetFilters = () => {
    setFilters({
      searchText: '',
      priceRange: [0, 1000000],
      propertyType: [],
      bedrooms: '',
      bathrooms: '',
      amenities: [],
      status: '',
      sortBy: 'newest',
    });
  };

  const activeFilterCount = useMemo(() => {
    return (
      (filters.searchText ? 1 : 0) +
      (filters.propertyType.length > 0 ? 1 : 0) +
      (filters.bedrooms ? 1 : 0) +
      (filters.bathrooms ? 1 : 0) +
      (filters.amenities.length > 0 ? 1 : 0) +
      (filters.status ? 1 : 0)
    );
  }, [filters]);

  return (
    <Box bg={bgColor} borderRadius="lg" border={`1px solid ${borderColor}`} p={4} mb={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={4} cursor="pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <HStack spacing={2}>
          <Icon as={FiFilter} boxSize={5} />
          <Text fontWeight="bold">Advanced Filters</Text>
          {activeFilterCount > 0 && (
            <Badge colorScheme="blue" borderRadius="full">
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        <Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} boxSize={6} />
      </Flex>

      <Collapse in={isExpanded}>
        <VStack spacing={6} align="stretch">
          {/* Search Text */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Search
            </Text>
            <Input
              placeholder="Address, property name..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              leftIcon={<FiSearch />}
            />
          </Box>

          {/* Price Range */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Price Range
            </Text>
            <Box mb={2}>
              <Flex justify="space-between" fontSize="sm" color="gray.600">
                <Text>${filters.priceRange[0].toLocaleString()}</Text>
                <Text>${filters.priceRange[1].toLocaleString()}</Text>
              </Flex>
            </Box>
            <RangeSlider
              min={0}
              max={1000000}
              step={10000}
              value={filters.priceRange}
              onChange={handlePriceChange}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>

          {/* Property Types */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Property Type
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {propertyTypes.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={filters.propertyType.includes(type) ? 'solid' : 'outline'}
                  colorScheme={filters.propertyType.includes(type) ? 'blue' : 'gray'}
                  onClick={() => handleTypeToggle(type)}
                >
                  {type}
                </Button>
              ))}
            </Flex>
          </Box>

          {/* Bedrooms & Bathrooms */}
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Bedrooms
              </Text>
              <Select
                placeholder="Any"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}+
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Bathrooms
              </Text>
              <Select
                placeholder="Any"
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}+
                  </option>
                ))}
              </Select>
            </Box>
          </Grid>

          {/* Amenities */}
          <Box>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Amenities
            </Text>
            <CheckboxGroup
              value={filters.amenities}
              onChange={(value) => handleFilterChange('amenities', value)}
            >
              <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={2}>
                {amenities.map((amenity) => (
                  <Checkbox key={amenity} value={amenity}>
                    {amenity}
                  </Checkbox>
                ))}
              </Grid>
            </CheckboxGroup>
          </Box>

          {/* Status & Sort */}
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Status
              </Text>
              <Select
                placeholder="All"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Sort By
              </Text>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </Select>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <HStack spacing={2} justify="space-between">
            <HStack spacing={2}>
              <Button colorScheme="blue" onClick={applyFilters} flex={1}>
                Apply Filters
              </Button>
              {activeFilterCount > 0 && (
                <Button
                  leftIcon={<CloseIcon />}
                  variant="outline"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              )}
            </HStack>

            {showSaveFilter && (
              <Button variant="outline" colorScheme="green">
                Save Search
              </Button>
            )}
          </HStack>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <Box pt={2} borderTop={`1px solid ${borderColor}`}>
              <Text fontSize="xs" color="gray.500" mb={2}>
                Active Filters:
              </Text>
              <Flex gap={2} flexWrap="wrap">
                {filters.searchText && (
                  <Badge colorScheme="purple">Search: {filters.searchText}</Badge>
                )}
                {filters.propertyType.map((type) => (
                  <Badge key={type} colorScheme="blue">
                    {type}
                  </Badge>
                ))}
                {filters.bedrooms && <Badge colorScheme="cyan">Beds: {filters.bedrooms}</Badge>}
                {filters.bathrooms && <Badge colorScheme="cyan">Baths: {filters.bathrooms}</Badge>}
                {filters.amenities.map((amenity) => (
                  <Badge key={amenity} colorScheme="green">
                    {amenity}
                  </Badge>
                ))}
                {filters.status && (
                  <Badge colorScheme="orange">{filters.status}</Badge>
                )}
              </Flex>
            </Box>
          )}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default AdvancedPropertyFilter;
