import { Badge, Button, Flex, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import LazyImage from "components/public/LazyImage";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { MdBathtub, MdCompareArrows, MdMeetingRoom, MdOutlineSquareFoot } from "react-icons/md";
import { useTranslation } from "react-i18next";
import {
  formatAreaValue,
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
      className="property-list-card"
      direction={{ base: "column", md: "row" }}
      maxW="100%"
      minW={0}
      w="100%"
      borderRadius="24px"
      overflow="hidden"
      bg={publicBrand.gradients.panel}
      border={`1px solid ${publicBrand.colors.line}`}
      boxShadow={publicBrand.shadows.deep}
      color={publicBrand.colors.text}
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 24px 68px rgba(0,0,0,0.32), 0 0 30px rgba(212,175,55,0.12)",
      }}
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
        <Flex
          justify="space-between"
          align={{ base: "stretch", md: "start" }}
          direction={{ base: "column", sm: "row" }}
          gap={2}
          w="100%"
          minW={0}
        >
          <Stack spacing={1} minW={0} flex={1}>
            <Text fontWeight="700" fontSize="lg" color={publicBrand.colors.text} noOfLines={2}>
              {getListingTitle(property, t, i18n.language)}
            </Text>
            <Text fontSize="sm" color={publicBrand.colors.textMuted} noOfLines={2}>
              {getListingAddress(property, t, i18n.language)}
            </Text>
          </Stack>
          <Text
            fontWeight="800"
            color="#f5d076"
            fontSize={{ base: "md", md: "lg" }}
            flexShrink={0}
            wordBreak="normal"
            overflowWrap="normal"
            whiteSpace={{ base: "normal", sm: "nowrap" }}
          >
            {formatPrice(property?.listingPrice, t, i18n.language)}
          </Text>
        </Flex>
        <HStack spacing={4} flexWrap="wrap" color={publicBrand.colors.textMuted} fontSize="sm">
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
            <Text>{formatAreaValue(property?.squareFootage)}</Text>
          </HStack>
        </HStack>
        <HStack spacing={2}>
          {property?.featured ? (
            <Badge bg="rgba(245,208,118,0.16)" color="#f5d076">
              {t("publicPages.catalog.badgeExclusive")}
            </Badge>
          ) : null}
          <HStack ml="auto" spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={(event) => {
                event.preventDefault();
                onFavoriteToggle?.(property?._id);
              }}
              color={isFavorite ? "#f5d076" : publicBrand.colors.textMuted}
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
              color={isInCompare ? "#f5d076" : publicBrand.colors.textMuted}
            >
              <MdCompareArrows />
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </Flex>
  );
}
