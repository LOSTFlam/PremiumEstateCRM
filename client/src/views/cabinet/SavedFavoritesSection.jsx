import { useCallback, useState } from "react";
import { Box, Button, Flex, Heading, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiDownload, FiShare2 } from "react-icons/fi";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";
import { clearFavoriteIds } from "views/public/catalog/catalogStorage";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import FavoritesDraggableGrid from "./FavoritesDraggableGrid";
import PropertyNotesPanel from "./PropertyNotesPanel";
import { exportFavoritesPdf, shareFavorites } from "./cabinetExport";
import { useCabinetTheme } from "./useCabinetTheme";

const CabinetSection = ({ title, description, children, actions }) => {
  const theme = useCabinetTheme();

  return (
    <Stack spacing={5}>
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        wrap="wrap"
      >
        <Box>
          <Heading size="md" color={theme.heading} mb={2}>
            {title}
          </Heading>
          {description ? (
            <Text color={theme.muted} maxW="720px">
              {description}
            </Text>
          ) : null}
        </Box>
        {actions}
      </Flex>
      {children}
    </Stack>
  );
};

const SavedFavoritesSection = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const theme = useCabinetTheme();
  const { favoriteIds, propertyNotes, refreshLocal } = useCabinetPreferences({ autoSync: false });
  const [exporting, setExporting] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!favoriteIds.length) return [];

    try {
      const response = await getApi(`api/property/public/by-ids?ids=${favoriteIds.join(",")}`, {
        silent: true,
      });
      const remote = extractCollection(response);
      if (remote.length) return remote;
    } catch {
      // fallback below
    }

    const catalog = await fetchPublicCatalog();
    return catalog.filter((item) => favoriteIds.includes(item?._id));
  }, [favoriteIds]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const properties = await loadFavorites();
      exportFavoritesPdf({ properties, t, locale: i18n.language, toast });
    } finally {
      setExporting(false);
    }
  };

  const handleShare = () => shareFavorites({ count: favoriteIds.length, t, toast });

  return (
    <CabinetSection
      title={t("cabinet.sections.saved")}
      description={t("cabinet.sections.savedDesc")}
      actions={
        favoriteIds.length > 0 ? (
          <HStack flexWrap="wrap">
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              colorScheme="green"
              onClick={handleExport}
              isLoading={exporting}
            >
              {t("cabinet.export.pdf")}
            </Button>
            <Button leftIcon={<FiShare2 />} variant="outline" onClick={handleShare}>
              {t("cabinet.export.share")}
            </Button>
            <Button
              variant="outline"
              colorScheme="red"
              onClick={() => {
                clearFavoriteIds();
                refreshLocal();
              }}
            >
              {t("cabinet.clearAll")}
            </Button>
          </HStack>
        ) : null
      }
    >
      {favoriteIds.length ? (
        <FavoritesDraggableGrid ids={favoriteIds} onReorder={refreshLocal} />
      ) : (
        <Box {...theme.emptyStateStyle} textAlign="center">
          <Text color={theme.heading} fontWeight="700" mb={2}>
            {t("cabinet.savedEmpty.title")}
          </Text>
          <Text color={theme.muted}>{t("cabinet.savedEmpty.text")}</Text>
        </Box>
      )}
      <PropertyNotesPanel
        favoriteIds={favoriteIds}
        propertyNotes={propertyNotes}
        onSaved={refreshLocal}
      />
    </CabinetSection>
  );
};

export default SavedFavoritesSection;
