import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Button,
  Text,
  SimpleGrid,
  useToast,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart, FiShare2, FiDownload, FiTrash2, FiGrid, FiList } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import ModernPropertyCard from "components/ModernPropertyCard";
import {
  PROPERTY_CARD_GRID_SPACING,
  PROPERTY_CARD_MIN_WIDTH,
} from "views/public/catalog/propertyCardLayout";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { useTranslation } from "react-i18next";
import { publicBrand } from "views/public/publicBrand";
import {
  clearFavoriteIds,
  getCompareIds,
  getFavoriteIds,
  toggleCompareId,
  toggleFavoriteId,
} from "./catalog/catalogStorage";
import { fetchPublicCatalog } from "./catalog/catalogService";
import { formatPrice } from "./catalog/catalogData";
import jsPDF from "jspdf";
import "jspdf-autotable";

const pageCopy = {
  ru: {
    loadError: "Не удалось загрузить избранное",
    removed: "Удалено из избранного",
    cleared: "Избранное очищено",
    compareLimit: "Можно сравнивать не более 3 объектов",
    addedToCompare: "Добавлено к сравнению",
    shareTitle: "Моя подборка объектов",
    shareText: (count) => `Посмотрите ${count} сохраненных объектов из моей подборки.`,
    linkCopied: "Ссылка скопирована",
    pdfTitle: "Моя подборка объектов",
    generatedOn: "Дата выгрузки",
    propertyFallback: "Объект",
    onRequest: "По запросу",
    bedroomsShort: "сп.",
    bathroomsShort: "сан.",
    pdfExported: "Файл успешно сохранен",
    title: "Ваша подборка",
    saved: (count) => `${count} ${count === 1 ? "объект" : "объектов"} сохранено`,
    grid: "Сетка",
    list: "Список",
    exportPdf: "Скачать файл",
    share: "Поделиться",
    clearAll: "Очистить все",
    compareSelected: (count) =>
      `${count} ${count === 1 ? "объект выбран" : "объекта выбрано"} для сравнения`,
    compareNow: "Сравнить сейчас",
    clear: "Очистить",
    emptyTitle: "Пока нет избранных объектов",
    emptyText: "Откройте каталог и сохраните интересные объекты в подборку.",
    browse: "Открыть каталог",
    tableHead: ["#", "Название", "Цена", "Площадь", "Спальни", "Санузлы"],
  },
  en: {
    loadError: "Error loading favorites",
    removed: "Removed from favorites",
    cleared: "All favorites cleared",
    compareLimit: "Maximum 3 properties for comparison",
    addedToCompare: "Added to compare",
    shareTitle: "My Favorite Properties",
    shareText: (count) => `Check out these ${count} properties I've saved!`,
    linkCopied: "Link copied to clipboard",
    pdfTitle: "My Favorite Properties",
    generatedOn: "Generated on",
    propertyFallback: "Property",
    onRequest: "On request",
    bedroomsShort: "bed",
    bathroomsShort: "bath",
    pdfExported: "PDF exported successfully",
    title: "My Favorites",
    saved: (count) => `${count} ${count === 1 ? "property" : "properties"} saved`,
    grid: "Grid",
    list: "List",
    exportPdf: "Export PDF",
    share: "Share",
    clearAll: "Clear All",
    compareSelected: (count) =>
      `${count} property${count !== 1 ? "ies" : "y"} selected for comparison`,
    compareNow: "Compare Now",
    clear: "Clear",
    emptyTitle: "No favorites yet",
    emptyText: "Start exploring properties and save your favorites here",
    browse: "Browse Properties",
    tableHead: ["#", "Name", "Price", "Area", "Bedrooms", "Bathrooms"],
  },
};

