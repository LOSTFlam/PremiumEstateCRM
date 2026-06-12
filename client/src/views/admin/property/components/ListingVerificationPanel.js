import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Input,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { putApi } from "services/api";
import { extractApiErrorMessage } from "utils/errorMessages";
import { normalizeModerationStatus, moderationStatusMeta } from "utils/moderationStatus";

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
  if (property?.marketingDescription || property?.propertyDescription)
    checklist.push("description");
  if (Array.isArray(property?.propertyPhotos) && property.propertyPhotos.length > 0)
    checklist.push("photos");
  if (Array.isArray(property?.propertyDocuments) && property.propertyDocuments.length > 0)
    checklist.push("documents");
  if (property?.createBy || property?.listingAgentOrTeam) checklist.push("agent");

  return checklist;
};

export default function ListingVerificationPanel({ property, onUpdated, canManage = false }) {
  const { t } = useTranslation();
  const toast = useToast();
  const compactActions = useBreakpointValue({ base: true, md: false }) ?? true;
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtleBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const mutedColor = useColorModeValue("gray.600", "gray.300");
  const [isSaving, setIsSaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [blockUser, setBlockUser] = useState(false);
  const [userBlockReason, setUserBlockReason] = useState("");
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

    const checklist =
      Array.isArray(property?.verificationChecklist) && property.verificationChecklist.length
        ? property.verificationChecklist
        : property?.verification?.checklist?.length
          ? property.verification.checklist
          : defaultChecklist(property);

    setForm({
      verificationStatus: normalizeModerationStatus(property),
      verificationScore: Number(
        property?.verificationScore ??
          property?.verification?.score ??
          Math.min(checklist.length * 20, 100)
      ),
      verificationNotes: property?.verificationNotes || property?.verification?.notes || "",
      verificationChecklist: checklist,
      seoTitle: property?.seoTitle || property?.seo?.title || "",
      seoDescription: property?.seoDescription || property?.seo?.description || "",
      seoKeywords: property?.seoKeywords || property?.seo?.keywords || "",
      publicSlug: property?.publicSlug || property?.seo?.slug || "",
      featuredCollections: Array.isArray(property?.featuredCollections)
        ? property.featuredCollections
        : [],
    });
    setRejectionReason(property?.rejectionReason || property?.verification?.rejectionReason || "");
  }, [property]);

  const status = useMemo(
    () => moderationStatusMeta(form.verificationStatus, t),
    [form.verificationStatus, t]
  );

  const owner = property?.createBy;
  const ownerName = [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim();
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

  const saveModeration = async (payload) => {
    const response = await putApi("api/property/verify/" + property._id, {
      verificationScore: Number(form.verificationScore) || 0,
      verificationNotes: form.verificationNotes,
      verificationChecklist: form.verificationChecklist,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords,
      publicSlug: form.publicSlug,
      featuredCollections: form.featuredCollections,
      ...payload,
    });
    return response;
  };

  const handleApprove = async () => {
    try {
      setIsSaving(true);
      await saveModeration({ decision: "approve" });
      toast({ title: "Объявление одобрено и опубликовано", status: "success" });
      onUpdated?.();
    } catch (error) {
      toast({
        title: extractApiErrorMessage(error, "ru") || "Не удалось одобрить объявление",
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Укажите причину отклонения — она будет показана пользователю",
        status: "warning",
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveModeration({
        decision: "reject",
        rejectionReason: rejectionReason.trim(),
        blockUser,
        userBlockReason: userBlockReason.trim() || rejectionReason.trim(),
      });
      toast({
        title: blockUser
          ? "Объявление отклонено, пользователь заблокирован"
          : "Объявление отклонено",
        status: "info",
      });
      onUpdated?.();
    } catch (error) {
      toast({
        title: extractApiErrorMessage(error, "ru") || "Не удалось отклонить объявление",
        status: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMeta = async () => {
    try {
      setIsSaving(true);
      await saveModeration({ verificationStatus: form.verificationStatus });
      toast({ title: "Настройки сохранены", status: "success" });
      onUpdated?.();
    } catch (error) {
      toast({ title: "Не удалось сохранить изменения", status: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card mt={4}>
      <Stack spacing={5}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          gap={3}
        >
          <Box>
            <Text fontSize="xl" fontWeight="700">
              Модерация объявления
            </Text>
            <Text color={mutedColor} mt={1}>
              Одобрите объявление для публикации на сайте или отклоните с указанием причины
            </Text>
          </Box>
          <Stack spacing={2} align={{ base: "flex-start", md: "flex-end" }}>
            <Badge colorScheme={status.colorScheme} px={3} py={1} borderRadius="full">
              {status.label}
            </Badge>
            {publicUrl && form.verificationStatus === "approved" ? (
              <Link href={publicUrl} isExternal color="brand.500" fontWeight="600">
                Открыть на сайте
              </Link>
            ) : null}
          </Stack>
        </Box>

        <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" bg={subtleBg} p={4}>
          <Text fontWeight="600" mb={1}>
            Автор объявления
          </Text>
          <Text>{ownerName || owner?.username || owner?.email || "—"}</Text>
          {owner?.isBlocked ? (
            <Badge mt={2} colorScheme="red">
              Пользователь заблокирован
            </Badge>
          ) : null}
        </Box>

        {!canManage ? (
          <Alert status="info" borderRadius="16px">
            <AlertIcon />У вас нет прав на модерацию этого объявления.
          </Alert>
        ) : null}

        {canManage ? (
          <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" p={4}>
            <Text fontWeight="700" mb={3}>
              Быстрые действия
            </Text>
            <HStack spacing={3} flexWrap="wrap">
              <Button colorScheme="green" onClick={handleApprove} isLoading={isSaving}>
                Одобрить
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleReject}
                isLoading={isSaving}
              >
                Отклонить
              </Button>
            </HStack>
            <FormControl mt={4} isRequired>
              <FormLabel>Причина отклонения (видна пользователю)</FormLabel>
              <Textarea
                rows={3}
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Например: фотографии не соответствуют объекту, укажите реальный адрес"
              />
              <FormHelperText>
                Обязательна при отклонении. Пользователь увидит её в разделе «Мои объявления».
              </FormHelperText>
            </FormControl>
            <Stack mt={4} spacing={3}>
              <Checkbox
                isChecked={blockUser}
                onChange={(event) => setBlockUser(event.target.checked)}
              >
                Также заблокировать пользователя
              </Checkbox>
              {blockUser ? (
                <FormControl>
                  <FormLabel>Причина блокировки аккаунта</FormLabel>
                  <Input
                    value={userBlockReason}
                    onChange={(event) => setUserBlockReason(event.target.value)}
                    placeholder="Если пусто — будет использована причина отклонения"
                  />
                </FormControl>
              ) : null}
            </Stack>
          </Box>
        ) : null}

        <Divider />

        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Статус модерации</FormLabel>
              <Select
                value={form.verificationStatus}
                onChange={(event) => updateField("verificationStatus", event.target.value)}
                isDisabled={!canManage}
              >
                <option value="draft">Черновик</option>
                <option value="pending">На модерации</option>
                <option value="approved">Одобрено</option>
                <option value="rejected">Отклонено</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Индекс доверия, %</FormLabel>
              <Input
                type="number"
                min="0"
                max="100"
                value={form.verificationScore}
                onChange={(event) => updateField("verificationScore", event.target.value)}
                isDisabled={!canManage}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Внутренний комментарий</FormLabel>
              <Textarea
                rows={4}
                value={form.verificationNotes}
                onChange={(event) => updateField("verificationNotes", event.target.value)}
                isDisabled={!canManage}
                placeholder="Заметки для администраторов, не видны пользователю"
              />
            </FormControl>
            <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" p={4}>
              <Text fontWeight="600" mb={3}>
                Чеклист проверки
              </Text>
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
              <Input
                value={form.seoTitle}
                onChange={(event) => updateField("seoTitle", event.target.value)}
                isDisabled={!canManage}
              />
            </FormControl>
            <FormControl>
              <FormLabel>SEO description</FormLabel>
              <Textarea
                rows={4}
                value={form.seoDescription}
                onChange={(event) => updateField("seoDescription", event.target.value)}
                isDisabled={!canManage}
              />
            </FormControl>
            <FormControl>
              <FormLabel>SEO keywords</FormLabel>
              <Input
                value={form.seoKeywords}
                onChange={(event) => updateField("seoKeywords", event.target.value)}
                isDisabled={!canManage}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Публичный slug</FormLabel>
              <Input
                value={form.publicSlug}
                onChange={(event) => updateField("publicSlug", event.target.value)}
                isDisabled={!canManage}
              />
            </FormControl>
            <Box borderWidth="1px" borderColor={borderColor} borderRadius="16px" p={4}>
              <Text fontWeight="600" mb={3}>
                SEO-подборки
              </Text>
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
            </Box>
          </Stack>
        </SimpleGrid>

        {canManage ? (
          <Flex
            className="cabinet-panel-actions"
            justify={{ base: "stretch", md: "flex-end" }}
            w="100%"
          >
            <Button
              className="cabinet-btn-fluid"
              variant="outline"
              onClick={handleSaveMeta}
              isLoading={isSaving}
              w={{ base: "100%", md: "auto" }}
              maxW="100%"
            >
              {compactActions ? "Сохранить" : "Сохранить SEO и статус"}
            </Button>
          </Flex>
        ) : null}
      </Stack>
    </Card>
  );
}
