import {
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Link,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditIcon } from "@chakra-ui/icons";
import {
  LuBath,
  LuBedDouble,
  LuCalendarClock,
  LuClock,
  LuExternalLink,
  LuHouse,
  LuMap,
  LuSparkles,
  LuTrees,
  LuUser,
  LuWaves,
  LuBuilding2,
} from "react-icons/lu";
import {
  MdCompareArrows,
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineLocationOn,
  MdOutlinePayments,
  MdOutlineSquareFoot,
} from "react-icons/md";
import { Link as RouterLink, useParams } from "react-router-dom";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import {
  estimateMortgage,
  formatDate,
  formatPrice,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  getPrimaryImage,
  normalizeStatus,
  placeholderImage,
} from "./catalogData";
import {
  getCompareIds,
  getFavoriteIds,
  pushRecentlyViewedId,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalogStorage";
import { fetchPublicCatalog, fetchPublicPropertyById } from "./catalogService";
import LeadCaptureCard from "./LeadCaptureCard";
import SeoMeta from "./SeoMeta";
import i18n from "i18n/i18n.config";
import { publicBrand } from "../publicBrand";

const splitFeatures = (...values) =>
  values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/,|\n|;/))
    .map((item) => item.trim())
    .filter(Boolean);

const buildHighlights = (property, t) => [
  {
    label: t?.("publicListing.type"),
    value: property?.propertyType || t?.("publicListing.notSpecified"),
    icon: LuHouse,
  },
  {
    label: t?.("publicListing.area"),
    value: property?.squareFootage || t?.("publicListing.notSpecified"),
    icon: MdOutlineSquareFoot,
  },
  {
    label: t?.("publicListing.lotSize"),
    value: property?.lotSize || t?.("publicListing.notSpecified"),
    icon: LuMap,
  },
  {
    label: t?.("publicListing.updatedAtLabel"),
    value: formatDate(property?.updatedDate || property?.createdDate || property?.listingDate),
    icon: LuCalendarClock,
  },
];

