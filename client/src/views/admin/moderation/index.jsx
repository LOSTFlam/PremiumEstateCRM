import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { MdGavel, MdOpenInNew, MdRefresh } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";

import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { normalizeModerationStatus, moderationStatusMeta } from "utils/moderationStatus";
import { formatPrice, normalizePropertyMedia } from "views/public/catalog/catalogData";
import { placeholderImage } from "utils/propertyStockImages";

const primaryImage = (listing) =>
  listing?.propertyPhotos?.[0]?.img || listing?.propertyPhotos?.[0] || placeholderImage;

export default function ModerationQueue() {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "navy.700");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const subtleText = useColorModeValue("gray.500", "gray.400");
  const accentGold = useColorModeValue("gold.600", "gold.400");

  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <Box pt={{ base: "110px", md: "80px", xl: "80px" }} px={{ base: 4, md: 6 }} pb={10}>
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={4} mb={6}>
        <Box>
          <HStack spacing={3} mb={2}>
            <Icon as={MdGavel} boxSize={7} color={accentGold} />
            <Text fontSize="2xl" fontWeight="800">
              Модерация объявлений
            </Text>
            <Badge colorScheme="orange" borderRadius="full" px={3}>
              {pendingCount}
            </Badge>
          </HStack>
          <Text color={subtleText}>
            Проверяйте новые объявления пользователей перед публикацией на сайте
          </Text>
        </Box>
        <Button leftIcon={<MdRefresh />} variant="outline" onClick={fetchQueue}>
          Обновить
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
            Очередь пуста
          </Text>
          <Text color={subtleText} mt={2}>
            Новые объявления, отправленные на проверку, появятся здесь
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {listings.map((listing) => {
            const moderationStatus = normalizeModerationStatus(listing);
            const moderation = moderationStatusMeta(moderationStatus);
            const owner = listing?.createBy;
            const ownerName = [owner?.firstName, owner?.lastName].filter(Boolean).join(" ").trim();

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
                  <HStack justify="space-between">
                    <Badge colorScheme={moderation.colorScheme}>{moderation.label}</Badge>
                    <Badge>{listing?.propertyType || "—"}</Badge>
                  </HStack>
                  <Text fontWeight="800" fontSize="lg" noOfLines={1}>
                    {listing?.name || listing?.propertyAddress}
                  </Text>
                  <HStack color={subtleText} spacing={1.5}>
                    <Icon as={LuMapPin} boxSize="14px" />
                    <Text fontSize="sm" noOfLines={1}>
                      {listing?.propertyAddress || "—"}
                    </Text>
                  </HStack>
                  <Text fontWeight="800" color={accentGold}>
                    {formatPrice(listing?.listingPrice)}
                  </Text>
                  <Box>
                    <Text fontSize="sm" color={subtleText}>
                      Автор
                    </Text>
                    <Text fontWeight="600">
                      {ownerName || owner?.username || owner?.email || "—"}
                    </Text>
                    {owner?.isBlocked ? (
                      <Badge mt={1} colorScheme="red">
                        Пользователь заблокирован
                      </Badge>
                    ) : null}
                  </Box>
                  <HStack pt={1}>
                    <Button
                      flex={1}
                      colorScheme="green"
                      onClick={() => navigate(`/propertyView/${listing._id}`)}
                    >
                      Проверить
                    </Button>
                    <Button
                      as={RouterLink}
                      to={`/propertyView/${listing._id}`}
                      target="_blank"
                      variant="outline"
                      leftIcon={<MdOpenInNew />}
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
    </Box>
  );
}
