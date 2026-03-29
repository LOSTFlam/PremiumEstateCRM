import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useColorModeValue,
  Collapse,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiFilter, FiX, FiSearch, FiMapPin, FiDollarSign, FiHome, FiMaximize } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const AdvancedFilters = ({ onFilterChange, initialFilters = {} }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    propertyType: initialFilters.propertyType || "",
    minPrice: initialFilters.minPrice || 0,
    maxPrice: initialFilters.maxPrice || 10000000,
    minArea: initialFilters.minArea || 0,
    maxArea: initialFilters.maxArea || 1000,
    bedrooms: initialFilters.bedrooms || 0,
    bathrooms: initialFilters.bathrooms || 0,
    location: initialFilters.location || "",
    sortBy: initialFilters.sortBy || "newest",
  });

  const propertyTypes = [
    { value: "", label: t("filters.allTypes") || "All Types" },
    { value: "house", label: t("publicListing.houses") || "Houses" },
    { value: "apartment", label: t("publicListing.apartments") || "Apartments" },
    { value: "land", label: t("publicListing.plots") || "Plots" },
    { value: "commercial", label: t("publicListing.commercial") || "Commercial" },
  ];

  const locations = [
    { value: "", label: t("filters.allLocations") || "All Locations" },
    { value: "downtown", label: t("filters.downtown") || "Downtown" },
    { value: "suburbs", label: t("filters.suburbs") || "Suburbs" },
    { value: "beachfront", label: t("filters.beachfront") || "Beachfront" },
    { value: "mountains", label: t("filters.mountains") || "Mountains" },
  ];

  const sortOptions = [
    { value: "newest", label: t("filters.newest") || "Newest" },
    { value: "price-asc", label: t("filters.priceLowToHigh") || "Price: Low to High" },
    { value: "price-desc", label: t("filters.priceHighToLow") || "Price: High to Low" },
    { value: "area-desc", label: t("filters.largestArea") || "Largest Area" },
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      search: "",
      propertyType: "",
      minPrice: 0,
      maxPrice: 10000000,
      minArea: 0,
      maxArea: 1000,
      bedrooms: 0,
      bathrooms: 0,
      location: "",
      sortBy: "newest",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "" && value !== 0 && value !== "newest" && value !== 10000000 && value !== 1000
  ).length;

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={bgColor}
      borderRadius="20px"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      mb={6}
    >
      {/* Quick Search Bar */}
      <Stack spacing={4} mb={4}>
        <HStack spacing={4}>
          <Box flex={1}>
            <InputGroup>
              <Input
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder={t("filters.searchPlaceholder") || "Search by location, keyword..."}
                borderRadius="12px"
                size="md"
              />
            </InputGroup>
          </Box>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            leftIcon={<FiFilter />}
            variant="outline"
            borderRadius="12px"
          >
            {t("filters.moreFilters") || "More Filters"}
            {activeFiltersCount > 0 && (
              <Badge ml={2} colorScheme="green">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button onClick={resetFilters} leftIcon={<FiX />} variant="ghost" borderRadius="12px">
              {t("filters.reset") || "Reset"}
            </Button>
          )}
        </HStack>

        {/* Sort */}
        <HStack spacing={4}>
          <Select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            borderRadius="12px"
            maxW="300px"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </HStack>
      </Stack>

      {/* Advanced Filters */}
      <Collapse in={isOpen}>
        <Stack spacing={6} pt={4} borderTop="1px solid" borderColor={borderColor}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            {/* Property Type */}
            <GridItem>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiHome} color="gray.500" />
                  <Text fontWeight="600" fontSize="sm">
                    {t("filters.propertyType") || "Property Type"}
                  </Text>
                </HStack>
                <Select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange("propertyType", e.target.value)}
                  borderRadius="12px"
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </Stack>
            </GridItem>

            {/* Location */}
            <GridItem>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiMapPin} color="gray.500" />
                  <Text fontWeight="600" fontSize="sm">
                    {t("filters.location") || "Location"}
                  </Text>
                </HStack>
                <Select
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  borderRadius="12px"
                >
                  {locations.map((loc) => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </Select>
              </Stack>
            </GridItem>

            {/* Price Range */}
            <GridItem>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiDollarSign} color="gray.500" />
                  <Text fontWeight="600" fontSize="sm">
                    {t("filters.priceRange") || "Price Range"}
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <NumberInput
                    value={filters.minPrice}
                    onChange={(val) => handleFilterChange("minPrice", Number(val))}
                    min={0}
                    max={filters.maxPrice}
                    size="sm"
                  >
                    <NumberInputField placeholder="Min" borderRadius="8px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>-</Text>
                  <NumberInput
                    value={filters.maxPrice}
                    onChange={(val) => handleFilterChange("maxPrice", Number(val))}
                    min={filters.minPrice}
                    max={10000000}
                    size="sm"
                  >
                    <NumberInputField placeholder="Max" borderRadius="8px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </Stack>
            </GridItem>

            {/* Area Range */}
            <GridItem>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiMaximize} color="gray.500" />
                  <Text fontWeight="600" fontSize="sm">
                    {t("filters.area") || "Area"} (m²)
                  </Text>
                </HStack>
                <HStack spacing={2}>
                  <NumberInput
                    value={filters.minArea}
                    onChange={(val) => handleFilterChange("minArea", Number(val))}
                    min={0}
                    max={filters.maxArea}
                    size="sm"
                  >
                    <NumberInputField placeholder="Min" borderRadius="8px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>-</Text>
                  <NumberInput
                    value={filters.maxArea}
                    onChange={(val) => handleFilterChange("maxArea", Number(val))}
                    min={filters.minArea}
                    max={1000}
                    size="sm"
                  >
                    <NumberInputField placeholder="Max" borderRadius="8px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </Stack>
            </GridItem>

            {/* Bedrooms */}
            <GridItem>
              <Stack spacing={2}>
                <Text fontWeight="600" fontSize="sm">
                  {t("publicListing.bedrooms") || "Bedrooms"}
                </Text>
                <Slider
                  value={filters.bedrooms}
                  onChange={(val) => handleFilterChange("bedrooms", val)}
                  min={0}
                  max={10}
                  step={1}
                  colorScheme="green"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Text fontSize="xs" fontWeight="bold">
                      {filters.bedrooms === 10 ? "10+" : filters.bedrooms}
                    </Text>
                  </SliderThumb>
                </Slider>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {filters.bedrooms === 10 ? "10+" : filters.bedrooms} {t("publicListing.bedrooms") || "bedrooms"}
                </Text>
              </Stack>
            </GridItem>

            {/* Bathrooms */}
            <GridItem>
              <Stack spacing={2}>
                <Text fontWeight="600" fontSize="sm">
                  {t("publicListing.bathrooms") || "Bathrooms"}
                </Text>
                <Slider
                  value={filters.bathrooms}
                  onChange={(val) => handleFilterChange("bathrooms", val)}
                  min={0}
                  max={10}
                  step={1}
                  colorScheme="green"
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Text fontSize="xs" fontWeight="bold">
                      {filters.bathrooms === 10 ? "10+" : filters.bathrooms}
                    </Text>
                  </SliderThumb>
                </Slider>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {filters.bathrooms === 10 ? "10+" : filters.bathrooms} {t("publicListing.bathrooms") || "bathrooms"}
                </Text>
              </Stack>
            </GridItem>
          </Grid>

          {/* Apply Button */}
          <HStack justify="flex-end">
            <Button
              onClick={() => setIsOpen(false)}
              colorScheme="green"
              leftIcon={<FiSearch />}
              borderRadius="12px"
              px={8}
            >
              {t("filters.applyFilters") || "Apply Filters"}
            </Button>
          </HStack>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default AdvancedFilters;
