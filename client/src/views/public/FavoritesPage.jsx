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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { MdArrowForward, MdCompareArrows, MdOutlineHistory } from "react-icons/md";
import ModernFooter from "components/ModernFooter";
import ModernHeader from "components/ModernHeader";
import ModernPropertyCard from "components/ModernPropertyCard";
import { fetchPublicCatalog } from "./catalog/catalogService";
import {
  getCompareIds,
  getFavoriteIds,
  getRecentlyViewedIds,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalog/catalogStorage";
import { publicBrand } from "./publicBrand";

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const catalog = await fetchPublicCatalog();
      setProperties(catalog);
      setFavoriteIds(getFavoriteIds());
      setCompareIds(getCompareIds());
      setRecentIds(getRecentlyViewedIds());
      setLoading(false);
    };

    load();
  }, []);

  const favorites = useMemo(
    () => favoriteIds.map((id) => properties.find((item) => item?._id === id)).filter(Boolean),
    [favoriteIds, properties],
  );

  const recentProperties = useMemo(
    () =>
      recentIds
        .filter((id) => !favoriteIds.includes(id))
        .map((id) => properties.find((item) => item?._id === id))
        .filter(Boolean)
        .slice(0, 3),
    [favoriteIds, properties, recentIds],
  );

  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = locale === "ru"
    ? {
        badge: "Saved shortlist",
        title: "Ваша сохраненная подборка",
        subtitle:
          "Все объекты, к которым стоит вернуться: избранное, сравнение и недавно просмотренные предложения в одном спокойном сценарии.",
        compareLink: "Открыть сравнение",
        browseAll: "Вернуться в каталог",
        emptyTitle: "Подборка пока пуста",
        emptyText: "Добавляйте объекты в избранное прямо из каталога и формируйте shortlist для следующего шага.",
      }
    : {
        badge: "Saved shortlist",
        title: "Your saved shortlist",
        subtitle:
          "Everything worth revisiting in one calmer flow: favorites, compare, and recently viewed offers collected in a buyer-friendly space.",
        compareLink: "Open compare",
        browseAll: "Back to catalog",
        emptyTitle: "Your shortlist is still empty",
        emptyText: "Save properties directly from the catalog and build a cleaner shortlist for the next step.",
      };

  const handleFavoriteToggle = (propertyId) => {
    const next = toggleFavoriteId(propertyId);
    setFavoriteIds(next);
    toast({
      title: next.includes(propertyId)
        ? t?.("publicListing.addToFavorites")
        : t?.("publicListing.removeFromFavorites"),
      status: "success",
      duration: 1800,
    });
  };

  const handleCompareToggle = (propertyId) => {
    const next = toggleCompareId(propertyId);
    setCompareIds(next);
    toast({
      title: next.includes(propertyId)
        ? t?.("publicListing.addToCompare")
        : t?.("publicListing.removeFromCompare"),
      status: "success",
      duration: 1800,
    });
  };

  return (
    <Box minH="100vh" bg={publicBrand.colors.paper} color={publicBrand.colors.ink}>
      <Box bg={publicBrand.gradients.hero} color="white" position="relative" overflow="hidden">
        <Box
          position="absolute"
          inset="0"
          bg="radial-gradient(circle at 18% 22%, rgba(245,208,118,0.16) 0%, rgba(245,208,118,0) 28%), radial-gradient(circle at 84% 14%, rgba(185,119,55,0.16) 0%, rgba(185,119,55,0) 32%)"
        />
        <ModernHeader />
        <Container maxW="8xl" pt={{ base: 28, md: 32 }} pb={{ base: 12, md: 16 }} position="relative">
          <Stack spacing={6}>
            <Badge
              w="fit-content"
              px={4}
              py={1.5}
              borderRadius="full"
              bg="rgba(245,208,118,0.14)"
              color="#f5d076"
              border="1px solid rgba(245,208,118,0.24)"
              textTransform="uppercase"
              letterSpacing="0.12em"
            >
              {copy.badge}
            </Badge>
            <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} lineHeight={{ base: "1.08", md: "0.98" }} maxW="900px">
              {copy.title}
            </Heading>
            <Text maxW="700px" fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.800" lineHeight="1.9">
              {copy.subtitle}
            </Text>
            <HStack spacing={3} flexWrap="wrap">
              <Button
                as={RouterLink}
                to="/offers"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
                rightIcon={<MdArrowForward />}
                borderRadius="full"
              >
                {copy.browseAll}
              </Button>
              <Button
                as={RouterLink}
                to="/offers/compare"
                variant="outline"
                color="white"
                borderColor="rgba(227, 211, 184, 0.24)"
                leftIcon={<MdCompareArrows />}
                borderRadius="full"
              >
                {copy.compareLink}
              </Button>
            </HStack>
          </Stack>
        </Container>
      </Box>

      <Container maxW="8xl" py={{ base: 8, md: 12 }}>
        <Stack spacing={8}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {[
              { label: t?.("publicListing.favoritesCount"), value: favoriteIds.length, icon: FiHeart },
              { label: t?.("publicListing.compareCount"), value: compareIds.length, icon: MdCompareArrows },
              { label: t?.("publicListing.recentCount"), value: recentIds.length, icon: MdOutlineHistory },
            ].map((item) => (
              <Box
                key={item.label}
                borderRadius="32px"
                px={6}
                py={6}
                bg="white"
                border="1px solid rgba(9,18,32,0.08)"
                boxShadow={publicBrand.shadows.soft}
              >
                <HStack justify="space-between" align="start">
                  <Stack spacing={1}>
                    <Text fontSize="xs" color={publicBrand.colors.copper} textTransform="uppercase" letterSpacing="0.14em">
                      {item.label}
                    </Text>
                    <Text fontSize="4xl" fontWeight="700" color={publicBrand.colors.ink}>
                      {item.value}
                    </Text>
                  </Stack>
                  <Box
                    w="48px"
                    h="48px"
                    borderRadius="18px"
                    display="grid"
                    placeItems="center"
                    bg="rgba(212,175,55,0.12)"
                    color={publicBrand.colors.copper}
                  >
                    <Icon as={item.icon} boxSize={5} />
                  </Box>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={`favorite-skeleton-${index}`} h="520px" borderRadius="34px" />
              ))}
            </SimpleGrid>
          ) : favorites.length ? (
            <Box>
              <Heading size="lg" mb={5} color={publicBrand.colors.ink}>
                {t?.("publicListing.favoritesTitle")}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {favorites.map((property) => (
                  <ModernPropertyCard
                    key={property?._id}
                    property={property}
                    isFavorite={favoriteIds.includes(property?._id)}
                    isInCompare={compareIds.includes(property?._id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ) : (
            <Box
              borderRadius="34px"
              px={{ base: 6, md: 8 }}
              py={{ base: 8, md: 10 }}
              bg="white"
              border="1px solid rgba(9,18,32,0.08)"
              boxShadow={publicBrand.shadows.soft}
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
                  <FiHeart size={24} />
                </Box>
                <Heading color={publicBrand.colors.ink}>{copy.emptyTitle}</Heading>
                <Text color={publicBrand.colors.textSoft} maxW="560px" lineHeight="1.8">
                  {copy.emptyText}
                </Text>
                <Button as={RouterLink} to="/offers" bg={publicBrand.gradients.brass} color={publicBrand.colors.ink} borderRadius="full">
                  {copy.browseAll}
                </Button>
              </Stack>
            </Box>
          )}

          {!loading && recentProperties.length ? (
            <Box>
              <Heading size="lg" mb={5} color={publicBrand.colors.ink}>
                {t?.("publicListing.recentlyViewedTitle")}
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
                {recentProperties.map((property) => (
                  <ModernPropertyCard
                    key={`recent-favorite-${property?._id}`}
                    property={property}
                    isFavorite={favoriteIds.includes(property?._id)}
                    isInCompare={compareIds.includes(property?._id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    onCompareToggle={handleCompareToggle}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ) : null}
        </Stack>
      </Container>

      <ModernFooter />
    </Box>
  );
}