export default function PublicOfferView() {
  const { id } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [property, setProperty] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [termYears, setTermYears] = useState(20);
  const [interestRate, setInterestRate] = useState(18);

  const pageBg = publicBrand.colors.paper;
  const cardBg = publicBrand.gradients.panelLight;
  const subtleBg = "rgba(244, 238, 229, 0.82)";
  const mutedColor = publicBrand.colors.textSoft;
  const borderColor = "rgba(9,18,32,0.08)";
  const cardShadow = publicBrand.shadows.soft;

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);

      try {
        const catalog = await fetchPublicCatalog();
        setAllProperties(catalog);

        const localProperty = catalog.find((item) => item?._id === id);
        if (localProperty) {
          setProperty(localProperty);
          return;
        }

        const propertyData = await fetchPublicPropertyById(id);
        setProperty(propertyData || null);
      } catch (err) {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    setActiveImage(0);
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
    if (id) pushRecentlyViewedId(id);
  }, [id]);

  const gallery = useMemo(() => {
    if (!property) return [];
    const photoItems = property?.propertyPhotos?.map((item) => item?.img) || [];
    const floorItems = property?.floorPlans?.map((item) => item?.img) || [];
    return [...photoItems, ...floorItems].filter(Boolean);
  }, [property]);

  const currentImage = gallery[activeImage] || placeholderImage;
  const amenities = useMemo(
    () =>
      splitFeatures(
        property?.communityAmenities,
        property?.appliancesIncluded,
        property?.heatingAndCoolingSystems,
        property?.flooringType,
        property?.exteriorFeatures
      ),
    [property]
  );

  const highlights = useMemo(() => buildHighlights(property, t), [property, t]);
  const unitTypes = useMemo(
    () => (Array.isArray(property?.unitType) ? property.unitType.filter(Boolean) : []),
    [property?.unitType]
  );
  const similarProperties = useMemo(
    () =>
      allProperties
        .filter((item) => item?._id !== property?._id)
        .filter((item) => item?.propertyType === property?.propertyType)
        .slice(0, 3),
    [allProperties, property]
  );

  const photoCount = useMemo(() => getPhotoCount(property), [property]);
  const documentCount = useMemo(() => getDocumentCount(property), [property]);
  const floorPlanCount = useMemo(() => getFloorPlanCount(property), [property]);
  const mortgage = useMemo(
    () =>
      estimateMortgage({
        price: property?.listingPrice,
        downPaymentPercent,
        years: termYears,
        annualRate: interestRate,
      }),
    [downPaymentPercent, interestRate, property?.listingPrice, termYears]
  );

  const isFavorite = favoriteIds.includes(property?._id);
  const isInCompare = compareIds.includes(property?._id);
  const verification = property?.verification || { status: "pending", checklist: [] };
  const verificationLabels = {
    address: t?.("publicListing.verificationAddress"),
    price: t?.("publicListing.verificationPrice"),
    description: t?.("publicListing.verificationDescription"),
    photos: t?.("publicListing.verificationPhotos"),
    documents: t?.("publicListing.verificationDocuments"),
    agent: t?.("publicListing.verificationAgent"),
  };

  const handleFavoriteToggle = () => {
    if (!property?._id) return;
    const next = toggleFavoriteId(property._id);
    setFavoriteIds(next);
    toast({
      title: isFavorite
        ? t?.("publicListing.removeFromFavorites")
        : t?.("publicListing.addToFavorites"),
      status: "success",
    });
  };

  const handleCompareToggle = () => {
    if (!property?._id) return;
    const next = toggleCompareId(property._id);
    setCompareIds(next);
    toast({
      title: isInCompare
        ? t?.("publicListing.removeFromCompare")
        : t?.("publicListing.addToCompare"),
      status: "success",
    });
  };

  if (loading) {
    return (
      <Box minH="100vh" bg={pageBg} py={10}>
        <Container maxW="8xl">
          <Skeleton h="640px" borderRadius="32px" />
        </Container>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box minH="100vh" bg={pageBg} py={10}>
        <Container maxW="5xl">
          <Box
            bg={cardBg}
            borderRadius="34px"
            p={10}
            boxShadow={cardShadow}
            border="1px solid rgba(9,18,32,0.08)"
          >
            <Stack spacing={4}>
              <Heading>{t?.("publicListing.propertyNotFound")}</Heading>
              <Text color={mutedColor}>{t?.("publicListing.propertyNotFoundText")}</Text>
              <Button
                as={RouterLink}
                to="/offers"
                w="fit-content"
                borderRadius="full"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
              >
                {t?.("publicListing.backToCatalog")}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box
        bg={publicBrand.gradients.hero}
        color="white"
        position="relative"
        overflow="hidden"
        mb={{ base: 8, md: 10 }}
      >
        <Box
          position="absolute"
          inset="0"
          bg="radial-gradient(circle at 18% 22%, rgba(245,208,118,0.16) 0%, rgba(245,208,118,0) 28%), radial-gradient(circle at 84% 14%, rgba(185,119,55,0.16) 0%, rgba(185,119,55,0) 32%)"
        />
        <ModernHeader />
        <Container
          maxW="8xl"
          pt={{ base: 28, md: 32 }}
          pb={{ base: 12, md: 16 }}
          position="relative"
        >
          <Grid templateColumns={{ base: "1fr", xl: "1.04fr 0.96fr" }} gap={8} alignItems="end">
            <GridItem>
              <Stack spacing={5} maxW="780px">
                <HStack spacing={3} flexWrap="wrap">
                  <Badge
                    w="fit-content"
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    bg="rgba(245,208,118,0.14)"
                    color="#f5d076"
                    border="1px solid rgba(245,208,118,0.24)"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                  >
                    {normalizeStatus(property?.listingStatus, t)}
                  </Badge>
                  <Badge
                    w="fit-content"
                    px={4}
                    py={1.5}
                    borderRadius="full"
                    bg={
                      property?.dealType === "rent"
                        ? "rgba(104,211,225,0.16)"
                        : "rgba(143,193,154,0.16)"
                    }
                    color={property?.dealType === "rent" ? "#9ae6f0" : "#bbdbbf"}
                    border="1px solid rgba(227, 211, 184, 0.18)"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                  >
                    {property?.dealType === "rent"
                      ? t?.("publicListing.dealRent") || "Аренда"
                      : t?.("publicListing.dealSale") || "Продажа"}
                  </Badge>
                </HStack>
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", md: "6xl" }}
                  lineHeight={{ base: "1.08", md: "0.98" }}
                >
                  {property?.name || property?.propertyAddress}
                </Heading>
                <Text
                  maxW="720px"
                  fontSize={{ base: "md", md: "lg" }}
                  color="whiteAlpha.800"
                  lineHeight="1.9"
                >
                  {property?.marketingDescription ||
                    property?.propertyDescription ||
                    t?.("publicListing.detailsTitle")}
                </Text>
                <HStack spacing={3} flexWrap="wrap">
                  <Button
                    as={RouterLink}
                    to="/offers"
                    borderRadius="full"
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                  >
                    {t?.("publicListing.backToCatalog")}
                  </Button>
                  <Button
                    variant="outline"
                    color="white"
                    borderRadius="full"
                    borderColor="rgba(227, 211, 184, 0.24)"
                    onClick={async () => {
                      await navigator.clipboard.writeText(window.location.href);
                      toast({ title: t?.("publicListing.copied"), status: "success" });
                    }}
                  >
                    {t?.("publicListing.shareOffer")}
                  </Button>
                </HStack>
              </Stack>
            </GridItem>

            <GridItem>
              <Box
                borderRadius="34px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                bg="rgba(7,12,20,0.42)"
                border="1px solid rgba(227, 211, 184, 0.14)"
                backdropFilter="blur(14px)"
              >
                <Stack spacing={5}>
                  <Text
                    color="#f5d076"
                    fontSize="xs"
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                  >
                    {t?.("publicListing.detailsTitle")}
                  </Text>
                  <Heading size="xl">
                    {formatPrice(property?.listingPrice, t)}
                    {property?.dealType === "rent" ? (
                      <Text as="span" fontSize="lg" color="whiteAlpha.700" fontWeight="600">
                        {t?.("publicListing.perMonth") || "/мес"}
                      </Text>
                    ) : null}
                  </Heading>
                  <SimpleGrid columns={3} spacing={3}>
                    <Box
                      px={4}
                      py={4}
                      borderRadius="22px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(227, 211, 184, 0.12)"
                    >
                      <Text
                        color="whiteAlpha.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.12em"
                      >
                        {t?.("publicListing.photosCount", { count: photoCount })}
                      </Text>
                      <Text mt={2} fontWeight="700">
                        {photoCount}
                      </Text>
                    </Box>
                    <Box
                      px={4}
                      py={4}
                      borderRadius="22px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(227, 211, 184, 0.12)"
                    >
                      <Text
                        color="whiteAlpha.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.12em"
                      >
                        {t?.("publicListing.docsCount", { count: documentCount })}
                      </Text>
                      <Text mt={2} fontWeight="700">
                        {documentCount}
                      </Text>
                    </Box>
                    <Box
                      px={4}
                      py={4}
                      borderRadius="22px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(227, 211, 184, 0.12)"
                    >
                      <Text
                        color="whiteAlpha.600"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.12em"
                      >
                        {t?.("publicListing.plansCount", { count: floorPlanCount })}
                      </Text>
                      <Text mt={2} fontWeight="700">
                        {floorPlanCount}
                      </Text>
                    </Box>
                  </SimpleGrid>
                  <HStack color="whiteAlpha.760" align="start">
                    <Icon as={MdOutlineLocationOn} mt={1} />
                    <Text>{property?.propertyAddress || t?.("publicListing.notSpecified")}</Text>
                  </HStack>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

      <Container maxW="8xl" py={{ base: 6, md: 10 }}>
        <SeoMeta
          title={property?.seo?.title || property?.name || property?.propertyAddress}
          description={
            property?.seo?.description ||
            property?.marketingDescription ||
            property?.propertyDescription
          }
          keywords={property?.seo?.keywords || property?.propertyType || "real estate"}
          canonicalPath={
            property?.publicSlugResolved
              ? `/offers/slug/${property.publicSlugResolved}`
              : `/offers/${id}`
          }
          image={currentImage}
        />
        <Stack spacing={8}>
          <HStack justify="space-between" align="center" flexWrap="wrap">
            <Button as={RouterLink} to="/offers" variant="outline" borderRadius="full">
              {t?.("publicListing.backToCatalog")}
            </Button>
            <HStack spacing={3} flexWrap="wrap">
              {/* Language Switcher */}
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant={i18n.language === "ru" ? "solid" : "outline"}
                  colorScheme="orange"
                  onClick={() => i18n.changeLanguage("ru")}
                >
                  RU
                </Button>
                <Button
                  size="sm"
                  variant={i18n.language === "en" ? "solid" : "outline"}
                  colorScheme="orange"
                  onClick={() => i18n.changeLanguage("en")}
                >
                  EN
                </Button>
              </HStack>
              <Button
                variant="outline"
                borderRadius="full"
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  toast({ title: t?.("publicListing.copied"), status: "success" });
                }}
              >
                {t?.("publicListing.shareOffer")}
              </Button>
              <IconButton
                aria-label={
                  isFavorite
                    ? t?.("publicListing.removeFromFavorites")
                    : t?.("publicListing.addToFavorites")
                }
                icon={isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
                bg={isFavorite ? publicBrand.gradients.brass : "white"}
                color={isFavorite ? publicBrand.colors.ink : publicBrand.colors.ink}
                border="1px solid rgba(9,18,32,0.08)"
                onClick={handleFavoriteToggle}
              />
              <Button
                leftIcon={<MdCompareArrows />}
                variant={isInCompare ? "solid" : "outline"}
                bg={isInCompare ? publicBrand.gradients.brass : "transparent"}
                color={isInCompare ? publicBrand.colors.ink : publicBrand.colors.ink}
                borderColor="rgba(9,18,32,0.12)"
                borderRadius="full"
                onClick={handleCompareToggle}
              >
                {isInCompare
                  ? t?.("publicListing.removeFromCompare")
                  : t?.("publicListing.addToCompare")}
              </Button>
              <Button
                as={RouterLink}
                to="/auth/sign-in"
                borderRadius="full"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
              >
                {t?.("publicListing.loginCta")}
              </Button>
            </HStack>
          </HStack>

          <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={6}>
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="34px"
                overflow="hidden"
                boxShadow={cardShadow}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Box position="relative">
                  <Image
                    src={currentImage}
                    alt={property?.name || property?.propertyAddress}
                    h={{ base: "320px", xl: "560px" }}
                    w="100%"
                    objectFit="cover"
                  />
                  <Badge
                    position="absolute"
                    top={5}
                    left={5}
                    bg="rgba(245,208,118,0.14)"
                    color="#f5d076"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                  >
                    {normalizeStatus(property?.listingStatus, t)}
                  </Badge>
                </Box>
                {gallery.length > 1 && (
                  <SimpleGrid columns={{ base: 3, md: 6 }} gap={3} p={4}>
                    {gallery.map((image, index) => (
                      <Image
                        key={`${image}-${index}`}
                        src={image}
                        alt={`preview-${index}`}
                        h="80px"
                        w="100%"
                        objectFit="cover"
                        borderRadius="16px"
                        cursor="pointer"
                        border={
                          activeImage === index ? "2px solid #2f855a" : "2px solid transparent"
                        }
                        onClick={() => setActiveImage(index)}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Stack spacing={6}>
                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Badge w="fit-content" colorScheme="blackAlpha">
                      {t?.("publicListing.detailsTitle")}
                    </Badge>
                    <Heading size="xl">{property?.name || property?.propertyAddress}</Heading>
                    <HStack color={mutedColor} align="start">
                      <Icon as={MdOutlineLocationOn} mt={1} />
                      <Text>{property?.propertyAddress || t?.("publicListing.notSpecified")}</Text>
                    </HStack>
                    <Heading size="2xl" color="orange.500">
                      {formatPrice(property?.listingPrice, t)}
                    </Heading>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.status")}
                        </Text>
                        <Text fontWeight="700">{normalizeStatus(property?.listingStatus, t)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.propertyType")}
                        </Text>
                        <Text fontWeight="700">
                          {property?.propertyType || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.yearBuilt")}
                        </Text>
                        <Text fontWeight="700">
                          {property?.yearBuilt || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.updatedAt")}
                        </Text>
                        <Text fontWeight="700">
                          {formatDate(
                            property?.updatedDate || property?.updatedAt || property?.createdDate
                          ) || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.listingDate")}
                        </Text>
                        <Text fontWeight="700">
                          {formatDate(property?.listingDate) || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.squareFootage")}
                        </Text>
                        <Text fontWeight="700">
                          {property?.squareFootage || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.lotSize")}
                        </Text>
                        <Text fontWeight="700">
                          {property?.lotSize || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.parkingAvailability")}
                        </Text>
                        <Text fontWeight="700">
                          {property?.parkingAvailability || t?.("publicListing.notSpecified")}
                        </Text>
                      </Box>
                    </SimpleGrid>
                    <SimpleGrid columns={3} gap={3}>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>
                            {t?.("publicListing.photosCount", { count: photoCount })}
                          </StatLabel>
                          <StatNumber>{photoCount}</StatNumber>
                        </Stat>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>
                            {t?.("publicListing.docsCount", { count: documentCount })}
                          </StatLabel>
                          <StatNumber>{documentCount}</StatNumber>
                        </Stat>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>
                            {t?.("publicListing.plansCount", { count: floorPlanCount })}
                          </StatLabel>
                          <StatNumber>{floorPlanCount}</StatNumber>
                        </Stat>
                      </Box>
                    </SimpleGrid>
                    <Button as={RouterLink} to="/auth/sign-in" colorScheme="orange">
                      {t?.("publicListing.bookCta")}
                    </Button>
                  </Stack>
                </Box>

                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.verificationTitle")}</Heading>
                    <Badge
                      w="fit-content"
                      colorScheme={
                        verification.status === "verified"
                          ? "green"
                          : verification.status === "review"
                            ? "orange"
                            : "gray"
                      }
                    >
                      {verification.status === "verified"
                        ? t?.("publicListing.verificationVerified")
                        : verification.status === "review"
                          ? t?.("publicListing.verificationReview")
                          : t?.("publicListing.verificationPending")}
                    </Badge>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                      {(verification.checklist || []).map((item, index) => (
                        <Box key={`${item}-${index}`} bg={subtleBg} borderRadius="18px" p={3}>
                          <Text>{verificationLabels[item] || item}</Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Box>

                <LeadCaptureCard property={property} agent={property?.agent} />

                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <HStack>
                      <Icon as={LuUser} boxSize={6} />
                      <Heading size="md">{t?.("publicListing.propertyConsultant")}</Heading>
                    </HStack>
                    <HStack color="orange.500">
                      <Icon as={LuClock} />
                      <Text fontSize="sm" fontWeight="600">
                        {t?.("publicListing.respondsInMinutes")}
                      </Text>
                    </HStack>
                    {property?.agent ? (
                      <>
                        <Text fontWeight="600">
                          {property.agent.fullName ||
                            property.agent.name ||
                            property.agent.label ||
                            t?.("publicListing.notSpecified")}
                        </Text>
                        {(property.agent.phoneNumber || property.agent.phone) && (
                          <Button
                            as="a"
                            href={`tel:${property.agent.phoneNumber || property.agent.phone}`}
                            colorScheme="orange"
                            w="full"
                          >
                            {property.agent.phoneNumber || property.agent.phone}
                          </Button>
                        )}
                        {property.agent.email && (
                          <Button
                            as="a"
                            href={`mailto:${property.agent.email}`}
                            variant="outline"
                            w="full"
                          >
                            {property.agent.email}
                          </Button>
                        )}
                      </>
                    ) : (
                      <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>
                    )}
                  </Stack>
                </Box>

                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.propertyImages")}</Heading>
                    <SimpleGrid columns={{ base: 2, md: 3 }} gap={3}>
                      {property?.propertyPhotos?.map((photo, index) => (
                        <Box key={index} position="relative" borderRadius="16px" overflow="hidden">
                          <Image
                            src={photo?.img}
                            alt={photo?.title || `Photo ${index + 1}`}
                            w="100%"
                            h="150px"
                            objectFit="cover"
                            onError={(e) => {
                              e.target.src = placeholderImage;
                            }}
                          />
                          <Badge position="absolute" top={2} right={2} colorScheme="green">
                            {index === 0 ? t?.("publicListing.primaryImage") : `#${index + 1}`}
                          </Badge>
                        </Box>
                      ))}
                    </SimpleGrid>
                    {(!property?.propertyPhotos || property.propertyPhotos.length === 0) && (
                      <Text color={mutedColor}>{t?.("publicListing.noPhotos")}</Text>
                    )}
                  </Stack>
                </Box>

                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.mortgageTitle")}</Heading>
                    <Text color={mutedColor}>{t?.("publicListing.mortgageText")}</Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <FormControl>
                        <FormLabel>{t?.("publicListing.downPaymentPercent")}</FormLabel>
                        <Input
                          type="number"
                          value={downPaymentPercent}
                          onChange={(event) =>
                            setDownPaymentPercent(Number(event.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t?.("publicListing.termYears")}</FormLabel>
                        <Input
                          type="number"
                          value={termYears}
                          onChange={(event) => setTermYears(Number(event.target.value) || 0)}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t?.("publicListing.interestRate")}</FormLabel>
                        <Input
                          type="number"
                          value={interestRate}
                          onChange={(event) => setInterestRate(Number(event.target.value) || 0)}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.downPaymentAmount")}
                        </Text>
                        <Text fontWeight="700">{formatPrice(mortgage.downPaymentAmount, t)}</Text>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Text fontSize="sm" color={mutedColor}>
                          {t?.("publicListing.loanAmount")}
                        </Text>
                        <Text fontWeight="700">{formatPrice(mortgage.loanAmount, t)}</Text>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <HStack mb={2}>
                          <Icon as={MdOutlinePayments} />
                          <Text fontSize="sm" color={mutedColor}>
                            {t?.("publicListing.monthlyPayment")}
                          </Text>
                        </HStack>
                        <Text fontWeight="700">{formatPrice(mortgage.monthlyPayment, t)}</Text>
                      </Box>
                    </SimpleGrid>
                    <Text fontSize="sm" color={mutedColor}>
                      {t?.("publicListing.mortgageDisclaimer")}
                    </Text>
                  </Stack>
                </Box>

                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.featureHighlightsTitle")}</Heading>
                    {highlights.map((item) => (
                      <HStack
                        key={item.label}
                        justify="space-between"
                        bg={subtleBg}
                        borderRadius="20px"
                        p={4}
                      >
                        <HStack>
                          <Icon as={item.icon} />
                          <Text color={mutedColor}>{item.label}</Text>
                        </HStack>
                        <Text fontWeight="700" textAlign="right">
                          {item.value}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="32px"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Stack spacing={4}>
                  <Heading size="md">{t?.("publicListing.aboutTitle")}</Heading>
                  <Text color={mutedColor} whiteSpace="pre-wrap">
                    {property?.marketingDescription ||
                      property?.propertyDescription ||
                      t?.("publicListing.notSpecified")}
                  </Text>
                  <Box bg={subtleBg} borderRadius="24px" p={5}>
                    <HStack mb={3}>
                      <Icon as={LuWaves} />
                      <Text fontWeight="700">
                        {i18n?.language === "ru"
                          ? t?.("publicListing.lifestyleTitleTranslated") ||
                            t?.("publicListing.lifestyleTitle")
                          : t?.("publicListing.lifestyleTitle")}
                      </Text>
                    </HStack>
                    <Text color={mutedColor}>
                      {property?.communityAmenities || t?.("publicListing.notSpecified")}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="32px"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Stack spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{t?.("publicListing.featuresTitle")}</Heading>
                    {/* Кнопка редактирования для авторизованных */}
                    {localStorage.getItem("token") && (
                      <Button
                        as={RouterLink}
                        to={`/admin/properties`}
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<EditIcon />}
                      >
                        {t?.("common.edit")}
                      </Button>
                    )}
                  </Flex>
                  <SimpleGrid columns={2} gap={4}>
                    <HStack>
                      <Icon as={LuBedDouble} />
                      <Text>
                        {t?.("publicListing.bedrooms")}:{" "}
                        {property?.numberofBedrooms || t?.("publicListing.notSpecified")}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuBath} />
                      <Text>
                        {t?.("publicListing.bathrooms")}:{" "}
                        {property?.numberofBathrooms || t?.("publicListing.notSpecified")}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={MdOutlineSquareFoot} />
                      <Text>
                        {t?.("publicListing.area")}:{" "}
                        {property?.squareFootage || t?.("publicListing.notSpecified")}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuCalendarClock} />
                      <Text>
                        {t?.("publicListing.listingDate")}: {formatDate(property?.listingDate)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuCalendarClock} />
                      <Text>
                        {t?.("publicListing.updatedAt")}: {formatDate(property?.updatedDate)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={LuBuilding2} />
                      <Text>
                        {t?.("publicListing.propertyType")}:{" "}
                        {property?.propertyType || t?.("publicListing.notSpecified")}
                      </Text>
                    </HStack>
                  </SimpleGrid>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>
                        {t?.("publicListing.lotSize")}
                      </Text>
                      <Text mt={2}>{property?.lotSize || t?.("publicListing.notSpecified")}</Text>
                    </Box>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>
                        {t?.("publicListing.parkingAvailability")}
                      </Text>
                      <Text mt={2}>
                        {property?.parkingAvailability || t?.("publicListing.notSpecified")}
                      </Text>
                    </Box>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>
                        {t?.("publicListing.engineeringTitle")}
                      </Text>
                      <Text mt={2}>
                        {property?.heatingAndCoolingSystems || t?.("publicListing.notSpecified")}
                      </Text>
                    </Box>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>
                        {t?.("publicListing.finishTitle")}
                      </Text>
                      <Text mt={2}>
                        {property?.flooringType || t?.("publicListing.notSpecified")}
                      </Text>
                    </Box>
                  </SimpleGrid>
                  <Box bg={subtleBg} borderRadius="24px" p={4}>
                    <Text fontSize="sm" color={mutedColor}>
                      {t?.("publicListing.unitTypes")}
                    </Text>
                    <Text mt={2} whiteSpace="pre-wrap">
                      {unitTypes.length
                        ? unitTypes
                            .map((unit) => unit?.name || unit?.label || unit?.title)
                            .filter(Boolean)
                            .join(", ")
                        : property?.unitType || t?.("publicListing.notSpecified")}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
          <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="32px"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Stack spacing={4}>
                  <Heading size="md">{t?.("publicListing.amenitiesTitle")}</Heading>
                  {amenities.length ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                      {amenities.map((feature, index) => (
                        <HStack
                          key={`${feature}-${index}`}
                          bg={subtleBg}
                          borderRadius="18px"
                          p={3}
                          align="start"
                        >
                          <Icon as={LuSparkles} mt={1} />
                          <Text>{feature}</Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>
                  )}
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg={cardBg}
                borderRadius="32px"
                p={6}
                boxShadow="sm"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Stack spacing={4}>
                  <Heading size="md">{t?.("publicListing.unitTypesTitle")}</Heading>
                  {unitTypes.length ? (
                    <Stack spacing={3}>
                      {unitTypes.map((unit) => (
                        <Box
                          key={unit?._id || unit?.name}
                          borderWidth="1px"
                          borderRadius="20px"
                          borderColor={borderColor}
                          p={4}
                        >
                          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                            <Box>
                              <Text fontSize="sm" color={mutedColor}>
                                {t?.("publicListing.type")}
                              </Text>
                              <Text fontWeight="700">
                                {unit?.name || t?.("publicListing.notSpecified")}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color={mutedColor}>
                                {t?.("publicListing.area")}
                              </Text>
                              <Text fontWeight="700">
                                {unit?.sqm || t?.("publicListing.notSpecified")}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color={mutedColor}>
                                {t?.("publicListing.priceLabel")}
                              </Text>
                              <Text fontWeight="700">{formatPrice(unit?.price, t)}</Text>
                            </Box>
                          </SimpleGrid>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>
                  )}
                </Stack>
              </Box>
            </GridItem>
          </Grid>

          {(property?.floorPlans?.length > 0 || property?.propertyDocuments?.length > 0) && (
            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
              <GridItem>
                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.floorPlansTitle")}</Heading>
                    {property?.floorPlans?.length ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        {property.floorPlans.map((item, index) => (
                          <Image
                            key={index}
                            src={item?.img}
                            alt={`floor-${index}`}
                            borderRadius="20px"
                            h="180px"
                            objectFit="cover"
                          />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>
                    )}
                  </Stack>
                </Box>
              </GridItem>
              <GridItem>
                <Box
                  bg={cardBg}
                  borderRadius="32px"
                  p={6}
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Stack spacing={4}>
                    <Heading size="md">{t?.("publicListing.documentsTitle")}</Heading>
                    {property?.propertyDocuments?.length ? (
                      <Stack spacing={3}>
                        {property.propertyDocuments.map((doc, index) => (
                          <Link
                            key={doc?.img || index}
                            href={doc?.img || "#"}
                            isExternal
                            color="orange.500"
                            fontWeight="600"
                          >
                            <HStack>
                              <Icon as={LuExternalLink} />
                              <Text>{doc?.filename || `Document ${index + 1}`}</Text>
                            </HStack>
                          </Link>
                        ))}
                      </Stack>
                    ) : (
                      <Text color={mutedColor}>{t?.("publicListing.notSpecified")}</Text>
                    )}
                  </Stack>
                </Box>
              </GridItem>
            </Grid>
          )}

          {similarProperties.length > 0 && (
            <Box
              bg={cardBg}
              borderRadius="32px"
              p={6}
              boxShadow="sm"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stack spacing={5}>
                <HStack>
                  <Icon as={LuTrees} />
                  <Heading size="md">{t?.("publicListing.similarOffersTitle")}</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                  {similarProperties.map((item) => (
                    <Box key={item?._id} bg={subtleBg} borderRadius="24px" overflow="hidden">
                      <Image
                        src={getPrimaryImage(item)}
                        alt={item?.name || item?.propertyAddress}
                        h="200px"
                        w="100%"
                        objectFit="cover"
                      />
                      <Stack p={4} spacing={3}>
                        <Heading size="sm">{item?.name || item?.propertyAddress}</Heading>
                        <Text color={mutedColor} noOfLines={2}>
                          {item?.marketingDescription || item?.propertyDescription}
                        </Text>
                        <Button
                          as={RouterLink}
                          to={`/offers/${item?._id}`}
                          size="sm"
                          colorScheme="orange"
                          variant="outline"
                          whiteSpace="normal"
                          lineHeight="1.25"
                          h="auto"
                          minH="36px"
                          py={2}
                          w="100%"
                        >
                          {t?.("publicListing.viewOffer")}
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
      <ModernFooter />
    </Box>
  );
}
