import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  HStack,
  Badge,
  Icon,
  useToast,
  Image,
  Table,
  Tbody,
  Td,
  Tr,
  Flex,
} from "@chakra-ui/react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { FiX, FiCheck, FiDownload, FiArrowLeft } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { LuMapPin, LuBuilding2, LuTrees } from "react-icons/lu";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { useTranslation } from "react-i18next";
import { publicBrand } from "views/public/publicBrand";
import { formatPrice, getPrimaryImage, normalizePropertyTypeKey } from "./catalogData";
import { getCompareIds } from "./catalogStorage";
import { fetchPublicCatalog } from "./catalogService";
import jsPDF from "jspdf";
import "jspdf-autotable";

const compareCopy = {
  ru: {
    noSelection: "Объекты для сравнения не выбраны",
    loadError: "Не удалось загрузить объекты",
    removed: "Объект удален из сравнения",
    pdfTitle: "Сравнение объектов",
    pdfExported: "Файл успешно сохранен",
    feature: "Параметр",
    property: (index) => `Объект ${index + 1}`,
    price: "Цена",
    onRequest: "По запросу",
    area: "Площадь (м²)",
    bedrooms: "Спальни",
    bathrooms: "Санузлы",
    type: "Тип объекта",
    location: "Локация",
    basicInfo: "Основная информация",
    details: "Параметры",
    locationTitle: "Расположение",
    features: "Особенности",
    name: "Название",
    propertyType: "Тип объекта",
    floors: "Этажи",
    yearBuilt: "Год постройки",
    address: "Адрес",
    city: "Город",
    state: "Регион",
    zip: "Индекс",
    parking: "Парковка",
    garage: "Гараж",
    pool: "Бассейн",
    garden: "Сад",
    balcony: "Балкон",
    yes: "Да",
    no: "Нет",
    emptyTitle: "Объекты для сравнения пока не выбраны",
    emptyText: "Добавьте объекты из каталога, чтобы посмотреть их рядом.",
    browse: "Открыть каталог",
    title: "Сравнение объектов",
    comparing: (count) => `Сравниваем ${count} ${count === 1 ? "объект" : "объекта"}`,
    back: "Назад в каталог",
    exportPdf: "Скачать файл",
    remove: "Убрать",
    different: "Есть отличия",
  },
  en: {
    noSelection: "No properties selected for comparison",
    loadError: "Error loading properties",
    removed: "Property removed from comparison",
    pdfTitle: "Property Comparison",
    pdfExported: "PDF exported successfully",
    feature: "Feature",
    property: (index) => `Property ${index + 1}`,
    price: "Price",
    onRequest: "On request",
    area: "Area (m²)",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    type: "Type",
    location: "Location",
    basicInfo: "Basic Info",
    details: "Details",
    locationTitle: "Location",
    features: "Features",
    name: "Name",
    propertyType: "Property Type",
    floors: "Floors",
    yearBuilt: "Year Built",
    address: "Address",
    city: "City",
    state: "State",
    zip: "ZIP Code",
    parking: "Parking",
    garage: "Garage",
    pool: "Pool",
    garden: "Garden",
    balcony: "Balcony",
    yes: "Yes",
    no: "No",
    emptyTitle: "No properties selected for comparison",
    emptyText: "Select properties from the catalog to compare them",
    browse: "Browse Properties",
    title: "Property Comparison",
    comparing: (count) => `Comparing ${count} propert${count !== 1 ? "ies" : "y"}`,
    back: "Back to Catalog",
    exportPdf: "Export PDF",
    remove: "Remove",
    different: "Different",
  },
};

const propertyTypeLabels = {
  ru: {
    house: "Дом",
    apartment: "Квартира",
    land: "Участок",
    commercial: "Коммерция",
  },
  en: {
    house: "House",
    apartment: "Apartment",
    land: "Land",
    commercial: "Commercial",
  },
};

