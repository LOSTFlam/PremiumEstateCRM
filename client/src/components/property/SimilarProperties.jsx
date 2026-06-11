import { useEffect, useState } from "react";
import { Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ModernPropertyCard from "components/ModernPropertyCard";
import {
  PROPERTY_CARD_GRID_SPACING,
  PROPERTY_CARD_MIN_WIDTH,
} from "views/public/catalog/propertyCardLayout";
import { normalizePropertyTypeKey } from "views/public/catalog/catalogData";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";

const SimilarProperties = ({ currentProperty }) => {
  const { t } = useTranslation();
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSimilar = async () => {
      if (!currentProperty?._id) return;

      try {
        setLoading(true);
        const catalog = await fetchPublicCatalog();
        const typeKey =
          currentProperty.propertyTypeKey ||
          normalizePropertyTypeKey(currentProperty.propertyType);
        const locationHint = String(currentProperty.propertyAddress || "")
          .toLowerCase()
          .split(",")[0]
          .trim();

        const matches = catalog
          .filter((property) => property?._id && property._id !== currentProperty._id)
          .map((property) => {
            const sameType =
              !typeKey ||
              property.propertyTypeKey === typeKey ||
              normalizePropertyTypeKey(property.propertyType) === typeKey;
            const address = String(property.propertyAddress || "").toLowerCase();
            const locationScore = locationHint && address.includes(locationHint) ? 2 : 0;
            const typeScore = sameType ? 1 : 0;
            return { property, score: typeScore + locationScore };
          })
          .filter((entry) => entry.score > 0)
          .sort((a, b) => b.score - a.score)
          .map((entry) => entry.property)
          .slice(0, 3);

        setSimilarProperties(matches);
      } catch {
        setSimilarProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilar();
  }, [currentProperty]);

  if (similarProperties.length === 0 && !loading) {
    return null;
  }

  return (
    <Stack spacing={6}>
      <Heading size="lg">
        {t("publicPages.detail.similarProperties", { defaultValue: "Similar Properties" })}
      </Heading>
      <SimpleGrid
        className="property-card-grid"
        minChildWidth={PROPERTY_CARD_MIN_WIDTH}
        spacing={PROPERTY_CARD_GRID_SPACING}
      >
        {similarProperties.map((property) => (
          <ModernPropertyCard
            key={property._id}
            property={property}
            isFavorite={false}
            isInCompare={false}
            onFavoriteToggle={() => {}}
            onCompareToggle={() => {}}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default SimilarProperties;
