import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { fetchStorefrontSettings, updateStorefrontSettings } from "services/storefrontSettings";
import {
  COLLECTION_STOREFRONT_SLUGS,
  getStorefrontPresetMeta,
  mergeStorefrontPresets,
} from "utils/storefrontPresets";

const pageCopy = {
  ru: {
    eyebrow: "Витрина системы",
    title: "Фильтры кнопок и коллекций",
    description:
      "Настройка этих пресетов управляет тем, что открывается по кнопкам на главной и на страницах каталога. Здесь можно задать тип, статус, бюджет, спальни, санузлы и дополнительные сигналы качества карточки.",
    routeLabel: "Маршрут",
    updatedLabel: "Обновлено",
    save: "Сохранить изменения",
    saving: "Сохранение...",
    active: "Активен",
    type: "Тип объекта",
    status: "Статус",
    minPrice: "Цена от",
    maxPrice: "Цена до",
    bedrooms: "Спальни от",
    bathrooms: "Санузлы от",
    verification: "Проверка",
    collection: "Выделенная подборка",
    sort: "Сортировка",
    onlyWithPhotos: "Только с фото",
    onlyRich: "Только полные карточки",
    target: "Применяется к публичной странице",
    allValue: "Любое значение",
    saved: "Настройки витрины сохранены.",
    loadError: "Не удалось загрузить настройки витрины.",
    saveError: "Не удалось сохранить настройки витрины.",
    emptyCollection: "Без дополнительной подборки",
    typeAll: "Все объекты",
    typeHouse: "Дома",
    typeApartment: "Квартиры",
    typeLand: "Участки",
    typeCommercial: "Коммерция",
    statusAll: "Все статусы",
    statusAvailable: "Доступно",
    statusNew: "Новое",
    statusActive: "Активно",
    statusPending: "В резерве",
    verificationAll: "Любая",
    verificationVerified: "Проверено",
    verificationPending: "На проверке",
    verificationRejected: "Не подтверждено",
    sortLatest: "Сначала новые",
    sortHigh: "Цена по убыванию",
    sortLow: "Цена по возрастанию",
    sortRich: "Лучшее наполнение",
  },
  en: {
    eyebrow: "Storefront CRM",
    title: "Button and collection filters",
    description:
      "These presets control what opens from the homepage buttons and catalog entry pages. Configure type, status, budget, bedrooms, bathrooms, and listing-quality defaults here.",
    routeLabel: "Route",
    updatedLabel: "Updated",
    save: "Save changes",
    saving: "Saving...",
    active: "Active",
    type: "Property type",
    status: "Status",
    minPrice: "Price from",
    maxPrice: "Price to",
    bedrooms: "Bedrooms from",
    bathrooms: "Bathrooms from",
    verification: "Verification",
    collection: "Featured collection",
    sort: "Sort by",
    onlyWithPhotos: "Only with photos",
    onlyRich: "Only rich listings",
    target: "Applies to the public page",
    allValue: "Any value",
    saved: "Storefront settings saved.",
    loadError: "Failed to load storefront settings.",
    saveError: "Failed to save storefront settings.",
    emptyCollection: "No extra collection",
    typeAll: "All properties",
    typeHouse: "Houses",
    typeApartment: "Apartments",
    typeLand: "Land",
    typeCommercial: "Commercial",
    statusAll: "All statuses",
    statusAvailable: "Available",
    statusNew: "New",
    statusActive: "Active",
    statusPending: "Pending",
    verificationAll: "Any",
    verificationVerified: "Verified",
    verificationPending: "Pending",
    verificationRejected: "Rejected",
    sortLatest: "Latest first",
    sortHigh: "Price high to low",
    sortLow: "Price low to high",
    sortRich: "Best listing quality",
  },
};

const bedroomsOptions = ["all", "1", "2", "3", "4", "5"];
const bathroomsOptions = ["all", "1", "2", "3", "4"];
const featuredCollectionOptions = ["", ...COLLECTION_STOREFRONT_SLUGS];

