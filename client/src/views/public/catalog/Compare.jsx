import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowForward, MdClose, MdCompareArrows } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import {
  formatPrice,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  getPrimaryImage,
  normalizeStatus,
} from "./catalogData";
import { clearCompareIds, getCompareIds, toggleCompareId } from "./catalogStorage";
import { fetchPublicCatalog } from "./catalogService";
import { publicBrand } from "../publicBrand";

export default function PublicCompareView() {
  const { t, i18n } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCompareIds(getCompareIds());
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const catalog = await fetchPublicCatalog();
      setProperties(catalog);
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
      { label: t?.("publicListing.priceLabel"), render: (property) => formatPrice(property?.listingPrice, t) },
      { label: t?.("publicListing.status"), render: (property) => normalizeStatus(property?.listingStatus, t) },
      { label: t?.("publicListing.type"), render: (property) => property?.propertyType || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.area"), render: (property) => property?.squareFootage || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.bedrooms"), render: (property) => property?.numberofBedrooms || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.bathrooms"), render: (property) => property?.numberofBathrooms || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.lotSize"), render: (property) => property?.lotSize || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.parking"), render: (property) => property?.parkingAvailability || t?.("publicListing.notSpecified") },
      { label: t?.("publicListing.photosCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getPhotoCount(property)) },
      { label: t?.("publicListing.docsCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getDocumentCount(property)) },
      { label: t?.("publicListing.plansCount", { count: 0 }).replace("0", "").trim(), render: (property) => String(getFloorPlanCount(property)) },
      { label: t?.("publicListing.aboutTitle"), render: (property) => property?.marketingDescription || property?.propertyDescription || t?.("publicListing.notSpecified") },
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
      <Box minH="100vh" bg={publicBrand.colors.paper} py={10}>
        <Container maxW="8xl">
          <Skeleton h="540px" borderRadius="34px" />
        </Container>
      </Box>
    );
  }

  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const emptyText = locale === "ru"
    ? "Добавьте до трех объектов в compare, чтобы увидеть цену, параметры и качество карточки бок о бок."
    : "Add up to three properties to compare price, features, and listing quality side by side.";

  return (
    <Box minH="100vh" bg={publicBrand.colors.paper} py={{ base: 6, md: 10 }}>
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
        <Container maxW="8xl" pt={{ base: 28, md: 32 }} pb={{ base: 12, md: 16 }} position="relative">
          <Stack spacing={4} maxW="760px">
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
              {t?.("publicListing.compareCount")}
            </Badge>
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} lineHeight={{ base: "1.08", md: "0.98" }}>
              {t?.("publicListing.comparePageTitle")}
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.800" lineHeight="1.9">
              {t?.("publicListing.comparePageText")}
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container maxW="8xl">
        <Stack spacing={8}>
          <HStack justify="space-between" align="center" flexWrap="wrap">
            <Button as={RouterLink} to="/offers" variant="outline" borderRadius="full">
              {t?.("publicListing.backToCatalog")}
            </Button>
            <HStack spacing={3} flexWrap="wrap">
              <Button onClick={clearCompare} variant="ghost" isDisabled={!compareIds.length}>
                {t?.("publicListing.clearCompare") || "Clear"}
              </Button>
              <Button
                as={RouterLink}
                to="/auth/sign-in"
                borderRadius="full"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
              >
                {t?.("publicListing.signIn")}
              </Button>
            </HStack>
          </HStack>

          {compareProperties.length ? (
            <Stack spacing={6}>
              <SimpleGrid
                columns={{ base: 1, md: compareProperties.length > 1 ? 2 : 1, xl: compareProperties.length }}
                gap={6}
              >
                {compareProperties.map((property) => (
                  <Box
                    key={property?._id}
                    bg="white"
                    borderRadius="32px"
                    overflow="hidden"
                    boxShadow={publicBrand.shadows.soft}
                    border="1px solid rgba(9,18,32,0.08)"
                  >
                    <Box position="relative">
                      <Image src={getPrimaryImage(property)} alt={property?.name || property?.propertyAddress} h="250px" w="100%" objectFit="cover" />
                      <Box
                        position="absolute"
                        inset="0"
                        bg="linear-gradient(180deg, rgba(7,12,20,0.04) 0%, rgba(7,12,20,0.26) 40%, rgba(7,12,20,0.72) 100%)"
                      />
                      <IconButton
                        aria-label={t?.("publicListing.removeFromCompare")}
                        icon={<MdClose />}
                        position="absolute"
                        top={4}
                        right={4}
                        size="sm"
                        bg="rgba(7,12,20,0.56)"
                        color="white"
                        border="1px solid rgba(227, 211, 184, 0.14)"
                        onClick={() => removeFromCompare(property?._id)}
                      />
                    </Box>
                    <Stack p={5} spacing={3}>
                      <Badge w="fit-content" bg="rgba(212,175,55,0.12)" color={publicBrand.colors.copper}>
                        {normalizeStatus(property?.listingStatus, t)}
                      </Badge>
                      <Heading size="md" color={publicBrand.colors.ink}>
                        {property?.name || property?.propertyAddress}
                      </Heading>
                      <Text color={publicBrand.colors.textSoft}>
                        {property?.propertyAddress || t?.("publicListing.notSpecified")}
                      </Text>
                      <Heading size="md" color={publicBrand.colors.copper}>
                        {formatPrice(property?.listingPrice, t)}
                      </Heading>
                      <Button
                        as={RouterLink}
                        to={property?.publicSlugResolved ? `/offers/slug/${property.publicSlugResolved}` : `/offers/${property?._id}`}
                        bg={publicBrand.colors.ink}
                        color="white"
                        rightIcon={<MdArrowForward />}
                        borderRadius="full"
                      >
                        {t?.("publicListing.viewOffer")}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>

              <Grid
                templateColumns={`220px repeat(${compareProperties.length}, minmax(250px, 1fr))`}
                gap={3}
                overflowX="auto"
              >
                <Box minW="220px"></Box>
                {compareProperties.map((property) => (
                  <Box
                    key={property?._id}
                    minW="250px"
                    bg={publicBrand.gradients.panel}
                    color="white"
                    borderRadius="24px"
                    p={4}
                    border="1px solid rgba(227, 211, 184, 0.14)"
                  >
                    <Heading size="sm">{property?.name || property?.propertyAddress}</Heading>
                  </Box>
                ))}
                {rows.map((row) => (
                  <Fragment key={row.label}>
                    <Box
                      minW="220px"
                      bg="rgba(212,175,55,0.10)"
                      borderRadius="22px"
                      p={4}
                      border="1px solid rgba(212,175,55,0.16)"
                    >
                      <Text fontWeight="700" color={publicBrand.colors.ink}>
                        {row.label}
                      </Text>
                    </Box>
                    {compareProperties.map((property) => (
                      <Box
                        key={`${row.label}-${property?._id}`}
                        minW="250px"
                        bg="white"
                        borderRadius="22px"
                        p={4}
                        border="1px solid rgba(9,18,32,0.08)"
                      >
                        <Text color={publicBrand.colors.textSoft} noOfLines={row.label === t?.("publicListing.aboutTitle") ? 4 : undefined}>
                          {row.render(property)}
                        </Text>
                      </Box>
                    ))}
                  </Fragment>
                ))}
              </Grid>
            </Stack>
          ) : (
            <Box
              bg="white"
              borderRadius="34px"
              p={{ base: 8, md: 10 }}
              boxShadow={publicBrand.shadows.soft}
              border="1px solid rgba(9,18,32,0.08)"
            >
              <Stack spacing={4} align="start">
                <Box
                  w="56px"
                  h="56px"
                  borderRadius="22px"
                  display="grid"
                  placeItems="center"
                  bg="rgba(212,175,55,0.12)"
                  color={publicBrand.colors.copper}
                >
                  <MdCompareArrows size={24} />
                </Box>
                <Heading color={publicBrand.colors.ink}>{t?.("publicListing.emptyCompareTitle")}</Heading>
                <Text color={publicBrand.colors.textSoft}>{emptyText}</Text>
                <Button as={RouterLink} to="/offers" bg={publicBrand.gradients.brass} color={publicBrand.colors.ink} borderRadius="full">
                  {t?.("publicListing.allOffers")}
                </Button>
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>

      <Box mt={{ base: 10, md: 14 }}>
        <ModernFooter />
      </Box>
    </Box>
  );
}
