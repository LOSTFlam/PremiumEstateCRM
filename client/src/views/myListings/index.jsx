import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  SimpleGrid,
  Skeleton,
  Spinner,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import {
  MdAdd,
  MdBathtub,
  MdDelete,
  MdEdit,
  MdMeetingRoom,
  MdOpenInNew,
  MdOutlineSquareFoot,
} from "react-icons/md";
import { LuBuilding2, LuMapPin } from "react-icons/lu";

import { deleteApi, getApi, postApi, putApi, clearApiCache } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { extractApiErrorMessage } from "utils/errorMessages";
import {
  isListingPublic,
  moderationStatusMeta,
  MODERATION_STATUS,
  normalizeModerationStatus,
} from "utils/moderationStatus";
import PropertyPhotoManager from "components/property/PropertyPhotoManager";
import { formatPrice, normalizePropertyMedia } from "views/public/catalog/catalogData";
import { placeholderImage } from "utils/propertyStockImages";

const DEAL_TYPES = ["sale", "rent"];
const PROPERTY_TYPES = ["Apartment", "House", "Land", "Commercial"];
const STATUSES = ["Available", "Booked", "Sold"];

const emptyForm = {
  name: "",
  dealType: "sale",
  propertyType: "Apartment",
  propertyAddress: "",
  listingPrice: "",
  listingStatus: "Available",
  numberofBedrooms: "",
  numberofBathrooms: "",
  squareFootage: "",
  Floor: "",
  yearBuilt: "",
  parkingAvailability: "",
  propertyDescription: "",
  marketingDescription: "",
};

const listingToForm = (listing) => ({
  ...emptyForm,
  ...Object.fromEntries(
    Object.keys(emptyForm).map((key) => [
      key,
      listing?.[key] === null || listing?.[key] === undefined ? "" : String(listing[key]),
    ])
  ),
  dealType: listing?.dealType || "sale",
  propertyType: listing?.propertyType || "Apartment",
  listingStatus: listing?.listingStatus || "Available",
});

