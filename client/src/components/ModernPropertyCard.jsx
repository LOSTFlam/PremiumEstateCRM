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
  useToast,
} from "@chakra-ui/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart, FiSearch, FiShare2 } from "react-icons/fi";
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
} from "views/public/catalog/catalogData";
import { publicBrand } from "views/public/publicBrand";

const metricText = (value, fallback = "—") => {
  if (value === null || value === undefined || value === "" || Number(value) === 0) {
    return fallback;
  }
  return String(value);
};

const propertyTypeLabel = (property, t) => {
  const key = property?.propertyTypeKey || normalizePropertyTypeKey(property?.propertyType);
  if (key === "house") return t?.("publicListing.houses") || "House";
  if (key === "apartment") return t?.("publicListing.apartments") || "Apartment";
  if (key === "land") return t?.("publicListing.plots") || "Land";
  if (key === "commercial") return t?.("publicListing.commercial") || "Commercial";
  return property?.propertyType || (t?.("publicListing.propertyType") || "Property");
};

const buildPropertyHref = (property) => {
  const slug = property?.publicSlugResolved || property?.publicSlug;
  return slug ? `/offers/slug/${slug}` : `/offers/${property?._id}`;
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

const ModernPropertyCard = memo(function ModernPropertyCard({
  property,
  isFavorite,
  isInCompare,
  onFavoriteToggle,
  onCompareToggle,
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const status = normalizeStatus(property?.listingStatus, t);
  const typeLabel = propertyTypeLabel(property, t);
  const verificationScore = Number(property?.verification?.score || 0);
  const richListing = isRichListing(property);
  const propertyHref = buildPropertyHref(property);

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
      borderRadius="40px"
      overflow="hidden"
      bg={publicBrand.gradients.panelLight}
      border="1px solid rgba(9,18,32,0.06)"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(212, 175, 55, 0.05)"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "40px",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(212,175,55,0.03) 100%)",
        opacity: 0,
        transition: "opacity 0.4s ease",
        zIndex: 0,
      }}
      _hover={{
        _before: {
          opacity: 1,
        },
        transform: "translateY(-8px) scale(1.01)",
        boxShadow: "0 15px 50px rgba(0, 0, 0, 0.2), 0 0 30px rgba(212, 175, 55, 0.1), 0 0 60px rgba(255, 255, 255, 0.05)",
      }}
    >
      <Box position="relative" overflow="hidden" borderRadius="34px 34px 0 0">
        <Box
          className="property-image-wrapper"
          transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          _hover={{
            transform: "scale(1.08)",
          }}
        >
          <Image
            src={getPrimaryImage(property)}
            alt={property?.name || property?.propertyAddress}
            h="320px"
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

        <HStack position="absolute" top={4} left={4} spacing={2} flexWrap="wrap">
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

        <HStack position="absolute" top={4} right={4} spacing={2}>
          <IconButton
            aria-label="Toggle favorite"
            icon={<FiHeart />}
            size="sm"
            bg={isFavorite ? publicBrand.gradients.brass : actionStyles.bg}
            color={isFavorite ? publicBrand.colors.ink : actionStyles.color}
            border={actionStyles.border}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ 
              bg: isFavorite ? publicBrand.gradients.brass : "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.15)",
              boxShadow: isFavorite ? "0 0 20px rgba(212, 175, 55, 0.5)" : "0 0 15px rgba(255, 255, 255, 0.2)",
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
            bg={isInCompare ? publicBrand.gradients.brass : actionStyles.bg}
            color={isInCompare ? publicBrand.colors.ink : actionStyles.color}
            border={actionStyles.border}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ 
              bg: isInCompare ? publicBrand.gradients.brass : "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.15)",
              boxShadow: isInCompare ? "0 0 20px rgba(212, 175, 55, 0.5)" : "0 0 15px rgba(255, 255, 255, 0.2)",
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
            bg={actionStyles.bg}
            color={actionStyles.color}
            border={actionStyles.border}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            _hover={{ 
              bg: "rgba(7, 12, 20, 0.76)",
              transform: "scale(1.15)",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
            }}
            _active={{ transform: "scale(0.95)" }}
            onClick={handleShare}
          />
        </HStack>

        <Stack position="absolute" left={4} right={4} bottom={4} spacing={3}>
          <HStack justify="space-between" align="end" spacing={4}>
            <Stack spacing={1}>
              <Text
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="700"
                lineHeight="1"
                letterSpacing="-0.04em"
                color="white"
              >
                {formatPrice(property?.listingPrice, t)}
              </Text>
              <Text color="whiteAlpha.700" fontSize="sm">
                {t?.("publicListing.priceLabel") || "Price"}
              </Text>
            </Stack>
            <Box
              px={4}
              py={3}
              borderRadius="22px"
              bg="rgba(7,12,20,0.54)"
              border="1px solid rgba(227, 211, 184, 0.14)"
              backdropFilter="blur(10px)"
            >
              <Text color="whiteAlpha.600" fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                {t?.("publicListing.verificationTitle") || "Verification"}
              </Text>
              <Text color="white" fontWeight="700" mt={1}>
                {verificationScore ? `${verificationScore}%` : t?.("publicListing.notSpecified") || "On request"}
              </Text>
            </Box>
          </HStack>
        </Stack>
      </Box>

      <Stack p={6} spacing={5}>
        <Stack spacing={3}>
          <Text fontSize="xl" fontWeight="700" lineHeight="1.15" color={publicBrand.colors.ink} noOfLines={2}>
            {property?.name || property?.propertyAddress}
          </Text>
          <HStack spacing={2} color={publicBrand.colors.textSoft}>
            <Icon as={LuMapPin} />
            <Text fontSize="sm" noOfLines={1}>
              {property?.propertyAddress || (t?.("publicListing.notSpecified") || "Location on request")}
            </Text>
          </HStack>
          <Text color={publicBrand.colors.textSoft} noOfLines={3} lineHeight="1.8">
            {property?.marketingDescription ||
              property?.propertyDescription ||
              "A structured premium listing with clear facts, direct inquiry, and stronger buyer confidence."}
          </Text>
        </Stack>

        <SimpleGrid columns={3} spacing={3}>
          {metricBlocks(property, t).map((metric) => (
            <Box
              key={metric.label}
              borderRadius="22px"
              px={4}
              py={4}
              bg="rgba(9,18,32,0.04)"
              border="1px solid rgba(9,18,32,0.06)"
            >
              <HStack spacing={2} color={publicBrand.colors.textSoft}>
                <Icon as={metric.icon} />
                <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.12em">
                  {metric.label}
                </Text>
              </HStack>
              <Text mt={2} fontWeight="700" color={publicBrand.colors.ink}>
                {metric.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={3} spacing={3}>
          {assetBlocks(property, t).map((asset) => (
            <HStack
              key={asset.label}
              spacing={3}
              borderRadius="20px"
              px={3.5}
              py={3}
              bg="rgba(245,239,228,0.75)"
              border="1px solid rgba(9,18,32,0.06)"
            >
              <Box
                w="34px"
                h="34px"
                borderRadius="14px"
                display="grid"
                placeItems="center"
                bg="rgba(245,208,118,0.12)"
                color={publicBrand.colors.copper}
              >
                <Icon as={asset.icon} />
              </Box>
              <Box minW="0">
                <Text fontSize="xs" color={publicBrand.colors.textSoft} noOfLines={1}>
                  {asset.label}
                </Text>
                <Text fontWeight="700" color={publicBrand.colors.ink}>
                  {asset.value}
                </Text>
              </Box>
            </HStack>
          ))}
        </SimpleGrid>

        <HStack justify="space-between" align="center" pt={1}>
          <Text color={publicBrand.colors.copper} fontSize="sm" fontWeight="700">
            {richListing
              ? t?.("publicListing.savedOffersHelp") || "Saved in a premium shortlist-ready format"
              : t?.("publicListing.openOffer") || "Open offer"}
          </Text>
          <Button
            rightIcon={<MdArrowForward />}
            borderRadius="full"
            bg={publicBrand.colors.ink}
            color="white"
            _hover={{ bg: publicBrand.colors.inkElevated }}
          >
            {t?.("publicListing.viewOffer") || "View offer"}
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
});

export default ModernPropertyCard;
