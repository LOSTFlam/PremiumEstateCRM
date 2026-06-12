import { useCallback, useEffect, useState } from "react";
import { Box, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import ModernPropertyCard from "components/ModernPropertyCard";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";
import {
  reorderFavoriteIds,
  toggleCompareId,
  toggleFavoriteId,
} from "views/public/catalog/catalogStorage";
import {
  PROPERTY_CARD_GRID_COLUMNS,
  PROPERTY_CARD_GRID_SPACING,
} from "views/public/catalog/propertyCardLayout";
import { useCabinetTheme } from "./useCabinetTheme";

const sortByIdOrder = (properties, ids) => {
  const order = new Map(ids.map((id, index) => [String(id), index]));
  return [...properties].sort(
    (a, b) => (order.get(String(a?._id)) ?? 999) - (order.get(String(b?._id)) ?? 999)
  );
};

export default function FavoritesDraggableGrid({ ids = [], onReorder }) {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderedIds, setOrderedIds] = useState(ids);
  const [compareIds, setCompareIds] = useState([]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    if (!orderedIds.length) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getApi(`api/property/public/by-ids?ids=${orderedIds.join(",")}`, {
        silent: true,
      });
      const remote = extractCollection(response);
      if (remote.length > 0) {
        setProperties(sortByIdOrder(remote, orderedIds));
        return;
      }
      const catalog = await fetchPublicCatalog();
      setProperties(
        sortByIdOrder(
          catalog.filter((item) => orderedIds.includes(item?._id)),
          orderedIds
        )
      );
    } catch {
      const catalog = await fetchPublicCatalog();
      setProperties(
        sortByIdOrder(
          catalog.filter((item) => orderedIds.includes(item?._id)),
          orderedIds
        )
      );
    } finally {
      setLoading(false);
    }
  }, [orderedIds]);

  useEffect(() => {
    setOrderedIds(ids);
  }, [ids]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const next = [...orderedIds];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setOrderedIds(next);
    reorderFavoriteIds(next);
    onReorder?.();
  };

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={PROPERTY_CARD_GRID_SPACING}>
        {[1, 2].map((item) => (
          <Skeleton key={item} height="420px" borderRadius="24px" />
        ))}
      </SimpleGrid>
    );
  }

  if (!orderedIds.length) return null;

  return (
    <Stack spacing={3}>
      <Text fontSize="sm" color={theme.muted}>
        {t("cabinet.favoritesDragHint")}
      </Text>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="favorites-grid">
          {(provided) => (
            <SimpleGrid
              ref={provided.innerRef}
              {...provided.droppableProps}
              columns={PROPERTY_CARD_GRID_COLUMNS}
              spacing={PROPERTY_CARD_GRID_SPACING}
            >
              {properties.map((property, index) => (
                <Draggable key={property._id} draggableId={String(property._id)} index={index}>
                  {(dragProvided, snapshot) => (
                    <Box
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      transform={snapshot.isDragging ? "scale(1.02)" : undefined}
                      transition="transform 0.2s ease"
                    >
                      <ModernPropertyCard
                        property={property}
                        isFavorite
                        isInCompare={compareIds.includes(property._id)}
                        onFavoriteToggle={() => {
                          toggleFavoriteId(property._id);
                          onReorder?.();
                        }}
                        onCompareToggle={() => setCompareIds(toggleCompareId(property._id))}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </SimpleGrid>
          )}
        </Droppable>
      </DragDropContext>
    </Stack>
  );
}
