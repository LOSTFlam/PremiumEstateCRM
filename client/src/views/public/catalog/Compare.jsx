import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Button,
  Text,
  SimpleGrid,
  useToast,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Image,
  Flex,
} from "@chakra-ui/react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { FiX, FiCheck, FiDownload, FiArrowLeft } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { LuMapPin, LuBuilding2, LuTrees } from "react-icons/lu";
import { getApi } from "services/api";
import { useTranslation } from "react-i18next";
import { publicBrand } from "views/public/publicBrand";
import jsPDF from "jspdf";
import 'jspdf-autotable';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const ids = searchParams.get("ids");
      if (!ids) {
        toast({
          title: "No properties selected for comparison",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      const response = await getApi(`api/property/public/by-ids?ids=${ids}`);
      if (response && response.data) {
        setProperties(response.data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error loading properties",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (propertyId) => {
    const newIds = properties
      .filter((p) => p._id !== propertyId)
      .map((p) => p._id);
    
    if (newIds.length > 0) {
      window.history.pushState({}, "", `/offers/compare?ids=${newIds.join(",")}`);
      setProperties(properties.filter((p) => p._id !== propertyId));
    } else {
      window.history.pushState({}, "", "/offers/compare");
      setProperties([]);
    }
    
    toast({
      title: "Property removed from comparison",
      status: "info",
      duration: 2000,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("Property Comparison", 14, 20);
    
    // Property names
    const headers = ["Feature", ...properties.map((p, i) => `Property ${i + 1}`)];
    const rows = [
      ["Price", ...properties.map((p) => `$${p.listingPrice?.toLocaleString() || "On request"}`)],
      ["Area (m²)", ...properties.map((p) => p.squareFootage || "—")],
      ["Bedrooms", ...properties.map((p) => p.numberofBedrooms || "—")],
      ["Bathrooms", ...properties.map((p) => p.numberofBathrooms || "—")],
      ["Type", ...properties.map((p) => p.propertyTypeKey || "—")],
      ["Location", ...properties.map((p) => p.propertyAddress || "—")],
    ];

    doc.autoTable({
      startY: 30,
      head: [headers],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [212, 175, 55] },
      columnStyles: {
        0: { fontStyle: "bold", fillColor: [240, 240, 240] },
      },
    });

    doc.save(`comparison-${Date.now()}.pdf`);
    
    toast({
      title: "PDF exported successfully",
      status: "success",
      duration: 3000,
    });
  };

  const comparisonFeatures = [
    {
      category: "Basic Info",
      features: [
        { key: "name", label: "Name", getValue: (p) => p.name || p.propertyAddress },
        { key: "price", label: "Price", getValue: (p) => `$${p.listingPrice?.toLocaleString() || "On request"}` },
        { key: "type", label: "Property Type", getValue: (p) => p.propertyTypeKey || "—" },
      ],
    },
    {
      category: "Details",
      features: [
        { key: "area", label: "Area (m²)", getValue: (p) => p.squareFootage || "—" },
        { key: "bedrooms", label: "Bedrooms", getValue: (p) => p.numberofBedrooms || "—" },
        { key: "bathrooms", label: "Bathrooms", getValue: (p) => p.numberofBathrooms || "—" },
        { key: "floors", label: "Floors", getValue: (p) => p.floors || "—" },
        { key: "year", label: "Year Built", getValue: (p) => p.yearBuilt || "—" },
      ],
    },
    {
      category: "Location",
      features: [
        { key: "address", label: "Address", getValue: (p) => p.propertyAddress || "—" },
        { key: "city", label: "City", getValue: (p) => p.city || "—" },
        { key: "state", label: "State", getValue: (p) => p.state || "—" },
        { key: "zip", label: "ZIP Code", getValue: (p) => p.zipCode || "—" },
      ],
    },
    {
      category: "Features",
      features: [
        { key: "parking", label: "Parking", getValue: (p) => p.parkingSpaces || "—" },
        { key: "garage", label: "Garage", getValue: (p) => p.garage ? "Yes" : "No" },
        { key: "pool", label: "Pool", getValue: (p) => p.pool ? "Yes" : "No" },
        { key: "garden", label: "Garden", getValue: (p) => p.garden ? "Yes" : "No" },
        { key: "balcony", label: "Balcony", getValue: (p) => p.balcony ? "Yes" : "No" },
      ],
    },
  ];

  if (loading) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={4}>
          <Box className="skeleton" h="40px" w="300px" borderRadius="10px" />
          <Box className="skeleton" h="600px" w="100%" borderRadius="20px" />
        </Stack>
      </Container>
    );
  }

  if (properties.length === 0) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={6} align="center">
          <Icon as={MdCompareArrows} boxSize={20} color="gray.600" />
          <Heading size="lg" color="gray.500">
            No properties selected for comparison
          </Heading>
          <Text color="gray.400">
            Select properties from the catalog to compare them
          </Text>
          <Button
            as={RouterLink}
            to="/offers"
            colorScheme="green"
            size="lg"
            borderRadius="12px"
            leftIcon={<FiArrowLeft />}
          >
            Browse Properties
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={publicBrand.gradients.page} color="white" py={10}>
      <Container maxW="8xl">
        <Stack spacing={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Stack spacing={2}>
              <HStack>
                <Icon as={MdCompareArrows} color="#F5D076" boxSize={8} />
                <Heading size="xl">
                  Property Comparison
                </Heading>
              </HStack>
              <Text color="gray.400">
                Comparing {properties.length} propert{properties.length !== 1 ? "ies" : "y"}
              </Text>
            </Stack>

            <HStack spacing={3}>
              <Button
                as={RouterLink}
                to="/offers"
                variant="outline"
                borderColor="rgba(255,255,255,0.2)"
                leftIcon={<FiArrowLeft />}
              >
                Back to Catalog
              </Button>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                borderColor="rgba(212,175,55,0.3)"
                color="#F5D076"
                onClick={exportToPDF}
              >
                Export PDF
              </Button>
            </HStack>
          </Flex>

          {/* Property Cards */}
          <SimpleGrid columns={{ base: 1, md: properties.length }} spacing={6}>
            {properties.map((property) => (
              <Box
                key={property._id}
                position="relative"
                borderRadius="20px"
                overflow="hidden"
                border="1px solid rgba(255,255,255,0.1)"
              >
                <Image
                  src={property.images?.[0] || property.primaryImage}
                  alt={property.name || property.propertyAddress}
                  h="200px"
                  w="100%"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Stack spacing={2}>
                    <HStack justify="space-between">
                      <Badge
                        px={3}
                        py={1}
                        borderRadius="full"
                        bg="rgba(212,175,55,0.2)"
                        color="#F5D076"
                      >
                        <HStack spacing={2}>
                          <Icon as={
                            property.propertyTypeKey === "house" ? LuBuilding2 :
                            property.propertyTypeKey === "apartment" ? LuBuilding2 :
                            property.propertyTypeKey === "land" ? LuTrees :
                            LuMapPin
                          } />
                          <Text textTransform="capitalize">{property.propertyTypeKey || "Property"}</Text>
                        </HStack>
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="red.400"
                        onClick={() => removeProperty(property._id)}
                        leftIcon={<FiX />}
                      >
                        Remove
                      </Button>
                    </HStack>
                    <Heading size="md" noOfLines={2}>
                      {property.name || property.propertyAddress}
                    </Heading>
                    <Text color="#F5D076" fontWeight="bold" fontSize="xl">
                      ${property.listingPrice?.toLocaleString() || "On request"}
                    </Text>
                    <HStack color="gray.400" fontSize="sm">
                      <Icon as={LuMapPin} />
                      <Text noOfLines={1}>{property.propertyAddress}</Text>
                    </HStack>
                  </Stack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>

          {/* Comparison Table */}
          <Box
            borderRadius="20px"
            overflow="hidden"
            border="1px solid rgba(255,255,255,0.1)"
            bg="rgba(255,255,255,0.02)"
          >
            {comparisonFeatures.map((category, catIdx) => (
              <Box key={catIdx} mb={catIdx > 0 ? 8 : 0}>
                <Box
                  px={6}
                  py={4}
                  bg="rgba(212,175,55,0.1)"
                  borderBottom="1px solid rgba(255,255,255,0.1)"
                >
                  <Heading size="md">{category.category}</Heading>
                </Box>
                <Table variant="simple">
                  <Tbody>
                    {category.features.map((feature, featIdx) => {
                      const values = properties.map((p) => feature.getValue(p));
                      const uniqueValues = new Set(values);
                      const isDifferent = uniqueValues.size > 1;

                      return (
                        <Tr
                          key={feature.key}
                          bg={featIdx % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent"}
                        >
                          <Td
                            fontWeight={isDifferent ? "bold" : "normal"}
                            color={isDifferent ? "#F5D076" : "inherit"}
                            borderRight="1px solid rgba(255,255,255,0.1)"
                          >
                            <HStack>
                              <Text>{feature.label}</Text>
                              {isDifferent && (
                                <Badge colorScheme="yellow" fontSize="xs">
                                  Different
                                </Badge>
                              )}
                            </HStack>
                          </Td>
                          {values.map((value, idx) => (
                            <Td key={idx} borderRight="1px solid rgba(255,255,255,0.1)">
                              <HStack>
                                {value !== "—" && value !== "On request" && (
                                  <Icon as={FiCheck} color="green.400" boxSize={4} />
                                )}
                                <Text>{value}</Text>
                              </HStack>
                            </Td>
                          ))}
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default ComparePage;