const FavoritesPage = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [loading, setLoading] = useState(true);
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = pageCopy[locale];

  const fetchFavorites = useCallback(async () => {
    setLoading(true);

    const storedIds = getFavoriteIds();
    setFavoriteIds(storedIds);
    setCompareIds(getCompareIds());

    if (storedIds.length === 0) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getApi(`api/property/public/by-ids?ids=${storedIds.join(",")}`, {
        silent: true,
      });
      const remoteFavorites = extractCollection(response);

      if (remoteFavorites.length > 0) {
        setFavorites(remoteFavorites);
        return;
      }

      const catalog = await fetchPublicCatalog();
      setFavorites(catalog.filter((property) => storedIds.includes(property?._id)));
    } catch (error) {
      const catalog = await fetchPublicCatalog();
      setFavorites(catalog.filter((property) => storedIds.includes(property?._id)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const removeFromFavorites = (propertyId) => {
    const newFavorites = favoriteIds.filter((id) => id !== propertyId);
    toggleFavoriteId(propertyId);
    setFavoriteIds(newFavorites);
    setFavorites(favorites.filter((p) => p._id !== propertyId));

    toast({
      title: copy.removed,
      status: "info",
      duration: 2000,
    });
  };

  const clearAllFavorites = () => {
    clearFavoriteIds();
    setFavoriteIds([]);
    setFavorites([]);
    toast({
      title: copy.cleared,
      status: "info",
      duration: 2000,
    });
  };

  const toggleCompare = (propertyId) => {
    if (!compareIds.includes(propertyId) && compareIds.length >= 3) {
      toast({
        title: copy.compareLimit,
        status: "warning",
        duration: 3000,
      });
      return;
    }

    const next = toggleCompareId(propertyId);
    setCompareIds(next);

    if (next.includes(propertyId)) {
      toast({
        title: copy.addedToCompare,
        status: "success",
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: copy.shareTitle,
      text: copy.shareText(favorites.length),
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: copy.linkCopied,
          status: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      // Error handled silently
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text(copy.pdfTitle, 14, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `${copy.generatedOn}: ${new Date().toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US")}`,
      14,
      28
    );

    // Property table
    const tableData = favorites.map((property, index) => [
      index + 1,
      property.name || property.propertyAddress || copy.propertyFallback,
      `${formatPrice(property.listingPrice) || copy.onRequest}`,
      `${property.squareFootage || "—"} m²`,
      `${property.numberofBedrooms || "—"} ${copy.bedroomsShort}`,
      `${property.numberofBathrooms || "—"} ${copy.bathroomsShort}`,
    ]);

    doc.autoTable({
      startY: 35,
      head: [copy.tableHead],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [212, 175, 55] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save
    doc.save(`favorites-${Date.now()}.pdf`);

    toast({
      title: copy.pdfExported,
      status: "success",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={4}>
          <Box className="skeleton" h="40px" w="300px" borderRadius="10px" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} className="skeleton" h="520px" borderRadius="34px" />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  return (
    <Box
      className="public-brand-shell"
      minH="100vh"
      bg={publicBrand.gradients.page}
      color="white"
      py={10}
      overflowX="hidden"
      maxW="100vw"
    >
      <Container maxW="8xl">
        <Stack spacing={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Stack spacing={2}>
              <HStack>
                <Icon as={FiHeart} color="#F5D076" boxSize={8} />
                <Heading as="h1" size="xl">
                  {t("publicListing.favoritesTitle") || copy.title}
                </Heading>
              </HStack>
              <Text color="gray.400">{copy.saved(favorites.length)}</Text>
            </Stack>

            <HStack spacing={3} flexWrap="wrap">
              {/* View Mode Toggle */}
              <HStack
                bg="rgba(255,255,255,0.05)"
                borderRadius="full"
                p={1}
                border="1px solid rgba(255,255,255,0.1)"
              >
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "solid" : "ghost"}
                  bg={viewMode === "grid" ? "rgba(212,175,55,0.3)" : "transparent"}
                  color={viewMode === "grid" ? "white" : "gray.400"}
                  borderRadius="full"
                  onClick={() => setViewMode("grid")}
                  leftIcon={<FiGrid />}
                >
                  {copy.grid}
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "solid" : "ghost"}
                  bg={viewMode === "list" ? "rgba(212,175,55,0.3)" : "transparent"}
                  color={viewMode === "list" ? "white" : "gray.400"}
                  borderRadius="full"
                  onClick={() => setViewMode("list")}
                  leftIcon={<FiList />}
                >
                  {copy.list}
                </Button>
              </HStack>

              {/* Actions */}
              {favorites.length > 0 && (
                <>
                  <Button
                    leftIcon={<FiDownload />}
                    variant="outline"
                    borderColor="rgba(212,175,55,0.3)"
                    color="#F5D076"
                    onClick={exportToPDF}
                  >
                    {copy.exportPdf}
                  </Button>
                  <Button
                    leftIcon={<FiShare2 />}
                    variant="outline"
                    borderColor="rgba(255,255,255,0.2)"
                    onClick={handleShare}
                  >
                    {copy.share}
                  </Button>
                  <Button
                    leftIcon={<FiTrash2 />}
                    variant="ghost"
                    color="red.400"
                    onClick={clearAllFavorites}
                  >
                    {copy.clearAll}
                  </Button>
                </>
              )}
            </HStack>
          </Flex>

          {/* Compare Bar */}
          {compareIds.length > 0 && (
            <Box
              p={4}
              borderRadius="20px"
              bg="rgba(212,175,55,0.1)"
              border="1px solid rgba(212,175,55,0.3)"
            >
              <HStack justify="space-between">
                <HStack>
                  <Icon as={MdCompareArrows} color="#F5D076" />
                  <Text>{copy.compareSelected(compareIds.length)}</Text>
                </HStack>
                <HStack>
                  <Button
                    as={RouterLink}
                    to={`/offers/compare?ids=${compareIds.join(",")}`}
                    colorScheme="green"
                    size="sm"
                    borderRadius="12px"
                  >
                    {copy.compareNow}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>
                    {copy.clear}
                  </Button>
                </HStack>
              </HStack>
            </Box>
          )}

          {/* Properties Grid/List */}
          {favorites.length === 0 ? (
            <Stack spacing={6} align="center" py={20}>
              <Icon as={FiHeart} boxSize={20} color="gray.600" />
              <Heading size="lg" color="gray.500">
                {copy.emptyTitle}
              </Heading>
              <Text color="gray.400" textAlign="center">
                {copy.emptyText}
              </Text>
              <Button
                as={RouterLink}
                to="/offers"
                colorScheme="green"
                size="lg"
                borderRadius="12px"
                leftIcon={<FiHeart />}
              >
                {copy.browse}
              </Button>
            </Stack>
          ) : (
            <SimpleGrid
              className="property-card-grid"
              columns={viewMode === "grid" ? undefined : 1}
              minChildWidth={viewMode === "grid" ? PROPERTY_CARD_MIN_WIDTH : undefined}
              spacing={PROPERTY_CARD_GRID_SPACING}
            >
              {favorites.map((property) => (
                <ModernPropertyCard
                  key={property._id}
                  property={property}
                  isFavorite={true}
                  isInCompare={compareIds.includes(property._id)}
                  onFavoriteToggle={() => removeFromFavorites(property._id)}
                  onCompareToggle={() => toggleCompare(property._id)}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default FavoritesPage;
