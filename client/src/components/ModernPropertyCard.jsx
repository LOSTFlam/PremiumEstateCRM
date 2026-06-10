import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Image,
  SimpleGrid,
  Stack,
  Text,
  usePrefersReducedMotion,
  useToast,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart, FiSearch, FiShare2 } from "react-icons/fi";
import { useState } from "react";
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
  formatPrice,
  getDocumentCount,
  getFloorPlanCount,
  getPhotoCount,
  getPrimaryImage,
  isRichListing,
  normalizePropertyTypeKey,
  normalizeStatus,
  placeholderImage,
} from "views/public/catalog/catalogData";
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
  const status = normalizeStatus(property?.listingStatus, t);
  const typeLabel = propertyTypeLabel(property, t);
  const verificationScore = Number(property?.verification?.score || 0);
  const richListing = isRichListing(property);
  const propertyHref = buildPropertyHref(property);
  const [imgError, setImgError] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

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
          <Image
            src={imgError ? placeholderImage : getPrimaryImage(property)}
            alt={property?.name || property?.propertyAddress}
            h={{ base: "240px", md: "300px", xl: "320px" }}
            w="100%"
            objectFit="cover"
            onError={() => setImgError(true)}
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

        <HStack
          className="property-badges"
          position="absolute"
          top={{ base: 3, md: 4 }}
          left={{ base: 3, md: 4 }}
          spacing={2}
          flexWrap="wrap"
          maxW={{ base: "calc(100% - 100px)", md: "calc(100% - 140px)" }}
        >
          <Badge
            px={3.5}
            py={1.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.16)"
            color="white"
            border="1px solid rgba(255,255,255,0.18)"
            backdropFilter="blur(10px)"
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
          >
            {dealTypeLabel(property, t)}
          </Badge>
          {richListing ? (
            <Badge
              px={3.5}
              py={1.5}
              borderRadius="full"
              bg="rgba(143,193,154,0.14)"
              color="#bbdbbf"
              border="1px solid rgba(143,193,154,0.18)"
            >
              {t?.("publicListing.richLabel") || "Rich"}
            </Badge>
          ) : null}
        </HStack>

        <HStack
          className="property-actions"
          position="absolute"
          top={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          spacing={2}
        >
          <IconButton
            aria-label="Toggle favorite"
            icon={<FiHeart />}
            size="sm"
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
            aria-label="Toggle compare"
            icon={<MdCompareArrows />}
            size="sm"
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
            aria-label="Share"
            icon={<FiShare2 />}
            size="sm"
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

        <Stack
          position="absolute"
          left={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          bottom={{ base: 3, md: 4 }}
          spacing={3}
        >
          <HStack
            justify="space-between"
            align="end"
            spacing={4}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
            rowGap={2}
          >
            <Stack spacing={1}>
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                lineHeight="1"
                letterSpacing="-0.04em"
                color="white"
              >
                {formatPrice(property?.listingPrice, t, i18n.language)}
                {property?.dealType === "rent" ? (
                  <Text as="span" fontSize="md" color="whiteAlpha.700" fontWeight="600">
                    {t?.("publicListing.perMonth") || "/мес"}
                  </Text>
                ) : null}
              </Text>
              <Text color="whiteAlpha.700" fontSize="sm">
                {property?.dealType === "rent"
                  ? t?.("publicListing.rentPriceLabel") || dealTypeLabel(property, t)
                  : t?.("publicListing.priceLabel") || "Price"}
              </Text>
            </Stack>
            <Box
              px={{ base: 3, md: 4 }}
              py={{ base: 2, md: 3 }}
              borderRadius="22px"
              bg="rgba(7,12,20,0.54)"
              border="1px solid rgba(227, 211, 184, 0.14)"
              backdropFilter="blur(10px)"
              display={{ base: "none", sm: "block" }}
            >
              <Text
                color="whiteAlpha.600"
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="0.12em"
              >
                {t?.("publicListing.verificationTitle") || "Verification"}
              </Text>
              <Text color="white" fontWeight="700" mt={1}>
                {verificationScore
                  ? `${verificationScore}%`
                  : t?.("publicListing.notSpecified") || "On request"}
              </Text>
            </Box>
          </HStack>
        </Stack>
      </Box>

      <Stack className="property-body" p={publicBrand.spacing.cardPad} spacing={{ base: 4, md: 5 }}>
        <Stack spacing={3}>
          <Text
            fontSize="xl"
            fontWeight="700"
            lineHeight="1.15"
            color={publicBrand.colors.ink}
            noOfLines={2}
          >
            {property?.name || property?.propertyAddress}
          </Text>
          <HStack spacing={2} color={publicBrand.colors.textSoft}>
            <Icon as={LuMapPin} />
            <Text fontSize="sm" noOfLines={1}>
              {property?.propertyAddress ||
                t?.("publicListing.notSpecified") ||
                "Location on request"}
            </Text>
          </HStack>
          <Text color={publicBrand.colors.textSoft} noOfLines={3} lineHeight="1.8">
            {property?.marketingDescription ||
              property?.propertyDescription ||
              "A structured premium listing with clear facts, direct inquiry, and stronger buyer confidence."}
          </Text>
        </Stack>

        <SimpleGrid className="property-metrics" columns={3} spacing={2}>
          {metricBlocks(property, t).map((metric) => (
            <Box
              key={metric.label}
              borderRadius="22px"
              px={3}
              py={3}
              bg="rgba(9,18,32,0.04)"
              border="1px solid rgba(9,18,32,0.06)"
            >
              <HStack spacing={1.5} color={publicBrand.colors.textSoft} minH="20px">
                <Icon as={metric.icon} boxSize="14px" flexShrink={0} />
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>
                  {metric.label}
                </Text>
              </HStack>
              <Text mt={1.5} fontWeight="700" color={publicBrand.colors.ink} noOfLines={1}>
                {metric.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid className="property-assets" columns={{ base: 1, sm: 3 }} spacing={2}>
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

        <HStack justify="space-between" align="center" pt={1} spacing={3} flexWrap="wrap" rowGap={2}>
          <Text
            color={publicBrand.colors.copper}
            fontSize="xs"
            fontWeight="700"
            noOfLines={2}
            flex="1 1 140px"
            minW="0"
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
