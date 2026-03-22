import { Box, Button, Container, Grid, Heading, HStack, IconButton, Image, SimpleGrid, Skeleton, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowForward, MdClose, MdCompareArrows } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { getApi } from "services/api";
import { formatPrice, getCatalogDataset, getDocumentCount, getFloorPlanCount, getPhotoCount, getPrimaryImage, normalizeStatus } from "./catalogData";
import { clearCompareIds, getCompareIds, toggleCompareId } from "./catalogStorage";

export default function PublicCompareView() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageBg = useColorModeValue("#f3ecdf", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("rgba(16,45,36,0.08)", "whiteAlpha.200");

  useEffect(() => {
    setCompareIds(getCompareIds());
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const response = await getApi("api/property/public");
      setProperties(getCatalogDataset(Array.isArray(response?.data) ? response.data : []));
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const compareProperties = useMemo(
    () => compareIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean),
    [compareIds, properties],
  );

  const rows = useMemo(
    () => [
      { label: t("publicListing.priceLabel"), render: (property) => formatPrice(property?.listingPrice, t) },
      { label: t("publicListing.status"), render: (property) => normalizeStatus(property?.listingStatus, t) },
      { label: t("publicListing.type"), render: (property) => property?.propertyType || t("publicListing.notSpecified") },
      { label: t("publicListing.area"), render: (property) => property?.squareFootage || t("publicListing.notSpecified") },
      { label: t("publicListing.bedrooms"), render: (property) => property?.numberofBedrooms || t("publicListing.notSpecified") },
      { label: t("publicListing.bathrooms"), render: (property) => property?.numberofBathrooms || t("publicListing.notSpecified") },
      { label: t("publicListing.lotSize"), render: (property) => property?.lotSize || t("publicListing.notSpecified") },
      { label: t("publicListing.parking"), render: (property) => property?.parkingAvailability || t("publicListing.notSpecified") },
      { label: t("publicListing.photosCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getPhotoCount(property)) },
      { label: t("publicListing.docsCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getDocumentCount(property)) },
      { label: t("publicListing.plansCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getFloorPlanCount(property)) },
      { label: t("publicListing.aboutTitle"), render: (property) => property?.marketingDescription || property?.propertyDescription || t("publicListing.notSpecified") },
    ],
    [t],
  );

  const removeFromCompare = (id) => {
    setCompareIds(toggleCompareId(id));
  };

  const clearCompare = () => {
    setCompareIds(clearCompareIds());
  };

  if (loading) {
    return (
      <Box minH="100vh" bg={pageBg} py={10}>
        <Container maxW="8xl"><Skeleton h="540px" borderRadius="32px" /></Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 6, md: 10 }}>
      <Container maxW="8xl">
        <Stack spacing={8}>
          <HStack justify="space-between" align="center" flexWrap="wrap">
            <Button as={RouterLink} to="/offers" variant="outline">{t("publicListing.backToCatalog")}</Button>
            <HStack spacing={3}>
              <Button onClick={clearCompare} variant="ghost" isDisabled={!compareIds.length}>{t("publicListing.clearCompare")}</Button>
              <Button as={RouterLink} to="/auth/sign-in" colorScheme="green">{t("publicListing.signIn")}</Button>
            </HStack>
          </HStack>

          <Box bg={cardBg} borderRadius="32px" p={{ base: 5, md: 7 }} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
            <Stack spacing={3}>
              <HStack>
                <MdCompareArrows />
                <Heading size="lg">{t("publicListing.comparePageTitle")}</Heading>
              </HStack>
              <Text color={mutedColor}>{t("publicListing.comparePageText")}</Text>
            </Stack>
          </Box>

          {compareProperties.length ? (
            <Stack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: compareProperties.length > 1 ? 2 : 1, xl: compareProperties.length }} gap={6}>
                {compareProperties.map((property) => (
                  <Box key={property?._id} bg={cardBg} borderRadius="28px" overflow="hidden" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                    <Box position="relative">
                      <Image src={getPrimaryImage(property)} alt={property?.name || property?.propertyAddress} h="220px" w="100%" objectFit="cover" />
                      <IconButton aria-label={t("publicListing.removeFromCompare")} icon={<MdClose />} position="absolute" top={4} right={4} size="sm" colorScheme="blackAlpha" onClick={() => removeFromCompare(property?._id)} />
                    </Box>
                    <Stack p={5} spacing={3}>
                      <Heading size="md">{property?.name || property?.propertyAddress}</Heading>
                      <Text color={mutedColor}>{property?.propertyAddress || t("publicListing.notSpecified")}</Text>
                      <Heading size="md" color="green.600">{formatPrice(property?.listingPrice, t)}</Heading>
                      <Button as={RouterLink} to={`/offers/${property?._id}`} colorScheme="green" rightIcon={<MdArrowForward />}>{t("publicListing.viewOffer")}</Button>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>

              <Grid templateColumns={`220px repeat(${compareProperties.length}, minmax(240px, 1fr))`} gap={3} overflowX="auto">
                <Box minW="220px"></Box>
                {compareProperties.map((property) => (
                  <Box key={property?._id} minW="240px" bg={cardBg} borderRadius="20px" p={4} borderWidth="1px" borderColor={borderColor}>
                    <Heading size="sm">{property?.name || property?.propertyAddress}</Heading>
                  </Box>
                ))}
                {rows.map((row) => (
                  <>
                    <Box key={`${row.label}-label`} minW="220px" bg={cardBg} borderRadius="20px" p={4} borderWidth="1px" borderColor={borderColor}>
                      <Text fontWeight="700">{row.label}</Text>
                    </Box>
                    {compareProperties.map((property) => (
                      <Box key={`${row.label}-${property?._id}`} minW="240px" bg={cardBg} borderRadius="20px" p={4} borderWidth="1px" borderColor={borderColor}>
                        <Text color={mutedColor} noOfLines={row.label === t("publicListing.aboutTitle") ? 4 : undefined}>{row.render(property)}</Text>
                      </Box>
                    ))}
                  </>
                ))}
              </Grid>
            </Stack>
          ) : (
            <Box bg={cardBg} borderRadius="32px" p={10} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <Stack spacing={4} align="start">
                <Heading>{t("publicListing.emptyCompareTitle")}</Heading>
                <Text color={mutedColor}>{t("publicListing.emptyCompareText")}</Text>
                <Button as={RouterLink} to="/offers" colorScheme="green">{t("publicListing.allOffers")}</Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

