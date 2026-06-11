import { Badge, Box, Button, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import LazyImage from "components/public/LazyImage";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { MdBathtub, MdCompareArrows, MdMeetingRoom, MdOutlineSquareFoot } from "react-icons/md";
import { useTranslation } from "react-i18next";
import {
  formatPrice,
  getListingAddress,
  getListingTitle,
  getPrimaryImage,
  placeholderImage,
} from "views/public/catalog/catalogData";
import { publicBrand } from "views/public/publicBrand";
import { buildPropertyHref } from "utils/propertyHref";

export default function PropertyListCard({
  property,
  isFavorite,
  isInCompare,
  onFavoriteToggle,
  onCompareToggle,
}) {
  const { t, i18n } = useTranslation();
  const href = buildPropertyHref(property);

  return (
    <Flex
      as={RouterLink}
      to={href}
      direction={{ base: "column", md: "row" }}
      borderRadius="24px"
      overflow="hidden"
      bg="white"
      border="1px solid rgba(9,18,32,0.08)"
      boxShadow={publicBrand.shadows.soft}
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.12)" }}
    >
      <LazyImage
        src={getPrimaryImage(property) || placeholderImage}
        fallbackSrc={placeholderImage}
        alt={getListingTitle(property, t, i18n.language)}
        w={{ base: "100%", md: "280px" }}
        h={{ base: "200px", md: "220px" }}
        objectFit="cover"
        flexShrink={0}
      />
      <Stack flex={1} p={5} spacing={3}>
        <HStack justify="space-between" align="start">
          <Stack spacing={1}>
            <Text fontWeight="700" fontSize="lg" noOfLines={2}>
              {getListingTitle(property, t, i18n.language)}
            </Text>
            <Text fontSize="sm" color={publicBrand.colors.textSoft} noOfLines={1}>
              {getListingAddress(property, t, i18n.language)}
            </Text>
          </Stack>
          <Text fontWeight="800" color={publicBrand.colors.ink} whiteSpace="nowrap">
            {formatPrice(property?.listingPrice, t, i18n.language)}
          </Text>
        </HStack>
        <HStack spacing={4} flexWrap="wrap" color={publicBrand.colors.textSoft} fontSize="sm">
          <HStack>
            <Icon as={MdMeetingRoom} />
            <Text>{property?.numberofBedrooms || "—"}</Text>
          </HStack>
          <HStack>
            <Icon as={MdBathtub} />
            <Text>{property?.numberofBathrooms || "—"}</Text>
          </HStack>
          <HStack>
            <Icon as={MdOutlineSquareFoot} />
            <Text>{property?.squareFootage || "—"}</Text>
          </HStack>
        </HStack>
        <HStack spacing={2}>
          {property?.featured ? (
            <Badge colorScheme="yellow">{t("publicPages.catalog.badgeExclusive")}</Badge>
          ) : null}
          <HStack ml="auto" spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={(event) => {
                event.preventDefault();
                onFavoriteToggle?.(property?._id);
              }}
              color={isFavorite ? "red.400" : publicBrand.colors.textSoft}
            >
              <FiHeart fill={isFavorite ? "currentColor" : "none"} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(event) => {
                event.preventDefault();
                onCompareToggle?.(property?._id);
              }}
              color={isInCompare ? publicBrand.colors.gold : publicBrand.colors.textSoft}
            >
              <MdCompareArrows />
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Flex>
  );
}
