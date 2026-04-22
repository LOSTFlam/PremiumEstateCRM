import { useState, useCallback } from "react";
import {
  Box as _Box,
  Button,
  Checkbox as _Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem as _GridItem,
  Input as _Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Slider as _Slider,
  SliderFilledTrack as _SliderFilledTrack,
  SliderThumb as _SliderThumb,
  SliderTrack as _SliderTrack,
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Badge,
  HStack as _HStack,
  VStack,
} from "@chakra-ui/react";
import { FiFilter, FiX } from "react-icons/fi";

export default function PropertyFilters({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
}) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = useCallback((field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = {
      type: "all",
      status: "all",
      minPrice: "",
      maxPrice: "",
      minBedrooms: "",
      maxBedrooms: "",
      minBathrooms: "",
      maxBathrooms: "",
      minArea: "",
      maxArea: "",
    };
    setLocalFilters(clearedFilters);
    onClearFilters(clearedFilters);
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Flex align="center" justify="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Filters
              </Text>
              <IconButton icon={<FiX />} size="sm" onClick={handleClear} variant="ghost">
                Clear All
              </IconButton>
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch">
              {/* Property Type */}
              <FormControl>
                <FormLabel fontWeight="600">Property Type</FormLabel>
                <Select
                  value={localFilters.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                </Select>
              </FormControl>

              {/* Status */}
              <FormControl>
                <FormLabel fontWeight="600">Status</FormLabel>
                <Select
                  value={localFilters.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                </Select>
              </FormControl>

              {/* Price Range */}
              <FormControl>
                <FormLabel fontWeight="600">Price Range</FormLabel>
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <NumberInput
                    value={localFilters.minPrice}
                    onChange={(value) => handleInputChange("minPrice", value)}
                    placeholder="Min"
                  >
                    <NumberInputField placeholder="Min" />
                  </NumberInput>
                  <NumberInput
                    value={localFilters.maxPrice}
                    onChange={(value) => handleInputChange("maxPrice", value)}
                    placeholder="Max"
                  >
                    <NumberInputField placeholder="Max" />
                  </NumberInput>
                </Grid>
              </FormControl>

              {/* Bedrooms */}
              <FormControl>
                <FormLabel fontWeight="600">Bedrooms</FormLabel>
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <NumberInput
                    min={0}
                    max={10}
                    value={localFilters.minBedrooms}
                    onChange={(value) => handleInputChange("minBedrooms", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput
                    min={0}
                    max={10}
                    value={localFilters.maxBedrooms}
                    onChange={(value) => handleInputChange("maxBedrooms", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Grid>
              </FormControl>

              {/* Bathrooms */}
              <FormControl>
                <FormLabel fontWeight="600">Bathrooms</FormLabel>
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <NumberInput
                    min={0}
                    max={10}
                    value={localFilters.minBathrooms}
                    onChange={(value) => handleInputChange("minBathrooms", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput
                    min={0}
                    max={10}
                    value={localFilters.maxBathrooms}
                    onChange={(value) => handleInputChange("maxBathrooms", value)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Grid>
              </FormControl>

              {/* Area Range */}
              <FormControl>
                <FormLabel fontWeight="600">Area (sq ft)</FormLabel>
                <Grid templateColumns="1fr 1fr" gap={3}>
                  <NumberInput
                    value={localFilters.minArea}
                    onChange={(value) => handleInputChange("minArea", value)}
                    placeholder="Min"
                  >
                    <NumberInputField placeholder="Min" />
                  </NumberInput>
                  <NumberInput
                    value={localFilters.maxArea}
                    onChange={(value) => handleInputChange("maxArea", value)}
                    placeholder="Max"
                  >
                    <NumberInputField placeholder="Max" />
                  </NumberInput>
                </Grid>
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px" borderColor={borderColor}>
            <Button colorScheme="blue" size="lg" width="full" onClick={handleApply}>
              Apply Filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Filter Button Badge */}
      <Flex position="relative" display="inline-block">
        <IconButton icon={<FiFilter />} onClick={onClose} aria-label="Open filters" />
        {(localFilters.type !== "all" ||
          localFilters.status !== "all" ||
          localFilters.minPrice ||
          localFilters.maxPrice ||
          localFilters.minBedrooms ||
          localFilters.maxBedrooms ||
          localFilters.minBathrooms ||
          localFilters.maxBathrooms ||
          localFilters.minArea ||
          localFilters.maxArea) && (
          <Badge
            position="absolute"
            top="-2px"
            right="-2px"
            colorScheme="red"
            borderRadius="full"
            minW="18px"
            h="18px"
            fontSize="xs"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            !
          </Badge>
        )}
      </Flex>
    </>
  );
}
