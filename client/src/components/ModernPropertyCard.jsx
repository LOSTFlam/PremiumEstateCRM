import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
  usePrefersReducedMotion,
  useToast,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart, FiSearch, FiShare2 } from "react-icons/fi";
import { useMemo, useState } from "react";
import CountUp from "react-countup";
import {
  MdArrowForward,
  MdBathtub,
  MdCompareArrows,
  MdMeetingRoom,
  MdOutlineDescription,
  MdOutlinePhotoLibrary,
  MdOutlineSquareFoot,
} from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import {
  formatCompactPrice,
  formatPrice,
  getDocumentCount,
  parsePrice,
  getFloorPlanCount,
  getListingAddress,
  getListingDescription,
  getListingTitle,
  getPhotoCount,
  getPrimaryImage,
  isRichListing,
  normalizePropertyTypeKey,
  normalizeStatus,
  placeholderImage,
} from "views/public/catalog/catalogData";
import LazyImage from "components/public/LazyImage";
import { publicBrand } from "views/public/publicBrand";

const metricText = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "" || Number(value) === 0) {
    return fallback;
  }
  return String(value);
};

const dealTypeLabel = (property, t) =>
  property?.dealType === "rent"
    ? t?.("publicListing.dealRent") || "Аренда"
    : t?.("publicListing.dealSale") || "Продажа";

const propertyTypeLabel = (property, t) => {
  const key = property?.propertyTypeKey || normalizePropertyTypeKey(property?.propertyType);
  if (key === "house") return t?.("publicListing.houses") || "House";
  if (key === "apartment") return t?.("publicListing.apartments") || "Apartment";
  if (key === "land") return t?.("publicListing.plots") || "Land";
  if (key === "commercial") return t?.("publicListing.commercial") || "Commercial";
  return property?.propertyType || t?.("publicListing.propertyType") || "Property";
};

const buildPropertyHref = (property) => {
  const id = property?._id;
  return id ? `/offers/${id}` : "#";
};

const buildShareUrl = (property) => `${window.location.origin}${buildPropertyHref(property)}`;

const actionStyles = {
  bg: "rgba(7, 12, 20, 0.56)",
  border: "1px solid rgba(227, 211, 184, 0.14)",
  color: "white",
};

const metricBlocks = (property, t) => [
  {
    label: t?.("publicListing.bedrooms") || "Bedrooms",
    icon: MdMeetingRoom,
    value: metricText(property?.numberofBedrooms),
  },
  {
    label: t?.("publicListing.bathrooms") || "Bathrooms",
    icon: MdBathtub,
    value: metricText(property?.numberofBathrooms),
  },
  {
    label: t?.("publicListing.area") || "Area",
    icon: MdOutlineSquareFoot,
    value: metricText(property?.squareFootage),
  },
];

const assetBlocks = (property, t) => [
  {
    label: t?.("publicListing.photosCount", { count: getPhotoCount(property) }) || "Photos",
    icon: MdOutlinePhotoLibrary,
    value: String(getPhotoCount(property)),
  },
  {
    label: t?.("publicListing.docsCount", { count: getDocumentCount(property) }) || "Docs",
    icon: MdOutlineDescription,
    value: String(getDocumentCount(property)),
  },
  {
    label: t?.("publicListing.plansCount", { count: getFloorPlanCount(property) }) || "Plans",
    icon: FiSearch,
    value: String(getFloorPlanCount(property)),
  },
];