const getLocalizedPropertyType = (property, locale, fallback) => {
  const key = normalizePropertyTypeKey(property?.propertyType);
  return propertyTypeLabels[locale]?.[key] || property?.propertyType || fallback;
};

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = compareCopy[locale];

  const fetchProperties = useCallback(async () => {
    setLoading(true);

    const requestedIds = searchParams.get("ids") || getCompareIds().join(",");
    const idList = requestedIds
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (idList.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getApi(`api/property/public/by-ids?ids=${idList.join(",")}`, {
        silent: true,
      });
      const remoteProperties = extractCollection(response);

      if (remoteProperties.length > 0) {
        setProperties(remoteProperties);
        return;
      }

      const catalog = await fetchPublicCatalog();
      setProperties(catalog.filter((property) => idList.includes(property?._id)));
    } catch (error) {
      const catalog = await fetchPublicCatalog();
      const fallbackProperties = catalog.filter((property) => idList.includes(property?._id));
      setProperties(fallbackProperties);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const removeProperty = (propertyId) => {
    const newIds = properties.filter((p) => p._id !== propertyId).map((p) => p._id);

    if (newIds.length > 0) {
      window.history.pushState({}, "", `/offers/compare?ids=${newIds.join(",")}`);
      window.localStorage.setItem("public_catalog_compare", JSON.stringify(newIds));
      setProperties(properties.filter((p) => p._id !== propertyId));
    } else {
      window.history.pushState({}, "", "/offers/compare");
      window.localStorage.setItem("public_catalog_compare", JSON.stringify([]));
      setProperties([]);
    }

    toast({
      title: copy.removed,
      status: "info",
      duration: 2000,
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text(copy.pdfTitle, 14, 20);

    // Property names
    const headers = [copy.feature, ...properties.map((p, i) => copy.property(i))];
    const rows = [
      [copy.price, ...properties.map((p) => formatPrice(p?.listingPrice) || copy.onRequest)],
      [copy.area, ...properties.map((p) => p.squareFootage || "—")],
      [copy.bedrooms, ...properties.map((p) => p.numberofBedrooms || "—")],
      [copy.bathrooms, ...properties.map((p) => p.numberofBathrooms || "—")],
      [copy.type, ...properties.map((p) => getLocalizedPropertyType(p, locale, "—"))],
      [copy.location, ...properties.map((p) => p.propertyAddress || "—")],
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
      title: copy.pdfExported,
      status: "success",
      duration: 3000,
    });
  };

  const comparisonFeatures = [
    {
      category: copy.basicInfo,
      features: [
        { key: "name", label: copy.name, getValue: (p) => p.name || p.propertyAddress },
        {
          key: "price",
          label: copy.price,
          getValue: (p) => formatPrice(p?.listingPrice) || copy.onRequest,
        },
        {
          key: "type",
          label: copy.propertyType,
          getValue: (p) => getLocalizedPropertyType(p, locale, "—"),
        },
      ],
    },
    {
      category: copy.details,
      features: [
        { key: "area", label: copy.area, getValue: (p) => p.squareFootage || "—" },
        { key: "bedrooms", label: copy.bedrooms, getValue: (p) => p.numberofBedrooms || "—" },
        { key: "bathrooms", label: copy.bathrooms, getValue: (p) => p.numberofBathrooms || "—" },
        { key: "floors", label: copy.floors, getValue: (p) => p.floors || "—" },
        { key: "year", label: copy.yearBuilt, getValue: (p) => p.yearBuilt || "—" },
      ],
    },
    {
      category: copy.locationTitle,
      features: [
        { key: "address", label: copy.address, getValue: (p) => p.propertyAddress || "—" },
        { key: "city", label: copy.city, getValue: (p) => p.city || "—" },
        { key: "state", label: copy.state, getValue: (p) => p.state || "—" },
        { key: "zip", label: copy.zip, getValue: (p) => p.zipCode || "—" },
      ],
    },
    {
      category: copy.features,
      features: [
        { key: "parking", label: copy.parking, getValue: (p) => p.parkingSpaces || "—" },
        { key: "garage", label: copy.garage, getValue: (p) => (p.garage ? copy.yes : copy.no) },
        { key: "pool", label: copy.pool, getValue: (p) => (p.pool ? copy.yes : copy.no) },
        { key: "garden", label: copy.garden, getValue: (p) => (p.garden ? copy.yes : copy.no) },
        { key: "balcony", label: copy.balcony, getValue: (p) => (p.balcony ? copy.yes : copy.no) },
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
            {copy.emptyTitle}
          </Heading>
          <Text color="gray.400">{copy.emptyText}</Text>
          <Button
            as={RouterLink}
            to="/offers"
            colorScheme="green"
            size="lg"
            borderRadius="12px"
            leftIcon={<FiArrowLeft />}
          >
            {copy.browse}
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
                <Heading as="h1" size="xl">
                  {copy.title}
                </Heading>
              </HStack>
              <Text color="gray.400">{copy.comparing(properties.length)}</Text>
            </Stack>

            <HStack spacing={3}>
              <Button
                as={RouterLink}
                to="/offers"
                variant="outline"
                borderColor="rgba(255,255,255,0.2)"
                leftIcon={<FiArrowLeft />}
              >
                {copy.back}
              </Button>
              <Button
                leftIcon={<FiDownload />}
                variant="outline"
                borderColor="rgba(212,175,55,0.3)"
                color="#F5D076"
                onClick={exportToPDF}
              >
                {copy.exportPdf}
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
                  src={getPrimaryImage(property)}
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
                          <Icon
                            as={
                              normalizePropertyTypeKey(property.propertyType) === "house"
                                ? LuBuilding2
                                : normalizePropertyTypeKey(property.propertyType) === "apartment"
                                  ? LuBuilding2
                                  : normalizePropertyTypeKey(property.propertyType) === "land"
                                    ? LuTrees
                                    : LuMapPin
                            }
                          />
                          <Text textTransform="capitalize">
                            {getLocalizedPropertyType(property, locale, copy.propertyType)}
                          </Text>
                        </HStack>
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="red.400"
                        onClick={() => removeProperty(property._id)}
                        leftIcon={<FiX />}
                      >
                        {copy.remove}
                      </Button>
                    </HStack>
                    <Heading size="md" noOfLines={2}>
                      {property.name || property.propertyAddress}
                    </Heading>
                    <Text color="#F5D076" fontWeight="bold" fontSize="xl">
                      {formatPrice(property.listingPrice) || copy.onRequest}
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
                                  {copy.different}
                                </Badge>
                              )}
                            </HStack>
                          </Td>
                          {values.map((value, idx) => (
                            <Td key={idx} borderRight="1px solid rgba(255,255,255,0.1)">
                              <HStack>
                                {value !== "—" && value !== copy.onRequest && (
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
