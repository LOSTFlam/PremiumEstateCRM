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
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LuBath,
  LuBedDouble,
  LuCalendarClock,
  LuExternalLink,
  LuHome,
  LuMap,
  LuSparkles,
  LuTrees,
  LuWaves,
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
import { getApi } from "services/api";
import {
  estimateMortgage,
  formatDate,
  formatPrice,
  getCatalogDataset,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  getPrimaryImage,
  getPropertyById,
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
import LeadCaptureCard from "./LeadCaptureCard";
import SeoMeta from "./SeoMeta";

const splitFeatures = (...values) =>
  values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/,|\n|;/))
    .map((item) => item.trim())
    .filter(Boolean);

const buildHighlights = (property, t) => [
  {
    label: t("publicListing.type"),
    value: property?.propertyType || t("publicListing.notSpecified"),
    icon: LuHome,
  },
  {
    label: t("publicListing.area"),
    value: property?.squareFootage || t("publicListing.notSpecified"),
    icon: MdOutlineSquareFoot,
  },
  {
    label: t("publicListing.lotSize"),
    value: property?.lotSize || t("publicListing.notSpecified"),
    icon: LuMap,
  },
  {
    label: t("publicListing.updatedAtLabel"),
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

  const pageBg = useColorModeValue("#f3ecdf", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleBg = useColorModeValue("#f8f2e7", "whiteAlpha.100");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("rgba(16,45,36,0.08)", "whiteAlpha.200");

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);

      try {
        const listResponse = await getApi("api/property/public");
        const catalog = getCatalogDataset(Array.isArray(listResponse?.data) ? listResponse.data : []);
        setAllProperties(catalog);

        const localProperty = getPropertyById(catalog, id);
        if (localProperty) {
          setProperty(localProperty);
          return;
        }

        const response = await getApi("api/property/public/", id);
        setProperty(response?.data?.property || null);
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
        property?.exteriorFeatures,
      ),
    [property],
  );

  const highlights = useMemo(() => buildHighlights(property, t), [property, t]);
  const similarProperties = useMemo(
    () =>
      allProperties
        .filter((item) => item?._id !== property?._id)
        .filter((item) => item?.propertyType === property?.propertyType)
        .slice(0, 3),
    [allProperties, property],
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
    [downPaymentPercent, interestRate, property?.listingPrice, termYears],
  );

  const isFavorite = favoriteIds.includes(property?._id);
  const isInCompare = compareIds.includes(property?._id);
  const verification = property?.verification || { status: "pending", checklist: [] };
  const verificationLabels = {
    address: t("publicListing.verificationAddress"),
    price: t("publicListing.verificationPrice"),
    description: t("publicListing.verificationDescription"),
    photos: t("publicListing.verificationPhotos"),
    documents: t("publicListing.verificationDocuments"),
    agent: t("publicListing.verificationAgent"),
  };

  const handleFavoriteToggle = () => {
    if (!property?._id) return;
    const next = toggleFavoriteId(property._id);
    setFavoriteIds(next);
    toast({
      title: isFavorite ? t("publicListing.removeFromFavorites") : t("publicListing.addToFavorites"),
      status: "success",
    });
  };

  const handleCompareToggle = () => {
    if (!property?._id) return;
    const next = toggleCompareId(property._id);
    setCompareIds(next);
    toast({
      title: isInCompare ? t("publicListing.removeFromCompare") : t("publicListing.addToCompare"),
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
          <Box bg={cardBg} borderRadius="32px" p={10}>
            <Stack spacing={4}>
              <Heading>{t("publicListing.propertyNotFound")}</Heading>
              <Text color={mutedColor}>{t("publicListing.propertyNotFoundText")}</Text>
              <Button as={RouterLink} to="/offers" w="fit-content">
                {t("publicListing.backToCatalog")}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 6, md: 10 }}>
      <Container maxW="8xl">
        <SeoMeta
          title={property?.seo?.title || property?.name || property?.propertyAddress}
          description={property?.seo?.description || property?.marketingDescription || property?.propertyDescription}
          keywords={property?.seo?.keywords || property?.propertyType || "real estate"}
          canonicalPath={`/offers/${id}`}
          image={currentImage}
        />
        <Stack spacing={8}>
          <HStack justify="space-between" align="center" flexWrap="wrap">
            <Button as={RouterLink} to="/offers" variant="outline">
              {t("publicListing.backToCatalog")}
            </Button>
            <HStack spacing={3} flexWrap="wrap">
              <Button
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(window.location.href);
                  toast({ title: t("publicListing.copied"), status: "success" });
                }}
              >
                {t("publicListing.shareOffer")}
              </Button>
              <IconButton
                aria-label={isFavorite ? t("publicListing.removeFromFavorites") : t("publicListing.addToFavorites")}
                icon={isFavorite ? <MdFavorite /> : <MdFavoriteBorder />}
                colorScheme={isFavorite ? "red" : "gray"}
                variant={isFavorite ? "solid" : "outline"}
                onClick={handleFavoriteToggle}
              />
              <Button
                leftIcon={<MdCompareArrows />}
                variant={isInCompare ? "solid" : "outline"}
                colorScheme="green"
                onClick={handleCompareToggle}
              >
                {isInCompare ? t("publicListing.removeFromCompare") : t("publicListing.addToCompare")}
              </Button>
              <Button as={RouterLink} to="/auth/sign-in" colorScheme="green">
                {t("publicListing.loginCta")}
              </Button>
            </HStack>
          </HStack>

          <Grid templateColumns={{ base: "1fr", xl: "1.2fr 0.8fr" }} gap={6}>
            <GridItem>
              <Box bg={cardBg} borderRadius="32px" overflow="hidden" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <Box position="relative">
                  <Image
                    src={currentImage}
                    alt={property?.name || property?.propertyAddress}
                    h={{ base: "320px", xl: "560px" }}
                    w="100%"
                    objectFit="cover"
                  />
                  <Badge position="absolute" top={5} left={5} colorScheme="green" px={3} py={1.5} borderRadius="full">
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
                        border={activeImage === index ? "2px solid #2f855a" : "2px solid transparent"}
                        onClick={() => setActiveImage(index)}
                      />
                    ))}
                  </SimpleGrid>
                )}
              </Box>
            </GridItem>

            <GridItem>
              <Stack spacing={6}>
                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Badge w="fit-content" colorScheme="blackAlpha">
                      {t("publicListing.detailsTitle")}
                    </Badge>
                    <Heading size="xl">{property?.name || property?.propertyAddress}</Heading>
                    <HStack color={mutedColor} align="start">
                      <Icon as={MdOutlineLocationOn} mt={1} />
                      <Text>{property?.propertyAddress || t("publicListing.notSpecified")}</Text>
                    </HStack>
                    <Heading size="2xl" color="green.600">
                      {formatPrice(property?.listingPrice, t)}
                    </Heading>
                    <SimpleGrid columns={2} gap={4}>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.status")}</Text>
                        <Text fontWeight="700">{normalizeStatus(property?.listingStatus, t)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.yearBuilt")}</Text>
                        <Text fontWeight="700">{property?.yearBuilt || t("publicListing.notSpecified")}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.bedrooms")}</Text>
                        <Text fontWeight="700">{property?.numberofBedrooms || t("publicListing.notSpecified")}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.bathrooms")}</Text>
                        <Text fontWeight="700">{property?.numberofBathrooms || t("publicListing.notSpecified")}</Text>
                      </Box>
                    </SimpleGrid>
                    <SimpleGrid columns={3} gap={3}>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>{t("publicListing.photosCount", { count: photoCount })}</StatLabel>
                          <StatNumber>{photoCount}</StatNumber>
                        </Stat>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>{t("publicListing.docsCount", { count: documentCount })}</StatLabel>
                          <StatNumber>{documentCount}</StatNumber>
                        </Stat>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Stat>
                          <StatLabel>{t("publicListing.plansCount", { count: floorPlanCount })}</StatLabel>
                          <StatNumber>{floorPlanCount}</StatNumber>
                        </Stat>
                      </Box>
                    </SimpleGrid>
                    <Button as={RouterLink} to="/auth/sign-in" colorScheme="green">
                      {t("publicListing.bookCta")}
                    </Button>
                  </Stack>
                </Box>

                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t("publicListing.verificationTitle")}</Heading>
                    <Badge w="fit-content" colorScheme={verification.status === "verified" ? "green" : verification.status === "review" ? "orange" : "gray"}>
                      {verification.status === "verified"
                        ? t("publicListing.verificationVerified")
                        : verification.status === "review"
                          ? t("publicListing.verificationReview")
                          : t("publicListing.verificationPending")}
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

                <LeadCaptureCard
                  property={property}
                  agent={property?.agent}
                />

                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t("publicListing.mortgageTitle")}</Heading>
                    <Text color={mutedColor}>{t("publicListing.mortgageText")}</Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <FormControl>
                        <FormLabel>{t("publicListing.downPaymentPercent")}</FormLabel>
                        <Input type="number" value={downPaymentPercent} onChange={(event) => setDownPaymentPercent(Number(event.target.value) || 0)} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t("publicListing.termYears")}</FormLabel>
                        <Input type="number" value={termYears} onChange={(event) => setTermYears(Number(event.target.value) || 0)} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>{t("publicListing.interestRate")}</FormLabel>
                        <Input type="number" value={interestRate} onChange={(event) => setInterestRate(Number(event.target.value) || 0)} />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.downPaymentAmount")}</Text>
                        <Text fontWeight="700">{formatPrice(mortgage.downPaymentAmount, t)}</Text>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <Text fontSize="sm" color={mutedColor}>{t("publicListing.loanAmount")}</Text>
                        <Text fontWeight="700">{formatPrice(mortgage.loanAmount, t)}</Text>
                      </Box>
                      <Box bg={subtleBg} borderRadius="20px" p={4}>
                        <HStack mb={2}>
                          <Icon as={MdOutlinePayments} />
                          <Text fontSize="sm" color={mutedColor}>{t("publicListing.monthlyPayment")}</Text>
                        </HStack>
                        <Text fontWeight="700">{formatPrice(mortgage.monthlyPayment, t)}</Text>
                      </Box>
                    </SimpleGrid>
                    <Text fontSize="sm" color={mutedColor}>{t("publicListing.mortgageDisclaimer")}</Text>
                  </Stack>
                </Box>

                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t("publicListing.featureHighlightsTitle")}</Heading>
                    {highlights.map((item) => (
                      <HStack key={item.label} justify="space-between" bg={subtleBg} borderRadius="20px" p={4}>
                        <HStack>
                          <Icon as={item.icon} />
                          <Text color={mutedColor}>{item.label}</Text>
                        </HStack>
                        <Text fontWeight="700" textAlign="right">{item.value}</Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <Stack spacing={4}>
                  <Heading size="md">{t("publicListing.aboutTitle")}</Heading>
                  <Text color={mutedColor} whiteSpace="pre-wrap">
                    {property?.marketingDescription || property?.propertyDescription || t("publicListing.notSpecified")}
                  </Text>
                  <Box bg={subtleBg} borderRadius="24px" p={5}>
                    <HStack mb={3}>
                      <Icon as={LuWaves} />
                      <Text fontWeight="700">{t("publicListing.lifestyleTitle")}</Text>
                    </HStack>
                    <Text color={mutedColor}>{property?.communityAmenities || t("publicListing.notSpecified")}</Text>
                  </Box>
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <Stack spacing={4}>
                  <Heading size="md">{t("publicListing.featuresTitle")}</Heading>
                  <SimpleGrid columns={2} gap={4}>
                    <HStack><Icon as={LuBedDouble} /><Text>{t("publicListing.bedrooms")}: {property?.numberofBedrooms || t("publicListing.notSpecified")}</Text></HStack>
                    <HStack><Icon as={LuBath} /><Text>{t("publicListing.bathrooms")}: {property?.numberofBathrooms || t("publicListing.notSpecified")}</Text></HStack>
                    <HStack><Icon as={MdOutlineSquareFoot} /><Text>{t("publicListing.area")}: {property?.squareFootage || t("publicListing.notSpecified")}</Text></HStack>
                    <HStack><Icon as={LuCalendarClock} /><Text>{t("publicListing.listingDate")}: {formatDate(property?.listingDate)}</Text></HStack>
                  </SimpleGrid>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>{t("publicListing.engineeringTitle")}</Text>
                      <Text mt={2}>{property?.heatingAndCoolingSystems || t("publicListing.notSpecified")}</Text>
                    </Box>
                    <Box bg={subtleBg} borderRadius="24px" p={4}>
                      <Text fontSize="sm" color={mutedColor}>{t("publicListing.finishTitle")}</Text>
                      <Text mt={2}>{property?.flooringType || t("publicListing.notSpecified")}</Text>
                    </Box>
                  </SimpleGrid>
                </Stack>
              </Box>
            </GridItem>
          </Grid>
          <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <Stack spacing={4}>
                  <Heading size="md">{t("publicListing.amenitiesTitle")}</Heading>
                  {amenities.length ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
                      {amenities.map((feature, index) => (
                        <HStack key={`${feature}-${index}`} bg={subtleBg} borderRadius="18px" p={3} align="start">
                          <Icon as={LuSparkles} mt={1} />
                          <Text>{feature}</Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text color={mutedColor}>{t("publicListing.notSpecified")}</Text>
                  )}
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                <Stack spacing={4}>
                  <Heading size="md">{t("publicListing.unitTypesTitle")}</Heading>
                  {property?.unitType?.length ? (
                    <Stack spacing={3}>
                      {property.unitType.map((unit) => (
                        <Box key={unit?._id || unit?.name} borderWidth="1px" borderRadius="20px" borderColor={borderColor} p={4}>
                          <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                            <Box><Text fontSize="sm" color={mutedColor}>{t("publicListing.type")}</Text><Text fontWeight="700">{unit?.name || t("publicListing.notSpecified")}</Text></Box>
                            <Box><Text fontSize="sm" color={mutedColor}>{t("publicListing.area")}</Text><Text fontWeight="700">{unit?.sqm || t("publicListing.notSpecified")}</Text></Box>
                            <Box><Text fontSize="sm" color={mutedColor}>{t("publicListing.priceLabel")}</Text><Text fontWeight="700">{formatPrice(unit?.price, t)}</Text></Box>
                          </SimpleGrid>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Text color={mutedColor}>{t("publicListing.notSpecified")}</Text>
                  )}
                </Stack>
              </Box>
            </GridItem>
          </Grid>

          {(property?.floorPlans?.length > 0 || property?.propertyDocuments?.length > 0) && (
            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t("publicListing.floorPlansTitle")}</Heading>
                    {property?.floorPlans?.length ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        {property.floorPlans.map((item, index) => (
                          <Image key={index} src={item?.img} alt={`floor-${index}`} borderRadius="20px" h="180px" objectFit="cover" />
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Text color={mutedColor}>{t("publicListing.notSpecified")}</Text>
                    )}
                  </Stack>
                </Box>
              </GridItem>
              <GridItem>
                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">{t("publicListing.documentsTitle")}</Heading>
                    {property?.propertyDocuments?.length ? (
                      <Stack spacing={3}>
                        {property.propertyDocuments.map((doc, index) => (
                          <Link key={doc?.img || index} href={doc?.img || "#"} isExternal color="green.600" fontWeight="600">
                            <HStack>
                              <Icon as={LuExternalLink} />
                              <Text>{doc?.filename || `Document ${index + 1}`}</Text>
                            </HStack>
                          </Link>
                        ))}
                      </Stack>
                    ) : (
                      <Text color={mutedColor}>{t("publicListing.notSpecified")}</Text>
                    )}
                  </Stack>
                </Box>
              </GridItem>
            </Grid>
          )}

          {similarProperties.length > 0 && (
            <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <Stack spacing={5}>
                <HStack>
                  <Icon as={LuTrees} />
                  <Heading size="md">{t("publicListing.similarOffersTitle")}</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
                  {similarProperties.map((item) => (
                    <Box key={item?._id} bg={subtleBg} borderRadius="24px" overflow="hidden">
                      <Image src={getPrimaryImage(item)} alt={item?.name || item?.propertyAddress} h="200px" w="100%" objectFit="cover" />
                      <Stack p={4} spacing={3}>
                        <Heading size="sm">{item?.name || item?.propertyAddress}</Heading>
                        <Text color={mutedColor} noOfLines={2}>{item?.marketingDescription || item?.propertyDescription}</Text>
                        <Button as={RouterLink} to={`/offers/${item?._id}`} size="sm" colorScheme="green" variant="outline">
                          {t("publicListing.viewOffer")}
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
    </Box>
  );
}

