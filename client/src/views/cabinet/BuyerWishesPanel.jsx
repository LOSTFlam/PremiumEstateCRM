import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { saveExtendedPreferences } from "services/userPreferences";

const panelStyle = {
  borderRadius: "24px",
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid",
  borderColor: "whiteAlpha.200",
  p: { base: 5, md: 7 },
};

const PROPERTY_TYPES = ["house", "apartment", "land", "commercial"];

const BuyerWishesPanel = ({ buyerProfile = {}, onSaved }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    budgetMin: "",
    budgetMax: "",
    preferredCity: "",
    propertyTypes: [],
    bedroomsMin: "",
    contactMethod: "phone",
    about: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      budgetMin: buyerProfile.budgetMin ?? "",
      budgetMax: buyerProfile.budgetMax ?? "",
      preferredCity: buyerProfile.preferredCity || "",
      propertyTypes: buyerProfile.propertyTypes || [],
      bedroomsMin: buyerProfile.bedroomsMin ?? "",
      contactMethod: buyerProfile.contactMethod || "phone",
      about: buyerProfile.about || "",
    });
  }, [buyerProfile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveExtendedPreferences({
        buyerProfile: {
          budgetMin: form.budgetMin === "" ? null : Number(form.budgetMin),
          budgetMax: form.budgetMax === "" ? null : Number(form.budgetMax),
          preferredCity: form.preferredCity,
          propertyTypes: form.propertyTypes,
          bedroomsMin: form.bedroomsMin === "" ? null : Number(form.bedroomsMin),
          contactMethod: form.contactMethod,
          about: form.about,
        },
      });
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box {...panelStyle}>
      <Heading size="md" color="white" mb={2}>
        {t("cabinet.wishes.title")}
      </Heading>
      <Text color="whiteAlpha.700" mb={5}>
        {t("cabinet.wishes.desc")}
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
        <FormControl>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.budgetMin")}</FormLabel>
          <NumberInput
            value={form.budgetMin}
            onChange={(_, value) => setForm({ ...form, budgetMin: value })}
            min={0}
          >
            <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" color="white" />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.budgetMax")}</FormLabel>
          <NumberInput
            value={form.budgetMax}
            onChange={(_, value) => setForm({ ...form, budgetMax: value })}
            min={0}
          >
            <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" color="white" />
          </NumberInput>
        </FormControl>
        <FormControl gridColumn={{ md: "span 2" }}>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.city")}</FormLabel>
          <Input
            value={form.preferredCity}
            onChange={(event) => setForm({ ...form, preferredCity: event.target.value })}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            color="white"
          />
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.bedrooms")}</FormLabel>
          <NumberInput
            value={form.bedroomsMin}
            onChange={(_, value) => setForm({ ...form, bedroomsMin: value })}
            min={0}
            max={20}
          >
            <NumberInputField bg="whiteAlpha.100" borderColor="whiteAlpha.300" color="white" />
          </NumberInput>
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.contactMethod")}</FormLabel>
          <Select
            value={form.contactMethod}
            onChange={(event) => setForm({ ...form, contactMethod: event.target.value })}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            color="white"
          >
            <option value="phone">{t("cabinet.wishes.contactPhone")}</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">{t("common.email")}</option>
          </Select>
        </FormControl>
        <FormControl gridColumn={{ md: "span 2" }}>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.types")}</FormLabel>
          <CheckboxGroup
            value={form.propertyTypes}
            onChange={(value) => setForm({ ...form, propertyTypes: value })}
          >
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} flexWrap="wrap">
              {PROPERTY_TYPES.map((type) => (
                <Checkbox key={type} value={type} colorScheme="green">
                  <Text color="whiteAlpha.900">{t(`cabinet.wishes.type.${type}`)}</Text>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl gridColumn={{ md: "span 2" }}>
          <FormLabel color="whiteAlpha.800">{t("cabinet.wishes.about")}</FormLabel>
          <Textarea
            value={form.about}
            onChange={(event) => setForm({ ...form, about: event.target.value })}
            placeholder={t("cabinet.wishes.aboutPlaceholder")}
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            color="white"
            rows={4}
            maxLength={1000}
          />
        </FormControl>
      </Grid>

      <Button mt={6} colorScheme="green" onClick={handleSave} isLoading={saving}>
        {t("cabinet.wishes.save")}
      </Button>
    </Box>
  );
};

export default BuyerWishesPanel;
