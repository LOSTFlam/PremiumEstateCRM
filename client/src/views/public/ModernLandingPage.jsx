import { memo, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
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
import { FiArrowRight, FiHeart, FiShield, FiTrendingUp } from "react-icons/fi";
import { LuBuilding2, LuMapPin, LuSparkles, LuTrees } from "react-icons/lu";
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
import SmokeEffect from "components/SmokeEffect";
import FloatingOrbs from "components/FloatingOrbs";
import GuidedFinder from "components/property/AIPropertyMatcher";
import { fetchPublicStorefrontSettings } from "services/storefrontSettings";
import {
  DEFAULT_STOREFRONT_PRESETS,
  COLLECTION_STOREFRONT_SLUGS,
  PRIMARY_STOREFRONT_SLUGS,
  getStorefrontPresetMeta,
} from "utils/storefrontPresets";
import { fetchPublicCatalog } from "./catalog/catalogService";
import { countCatalogProperties, extractPresetFilters } from "./catalog/catalogFilters";
import { formatPrice, isRichListing, parsePrice, placeholderImage } from "./catalog/catalogData";
import { getRate } from "services/exchangeRate";
import { getSeoCollectionConfig } from "./catalog/seoCollections";
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

const landingCopy = {
  ru: {
    marketBadge: "Маршруты спроса",
    marketTitle:
      "Главная теперь ведет не только в красивые карточки, но и в нужный сценарий поиска.",
    marketText:
      "По примеру сильных порталов мы собрали быстрые входы в частые запросы: семейный дом, городская квартира, проверенная витрина, инвестиционные участки и премиальная коммерция.",
    marketOpen: "Открыть маршрут",
    marketStats: "Живые сигналы витрины",
    collectionsBadge: "Редакционные подборки",
    collectionsTitle:
      "Подборки получили свой смысл: это уже не просто фильтр, а отдельные входы под поисковый интент.",
    collectionsText:
      "Каждая подборка может работать как рекламная или поисковая посадочная страница: с коротким обещанием, понятным типом спроса и быстрым переходом в релевантные объекты.",
    servicesBadge: "Инструменты покупателя",
    servicesTitle: "Инструменты для спокойного выбора",
    servicesText:
      "Сохранение, сравнение и интеллектуальный подбор теперь воспринимаются как часть процесса покупки, а не как случайные кнопки в интерфейсе.",
    locationsTitle: "Локации на витрине",
    locationsText:
      "Показываем не абстрактные карточки, а понятные зоны спроса, которые уже видны в базе.",
    collectionsOpen: "Открыть подборку",
    fromLabel: "от",
    catalogBadge: "Витрина объектов",
    catalogText:
      "Ниже остается живая витрина предложений, но теперь она лучше связана с поиском выше: запрос, подборки и инструменты выбора работают как одна система.",
    services: [
      {
        key: "shortlist",
        icon: FiHeart,
        title: "Подборка без хаоса",
        text: "Избранное и сравнение вынесены в ясный сценарий выбора, а не спрятаны в служебных экранах.",
      },
      {
        key: "trust",
        icon: FiShield,
        title: "Доверие к карточке",
        text: "Полные объявления с документами и фото стали заметным слоем продукта, а не скрытым преимуществом.",
      },
      {
        key: "growth",
        icon: FiTrendingUp,
        title: "Маркетинг под спрос",
        text: "Подборки и быстрые маршруты дают нормальную основу под рекламу, поисковое продвижение и ретаргетинг.",
      },
    ],
  },
  en: {
    marketBadge: "Demand routes",
    marketTitle:
      "The homepage now routes buyers into the right search scenario, not only into attractive cards.",
    marketText:
      "Inspired by stronger portals, we added fast entry points into common intent: family homes, city apartments, verified listings, investment land, and premium commercial real estate.",
    marketOpen: "Open route",
    marketStats: "Live storefront signals",
    collectionsBadge: "Editorial collections",
    collectionsTitle:
      "Collections now carry real intent: they work like focused search landings, not just saved filters.",
    collectionsText:
      "Each collection can support SEO or paid traffic with a short promise, clearer demand framing, and a direct route into relevant inventory.",
    servicesBadge: "Buyer tools",
    servicesTitle: "Tools for calmer decision-making",
    servicesText:
      "Favorites, compare, and the guided finder now read like part of the buying process instead of random utility buttons.",
    locationsTitle: "Locations on display",
    locationsText:
      "The storefront now surfaces understandable demand zones that already exist in the catalog.",
    collectionsOpen: "Open collection",
    fromLabel: "from",
    catalogBadge: "Property storefront",
    catalogText:
      "The listing grid stays live below, but now it is connected to the search layer above: query, collections, and buyer tools work as one system.",
    services: [
      {
        key: "shortlist",
        icon: FiHeart,
        title: "Shortlist without clutter",
        text: "Favorites and compare now sit inside a cleaner buyer flow instead of feeling like admin leftovers.",
      },
      {
        key: "trust",
        icon: FiShield,
        title: "Trust-ready listings",
        text: "Listings with photos and documents are positioned as a meaningful product layer, not hidden product hygiene.",
      },
      {
        key: "growth",
        icon: FiTrendingUp,
        title: "Demand-oriented marketing",
        text: "Collections and fast routes give you better surfaces for SEO, ads, and retargeting campaigns.",
      },
    ],
  },
};

const compactCurrency = (value, language, t) => {
  const amount = parsePrice(value);
  if (!amount) return t?.("publicListing.priceOnRequest") || "Price on request";
  const isRussian = language?.startsWith("ru");
  const locale = isRussian ? "ru-RU" : "en-US";
  if (isRussian) {
    const rubAmount = Math.round(amount * getRate());
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "RUB",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(rubAmount);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

const resolveLocationLabel = (address, language) => {
  const parts = String(address || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return language?.startsWith("ru") ? "Локация" : "Location";
  }

  return parts[parts.length - 1];
};

export default function ModernLandingPage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const _prefersReducedMotion = usePrefersReducedMotion();
  const [_isDesktop] = useMediaQuery("(min-width: 62em)");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [storefrontPresets, setStorefrontPresets] = useState(DEFAULT_STOREFRONT_PRESETS);

  const enableFullMotion = false; // Disabled for performance
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = landingCopy[locale];

  useEffect(() => {
    let ignore = false;

    const loadCatalog = async () => {
      setLoading(true);

      try {
        const [catalog, settings] = await Promise.all([
          fetchPublicCatalog(),
          fetchPublicStorefrontSettings(),
        ]);

        if (!ignore) {
          setProperties(catalog);
          setStorefrontPresets(settings.presets || DEFAULT_STOREFRONT_PRESETS);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCatalog();

    return () => {
      ignore = true;
    };
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

  const featuredProperties = useMemo(() => filteredProperties.slice(0, 6), [filteredProperties]);

  const richCount = useMemo(
    () => properties.filter((property) => isRichListing(property)).length,
    [properties]
  );

  const averagePrice = useMemo(() => {
    const priced = properties.map((property) => parsePrice(property?.listingPrice)).filter(Boolean);
    if (!priced.length) return 0;
    return Math.round(priced.reduce((sum, price) => sum + price, 0) / priced.length);
  }, [properties]);

  const newCount = useMemo(
    () =>
      properties.filter((property) =>
        String(property?.listingStatus || "")
          .toLowerCase()
          .includes("new")
      ).length,
    [properties]
  );
  const presetMap = useMemo(
    () => new Map((storefrontPresets || []).map((preset) => [preset.slug, preset])),
    [storefrontPresets]
  );

  const heroSegmentCards = useMemo(() => {
    const iconMap = {
      houses: FiHeart,
      apartments: LuBuilding2,
      plots: LuTrees,
      commercial: FiTrendingUp,
    };

    return PRIMARY_STOREFRONT_SLUGS.filter((slug) => slug !== "all-offers")
      .map((slug) => {
        const preset = presetMap.get(slug);
        const meta = getStorefrontPresetMeta(slug, i18n.language);

        if (!preset?.isActive || !meta) return null;

        return {
          key: slug,
          title: meta.adminLabel,
          text: meta.description,
          href: meta.route,
          count: countCatalogProperties(properties, extractPresetFilters(preset)),
          icon: iconMap[slug] || FiTrendingUp,
        };
      })
      .filter(Boolean);
  }, [i18n.language, presetMap, properties]);

  const marketStats = useMemo(
    () => [
      {
        key: "total",
        label: locale === "ru" ? "Объектов в каталоге" : "Listings in catalog",
        value: String(properties.length || 0),
      },
      {
        key: "rich",
        label: locale === "ru" ? "Полных карточек" : "Rich listings",
        value: String(richCount || 0),
      },
      {
        key: "new",
        label: locale === "ru" ? "Новых объявлений" : "New listings",
        value: String(newCount || 0),
      },
      {
        key: "average",
        label: locale === "ru" ? "Средний бюджет" : "Average ticket",
        value: formatPrice(averagePrice, t),
      },
    ],
    [averagePrice, locale, newCount, properties.length, richCount, t]
  );

  const collectionCards = useMemo(() => {
    const iconMap = {
      "family-homes": FiHeart,
      "city-apartments": LuBuilding2,
      verified: FiShield,
      "investment-plots": LuTrees,
      "premium-commercial": FiTrendingUp,
    };

    return COLLECTION_STOREFRONT_SLUGS.map((slug) => {
      const preset = presetMap.get(slug);
      const config = getSeoCollectionConfig(slug, i18n.language);
      const meta = getStorefrontPresetMeta(slug, i18n.language);

      if (!preset?.isActive || !config || !meta) return null;

      return {
        ...config,
        href: meta.route,
        count: countCatalogProperties(properties, extractPresetFilters(preset)),
        icon: iconMap[slug] || FiTrendingUp,
      };
    }).filter(Boolean);
  }, [i18n.language, presetMap, properties]);

  const marketRoutes = useMemo(
    () =>
      collectionCards.map((collection) => ({
        key: collection.slug,
        icon: collection.icon,
        count: collection.count,
        title: collection.title,
        text: collection.description,
        href: collection.href,
      })),
    [collectionCards]
  );

  const locationSignals = useMemo(() => {
    const locationsMap = properties.reduce((acc, property) => {
      const label = resolveLocationLabel(property?.propertyAddress, i18n.language);
      const current = acc.get(label) || { label, count: 0, price: 0 };
      const price = parsePrice(property?.listingPrice);

      current.count += 1;
      current.price = current.price === 0 ? price : Math.min(current.price, price || current.price);
      acc.set(label, current);
      return acc;
    }, new Map());

    return [...locationsMap.values()]
      .sort((left, right) => right.count - left.count || left.price - right.price)
      .slice(0, 4);
  }, [i18n.language, properties]);

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
      `}</style>

      {enableFullMotion && <MouseGlowEffect />}
      {enableFullMotion && <DeepParallaxBackground />}
      {enableFullMotion && <FloatingGradientOrbs />}
      {enableFullMotion && <FloatingOrbs count={6} />}
      {enableFullMotion && <SmokeEffect opacity={0.12} speed={0.6} />}
      {enableFullMotion && <PremiumEtherealBackground />}
      {enableFullMotion && (
        <Box position="absolute" inset={0} overflow="hidden" zIndex={1}>
          <ShimmerParticles count={0} />
        </Box>
      )}
      {enableFullMotion && <PropertyBackground />}
      {enableFullMotion ? <ParticleCanvas /> : null}
      {enableFullMotion ? <ThreeBackground /> : null}

      <ModernHeader />

      <Box position="relative" zIndex={1}>
        <MemoizedModernHero
          properties={properties}
          onSearch={scrollToCatalogPreview}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          segmentCards={heroSegmentCards}
          marketRouteCards={marketRoutes}
        />

        <Box id="about" pt={{ base: 16, md: 20 }}>
          <MemoizedModernFeatures properties={properties} t={t} />
        </Box>

        <Box
          id="market"
          py={{ base: 14, md: 18, xl: 20 }}
          bg="linear-gradient(180deg, rgba(244,238,229,0.98) 0%, rgba(236,227,215,1) 100%)"
        >
          <Container maxW="min(1640px, 96vw)">
            <Stack spacing={10}>
              <Box
                borderRadius="32px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                bg="white"
                border="1px solid rgba(9,18,32,0.08)"
                boxShadow={publicBrand.shadows.soft}
                backdropFilter="blur(8px)"
              >
                <Stack spacing={8}>
                  <Box>
                    <Badge
                      w="fit-content"
                      px={4}
                      py={1.5}
                      borderRadius="full"
                      bg="rgba(212,175,55,0.12)"
                      border="1px solid rgba(212,175,55,0.18)"
                      color={publicBrand.colors.copper}
                      letterSpacing="0.12em"
                      textTransform="uppercase"
                    >
                      {copy.marketBadge}
                    </Badge>
                    <Heading
                      color={publicBrand.colors.ink}
                      fontSize={{ base: "3xl", md: "5xl" }}
                      lineHeight="1.05"
                      mt={4}
                    >
                      {copy.marketTitle}
                    </Heading>
                    <Text
                      color={publicBrand.colors.textSoft}
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="1.9"
                      mt={4}
                    >
                      {copy.marketText}
                    </Text>
                    <Text
                      color={publicBrand.colors.copper}
                      fontSize="xs"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                      mt={6}
                    >
                      {copy.marketStats}
                    </Text>
                  </Box>

                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={5}>
                    {marketStats.map((item) => (
                      <Box
                        key={item.key}
                        borderRadius="26px"
                        px={4}
                        py={4}
                        bg="rgba(212,175,55,0.04)"
                        border="1px solid rgba(212,175,55,0.12)"
                      >
                        <Text
                          color={publicBrand.colors.textSoft}
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="0.14em"
                        >
                          {item.label}
                        </Text>
                        <Text
                          mt={2}
                          color={publicBrand.colors.ink}
                          fontWeight="700"
                          fontSize={{ base: "xl", md: "2xl" }}
                        >
                          {item.value}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>

              <Box
                display="grid"
                gridTemplateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                }}
                gap={{ base: 4, md: 5 }}
                width="100%"
              >
                {marketRoutes.map((route) => (
                  <Box
                    key={route.key}
                    as={RouterLink}
                    to={route.href}
                    borderRadius="32px"
                    px={{ base: 5, md: 6 }}
                    py={{ base: 5, md: 6 }}
                    bg="white"
                    border="1px solid rgba(9,18,32,0.08)"
                    boxShadow={publicBrand.shadows.soft}
                    transition="transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease"
                    _hover={{
                      transform: "translateY(-6px)",
                      boxShadow: "0 24px 70px rgba(6, 10, 16, 0.16)",
                      borderColor: "rgba(185,119,55,0.20)",
                    }}
                  >
                    <HStack justify="space-between" align="start">
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius="18px"
                        display="grid"
                        placeItems="center"
                        bg="rgba(212,175,55,0.10)"
                        color={publicBrand.colors.copper}
                      >
                        <Icon as={route.icon} boxSize={5} />
                      </Box>
                      <Text color={publicBrand.colors.textSoft} fontSize="sm">
                        {route.count}
                      </Text>
                    </HStack>
                    <Heading mt={5} size="md" color={publicBrand.colors.ink}>
                      {route.title}
                    </Heading>
                    <Text mt={3} color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {route.text}
                    </Text>
                    <HStack mt={5} spacing={2} color={publicBrand.colors.copper}>
                      <Text fontWeight="700" fontSize="sm">
                        {copy.marketOpen}
                      </Text>
                      <FiArrowRight />
                    </HStack>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Container>
        </Box>

        <Box
          id="collections"
          py={{ base: 16, md: 20 }}
          bg="linear-gradient(180deg, rgba(9,18,32,0.24) 0%, rgba(8,17,26,0.72) 100%)"
        >
          <Container maxW="min(1640px, 96vw)">
            <Stack spacing={8}>
              <Box>
                <Badge
                  w="fit-content"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(245,208,118,0.14)"
                  border="1px solid rgba(245,208,118,0.24)"
                  color="#f5d076"
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {copy.collectionsBadge}
                </Badge>
                <Heading color="white" fontSize={{ base: "3xl", md: "5xl" }} lineHeight="1.05">
                  {copy.collectionsTitle}
                </Heading>
                <Text
                  color="whiteAlpha.760"
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.9"
                  maxW="760px"
                >
                  {copy.collectionsText}
                </Text>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3, xl: 4, "2xl": 5 }}
                  spacing={{ base: 4, md: 5 }}
                >
                  {collectionCards.map((collection) => (
                    <Box
                      key={collection.slug}
                      as={RouterLink}
                      to={collection.href}
                      borderRadius="32px"
                      px={{ base: 5, md: 6 }}
                      py={{ base: 5, md: 6 }}
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(227, 211, 184, 0.12)"
                      transition="transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease"
                      _hover={{
                        transform: "translateY(-6px)",
                        borderColor: "rgba(245,208,118,0.24)",
                        boxShadow: "0 28px 70px rgba(0,0,0,0.18)",
                      }}
                    >
                      <HStack justify="space-between" align="start">
                        <Badge
                          px={3}
                          py={1.5}
                          borderRadius="full"
                          bg="rgba(245,208,118,0.12)"
                          color="#f5d076"
                          border="1px solid rgba(245,208,118,0.20)"
                        >
                          {collection.badge}
                        </Badge>
                        <Text color="whiteAlpha.620" fontSize="sm">
                          {collection.count}
                        </Text>
                      </HStack>
                      <Heading mt={5} size="md" color="white">
                        {collection.title}
                      </Heading>
                      <Text mt={3} color="whiteAlpha.760" lineHeight="1.8" noOfLines={3}>
                        {collection.description}
                      </Text>
                      <Stack mt={5} spacing={2}>
                        {collection.heroPoints?.slice(0, 2).map((point) => (
                          <HStack key={point} spacing={2.5} color="whiteAlpha.820">
                            <Icon as={LuSparkles} color="#f5d076" />
                            <Text fontSize="sm">{point}</Text>
                          </HStack>
                        ))}
                      </Stack>
                      <HStack mt={5} spacing={2} color="#f5d076">
                        <Text fontWeight="700" fontSize="sm">
                          {copy.collectionsOpen}
                        </Text>
                        <FiArrowRight />
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>

            <Stack spacing={5}>
              <GuidedFinder
                properties={properties}
                variant="dark"
                onMatchFound={handleGuidedMatch}
              />

              <Box
                id="services"
                className="public-brand-panel"
                borderRadius="32px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
              >
                <Stack spacing={5}>
                  <Box>
                    <Text
                      color="#f5d076"
                      fontSize="xs"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {copy.servicesBadge}
                    </Text>
                    <Heading mt={2} size="lg" color="white">
                      {copy.servicesTitle}
                    </Heading>
                    <Text mt={3} color="whiteAlpha.760" lineHeight="1.8">
                      {copy.servicesText}
                    </Text>
                  </Box>
                  <Stack spacing={4}>
                    {copy.services.map((service) => (
                      <Box
                        key={service.key}
                        borderRadius="24px"
                        px={4}
                        py={4}
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.10)"
                      >
                        <HStack spacing={4} align="start">
                          <Box
                            w="44px"
                            h="44px"
                            borderRadius="18px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.10)"
                            color="#f5d076"
                            flexShrink={0}
                          >
                            <Icon as={service.icon} />
                          </Box>
                          <Box>
                            <Text color="white" fontWeight="700">
                              {service.title}
                            </Text>
                            <Text mt={1.5} color="whiteAlpha.720" fontSize="sm" lineHeight="1.8">
                              {service.text}
                            </Text>
                          </Box>
                        </HStack>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>

              <Box
                className="public-brand-panel"
                borderRadius="32px"
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
              >
                <Stack spacing={4}>
                  <Box>
                    <Text
                      color="#f5d076"
                      fontSize="xs"
                      letterSpacing="0.16em"
                      textTransform="uppercase"
                    >
                      {copy.locationsTitle}
                    </Text>
                    <Text mt={2} color="whiteAlpha.760" lineHeight="1.8">
                      {copy.locationsText}
                    </Text>
                  </Box>
                  <Stack spacing={3}>
                    {locationSignals.map((location) => (
                      <HStack
                        key={location.label}
                        justify="space-between"
                        align="center"
                        px={4}
                        py={4}
                        borderRadius="22px"
                        bg="rgba(255,255,255,0.05)"
                        border="1px solid rgba(227, 211, 184, 0.10)"
                      >
                        <HStack spacing={3}>
                          <Box
                            w="40px"
                            h="40px"
                            borderRadius="16px"
                            display="grid"
                            placeItems="center"
                            bg="rgba(245,208,118,0.10)"
                            color="#f5d076"
                          >
                            <LuMapPin />
                          </Box>
                          <Box>
                            <Text color="white" fontWeight="700">
                              {location.label}
                            </Text>
                            <Text color="whiteAlpha.620" fontSize="sm">
                              {location.count} {locale === "ru" ? "объекта" : "offers"}
                            </Text>
                          </Box>
                        </HStack>
                        <Text color="#f5d076" fontWeight="700" fontSize="sm">
                          {copy.fromLabel} {compactCurrency(location.price, i18n.language, t)}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Box>

        <Box
          id="properties-section"
          py={{ base: 14, md: 18, xl: 20 }}
          bg="linear-gradient(180deg, rgba(244,238,229,1) 0%, rgba(244,238,229,1) 100%)"
        >
          <Container maxW="min(1640px, 96vw)">
            <Stack spacing={10}>
              <Stack spacing={6} align="center" textAlign="center">
                <Badge
                  w="fit-content"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(212,175,55,0.12)"
                  border="1px solid rgba(212,175,55,0.18)"
                  color={publicBrand.colors.copper}
                  letterSpacing="0.12em"
                  textTransform="uppercase"
                >
                  {copy.catalogBadge}
                </Badge>
                <Heading size="2xl" color={publicBrand.colors.ink} maxW="900px">
                  {searchQuery
                    ? resultsTitle(i18n.language, filteredProperties.length)
                    : t("publicListing.catalogTitle")}
                </Heading>
                <Text
                  color={publicBrand.colors.textSoft}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.8"
                  maxW="820px"
                >
                  {searchQuery ? resultsText(i18n.language) : copy.catalogText}
                </Text>
                <HStack spacing={3} flexWrap="wrap" justify="center">
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
                  <Badge
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg="rgba(8,17,26,0.04)"
                    color={publicBrand.colors.ink}
                    border="1px solid rgba(9,18,32,0.08)"
                  >
                    {favoriteIds.length} {locale === "ru" ? "в избранном" : "in favorites"}
                  </Badge>
                  <Badge
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg="rgba(8,17,26,0.04)"
                    color={publicBrand.colors.ink}
                    border="1px solid rgba(9,18,32,0.08)"
                  >
                    {compareIds.length} {locale === "ru" ? "в сравнении" : "in compare"}
                  </Badge>
                </HStack>
              </Stack>

              {loading ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 4, md: 6 }}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={`landing-skeleton-${index}`} h="520px" borderRadius="40px" />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={{ base: 4, md: 6 }}>
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
