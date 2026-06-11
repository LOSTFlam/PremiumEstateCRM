import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { saveExtendedPreferences } from "services/userPreferences";
import { useCabinetTheme } from "./useCabinetTheme";

const PropertyNotesPanel = ({ favoriteIds = [], propertyNotes = {}, onSaved }) => {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const [drafts, setDrafts] = useState(propertyNotes);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDrafts(propertyNotes);
  }, [propertyNotes]);

  const noteIds = useMemo(
    () => favoriteIds.filter((id) => drafts[id] !== undefined || propertyNotes[id]),
    [favoriteIds, drafts, propertyNotes]
  );

  const visibleIds = favoriteIds.slice(0, 8);

  const handleSave = async () => {
    setSaving(true);
    try {
      const nextNotes = { ...propertyNotes };
      visibleIds.forEach((id) => {
        const text = String(drafts[id] || "").trim();
        if (text) nextNotes[id] = text;
        else delete nextNotes[id];
      });
      await saveExtendedPreferences({ propertyNotes: nextNotes });
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  if (!favoriteIds.length) return null;

  return (
    <Box {...theme.panelStyle} p={{ base: 5, md: 6 }}>
      <Heading size="sm" color={theme.heading} mb={2}>
        {t("cabinet.notes.title")}
      </Heading>
      <Text color={theme.muted} fontSize="sm" mb={4}>
        {t("cabinet.notes.desc")}
      </Text>
      <Stack spacing={4}>
        {visibleIds.map((id) => (
          <FormControl key={id}>
            <FormLabel color={theme.muted} fontSize="sm">
              {t("cabinet.notes.forProperty", { id: id.slice(-6) })}
            </FormLabel>
            <Textarea
              value={drafts[id] ?? propertyNotes[id] ?? ""}
              onChange={(event) => setDrafts({ ...drafts, [id]: event.target.value })}
              placeholder={t("cabinet.notes.placeholder")}
              rows={2}
              maxLength={500}
              {...theme.inputFieldProps}
            />
          </FormControl>
        ))}
      </Stack>
      <Button mt={4} colorScheme="green" size="sm" onClick={handleSave} isLoading={saving}>
        {t("cabinet.notes.save")}
      </Button>
      {noteIds.length > visibleIds.length ? (
        <Text mt={3} fontSize="xs" color={theme.subtle}>
          {t("cabinet.notes.moreHidden", { count: noteIds.length - visibleIds.length })}
        </Text>
      ) : null}
    </Box>
  );
};

export default PropertyNotesPanel;