const toNumberOrUndefined = (value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildPayload = (values) => {
  const payload = {
    name: values.name.trim(),
    dealType: values.dealType,
    propertyType: values.propertyType,
    propertyAddress: values.propertyAddress.trim(),
    listingStatus: values.listingStatus,
    parkingAvailability: values.parkingAvailability?.trim() || "",
    propertyDescription: values.propertyDescription?.trim() || "",
    marketingDescription: values.marketingDescription?.trim() || "",
  };

  const price = toNumberOrUndefined(values.listingPrice);
  if (price !== undefined) payload.listingPrice = price;

  const bedrooms = toNumberOrUndefined(values.numberofBedrooms);
  if (bedrooms !== undefined) payload.numberofBedrooms = bedrooms;

  const bathrooms = toNumberOrUndefined(values.numberofBathrooms);
  if (bathrooms !== undefined) payload.numberofBathrooms = bathrooms;

  const area = toNumberOrUndefined(values.squareFootage);
  if (area !== undefined) payload.squareFootage = String(area);

  const floor = toNumberOrUndefined(values.Floor);
  if (floor !== undefined) payload.Floor = floor;

  const yearBuilt = toNumberOrUndefined(values.yearBuilt);
  if (yearBuilt !== undefined) payload.yearBuilt = yearBuilt;

  return payload;
};

const statusColorScheme = {
  Available: "green",
  Active: "green",
  New: "blue",
  Booked: "orange",
  Sold: "purple",
  Pending: "yellow",
  Blocked: "gray",
};

export default function MyListings() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const cardBg = useColorModeValue("white", "navy.700");
  const subtleText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const metricBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const accentGold = useColorModeValue("gold.600", "gold.400");
  const accentSoft = useColorModeValue("rgba(212,175,55,0.08)", "rgba(212,175,55,0.12)");
  const statShadow = useColorModeValue("sm", "none");
  const drawerSize = useBreakpointValue({ base: "full", md: "lg" }) || "lg";

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingPhotos, setEditingPhotos] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const drawer = useDisclosure();
  const deleteDialog = useDisclosure();
  const cancelDeleteRef = useRef(null);

  const dealLabel = useCallback(
    (dealType) => (dealType === "rent" ? t("myListings.dealRent") : t("myListings.dealSale")),
    [t]
  );

  const typeLabel = useCallback(
    (type) => {
      const map = {
        House: t("myListings.typeHouse"),
        Apartment: t("myListings.typeApartment"),
        Land: t("myListings.typeLand"),
        Commercial: t("myListings.typeCommercial"),
      };
      return map[type] || type || "—";
    },
    [t]
  );

  const statusLabel = useCallback(
    (status) => {
      const map = {
        Available: t("myListings.statusAvailable"),
        Booked: t("myListings.statusBooked"),
        Sold: t("myListings.statusSold"),
        Blocked: t("myListings.statusBlocked"),
      };
      return map[status] || status || "—";
    },
    [t]
  );

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getApi("api/property/", { useCache: false });
      const data = extractCollection(response);
      setListings(data.map(normalizePropertyMedia));
    } catch (error) {
      toast({ title: t("myListings.loadError"), status: "error", duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const stats = useMemo(() => {
    const total = listings.length;
    const sale = listings.filter((item) => (item?.dealType || "sale") === "sale").length;
    const rent = listings.filter((item) => item?.dealType === "rent").length;
    const approved = listings.filter(
      (item) => normalizeModerationStatus(item) === MODERATION_STATUS.APPROVED
    ).length;
    const pending = listings.filter(
      (item) => normalizeModerationStatus(item) === MODERATION_STATUS.PENDING
    ).length;
    return { total, sale, rent, approved, pending };
  }, [listings]);

  const editingListing = useMemo(
    () => listings.find((item) => item._id === editingId) || null,
    [listings, editingId]
  );
  const editingModerationStatus = normalizeModerationStatus(editingListing);
  const isPendingModeration = editingModerationStatus === MODERATION_STATUS.PENDING;

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().trim().required(t("myListings.requiredName")),
        propertyAddress: yup.string().trim().required(t("myListings.requiredAddress")),
        listingPrice: yup
          .string()
          .required(t("myListings.requiredPrice"))
          .test("is-number", t("myListings.invalidNumber"), (value) =>
            value === undefined || value === "" ? false : Number.isFinite(Number(value))
          ),
      }),
    [t]
  );

  const formik = useFormik({
    initialValues: emptyForm,
    enableReinitialize: false,
    validationSchema,
    onSubmit: async (values) => {
      const payload = buildPayload(values);
      try {
        setIsSaving(true);
        if (editingId) {
          await putApi(`api/property/edit/${editingId}`, payload);
          toast({ title: t("myListings.updated"), status: "success", duration: 2500 });
        } else {
          const response = await postApi("api/property/add", payload);
          const createdId = response?.data?._id;
          if (!createdId) {
            throw new Error("create failed");
          }
          setEditingId(createdId);
          setEditingPhotos([]);
          toast({ title: t("myListings.createdDraft"), status: "success", duration: 3500 });
        }
        clearApiCache("public:");
        clearApiCache("api/property");
        await fetchListings();
      } catch (error) {
        const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
        const message = extractApiErrorMessage(error, locale) || t("myListings.saveError");
        toast({ title: message, status: "error", duration: 4000 });
      } finally {
        setIsSaving(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, resetForm } = formik;

  const openCreate = () => {
    resetForm({ values: emptyForm });
    setEditingId(null);
    setEditingPhotos([]);
    drawer.onOpen();
  };

  const openEdit = (listing) => {
    resetForm({ values: listingToForm(listing) });
    setEditingId(listing?._id || null);
    setEditingPhotos(Array.isArray(listing?.propertyPhotos) ? listing.propertyPhotos : []);
    drawer.onOpen();
  };

  const closeDrawer = () => {
    drawer.onClose();
    setEditingId(null);
    setEditingPhotos([]);
    resetForm({ values: emptyForm });
  };

  const confirmDelete = (listing) => {
    setDeleteTarget(listing);
    deleteDialog.onOpen();
  };

  const handleSubmitForReview = async () => {
    if (!editingId) return;
    try {
      setIsSaving(true);
      await putApi(`api/property/submit/${editingId}`, {});
      toast({ title: t("myListings.submitted"), status: "success", duration: 3500 });
      clearApiCache("public:");
      clearApiCache("api/property");
      await fetchListings();
      closeDrawer();
    } catch (error) {
      const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
      toast({
        title: extractApiErrorMessage(error, locale) || t("myListings.submitError"),
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdraw = async () => {
    if (!editingId) return;
    try {
      setIsSaving(true);
      await putApi(`api/property/withdraw/${editingId}`, {});
      toast({ title: t("myListings.withdrawn"), status: "info", duration: 3000 });
      clearApiCache("api/property");
      await fetchListings();
    } catch (error) {
      const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
      toast({
        title: extractApiErrorMessage(error, locale) || t("myListings.withdrawError"),
        status: "error",
        duration: 4000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      setIsDeleting(true);
      await deleteApi("api/property/delete/", deleteTarget._id);
      toast({ title: t("myListings.deletedToast"), status: "info", duration: 2500 });
      clearApiCache("public:");
      clearApiCache("api/property");
      setListings((prev) => prev.filter((item) => item._id !== deleteTarget._id));
    } catch (error) {
      toast({ title: t("myListings.deleteError"), status: "error", duration: 4000 });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      deleteDialog.onClose();
    }
  };

  const fieldError = (name) => Boolean(errors?.[name] && touched?.[name]);

  const numberField = (name, label, { min = 0, max, helper } = {}) => (
    <FormControl key={name} isInvalid={fieldError(name)}>
      <FormLabel fontSize="sm" mb="6px">
        {label}
      </FormLabel>
      <NumberInput
        min={min}
        max={max}
        value={values[name]}
        onChange={(valueString) => setFieldValue(name, valueString)}
      >
        <NumberInputField name={name} onBlur={handleBlur} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {helper ? <FormHelperText fontSize="xs">{helper}</FormHelperText> : null}
      {fieldError(name) ? <FormErrorMessage>{errors[name]}</FormErrorMessage> : null}
    </FormControl>
  );

  const primaryImage = (listing) =>
    listing?.propertyPhotos?.[0]?.img || listing?.floorPlans?.[0]?.img || placeholderImage;

  return (
    <Box>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={4}
        mb={6}
      >
        <Box>
          <Text fontSize="2xl" fontWeight="800">
            {t("myListings.title")}
          </Text>
          <Text color={subtleText} mt={1} maxW="640px">
            {t("myListings.subtitle")}
          </Text>
        </Box>
        <Button
          leftIcon={<MdAdd />}
          variant="brand"
          size="md"
          flexShrink={0}
          w={{ base: "full", md: "auto" }}
          borderRadius="full"
          onClick={openCreate}
        >
          {t("myListings.addListing")}
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        {[
          { label: t("myListings.statsTotal"), value: stats.total },
          { label: t("myListings.statsApproved"), value: stats.approved },
          { label: t("myListings.statsPending"), value: stats.pending },
          { label: t("myListings.statsSale"), value: stats.sale },
        ].map((stat) => (
          <Box
            key={stat.label}
            bg={cardBg}
            borderRadius={{ base: "16px", md: "20px" }}
            border="1px solid"
            borderColor={borderColor}
            px={{ base: 4, md: 5 }}
            py={{ base: 3, md: 4 }}
            boxShadow={statShadow}
          >
            <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color={subtleText}>
              {stat.label}
            </Text>
            <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" mt={1} color={accentGold}>
              {isLoading ? "—" : stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {[1, 2, 3].map((key) => (
            <Skeleton key={key} h="320px" borderRadius="24px" />
          ))}
        </SimpleGrid>
      ) : listings.length === 0 ? (
        <Box
          bg={cardBg}
          borderRadius="24px"
          border="1px dashed"
          borderColor={borderColor}
          py={16}
          textAlign="center"
        >
          <Icon as={LuBuilding2} boxSize={12} color="gray.400" mb={3} />
          <Text fontSize="lg" fontWeight="700">
            {t("myListings.empty")}
          </Text>
          <Text color={subtleText} mt={1}>
            {t("myListings.emptyHint")}
          </Text>
          <Button mt={5} leftIcon={<MdAdd />} variant="brand" onClick={openCreate}>
            {t("myListings.addListing")}
          </Button>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {listings.map((listing) => {
            const moderationStatus = normalizeModerationStatus(listing);
            const moderation = moderationStatusMeta(moderationStatus, t);
            const rejectionReason =
              listing?.rejectionReason || listing?.verification?.rejectionReason || "";

            return (
              <Box
                key={listing._id}
                bg={cardBg}
                borderRadius={{ base: "20px", md: "24px" }}
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
                transition="all 0.25s ease"
                _hover={{ transform: { base: "none", md: "translateY(-4px)" }, boxShadow: "lg" }}
              >
                <Box position="relative">
                  <Image
                    src={primaryImage(listing)}
                    alt={listing?.name || ""}
                    h="190px"
                    w="100%"
                    objectFit="cover"
                    fallbackSrc={placeholderImage}
                  />
                  <HStack
                    position="absolute"
                    top={3}
                    left={3}
                    spacing={2}
                    flexWrap="wrap"
                    maxW="80%"
                  >
                    <Badge colorScheme={listing?.dealType === "rent" ? "cyan" : "yellow"}>
                      {dealLabel(listing?.dealType)}
                    </Badge>
                    <Badge colorScheme={moderation.colorScheme}>{moderation.label}</Badge>
                    {moderationStatus === MODERATION_STATUS.APPROVED ? (
                      <Badge colorScheme={statusColorScheme[listing?.listingStatus] || "gray"}>
                        {statusLabel(listing?.listingStatus)}
                      </Badge>
                    ) : null}
                  </HStack>
                  <Badge position="absolute" top={3} right={3} colorScheme="blackAlpha">
                    {typeLabel(listing?.propertyType)}
                  </Badge>
                </Box>

                <Stack p={5} spacing={3}>
                  <Box>
                    <Text fontWeight="800" fontSize="lg" noOfLines={1}>
                      {listing?.name || listing?.propertyAddress}
                    </Text>
                    <HStack spacing={1.5} color={subtleText} mt={1}>
                      <Icon as={LuMapPin} boxSize="14px" />
                      <Text fontSize="sm" noOfLines={1}>
                        {listing?.propertyAddress || "—"}
                      </Text>
                    </HStack>
                  </Box>

                  <Text fontWeight="800" fontSize="xl" color={accentGold}>
                    {formatPrice(listing?.listingPrice, t, i18n.language)}
                    {listing?.dealType === "rent" ? (
                      <Text as="span" fontSize="sm" color={subtleText} fontWeight="600">
                        {" "}
                        {t("myListings.perMonth")}
                      </Text>
                    ) : null}
                  </Text>

                  {moderationStatus === MODERATION_STATUS.REJECTED && rejectionReason ? (
                    <Alert status="error" borderRadius="14px" py={2}>
                      <AlertIcon boxSize={4} />
                      <AlertDescription fontSize="sm">
                        <Text fontWeight="700">{t("myListings.rejectionReason")}</Text>
                        {rejectionReason}
                      </AlertDescription>
                    </Alert>
                  ) : null}

                  <SimpleGrid columns={3} spacing={2}>
                    {[
                      {
                        icon: MdMeetingRoom,
                        label: t("myListings.bedrooms"),
                        value: listing?.numberofBedrooms,
                      },
                      {
                        icon: MdBathtub,
                        label: t("myListings.bathrooms"),
                        value: listing?.numberofBathrooms,
                      },
                      {
                        icon: MdOutlineSquareFoot,
                        label: t("myListings.area"),
                        value: listing?.squareFootage,
                      },
                    ].map((metric) => (
                      <Box
                        key={metric.label}
                        bg={accentSoft}
                        borderRadius="14px"
                        px={2.5}
                        py={2}
                        textAlign="center"
                      >
                        <Icon as={metric.icon} boxSize="16px" color={subtleText} />
                        <Text fontWeight="700" fontSize="sm" mt={0.5}>
                          {metric.value === 0 || metric.value
                            ? String(metric.value).replace(/[^\d.]/g, "") || "—"
                            : "—"}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>

                  <HStack className="my-listings-actions" pt={1} spacing={2} flexWrap="wrap">
                    <Button
                      size="sm"
                      leftIcon={<MdEdit />}
                      variant="outline"
                      flex={{ base: "1 1 100%", sm: 1 }}
                      borderRadius="full"
                      onClick={() => openEdit(listing)}
                    >
                      {t("myListings.edit")}
                    </Button>
                    {isListingPublic(listing) ? (
                      <Tooltip label={t("myListings.openOnSite")}>
                        <IconButton
                          as={RouterLink}
                          to={`/offers/${listing._id}`}
                          target="_blank"
                          size="sm"
                          variant="outline"
                          aria-label={t("myListings.openOnSite")}
                          icon={<MdOpenInNew />}
                        />
                      </Tooltip>
                    ) : null}
                    <Tooltip label={t("myListings.delete")}>
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        aria-label={t("myListings.delete")}
                        icon={<MdDelete />}
                        onClick={() => confirmDelete(listing)}
                      />
                    </Tooltip>
                  </HStack>
                </Stack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      <Drawer isOpen={drawer.isOpen} onClose={closeDrawer} size={drawerSize} placement="right">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            {editingId ? t("myListings.editListing") : t("myListings.newListing")}
          </DrawerHeader>
          <DrawerBody py={5}>
            {editingListing ? (
              <Alert
                status={
                  editingModerationStatus === MODERATION_STATUS.REJECTED
                    ? "error"
                    : editingModerationStatus === MODERATION_STATUS.PENDING
                      ? "warning"
                      : editingModerationStatus === MODERATION_STATUS.APPROVED
                        ? "success"
                        : "info"
                }
                borderRadius="16px"
                mb={4}
              >
                <AlertIcon />
                <Box>
                  <Text fontWeight="700">
                    {moderationStatusMeta(editingModerationStatus, t).label}
                  </Text>
                  {editingModerationStatus === MODERATION_STATUS.PENDING ? (
                    <Text fontSize="sm">{t("myListings.pendingHint")}</Text>
                  ) : null}
                  {editingModerationStatus === MODERATION_STATUS.REJECTED &&
                  (editingListing?.rejectionReason ||
                    editingListing?.verification?.rejectionReason) ? (
                    <Text fontSize="sm" mt={1}>
                      {t("myListings.rejectionReason")}:{" "}
                      {editingListing?.rejectionReason ||
                        editingListing?.verification?.rejectionReason}
                    </Text>
                  ) : null}
                  {editingModerationStatus === MODERATION_STATUS.DRAFT ? (
                    <Text fontSize="sm">{t("myListings.draftHint")}</Text>
                  ) : null}
                </Box>
              </Alert>
            ) : (
              <Alert status="info" borderRadius="16px" mb={4}>
                <AlertIcon />
                <Text fontSize="sm">{t("myListings.newListingHint")}</Text>
              </Alert>
            )}
            <form id="my-listing-form" onSubmit={formik.handleSubmit}>
              <Stack
                spacing={4}
                opacity={isPendingModeration ? 0.65 : 1}
                pointerEvents={isPendingModeration ? "none" : "auto"}
              >
                <FormControl isInvalid={fieldError("name")} isRequired>
                  <FormLabel fontSize="sm" mb="6px">
                    {t("myListings.name")}
                  </FormLabel>
                  <Input
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("myListings.namePlaceholder")}
                  />
                  {fieldError("name") ? <FormErrorMessage>{errors.name}</FormErrorMessage> : null}
                </FormControl>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" mb="6px">
                      {t("myListings.dealType")}
                    </FormLabel>
                    <Select name="dealType" value={values.dealType} onChange={handleChange}>
                      {DEAL_TYPES.map((deal) => (
                        <option key={deal} value={deal}>
                          {dealLabel(deal)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" mb="6px">
                      {t("myListings.propertyType")}
                    </FormLabel>
                    <Select name="propertyType" value={values.propertyType} onChange={handleChange}>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {typeLabel(type)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isInvalid={fieldError("propertyAddress")} isRequired>
                  <FormLabel fontSize="sm" mb="6px">
                    {t("myListings.address")}
                  </FormLabel>
                  <Input
                    name="propertyAddress"
                    value={values.propertyAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("myListings.addressPlaceholder")}
                  />
                  {fieldError("propertyAddress") ? (
                    <FormErrorMessage>{errors.propertyAddress}</FormErrorMessage>
                  ) : null}
                </FormControl>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormControl isInvalid={fieldError("listingPrice")} isRequired>
                    <FormLabel fontSize="sm" mb="6px">
                      {t("myListings.price")}
                    </FormLabel>
                    <NumberInput
                      min={0}
                      value={values.listingPrice}
                      onChange={(valueString) => setFieldValue("listingPrice", valueString)}
                    >
                      <NumberInputField name="listingPrice" onBlur={handleBlur} />
                    </NumberInput>
                    <FormHelperText fontSize="xs">
                      {values.dealType === "rent"
                        ? t("myListings.priceRentHint")
                        : t("myListings.priceHint")}
                    </FormHelperText>
                    {fieldError("listingPrice") ? (
                      <FormErrorMessage>{errors.listingPrice}</FormErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" mb="6px">
                      {t("myListings.status")}
                    </FormLabel>
                    <Select
                      name="listingStatus"
                      value={values.listingStatus}
                      onChange={handleChange}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel(status)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
                  {numberField("numberofBedrooms", t("myListings.bedrooms"), { max: 50 })}
                  {numberField("numberofBathrooms", t("myListings.bathrooms"), { max: 50 })}
                  {numberField("squareFootage", t("myListings.area"))}
                </SimpleGrid>

                <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
                  {numberField("Floor", t("myListings.floor"))}
                  {numberField("yearBuilt", t("myListings.yearBuilt"), {
                    min: 1800,
                    max: new Date().getFullYear() + 1,
                  })}
                  <FormControl>
                    <FormLabel fontSize="sm" mb="6px">
                      {t("myListings.parking")}
                    </FormLabel>
                    <Input
                      name="parkingAvailability"
                      value={values.parkingAvailability}
                      onChange={handleChange}
                      placeholder={t("myListings.parkingPlaceholder")}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm" mb="6px">
                    {t("myListings.marketingDescription")}
                  </FormLabel>
                  <Textarea
                    name="marketingDescription"
                    value={values.marketingDescription}
                    onChange={handleChange}
                    placeholder={t("myListings.marketingPlaceholder")}
                    rows={2}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" mb="6px">
                    {t("myListings.description")}
                  </FormLabel>
                  <Textarea
                    name="propertyDescription"
                    value={values.propertyDescription}
                    onChange={handleChange}
                    placeholder={t("myListings.descriptionPlaceholder")}
                    rows={4}
                  />
                </FormControl>

                <Box
                  borderRadius="16px"
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                  bg={metricBg}
                >
                  {editingId ? (
                    <PropertyPhotoManager
                      propertyId={editingId}
                      photos={editingPhotos}
                      onChange={(newPhotos) => {
                        setEditingPhotos(newPhotos);
                        setListings((prev) =>
                          prev.map((item) =>
                            item._id === editingId ? { ...item, propertyPhotos: newPhotos } : item
                          )
                        );
                      }}
                      isOpen
                      onClose={() => {}}
                    />
                  ) : (
                    <HStack color={subtleText} spacing={3}>
                      <Icon as={LuBuilding2} boxSize={5} />
                      <Text fontSize="sm">{t("myListings.photosHint")}</Text>
                    </HStack>
                  )}
                </Box>
              </Stack>
            </form>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px" gap={3} flexWrap="wrap">
            <Button variant="outline" onClick={closeDrawer}>
              {t("myListings.close")}
            </Button>
            {editingId && isPendingModeration ? (
              <Button variant="outline" onClick={handleWithdraw} isLoading={isSaving}>
                {t("myListings.withdraw")}
              </Button>
            ) : null}
            {!isPendingModeration ? (
              <Button
                variant="brand"
                type="submit"
                form="my-listing-form"
                isDisabled={isSaving}
                minW="160px"
              >
                {isSaving ? (
                  <Spinner size="sm" />
                ) : editingId ? (
                  t("myListings.saveDraft")
                ) : (
                  t("myListings.saveAndPhotos")
                )}
              </Button>
            ) : null}
            {editingId &&
            !isPendingModeration &&
            [MODERATION_STATUS.DRAFT, MODERATION_STATUS.REJECTED].includes(
              editingModerationStatus
            ) ? (
              <Button colorScheme="green" onClick={handleSubmitForReview} isLoading={isSaving}>
                {t("myListings.submitForReview")}
              </Button>
            ) : null}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelDeleteRef}
        onClose={deleteDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("myListings.deleteTitle")}
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text fontWeight="700" mb={2} noOfLines={1}>
                {deleteTarget?.name || deleteTarget?.propertyAddress}
              </Text>
              {t("myListings.deleteText")}
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelDeleteRef} onClick={deleteDialog.onClose}>
                {t("myListings.cancel")}
              </Button>
              <Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting}>
                {t("myListings.delete")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