const formatUpdatedDate = (value, language) => {
  if (!value) return "—";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";

  return new Intl.DateTimeFormat(
    String(language).toLowerCase().startsWith("ru") ? "ru-RU" : "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(parsed);
};

export default function StorefrontFilters() {
  const { i18n } = useTranslation();
  const toast = useToast();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = pageCopy[locale];
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatedDate, setUpdatedDate] = useState(null);
  const [presets, setPresets] = useState([]);
  const panelBg = "#f8fafc";
  const cardBg = "#ffffff";
  const borderTone = "#d8e1ea";
  const headingTone = "gray.900";
  const bodyTone = "gray.700";
  const mutedTone = "gray.600";

  const typeOptions = useMemo(
    () => [
      { value: "all", label: copy.typeAll },
      { value: "house", label: copy.typeHouse },
      { value: "apartment", label: copy.typeApartment },
      { value: "land", label: copy.typeLand },
      { value: "commercial", label: copy.typeCommercial },
    ],
    [copy.typeAll, copy.typeApartment, copy.typeCommercial, copy.typeHouse, copy.typeLand]
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: copy.statusAll },
      { value: "available", label: copy.statusAvailable },
      { value: "new", label: copy.statusNew },
      { value: "active", label: copy.statusActive },
      { value: "pending", label: copy.statusPending },
    ],
    [copy.statusActive, copy.statusAll, copy.statusAvailable, copy.statusNew, copy.statusPending]
  );

  const verificationOptions = useMemo(
    () => [
      { value: "all", label: copy.verificationAll },
      { value: "verified", label: copy.verificationVerified },
      { value: "pending", label: copy.verificationPending },
      { value: "rejected", label: copy.verificationRejected },
    ],
    [
      copy.verificationAll,
      copy.verificationPending,
      copy.verificationRejected,
      copy.verificationVerified,
    ]
  );

  const sortOptions = useMemo(
    () => [
      { value: "latest", label: copy.sortLatest },
      { value: "priceHigh", label: copy.sortHigh },
      { value: "priceLow", label: copy.sortLow },
      { value: "bestFilled", label: copy.sortRich },
    ],
    [copy.sortHigh, copy.sortLatest, copy.sortLow, copy.sortRich]
  );

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);

      try {
        const response = await fetchStorefrontSettings();
        if (!ignore) {
          setPresets(mergeStorefrontPresets(response.presets));
          setUpdatedDate(response.updatedDate);
        }
      } catch (error) {
        if (!ignore) {
          toast({
            title: copy.loadError,
            status: "error",
            duration: 2500,
          });
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [copy.loadError, toast]);

  const updatePreset = (slug, patch) => {
    setPresets((current) =>
      current.map((preset) =>
        preset.slug === slug
          ? {
              ...preset,
              ...patch,
            }
          : preset
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await updateStorefrontSettings(presets);
      setPresets(mergeStorefrontPresets(response.presets));
      setUpdatedDate(response.updatedDate);
      toast({
        title: copy.saved,
        status: "success",
        duration: 2200,
      });
    } catch (error) {
      toast({
        title: copy.saveError,
        status: "error",
        duration: 2500,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box pt={4}>
        <HStack spacing={3}>
          <Spinner size="sm" />
          <Text>{copy.title}</Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Stack spacing={6}>
      <Box
        bg={panelBg}
        borderRadius="24px"
        p={{ base: 5, md: 6 }}
        border="1px solid"
        borderColor={borderTone}
        boxShadow="0 18px 46px rgba(15, 23, 42, 0.08)"
      >
        <Stack spacing={4}>
          <HStack justify="space-between" align={{ base: "start", md: "center" }} flexWrap="wrap">
            <Box>
              <Badge colorScheme="blue" mb={3}>
                {copy.eyebrow}
              </Badge>
              <Heading size="lg" color={headingTone}>
                {copy.title}
              </Heading>
            </Box>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={saving}
              loadingText={copy.saving}
            >
              {copy.save}
            </Button>
          </HStack>
          <Text color={bodyTone} maxW="5xl">
            {copy.description}
          </Text>
          <Text fontSize="sm" color={mutedTone}>
            {copy.updatedLabel}: {formatUpdatedDate(updatedDate, i18n.language)}
          </Text>
        </Stack>
      </Box>

      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
        {presets.map((preset) => {
          const meta = getStorefrontPresetMeta(preset.slug, i18n.language);

          return (
            <Box
              key={preset.slug}
              bg={cardBg}
              borderRadius="24px"
              p={{ base: 5, md: 6 }}
              border="1px solid"
              borderColor={borderTone}
              boxShadow="0 14px 36px rgba(15, 23, 42, 0.06)"
            >
              <Stack spacing={5}>
                <HStack justify="space-between" align="start">
                  <Box>
                    <Heading size="md" color={headingTone}>
                      {meta?.adminLabel || preset.slug}
                    </Heading>
                    <Text mt={1} fontSize="sm" color={mutedTone}>
                      {copy.routeLabel}: {meta?.route || "/offers"}
                    </Text>
                  </Box>
                  <HStack spacing={3}>
                    <Text fontSize="sm" color={bodyTone}>
                      {copy.active}
                    </Text>
                    <Switch
                      colorScheme="blue"
                      isChecked={Boolean(preset.isActive)}
                      onChange={(event) =>
                        updatePreset(preset.slug, { isActive: event.target.checked })
                      }
                    />
                  </HStack>
                </HStack>

                <Text fontSize="sm" color={bodyTone}>
                  {meta?.description || copy.target}
                </Text>

                <Divider />

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.type}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.type}
                      onChange={(event) => updatePreset(preset.slug, { type: event.target.value })}
                    >
                      {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.status}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.status}
                      onChange={(event) =>
                        updatePreset(preset.slug, { status: event.target.value })
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.minPrice}
                    </FormLabel>
                    <Input
                      bg="white"
                      value={preset.minPrice}
                      onChange={(event) =>
                        updatePreset(preset.slug, { minPrice: event.target.value })
                      }
                      placeholder="0"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.maxPrice}
                    </FormLabel>
                    <Input
                      bg="white"
                      value={preset.maxPrice}
                      onChange={(event) =>
                        updatePreset(preset.slug, { maxPrice: event.target.value })
                      }
                      placeholder="1000000"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.bedrooms}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.bedrooms}
                      onChange={(event) =>
                        updatePreset(preset.slug, { bedrooms: event.target.value })
                      }
                    >
                      {bedroomsOptions.map((value) => (
                        <option key={value} value={value}>
                          {value === "all" ? copy.allValue : `${value}+`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.bathrooms}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.bathrooms}
                      onChange={(event) =>
                        updatePreset(preset.slug, { bathrooms: event.target.value })
                      }
                    >
                      {bathroomsOptions.map((value) => (
                        <option key={value} value={value}>
                          {value === "all" ? copy.allValue : `${value}+`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.verification}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.verificationStatus}
                      onChange={(event) =>
                        updatePreset(preset.slug, {
                          verificationStatus: event.target.value,
                        })
                      }
                    >
                      {verificationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.sort}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.sortBy}
                      onChange={(event) =>
                        updatePreset(preset.slug, { sortBy: event.target.value })
                      }
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl gridColumn={{ base: "auto", md: "1 / -1" }}>
                    <FormLabel color={headingTone} fontWeight="600">
                      {copy.collection}
                    </FormLabel>
                    <Select
                      bg="white"
                      value={preset.featuredCollection}
                      onChange={(event) =>
                        updatePreset(preset.slug, {
                          featuredCollection: event.target.value,
                        })
                      }
                    >
                      <option value="">{copy.emptyCollection}</option>
                      {featuredCollectionOptions.filter(Boolean).map((slug) => {
                        const collectionMeta = getStorefrontPresetMeta(slug, i18n.language);
                        return (
                          <option key={slug} value={slug}>
                            {collectionMeta?.adminLabel || slug}
                          </option>
                        );
                      })}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack
                    justify="space-between"
                    border="1px solid"
                    borderColor={borderTone}
                    borderRadius="16px"
                    px={4}
                    py={3}
                    bg={panelBg}
                  >
                    <Text color={headingTone} fontWeight="600">
                      {copy.onlyWithPhotos}
                    </Text>
                    <Switch
                      colorScheme="blue"
                      isChecked={Boolean(preset.onlyWithPhotos)}
                      onChange={(event) =>
                        updatePreset(preset.slug, {
                          onlyWithPhotos: event.target.checked,
                        })
                      }
                    />
                  </HStack>
                  <HStack
                    justify="space-between"
                    border="1px solid"
                    borderColor={borderTone}
                    borderRadius="16px"
                    px={4}
                    py={3}
                    bg={panelBg}
                  >
                    <Text color={headingTone} fontWeight="600">
                      {copy.onlyRich}
                    </Text>
                    <Switch
                      colorScheme="blue"
                      isChecked={Boolean(preset.onlyRich)}
                      onChange={(event) =>
                        updatePreset(preset.slug, {
                          onlyRich: event.target.checked,
                        })
                      }
                    />
                  </HStack>
                </SimpleGrid>
              </Stack>
            </Box>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
