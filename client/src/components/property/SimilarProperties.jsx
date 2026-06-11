import { useEffect, useState } from "react";
import { Box as _Box, Heading, SimpleGrid, Stack, Text as _Text, useToast } from "@chakra-ui/react";
import { getApi } from "services/api";
import ModernPropertyCard from "components/ModernPropertyCard";
import {
  PROPERTY_CARD_GRID_SPACING,
  PROPERTY_CARD_MIN_WIDTH,
} from "views/public/catalog/propertyCardLayout";
import { useTranslation } from "react-i18next";

const SimilarProperties = ({ currentProperty }) => {
  const { t: _t } = useTranslation();
  const _toast = useToast();
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSimilarProperties();
  }, [currentProperty]);

  const fetchSimilarProperties = async () => {
    if (!currentProperty) return;

    try {
      setLoading(true);
      const response = await getApi(
        `api/property/public/similar?propertyType=${currentProperty.propertyTypeKey}&location=${currentProperty.propertyAddress}&limit=3`
      );
      if (response && response.data) {
        // Filter out the current property
        const filtered = response.data.filter((p) => p._id !== currentProperty._id);
        setSimilarProperties(filtered.slice(0, 3));
      }
    } catch (error) {
      // Console statement removed
    } finally {
      setLoading(false);
    }
  };

  if (similarProperties.length === 0 && !loading) {
    return null;
  }

  return (
    <Stack spacing={6}>
      <Heading size="lg">Similar Properties</Heading>
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
