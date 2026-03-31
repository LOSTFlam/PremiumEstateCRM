import React, { useEffect, useState } from "react";
import { Grid, GridItem, Heading, useColorModeValue, Box, Text, Icon, Flex, Button, Input, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getApi } from "services/api";
import Card from "components/card/Card";
import PropertyPhotoManager from "components/property/PropertyPhotoManager";
import { FiUpload, FiImage } from "react-icons/fi";
import DataNotFound from "components/notFoundData";

const PropertyPhotos = () => {
  const { t, i18n } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isRu = i18n.language?.startsWith("ru");

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await getApi("api/property/public");
      const propertiesData = Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [];
      setProperties(propertiesData.filter(p => p.propertyPhotos && p.propertyPhotos.length > 0));
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.propertyAddress?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={4}>
      <GridItem colSpan={12}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">{t?.("navigation.propertyPhotos") || (isRu ? "Фото объектов" : "Property Photos")}</Heading>
          <Input
            placeholder={isRu ? "Поиск объектов..." : "Search properties..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            maxW="300px"
          />
        </Flex>
      </GridItem>

      {loading ? (
        <GridItem colSpan={12}>
          <Flex justify="center" align="center" height="400px">
            <Spinner size="xl" />
          </Flex>
        </GridItem>
      ) : filteredProperties.length > 0 ? (
        filteredProperties.map((property) => (
          <GridItem key={property._id} colSpan={{ base: 12, md: 6, lg: 4 }}>
            <Card
              p={4}
              cursor="pointer"
              onClick={() => setSelectedProperty(selectedProperty?._id === property._id ? null : property)}
              _hover={{ transform: "scale(1.02)", transition: "all 0.3s" }}
            >
              <Flex direction="column" gap={3}>
                <Heading size="md" noOfLines={2}>{property.name || property.propertyAddress}</Heading>
                <Text color="gray.500" fontSize="sm" noOfLines={1}>{property.propertyAddress}</Text>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="green.600" fontWeight="bold">
                    {property.propertyPhotos?.length || 0} {isRu ? "фото" : property.propertyPhotos?.length === 1 ? "photo" : "photos"}
                  </Text>
                  <Icon as={FiImage} boxSize={5} color="gray.400" />
                </Flex>
                
                {property.propertyPhotos?.length > 0 && (
                  <Box
                    position="relative"
                    borderRadius="12px"
                    overflow="hidden"
                    borderWidth="1px"
                    borderColor={borderColor}
                  >
                    <img
                      src={property.propertyPhotos[0]?.img}
                      alt={property.name || (isRu ? "Объект" : "Property")}
                      style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    />
                    {property.propertyPhotos.length > 1 && (
                      <Box
                        position="absolute"
                        top={2}
                        right={2}
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="sm"
                      >
                        +{property.propertyPhotos.length - 1} {isRu ? "еще" : "more"}
                      </Box>
                    )}
                  </Box>
                )}

                {selectedProperty?._id === property._id && (
                  <Box mt={4}>
                    <PropertyPhotoManager
                      propertyId={property._id}
                      photos={property.propertyPhotos || []}
                      onChange={(newPhotos) => {
                        setProperties(properties.map(p => 
                          p._id === property._id ? { ...p, propertyPhotos: newPhotos } : p
                        ));
                      }}
                      isOpen={true}
                      onClose={() => {}}
                    />
                  </Box>
                )}
              </Flex>
            </Card>
          </GridItem>
        ))
      ) : (
        <GridItem colSpan={12}>
          <Card p={10}>
            <Flex direction="column" align="center" gap={4}>
              <Icon as={FiUpload} boxSize={12} color="gray.400" />
              <Text color="gray.500" fontSize="lg">
                {searchQuery
                  ? (isRu ? "Объекты не найдены" : "No properties found")
                  : (isRu ? "Объектов с фото пока нет" : "No properties with photos yet")}
              </Text>
              {!searchQuery && <DataNotFound />}
            </Flex>
          </Card>
        </GridItem>
      )}
    </Grid>
  );
};

export default PropertyPhotos;
