import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect, useMemo, useState } from "react";
import { putApi } from "services/api";

const verificationOptions = [
  { value: "address", label: "Адрес подтвержден" },
  { value: "price", label: "Цена подтверждена" },
  { value: "description", label: "Описание заполнено" },
  { value: "photos", label: "Есть фотографии" },
  { value: "documents", label: "Есть документы" },
  { value: "agent", label: "Назначен агент" },
];

const collectionOptions = [
  { value: "verified", label: "Проверенные объявления" },
  { value: "family-homes", label: "Семейные дома" },
  { value: "city-apartments", label: "Городские квартиры" },
  { value: "investment-plots", label: "Инвестиционные участки" },
  { value: "premium-commercial", label: "Премиальная коммерция" },
];

const defaultChecklist = (property = {}) => {
  const checklist = [];

  if (property?.propertyAddress) checklist.push("address");
  if (property?.listingPrice) checklist.push("price");
  if (property?.marketingDescription || property?.propertyDescription) checklist.push("description");
  if (Array.isArray(property?.propertyPhotos) && property.propertyPhotos.length > 0) checklist.push("photos");
  if (Array.isArray(property?.propertyDocuments) && property.propertyDocuments.length > 0) checklist.push("documents");
  if (property?.createBy || property?.listingAgentOrTeam) checklist.push("agent");

  return checklist;
};

const statusMeta = {
  pending: { colorScheme: "gray", label: "Ожидает модерации" },
  review: { colorScheme: "orange", label: "На проверке" },
  verified: { colorScheme: "green", label: "Проверено" },
};

