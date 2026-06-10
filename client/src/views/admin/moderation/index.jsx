import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MdGavel, MdOpenInNew, MdRefresh } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";

import { useTranslation } from "react-i18next";
import { getApi, putApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { extractApiErrorMessage } from "utils/errorMessages";
import { normalizeModerationStatus, moderationStatusMeta } from "utils/moderationStatus";
import { formatPrice, normalizePropertyMedia } from "views/public/catalog/catalogData";
import { placeholderImage } from "utils/propertyStockImages";

const primaryImage = (listing) =>
  listing?.propertyPhotos?.[0]?.img || listing?.propertyPhotos?.[0] || placeholderImage;

const compactButtonProps = {
  whiteSpace: "normal",
  lineHeight: "1.25",
  h: "auto",
  minH: "36px",
  py: 2,
  px: 3,
  fontSize: "sm",
};

export default function ModerationQueue() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtleText = useColorModeValue("gray.500", "gray.400");
  const accentGold = useColorModeValue("gold.600", "gold.400");

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getApi("api/property/moderation-queue", { useCache: false });
      setListings(extractCollection(response).map(normalizePropertyMedia));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const pendingCount = useMemo(() => listings.length, [listings]);

  const handleApprove = async (listing) => {
    try {
      setActionLoadingId(listing._id);
      await putApi(`api/property/verify/${listing._id}`, { decision: "approve" });
      toast({
        title: t("moderationQueue.approveSuccess"),
        status: "success",
      });
      await fetchQueue();
    } catch (error) {
      toast({
        title: extractApiErrorMessage(error, "ru") || t("moderationQueue.approveError"),
        status: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const openRejectModal = (listing) => {
    setRejectTarget(listing);
    setRejectionReason("");
    onOpen();
  };

  const handleReject = async () => {
    if (!rejectTarget?._id) return;
    if (!rejectionReason.trim()) {
      toast({
        title: t("moderationQueue.rejectReasonRequired"),
        status: "warning",
      });
      return;
    }

    try {
      setActionLoadingId(rejectTarget._id);
      await putApi(`api/property/verify/${rejectTarget._id}`, {
        decision: "reject",
        rejectionReason: rejectionReason.trim(),
      });
      toast({
        title: t("moderationQueue.rejectSuccess"),
        status: "info",
      });
      onClose();
      setRejectTarget(null);
      await fetchQueue();
    } catch (error) {
      toast({
        title: extractApiErrorMessage(error, "ru") || t("moderationQueue.rejectError"),
        status: "error",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <Box pt={{ base: "110px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }} pb={10}>
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={4} mb={6}>
        <Box>
          <HStack spacing={3} mb={2}>
            <Icon as={MdGavel} boxSize={7} color={accentGold} />
            <Text fontSize="2xl" fontWeight="800">
              {t("moderationQueue.title")}
            </Text>
            <Badge colorScheme="orange" borderRadius="full" px={3}>
              {pendingCount}
            </Badge>
          </HStack>
          <Text color={subtleText}>{t("moderationQueue.subtitle")}</Text>
        </Box>
        <Button leftIcon={<MdRefresh />} variant="outline" onClick={fetchQueue} {...compactButtonProps}>
          {t("moderationQueue.refresh")}
        </Button>
      </Flex>

      {isLoading ? (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} h="320px" borderRadius="24px" />
          ))}
        </SimpleGrid>
      ) : listings.length === 0 ? (
        <Box
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="24px"
          p={10}
          textAlign="center"
        >
          <Text fontWeight="700" fontSize="lg">
            {t("moderationQueue.emptyTitle")}
          </Text>
          <Text color={subtleText} mt={2}>
            {t("moderationQueue.emptyHint")}
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {listings.map((listing) => {
            const moderationStatus = normalizeModerationStatus(listing);
            const moderation = moderationStatusMeta(moderationStatus, t);
            const owner = listing?.createBy;
            const ownerName = [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim();
            const isBusy = actionLoadingId === listing._id;

            return (
              <Box
                key={listing._id}
                bg={cardBg}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="24px"
                overflow="hidden"
              >
                <Image
                  src={primaryImage(listing)}
                  alt={listing?.name || ""}
                  h="180px"
                  w="100%"
                  objectFit="cover"
                  fallbackSrc={placeholderImage}
                />
                <Stack p={5} spacing={3}>
                  <HStack justify="space-between" flexWrap="wrap" gap={2}>
                    <Badge colorScheme={moderation.colorScheme}>{moderation.label}</Badge>
                    <Badge maxW="100%" whiteSpace="normal">
                      {listing?.propertyType || "—"}
                    </Badge>
                  </HStack>
                  <Text fontWeight="800" fontSize="lg" noOfLines={2}>
                    {listing?.name || listing?.propertyAddress}
                  </Text>
                  <HStack color={subtleText} spacing={1.5} align="flex-start">
                    <Icon as={LuMapPin} boxSize="14px" mt="3px" flexShrink={0} />
                    <Text fontSize="sm" noOfLines={2}>
                      {listing?.propertyAddress || "—"}
                    </Text>
                  </HStack>
                  <Text fontWeight="800" color={accentGold}>
                    {formatPrice(listing?.listingPrice)}
                  </Text>
                  <Box>
                    <Text fontSize="sm" color={subtleText}>
                      {t("moderationQueue.author")}
                    </Text>
                    <Text fontWeight="600" noOfLines={1}>
                      {ownerName || owner?.username || owner?.email || "—"}
                    </Text>
                    {owner?.isBlocked ? (
                      <Badge mt={1} colorScheme="red">
                        {t("moderationQueue.userBlocked")}
                      </Badge>
                    ) : null}
                  </Box>

                  <SimpleGrid columns={2} spacing={2}>
                    <Button
                      colorScheme="green"
                      onClick={() => handleApprove(listing)}
                      isLoading={isBusy}
                      {...compactButtonProps}
                    >
                      {t("moderationQueue.approve")}
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="outline"
                      onClick={() => openRejectModal(listing)}
                      isLoading={isBusy}
                      {...compactButtonProps}
                    >
                      {t("moderationQueue.reject")}
                    </Button>
                  </SimpleGrid>

                  <HStack pt={1} flexWrap="wrap" gap={2}>
                    <Button
                      flex={{ base: "1 1 100%", sm: 1 }}
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => navigate(`/propertyView/${listing._id}`)}
                      {...compactButtonProps}
                    >
                      {t("moderationQueue.review")}
                    </Button>
                    <Button
                      as={RouterLink}
                      to={`/propertyView/${listing._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline"
                      leftIcon={<MdOpenInNew />}
                      flexShrink={0}
                      {...compactButtonProps}
                    >
                      CRM
                    </Button>
                  </HStack>
                </Stack>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>{t("moderationQueue.rejectTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>{t("moderationQueue.rejectReasonLabel")}</FormLabel>
              <Textarea
                rows={4}
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder={t("moderationQueue.rejectReasonPlaceholder")}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button colorScheme="red" onClick={handleReject} isLoading={Boolean(actionLoadingId)}>
              {t("moderationQueue.rejectConfirm")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
