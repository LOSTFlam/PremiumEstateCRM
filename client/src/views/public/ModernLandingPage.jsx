import { memo, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useMediaQuery,
  usePrefersReducedMotion,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiHeart, FiSearch } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";
import GradientOrbs from "components/GradientOrbs";
import ModernFeatures from "components/ModernFeatures";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import ModernHero from "components/ModernHero";
import ModernPropertyCard from "components/ModernPropertyCard";
import ParticleCanvas from "components/ParticleCanvas";
import PropertyBackground from "components/PropertyBackground";
import ThreeBackground from "components/ThreeBackground";
import PremiumEtherealBackground from "components/PremiumEtherealBackground";
import DeepParallaxBackground from "components/DeepParallaxBackground";
import MouseGlowEffect from "components/MouseGlowEffect";
import FloatingGradientOrbs from "components/FloatingGradientOrbs";
import ShimmerParticles from "components/ShimmerParticles";
import GuidedFinder from "components/property/AIPropertyMatcher";
import { fetchPublicCatalog } from "./catalog/catalogService";
import { getPrimaryImage } from "./catalog/catalogData";
import {
  getCompareIds,
  getFavoriteIds,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalog/catalogStorage";
import { publicBrand } from "./publicBrand";

const MemoizedModernFeatures = memo(ModernFeatures);
const MemoizedModernHero = memo(ModernHero);
const MemoizedModernPropertyCard = memo(ModernPropertyCard);

const scrollToCatalogPreview = () => {
  const section = document.getElementById("properties-section");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const resultsTitle = (language, count) =>
  language?.startsWith("ru") ? `Найдено объектов: ${count}` : `Properties found: ${count}`;

const resultsText = (language) =>
  language?.startsWith("ru")
    ? "Показаны предложения, которые совпадают с вашим поиском на главной витрине."
    : "These signature listings match your current homepage search.";

const signatureCopy = {
  ru: {
    badge: "Signature residences",
    title: "Сильная витрина начинается не с фильтра, а с ощущения уровня объекта.",
    text:
      "Ниже собраны предложения, которые формируют первую эмоцию от коллекции: выразительная архитектура, качественная карточка и понятный маршрут к личному показу.",
    finderTitle: "Короткий путь к подборке",
    finderText:
      "Используйте guided finder, сохраните shortlist или перейдите сразу в каталог с URL-синхронизированными фильтрами.",
    shortlist: "Сохраненная подборка",
    compare: "Сравнение",
    allCatalog: "Открыть каталог",
    finalBadge: "Private viewing",
    finalTitle: "Когда объект действительно подходит, до следующего шага должен быть один клик.",
    finalText:
      "Из главной вы можете сразу перейти в каталог, сравнение, избранное и детальную карточку без потери контекста и без ощущения сырого интерфейса.",
  },
  en: {
    badge: "Signature residences",
    title: "A stronger storefront starts with atmosphere before the first filter.",
    text:
      "These featured properties set the tone for the collection: expressive architecture, richer listing quality, and a clear route into private viewing.",
    finderTitle: "A shorter route to the right shortlist",
    finderText:
      "Use the guided finder, save a shortlist, or move straight into the catalog with URL-synced filters and cleaner buyer tools.",
    shortlist: "Saved shortlist",
    compare: "Compare",
    allCatalog: "Open catalog",
    finalBadge: "Private viewing",
    finalTitle: "When a property feels right, the next step should be one calm click away.",
    finalText:
      "From the homepage you can now move into the catalog, comparison, favorites, and the detail page without losing context or hitting unfinished-looking surfaces.",
  },
};

export default function ModernLandingPage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDesktop] = useMediaQuery("(min-width: 62em)");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);

  const enableFullMotion = isDesktop && !prefersReducedMotion;
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = signatureCopy[locale];

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      const catalog = await fetchPublicCatalog();
      setProperties(catalog);
      setLoading(false);
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    const syncCollections = () => {
      setFavoriteIds(getFavoriteIds());
      setCompareIds(getCompareIds());
    };

    syncCollections();
    window.addEventListener("focus", syncCollections);
    return () => window.removeEventListener("focus", syncCollections);
  }, []);

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return properties;

    return properties.filter((property) => {
      const haystack = [
        property?.name,
        property?.propertyAddress,
        property?.propertyType,
        property?.marketingDescription,
        property?.propertyDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [properties, searchQuery]);

  const featuredProperties = useMemo(() => {
    const withImages = filteredProperties.filter((property) => {
      const primaryImage = getPrimaryImage(property);
      return primaryImage && !primaryImage.includes("placeholder");
    });
    const source = withImages.length ? withImages : filteredProperties;
    return source.slice(0, 6);
  }, [filteredProperties]);

  const marqueeProperties = featuredProperties.slice(0, 3);

  const handleFavoriteToggle = (propertyId) => {
    const next = toggleFavoriteId(propertyId);
    setFavoriteIds(next);
    toast({
      title: next.includes(propertyId)
        ? t("publicListing.addToFavorites")
        : t("publicListing.removeFromFavorites"),
      status: "success",
      duration: 1800,
    });
  };

  const handleCompareToggle = (propertyId) => {
    if (!compareIds.includes(propertyId) && compareIds.length >= 3) {
      toast({
        title: t("publicListing.compareLimit"),
        status: "info",
        duration: 2200,
      });
      return;
    }

    const next = toggleCompareId(propertyId);
    setCompareIds(next);
    toast({
      title: next.includes(propertyId)
        ? t("publicListing.addToCompare")
        : t("publicListing.removeFromCompare"),
      status: "success",
      duration: 1800,
    });
  };

  const handleGuidedMatch = (property) => {
    if (!property) return;
    setSearchQuery(property?.name || property?.propertyAddress || "");
    scrollToCatalogPreview();
  };

  return (
    <Box 
      minH="100vh" 
      position="relative" 
      bg={publicBrand.gradients.page} 
      color="white" 
      overflowX="hidden"
      width="100%"
      maxWidth="100vw"
    >
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.65s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Premium rounded corners everywhere */
        .premium-rounded {
          border-radius: 40px !important;
        }
        .premium-rounded-lg {
          border-radius: 48px !important;
        }
        .premium-rounded-xl {
          border-radius: 56px !important;
        }
        
        /* Depth-based opacity for layers */
        .depth-far {
          opacity: 0.4;
          filter: blur(2px);
        }
        .depth-mid {
          opacity: 0.6;
          filter: blur(1px);
        }
        .depth-near {
          opacity: 0.8;
          filter: blur(0.5px);
        }
        .depth-foreground {
          opacity: 1;
          filter: blur(0);
        }
      `}</style>

      {/* Mouse-following glow effect */}
      {enableFullMotion && <MouseGlowEffect />}
      
      {/* Deep Parallax Background - furthest layer */}
      <DeepParallaxBackground />
      
      {/* Floating gradient orbs */}
      {!prefersReducedMotion && <FloatingGradientOrbs />}
      
      {/* Premium Ethereal Background - mid layer */}
      <PremiumEtherealBackground />
      
      {/* Shimmer particles */}
      {!prefersReducedMotion && (
        <Box position="absolute" inset={0} overflow="hidden" zIndex={1}>
          <ShimmerParticles count={30} />
        </Box>
      )}
      
      {/* Property silhouettes - near layer */}
      {!prefersReducedMotion ? <PropertyBackground /> : null}
      
      {/* Particle system - foreground */}
      {enableFullMotion ? <ParticleCanvas /> : null}
      
      {/* 3D elements - closest foreground */}
      {enableFullMotion ? <ThreeBackground /> : null}

      <ModernHeader />

      <Box position="relative" zIndex={1}>
        <MemoizedModernHero
          properties={properties}
          t={t}
          onSearch={scrollToCatalogPreview}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Features Section - Integrated into single scroll */}
        <Box id="about" pt={{ base: 16, md: 20 }}>
          <MemoizedModernFeatures properties={properties} t={t} />
        </Box>

        <Box
          id="properties-section"
          py={{ base: 16, md: 20 }}
          bg="linear-gradient(180deg, rgba(7,12,20,0.08) 0%, rgba(244,238,229,1) 18%, rgba(244,238,229,1) 100%)"
        >
          <Container maxW="8xl">
            <Stack spacing={10}>
              {/* Header - Full width */}
              <Stack spacing={6} align="center" textAlign="center">
                <Badge
                  w="fit-content"
                  px={4}
                  py={1.5}
                  className="rounded-max"
                  borderRadius="full"
                  bg="rgba(212,175,55,0.12)"
                  border="1px solid rgba(212,175,55,0.18)"
                  color={publicBrand.colors.copper}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {t("publicListing.featuredProperties")}
                </Badge>
                <Heading size="2xl" color={publicBrand.colors.ink} maxW="900px">
                  {searchQuery
                    ? resultsTitle(i18n.language, filteredProperties.length)
                    : t("publicListing.catalogTitle")}
                </Heading>
                <Text color={publicBrand.colors.textSoft} fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" maxW="800px">
                  {searchQuery ? resultsText(i18n.language) : t("publicListing.heroDescription")}
                </Text>
                {/* Simple action buttons */}
                <HStack spacing={4} flexWrap="wrap" justify="center">
                  <Button
                    as={RouterLink}
                    to="/offers"
                    borderRadius="full"
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    rightIcon={<FiArrowRight />}
                    px={8}
                    h="50px"
                  >
                    {t("publicListing.viewAllProperties")}
                  </Button>
                </HStack>
              </Stack>

              {/* Property Grid */}
              {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={`landing-skeleton-${index}`} h="520px" borderRadius="40px" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                  {featuredProperties.map((property) => (
                    <MemoizedModernPropertyCard
                      key={property?._id}
                      property={property}
                      isFavorite={favoriteIds.includes(property?._id)}
                      isInCompare={compareIds.includes(property?._id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      onCompareToggle={handleCompareToggle}
                    />
                  ))}
                </SimpleGrid>
              )}
            </Stack>
          </Container>
        </Box>

        <ModernFooter />
      </Box>
    </Box>
  );
}