export default function ListingVerificationPanel({ property, onUpdated, canManage = false }) {
  const toast = useToast();
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtleBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    verificationStatus: "pending",
    verificationScore: 0,
    verificationNotes: "",
    verificationChecklist: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    publicSlug: "",
    featuredCollections: [],
  });

  useEffect(() => {
    if (!property) return;

    const checklist = Array.isArray(property?.verificationChecklist) && property.verificationChecklist.length
      ? property.verificationChecklist
      : property?.verification?.checklist?.length
        ? property.verification.checklist
        : defaultChecklist(property);

    setForm({
      verificationStatus: property?.verificationStatus || property?.verification?.status || "pending",
      verificationScore: Number(property?.verificationScore ?? property?.verification?.score ?? Math.min(checklist.length * 20, 100)),
      verificationNotes: property?.verificationNotes || property?.verification?.notes || "",
      verificationChecklist: checklist,
      seoTitle: property?.seoTitle || property?.seo?.title || "",
      seoDescription: property?.seoDescription || property?.seo?.description || "",
      seoKeywords: property?.seoKeywords || property?.seo?.keywords || "",
      publicSlug: property?.publicSlug || property?.seo?.slug || "",
      featuredCollections: Array.isArray(property?.featuredCollections) ? property.featuredCollections : [],
    });
  }, [property]);

  const status = useMemo(() => statusMeta[form.verificationStatus] || statusMeta.pending, [form.verificationStatus]);
  const publicUrl = useMemo(() => {
    if (!property?._id || typeof window === "undefined") return "";
    return window.location.origin + "/offers/" + property._id;
  }, [property?._id]);

  if (!property) return null;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleArrayValue = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: current[field]?.includes(value)
        ? current[field].filter((item) => item !== value)
        : [...(current[field] || []), value],
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await putApi("api/property/verify/" + property._id, {
        verificationStatus: form.verificationStatus,
        verificationScore: Number(form.verificationScore) || 0,
        verificationNotes: form.verificationNotes,
        verificationChecklist: form.verificationChecklist,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        publicSlug: form.publicSlug,
        featuredCollections: form.featuredCollections,
      });

      if (response?.status === 200) {
        toast({ title: "Карточка обновлена", status: "success" });
        onUpdated?.();
        return;
      }

      toast({ title: "Не удалось сохранить изменения", status: "error" });
    } catch (error) {
      toast({ title: "Не удалось сохранить изменения", status: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card mt={4}>
      <Stack spacing={5}>
        <Box display="flex" justifyContent="space-between" alignItems={{ base: "flex-start", md: "center" }} flexDirection={{ base: "column", md: "row" }} gap={3}>
          <Box>
            <Text fontSize="xl" fontWeight="700">Верификация и SEO</Text>
            <Text color={mutedColor} mt={1}>
              Управление статусом доверия объявления, SEO-метаданными и подборками для посадочных страниц.
            </Text>
          </Box>
          <Stack spacing={2} align={{ base: "flex-start", md: "flex-end" }}>
            <Badge colorScheme={status.colorScheme} px={3} py={1} borderRadius="full">
              {status.label}
            </Badge>
            {publicUrl ? (
              <Link href={publicUrl} isExternal color="brand.500" fontWeight="600">
                Открыть публичную карточку
              </Link>
            ) : null}
          </Stack>
        </Box>

        {!canManage ? (
          <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" bg={subtleBg} p={4}>
            <Text color={mutedColor}>У вас нет прав на изменение verified-статуса и SEO-настроек этого объявления.</Text>
          </Box>
        ) : null}

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Статус проверки</FormLabel>
              <Select value={form.verificationStatus} onChange={(event) => updateField("verificationStatus", event.target.value)} isDisabled={!canManage}>
                <option value="pending">Ожидает модерации</option>
                <option value="review">На проверке</option>
                <option value="verified">Проверено</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Индекс доверия, %</FormLabel>
              <Input type="number" min="0" max="100" value={form.verificationScore} onChange={(event) => updateField("verificationScore", event.target.value)} isDisabled={!canManage} />
            </FormControl>
            <FormControl>
              <FormLabel>Комментарий модерации</FormLabel>
              <Textarea rows={5} value={form.verificationNotes} onChange={(event) => updateField("verificationNotes", event.target.value)} isDisabled={!canManage} placeholder="Что проверено, что ещё нужно загрузить, какие данные нужно уточнить" />
            </FormControl>
            <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" p={4}>
              <Text fontWeight="600" mb={3}>Чеклист доверия</Text>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                {verificationOptions.map((item) => (
                  <Checkbox
                    key={item.value}
                    isChecked={form.verificationChecklist.includes(item.value)}
                    onChange={() => toggleArrayValue("verificationChecklist", item.value)}
                    isDisabled={!canManage}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              </Grid>
            </Box>
          </Stack>

          <Stack spacing={4}>
            <FormControl>
              <FormLabel>SEO title</FormLabel>
              <Input value={form.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} isDisabled={!canManage} placeholder="Например: Дом у леса в Подмосковье | Название агентства" />
            </FormControl>
            <FormControl>
              <FormLabel>SEO description</FormLabel>
              <Textarea rows={4} value={form.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} isDisabled={!canManage} placeholder="Короткое описание для поисковой выдачи и социальных карточек" />
            </FormControl>
            <FormControl>
              <FormLabel>SEO keywords</FormLabel>
              <Input value={form.seoKeywords} onChange={(event) => updateField("seoKeywords", event.target.value)} isDisabled={!canManage} placeholder="дом, купить дом, загородная недвижимость, москва" />
            </FormControl>
            <FormControl>
              <FormLabel>Публичный slug</FormLabel>
              <Input value={form.publicSlug} onChange={(event) => updateField("publicSlug", event.target.value)} isDisabled={!canManage} placeholder="dom-u-lesa-v-podmoskove" />
            </FormControl>
            <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" p={4}>
              <Text fontWeight="600" mb={3}>SEO-подборки</Text>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                {collectionOptions.map((item) => (
                  <Checkbox
                    key={item.value}
                    isChecked={form.featuredCollections.includes(item.value)}
                    onChange={() => toggleArrayValue("featuredCollections", item.value)}
                    isDisabled={!canManage}
                  >
                    {item.label}
                  </Checkbox>
                ))}
              </Grid>
              <Text mt={3} color={mutedColor} fontSize="sm">
                Отмеченные подборки получают этот объект на SEO-лендингах даже если он не подходит под автоматические правила.
              </Text>
            </Box>
          </Stack>
        </SimpleGrid>

        <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" bg={subtleBg} p={4}>
          <Text fontWeight="600" mb={2}>Памятка по воронке</Text>
          <Text color={mutedColor}>
            После сохранения объект получает verified-статус для публичной витрины, может попадать на SEO-страницы подборок и использоваться в публичных лид-формах с агентом.
          </Text>
        </Box>

        <Box display="flex" justifyContent="flex-end">
          <Button colorScheme="green" onClick={handleSave} isLoading={isSaving} isDisabled={!canManage}>
            Сохранить модерацию
          </Button>
        </Box>
      </Stack>
    </Card>
  );
}
