import { useMemo } from "react";
import { Select, Button, Flex, Icon } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const usePropertyPagination = (properties, filters, sortBy, page, pageSize = 6) => {
  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Type filter
      if (filters.type !== "all" && property.propertyType !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && property.listingStatus !== filters.status) {
        return false;
      }

      // Price filter
      if (filters.minPrice && property.listingPrice < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && property.listingPrice > filters.maxPrice) {
        return false;
      }

      // Bedrooms filter
      if (filters.minBedrooms && property.numberofBedrooms < filters.minBedrooms) {
        return false;
      }
      if (filters.maxBedrooms && property.numberofBedrooms > filters.maxBedrooms) {
        return false;
      }

      // Bathrooms filter
      if (filters.minBathrooms && property.numberofBathrooms < filters.minBathrooms) {
        return false;
      }
      if (filters.maxBathrooms && property.numberofBathrooms > filters.maxBathrooms) {
        return false;
      }

      // Area filter
      if (filters.minArea && property.squareFootage < filters.minArea) {
        return false;
      }
      if (filters.maxArea && property.squareFootage > filters.maxArea) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.listingPrice - b.listingPrice);
      case "price-desc":
        return sorted.sort((a, b) => b.listingPrice - a.listingPrice);
      case "newest":
        return sorted.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
      default:
        return sorted;
    }
  }, [filteredProperties, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / pageSize);
  const paginatedProperties = sortedProperties.slice((page - 1) * pageSize, page * pageSize);

  return {
    filteredProperties: sortedProperties,
    paginatedProperties,
    totalPages,
    currentPage: page,
    totalResults: sortedProperties.length,
  };
};

export const PropertySort = ({ sortBy, onSortChange }) => {
  return (
    <Select value={sortBy} onChange={(e) => onSortChange(e.target.value)} width="200px" size="md">
      <option value="default">Default</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
    </Select>
  );
};

export const PropertyPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <Flex justify="center" align="center" gap={2} mt={8}>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        leftIcon={<Icon as={FiChevronLeft} boxSize={4} />}
      >
        Previous
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        rightIcon={<Icon as={FiChevronRight} boxSize={4} />}
      >
        Next
      </Button>
    </Flex>
  );
};