const ModernPropertyCard = ({
  property,
  isFavorite,
  isInCompare,
  onFavoriteToggle,
  onCompareToggle,
}) => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const status = normalizeStatus(property?.listingStatus, t, i18n.language);
  const listingTitle = getListingTitle(property, t, i18n.language);
  const listingAddress = getListingAddress(property, t, i18n.language);
  const listingDescription = getListingDescription(property, t, i18n.language);
  const typeLabel = propertyTypeLabel(property, t);
  const verificationScore = Number(property?.verification?.score || 0);
  const richListing = isRichListing(property);
  const propertyHref = buildPropertyHref(property);
  const prefersReducedMotion = usePrefersReducedMotion();

  const priceAmount = useMemo(() => parsePrice(property?.listingPrice), [property?.listingPrice]);
  const priceDisplay = useMemo(() => {
    const formatted = formatPrice(property?.listingPrice, t, i18n.language);
    const amount = priceAmount;
    if (!amount || formatted.length <= 16) return formatted;
    return formatCompactPrice(property?.listingPrice, t, i18n.language);
  }, [priceAmount, property?.listingPrice, t, i18n.language]);

  const isNewListing = useMemo(() => {
    if (!property?.createdAt) return false;
    return Date.now() - new Date(property.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
  }, [property?.createdAt]);

  const handleShare = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(buildShareUrl(property));
      toast({
        title: t?.("publicListing.copied") || "Link copied",
        status: "success",
        duration: 1800,
      });
    } catch (error) {
      toast({ title: "Unable to copy link", status: "error", duration: 1800 });
    }
  };

  return (
    <Box
      as={RouterLink}
      to={propertyHref}
      className="property-card"
      borderRadius={{ base: "30px", md: "40px", xl: "44px" }}
      overflow="hidden"
      maxW="100%"
      minW={{ base: "100%", sm: "380px" }}
      w="100%"
      bg={publicBrand.gradients.panelLight}
      border="1px solid rgba(9,18,32,0.06)"
      boxShadow="0 10px 36px rgba(0, 0, 0, 0.14), 0 0 26px rgba(212, 175, 55, 0.09)"
      position="relative"
      transition="all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "inherit",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(212,175,55,0.05) 100%)",
        opacity: 0,
        transition: "opacity 0.5s ease",
        zIndex: 0,
      }}
      _hover={
        prefersReducedMotion
          ? { boxShadow: "0 16px 48px rgba(0, 0, 0, 0.2)" }
          : {
              _before: { opacity: 1 },
              transform: { base: "translateY(-4px)", md: "translateY(-12px) scale(1.02)" },
              boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.25), 0 0 40px rgba(212, 175, 55, 0.15), 0 0 80px rgba(255, 255, 255, 0.08)",
            }
      }
    >
      <Box
        className="property-image-overlay"
        position="relative"
        overflow="hidden"
        borderRadius={{ base: "26px 26px 0 0", md: "34px 34px 0 0" }}
      >
        <Box
          className="property-image-wrapper"
          transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{
            transform: "scale(1.08)",
          }}
        >
          <LazyImage
            src={getPrimaryImage(property)}
            fallbackSrc={placeholderImage}
            alt={property?.name || property?.propertyAddress}
            h={{ base: "240px", md: "300px", xl: "320px" }}
            w="100%"
            objectFit="cover"
          />
        </Box>
        <Box
          position="absolute"
          inset="0"
          bg="linear-gradient(180deg, rgba(7,12,20,0.04) 0%, rgba(7,12,20,0.34) 38%, rgba(7,12,20,0.84) 100%)"
          transition="opacity 0.4s ease"
          _groupHover={{
            opacity: 0.7,
          }}
        />

        <Flex
          className="property-card-top"
          position="absolute"
          top={{ base: 3, md: 4 }}
          left={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          align="flex-start"
          gap={2}
          zIndex={2}
        >
          <HStack
            className="property-badges"
            flex={1}
            minW={0}
            spacing={2}
            flexWrap="nowrap"
            overflowX="auto"
            overflowY="hidden"
            sx={{
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
          <Badge
            px={3.5}
            py={1.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.16)"
            color="white"
            border="1px solid rgba(255,255,255,0.18)"
            backdropFilter="blur(10px)"
            textTransform="none"
            flexShrink={0}
          >
            {status}
          </Badge>
          <Badge
            px={3.5}
            py={1.5}
            borderRadius="full"
            bg="rgba(7,12,20,0.56)"
            color="#f5d076"
            border="1px solid rgba(227, 211, 184, 0.14)"
            textTransform="none"
            flexShrink={0}
          >
            {typeLabel}
          </Badge>
          <Badge
            px={3.5}
            py={1.5}
            borderRadius="full"
            bg={property?.dealType === "rent" ? "rgba(104,211,225,0.18)" : "rgba(245,208,118,0.18)"}
            color={property?.dealType === "rent" ? "#9ae6f0" : "#f5d076"}
            border="1px solid rgba(227, 211, 184, 0.14)"
            textTransform="none"
            flexShrink={0}
          >
            {dealTypeLabel(property, t)}
          </Badge>
          {richListing ? (
            <Badge
              className="property-badge-rich"
              px={3.5}
              py={1.5}
              borderRadius="full"
              bg="rgba(143,193,154,0.14)"
              color="#bbdbbf"
              border="1px solid rgba(143,193,154,0.18)"
              textTransform="none"
              flexShrink={0}
            >
              {t?.("publicListing.richLabel") || "Rich"}
            </Badge>
          ) : null}
          {isNewListing ? (
            <Badge px={3.5} py={1.5} borderRadius="full" bg="rgba(56,161,105,0.2)" color="#9ae6b4" textTransform="none" flexShrink={0}>
              {t?.("publicPages.catalog.badgeNew") || "New"}
            </Badge>
          ) : null}
          {property?.featured ? (
            <Badge px={3.5} py={1.5} borderRadius="full" bg="rgba(212,175,55,0.22)" color="#f5d076" textTransform="none" flexShrink={0}>
              {t?.("publicPages.catalog.badgeExclusive") || "Exclusive"}
            </Badge>
          ) : null}
          {property?.previousPrice ? (
            <Badge px={3.5} py={1.5} borderRadius="full" bg="rgba(229,62,62,0.2)" color="#feb2b2" textTransform="none" flexShrink={0}>
              {t?.("publicPages.catalog.badgeReduced") || "Reduced"}
            </Badge>
          ) : null}
          </HStack>

          <HStack className="property-actions" spacing={{ base: 1, md: 2 }} flexShrink={0}>
          <IconButton
            aria-label={
              isFavorite
                ? t?.("publicListing.removeFromFavorites") || "Remove from favorites"
                : t?.("publicListing.addToFavorites") || "Add to favorites"
            }
            icon={<FiHeart />}
            size={{ base: "xs", md: "sm" }}
            borderRadius="full"
            bg={isFavorite ? publicBrand.gradients.brass : actionStyles.bg}
            color={isFavorite ? publicBrand.colors.ink : actionStyles.color}
            border={actionStyles.border}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: isFavorite ? publicBrand.gradients.brass : "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.2) rotate(10deg)",
              boxShadow: isFavorite
                ? "0 0 20px rgba(212, 175, 55, 0.5)"
                : "0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            _active={{ transform: "scale(0.95)" }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onFavoriteToggle?.(property?._id);
            }}
          />
          <IconButton
            aria-label={
              isInCompare
                ? t?.("publicListing.removeFromCompare") || "Remove from compare"
                : t?.("publicListing.addToCompare") || "Add to compare"
            }
            icon={<MdCompareArrows />}
            size={{ base: "xs", md: "sm" }}
            borderRadius="full"
            bg={isInCompare ? publicBrand.gradients.brass : actionStyles.bg}
            color={isInCompare ? publicBrand.colors.ink : actionStyles.color}
            border={actionStyles.border}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: isInCompare ? publicBrand.gradients.brass : "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.2) rotate(-10deg)",
              boxShadow: isInCompare
                ? "0 0 20px rgba(212, 175, 55, 0.5)"
                : "0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            _active={{ transform: "scale(0.95)" }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onCompareToggle?.(property?._id);
            }}
          />
          <IconButton
            aria-label={t?.("publicListing.shareOffer") || "Share"}
            icon={<FiShare2 />}
            size={{ base: "xs", md: "sm" }}
            borderRadius="full"
            bg={actionStyles.bg}
            color={actionStyles.color}
            border={actionStyles.border}
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{
              bg: "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.2)",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            _active={{ transform: "scale(0.95)" }}
            onClick={handleShare}
          />
          </HStack>
        </Flex>

        <Stack
          className="property-image-footer"
          position="absolute"
          left={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          bottom={{ base: 3, md: 4 }}
          spacing={2}
          w="auto"
        >
          <Stack spacing={1} minW={0} w="100%">
            <Text
              className="property-price"
              fontSize={{ base: "lg", md: "2xl", xl: "3xl" }}
              fontWeight="700"
              lineHeight="1.15"
              letterSpacing="-0.02em"
              color="white"
            >
              {priceAmount ? (
                <CountUp
                  end={priceAmount}
                  duration={1.2}
                  formattingFn={(value) =>
                    formatPrice(value, t, i18n.language) || priceDisplay
                  }
                />
              ) : (
                priceDisplay
              )}
              {property?.dealType === "rent" ? (
                <Text as="span" fontSize={{ base: "sm", md: "md" }} color="whiteAlpha.700" fontWeight="600">
                  {t?.("publicListing.perMonth") || "/мес"}
                </Text>
              ) : null}
            </Text>
            <Text className="property-price-label" color="whiteAlpha.700" fontSize="sm">
              {property?.dealType === "rent"
                ? t?.("publicListing.rentPriceLabel") || dealTypeLabel(property, t)
                : t?.("publicListing.priceLabel") || "Price"}
            </Text>
          </Stack>
          <Box
            className="property-verification"
            px={{ base: 2.5, md: 4 }}
            py={{ base: 1.5, md: 3 }}
            borderRadius="18px"
            bg="rgba(7,12,20,0.54)"
            border="1px solid rgba(227, 211, 184, 0.14)"
            backdropFilter="blur(10px)"
            w="fit-content"
            maxW="100%"
          >
            <Text
              className="property-verification-label"
              color="whiteAlpha.600"
              fontSize="xs"
              textTransform="none"
              letterSpacing="0.04em"
              noOfLines={1}
            >
              <Box as="span" display={{ base: "inline", lg: "none" }}>
                {t?.("publicListing.verificationShort") || "Проверка"}
              </Box>
              <Box as="span" display={{ base: "none", lg: "inline" }}>
                {t?.("publicListing.verificationTitle") || "Verification"}
              </Box>
            </Text>
            <Text color="white" fontWeight="700" mt={0.5} fontSize={{ base: "sm", md: "md" }}>
              {verificationScore
                ? `${verificationScore}%`
                : t?.("publicListing.notSpecified") || "On request"}
            </Text>
          </Box>
        </Stack>
      </Box>

      <Stack className="property-body" p={publicBrand.spacing.cardPad} spacing={{ base: 4, md: 5 }}>
        <Stack spacing={3}>
          <Text
            className="property-title"
            fontSize="xl"
            fontWeight="700"
            lineHeight="1.2"
            color={publicBrand.colors.ink}
            noOfLines={2}
          >
            {listingTitle}
          </Text>
          <HStack spacing={2} color={publicBrand.colors.textSoft} align="start">
            <Icon as={LuMapPin} mt={0.5} flexShrink={0} />
            <Text className="property-address" fontSize="sm" noOfLines={2} lineHeight="1.45">
              {listingAddress}
            </Text>
          </HStack>
          <Text
            className="property-description"
            color={publicBrand.colors.textSoft}
            noOfLines={2}
            lineHeight="1.65"
          >
            {listingDescription}
          </Text>
        </Stack>

        <SimpleGrid className="property-metrics" columns={{ base: 1, sm: 3 }} spacing={2} w="100%">
          {metricBlocks(property, t).map((metric) => (
            <Box
              key={metric.label}
              className="property-metric"
              borderRadius="22px"
              px={3}
              py={3}
              bg="rgba(9,18,32,0.04)"
              border="1px solid rgba(9,18,32,0.06)"
              textAlign={{ base: "left", sm: "center" }}
            >
              <HStack
                spacing={2}
                color={publicBrand.colors.textSoft}
                justify={{ base: "flex-start", sm: "center" }}
              >
                <Icon as={metric.icon} boxSize="16px" flexShrink={0} />
                <Text className="property-metric-label" fontSize="xs" lineHeight="1.3">
                  {metric.label}
                </Text>
              </HStack>
              <Text
                className="property-metric-value"
                mt={1.5}
                fontWeight="700"
                color={publicBrand.colors.ink}
                fontSize={{ base: "md", sm: "sm" }}
              >
                {metric.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid className="property-assets" columns={{ base: 1, md: 3 }} spacing={2}>
          {assetBlocks(property, t).map((asset) => (
            <HStack
              key={asset.label}
              spacing={2}
              borderRadius="24px"
              px={2.5}
              py={2.5}
              bg="rgba(245,239,228,0.75)"
              border="1px solid rgba(9,18,32,0.06)"
              transition="all 0.3s ease"
              _hover={{
                bg: "rgba(245,239,228,0.95)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                w="30px"
                h="30px"
                borderRadius="14px"
                display="grid"
                placeItems="center"
                bg="rgba(245,208,118,0.12)"
                color={publicBrand.colors.copper}
                flexShrink={0}
              >
                <Icon as={asset.icon} boxSize="15px" />
              </Box>
              <Box minW="0" flex={1}>
                <Text fontSize="xs" color={publicBrand.colors.textSoft} noOfLines={1}>
                  {asset.label}
                </Text>
                <Text fontWeight="700" color={publicBrand.colors.ink} noOfLines={1}>
                  {asset.value}
                </Text>
              </Box>
            </HStack>
          ))}
        </SimpleGrid>

        <HStack
          className="property-footer"
          justify="space-between"
          align="center"
          pt={1}
          spacing={3}
          flexWrap="wrap"
          rowGap={2}
        >
          <Text
            className="property-footer-note"
            color={publicBrand.colors.copper}
            fontSize="xs"
            fontWeight="700"
            noOfLines={2}
            flex="1 1 160px"
            minW="0"
            display={{ base: "none", sm: "block" }}
          >
            {richListing
              ? t?.("publicListing.savedOffersHelp") || "Saved in a premium shortlist-ready format"
              : t?.("publicListing.openOffer") || "Open offer"}
          </Text>
          <Button
            size="sm"
            rightIcon={<MdArrowForward />}
            borderRadius="full"
            bg={publicBrand.colors.ink}
            color="white"
            h="auto"
            minH="32px"
            py={2}
            px={4}
            fontSize="xs"
            flexShrink={0}
            maxW="100%"
            whiteSpace="normal"
            lineHeight="1.25"
            textAlign="center"
            transition="all 0.3s ease"
            _hover={{
              bg: publicBrand.colors.inkElevated,
              transform: "translateX(4px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {t?.("publicListing.viewOffer") || "View offer"}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
};

export default ModernPropertyCard;
