import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import { Link as RouterLink, useParams } from "react-router-dom";
import { getApi } from "services/api";
import { formatPrice, getCatalogDataset, getPrimaryImage } from "./catalogData";
import LeadCaptureCard from "./LeadCaptureCard";
import SeoMeta from "./SeoMeta";
import { getSeoCollectionConfig } from "./seoCollections";

export default function SeoCollectionPage() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageBg = useColorModeValue("#f3ecdf", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("rgba(16,45,36,0.08)", "whiteAlpha.200");
  const heroBg = useColorModeValue(
    "linear-gradient(135deg, #102d24 0%, #1d4d42 45%, #be935f 100%)",
    "linear-gradient(135deg, #10241d 0%, #22443b 45%, #6f8f7b 100%)",
  );

  const config = useMemo(() => getSeoCollectionConfig(slug, i18n.language), [i18n.language, slug]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getApi("api/property/public");
        setProperties(getCatalogDataset(Array.isArray(response?.data) ? response.data : []));
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filtered = useMemo(() => {
    if (!config) return [];
    return properties.filter((property) => config.filter(property));
  }, [config, properties]);

  const featuredProperty = filtered[0] || null;

  if (!config) {
    return (
      <Box minH="100vh" bg={pageBg} py={10}>
        <Container maxW="6xl">
          <Stack spacing={4}>
            <Heading>{t("publicListing.propertyNotFound")}</Heading>
            <Button as={RouterLink} to="/offers">{t("publicListing.backToCatalog")}</Button>
          </Stack>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={pageBg} py={10}>
        <Container maxW="8xl"><Skeleton h="560px" borderRadius="32px" /></Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={pageBg} py={{ base: 6, md: 10 }}>
      <SeoMeta
        title={config.title}
        description={config.description}
        keywords={[config.title, config.badge, slug].join(", ")}
        canonicalPath={`/collections/${slug}`}
        image={featuredProperty ? getPrimaryImage(featuredProperty) : ""}
      />
      <Container maxW="8xl">
        <Stack spacing={8}>
          <Box borderRadius="36px" bg={heroBg} color="white" p={{ base: 6, md: 10 }} boxShadow="0 28px 80px rgba(15,47,36,0.22)">
            <Grid templateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={8} alignItems="center">
              <GridItem>
                <Stack spacing={5}>
                  <Badge w="fit-content" px={4} py={1.5} borderRadius="full" bg="whiteAlpha.250">{config.badge}</Badge>
                  <Heading size="2xl">{config.title}</Heading>
                  <Text color="whiteAlpha.900" fontSize={{ base: "md", md: "lg" }}>{config.description}</Text>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={3}>
                    {config.heroPoints.map((point) => (
                      <Box key={point} bg="whiteAlpha.180" borderRadius="22px" p={4}>{point}</Box>
                    ))}
                  </SimpleGrid>
                  <Button as={RouterLink} to="/offers" w="fit-content" variant="outline" borderColor="whiteAlpha.500">
                    {t("publicListing.backToCatalog")}
                  </Button>
                </Stack>
              </GridItem>
              <GridItem>
                {featuredProperty ? (
                  <Box bg="whiteAlpha.140" borderRadius="32px" overflow="hidden">
                    <Image src={getPrimaryImage(featuredProperty)} alt={featuredProperty?.name || featuredProperty?.propertyAddress} h={{ base: "260px", md: "420px" }} w="100%" objectFit="cover" />
                    <Stack p={5} spacing={3}>
                      <Heading size="md">{featuredProperty?.name || featuredProperty?.propertyAddress}</Heading>
                      <Text color="whiteAlpha.800">{featuredProperty?.propertyAddress || t("publicListing.notSpecified")}</Text>
                      <Heading size="md">{formatPrice(featuredProperty?.listingPrice, t)}</Heading>
                    </Stack>
                  </Box>
                ) : (
                  <Box bg="whiteAlpha.120" borderRadius="32px" p={8}><Text>{t("publicListing.noResults")}</Text></Box>
                )}
              </GridItem>
            </Grid>
          </Box>

          <Grid templateColumns={{ base: "1fr", xl: "1.3fr 0.7fr" }} gap={6}>
            <GridItem>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
                {filtered.map((property) => (
                  <Box key={property?._id} bg={cardBg} borderRadius="28px" overflow="hidden" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                    <Image src={getPrimaryImage(property)} alt={property?.name || property?.propertyAddress} h="230px" w="100%" objectFit="cover" />
                    <Stack p={5} spacing={3}>
                      <Heading size="md" noOfLines={2}>{property?.name || property?.propertyAddress}</Heading>
                      <Text color={mutedColor} noOfLines={2}>{property?.marketingDescription || property?.propertyDescription || t("publicListing.notSpecified")}</Text>
                      <Heading size="md" color="green.600">{formatPrice(property?.listingPrice, t)}</Heading>
                      <Button as={RouterLink} to={`/offers/${property?._id}`} colorScheme="green" rightIcon={<MdArrowForward />}>
                        {t("publicListing.viewOffer")}
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>
            <GridItem>
              <Stack spacing={6}>
                {featuredProperty && (
                  <LeadCaptureCard
                    property={featuredProperty}
                    agent={featuredProperty?.agent}
                    collectionSlug={slug}
                    title={t("publicListing.collectionLeadTitle")}
                    subtitle={t("publicListing.collectionLeadText")}
                  />
                )}
                <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
                  <Stack spacing={4}>
                    <Heading size="md">FAQ</Heading>
                    {config.faq.map((item) => (
                      <Box key={item.q}>
                        <Text fontWeight="700">{item.q}</Text>
                        <Text mt={2} color={mutedColor}>{item.a}</Text>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
