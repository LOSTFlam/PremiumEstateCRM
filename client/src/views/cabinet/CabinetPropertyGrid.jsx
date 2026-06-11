import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModernPropertyCard from "components/ModernPropertyCard";
import {
  PROPERTY_CARD_GRID_SPACING,
  PROPERTY_CARD_MIN_WIDTH,
} from "views/public/catalog/propertyCardLayout";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";
import {
  toggleCompareId,
  toggleFavoriteId,
} from "views/public/catalog/catalogStorage";
import { useCabinetTheme } from "./useCabinetTheme";

const sortByIdOrder = (properties, ids) => {
  const order = new Map(ids.map((id, index) => [String(id), index]));
  return [...properties].sort(
    (a, b) => (order.get(String(a?._id)) ?? 999) - (order.get(String(b?._id)) ?? 999)
  );
};

const CabinetPropertyGrid = ({
  ids = [],
  emptyTitle,
  emptyText,
  browseLabel,
  browseTo = "/offers",
  onRemove,
}) => {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(ids);
  const [compareIds, setCompareIds] = useState([]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);

    if (!ids.length) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getApi(`api/property/public/by-ids?ids=${ids.join(",")}`, {
        silent: true,
      });
      const remote = extractCollection(response);

      if (remote.length > 0) {
        setProperties(sortByIdOrder(remote, ids));
        return;
      }

      const catalog = await fetchPublicCatalog();
      setProperties(sortByIdOrder(catalog.filter((item) => ids.includes(item?._id)), ids));
    } catch {
      const catalog = await fetchPublicCatalog();
      setProperties(sortByIdOrder(catalog.filter((item) => ids.includes(item?._id)), ids));
    } finally {
      setLoading(false);
    }
  }, [ids]);

  useEffect(() => {
    setFavoriteIds(ids);
    fetchProperties();
  }, [fetchProperties, ids]);

  const handleFavorite = (propertyId) => {
    const wasFavorite = favoriteIds.includes(propertyId);
    const next = toggleFavoriteId(propertyId);
    setFavoriteIds(next);
    if (wasFavorite) onRemove?.(propertyId);
  };

  const handleCompare = (propertyId) => {
    setCompareIds(toggleCompareId(propertyId));
  };

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={PROPERTY_CARD_GRID_SPACING}>
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} height="420px" borderRadius="24px" />
        ))}
      </SimpleGrid>
    );
  }

  if (!ids.length || properties.length === 0) {
    return (
      <Stack align="center" justify="center" {...theme.emptyStateStyle}>
        <Text fontSize="lg" fontWeight="700" color={theme.heading}>
          {emptyTitle || t("cabinet.empty.title")}
        </Text>
        <Text color={theme.muted} maxW="420px">
          {emptyText || t("cabinet.empty.text")}
        </Text>
        <Button as={RouterLink} to={browseTo} colorScheme="green" mt={2}>
          {browseLabel || t("cabinet.empty.browse")}
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing={PROPERTY_CARD_GRID_SPACING}
        minChildWidth={PROPERTY_CARD_MIN_WIDTH}
      >
        {properties.map((property) => (
          <ModernPropertyCard
            key={property._id}
            property={property}
            isFavorite={favoriteIds.includes(property._id)}
            isInCompare={compareIds.includes(property._id)}
            onFavoriteToggle={() => handleFavorite(property._id)}
            onCompareToggle={() => handleCompare(property._id)}
          />
        ))}
      </SimpleGrid>
      {properties.length < ids.length ? (
        <Flex justify="center" mt={6}>
          <Text color={theme.subtle} fontSize="sm">
            {t("cabinet.partialLoad", { shown: properties.length, total: ids.length })}
          </Text>
        </Flex>
      ) : null}
    </Box>
  );
};

export default CabinetPropertyGrid;
