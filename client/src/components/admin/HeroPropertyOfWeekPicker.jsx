import { useMemo, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FiHome, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  formatPrice,
  getListingTitle,
  getPrimaryImage,
  placeholderImage,
} from "views/public/catalog/catalogData";

const propertyLabel = (property, t, language) =>
  getListingTitle(property, t, language) ||
  property?.name ||
  property?.propertyAddress ||
  t("adminInline.heroPropertyUntitled", { defaultValue: "Untitled listing" });

export default function HeroPropertyOfWeekPicker({
  properties = [],
  selectedId = null,
  onSave,
  isSaving = false,
  compact = false,
}) {
  const { t, i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState(selectedId);

  const filtered = useMemo(() => {
    const normalized = String(query || "")
      .trim()
      .toLowerCase();
    if (!normalized) return properties;

    return properties.filter((property) => {
      const haystack = [
        property?.name,
        property?.propertyAddress,
        property?.propertyType,
        property?.marketingDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [properties, query]);

  const selectedProperty = useMemo(
    () => properties.find((property) => String(property?._id) === String(selectedId)) || null,
    [properties, selectedId]
  );

  const openPicker = () => {
    setPendingId(selectedId);
    setQuery("");
    onOpen();
  };

  const handleApply = async () => {
    await onSave(pendingId || null);
    onClose();
  };

  const handleClear = async () => {
    await onSave(null);
    onClose();
  };

  return (
    <>
      <Box
        position="absolute"
        top={{ base: "52px", md: "56px" }}
        right={{ base: 3, md: 4 }}
        zIndex={35}
      >
        <Button
          size={compact ? "xs" : "sm"}
          leftIcon={<Icon as={FiHome} />}
          onClick={openPicker}
          isLoading={isSaving}
          borderRadius="full"
          bg="rgba(8, 17, 26, 0.82)"
          color="#f5d076"
          border="1px solid rgba(245, 208, 118, 0.24)"
          backdropFilter="blur(10px)"
          _hover={{ bg: "rgba(8, 17, 26, 0.92)" }}
        >
          {t("adminInline.pickHeroProperty", { defaultValue: "Pick listing of the week" })}
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="24px" mx={4}>
          <ModalHeader>
            {t("adminInline.heroPropertyModalTitle", { defaultValue: "Listing of the week" })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {selectedProperty ? (
                <Box
                  p={3}
                  borderRadius="16px"
                  bg="blackAlpha.50"
                  border="1px solid"
                  borderColor="blackAlpha.100"
                >
                  <Text fontSize="xs" fontWeight="700" color="gray.500" mb={1}>
                    {t("adminInline.heroPropertyCurrent", { defaultValue: "Currently featured" })}
                  </Text>
                  <Text fontWeight="700">{propertyLabel(selectedProperty, t, i18n.language)}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {selectedProperty?.propertyAddress}
                  </Text>
                </Box>
              ) : (
                <Text fontSize="sm" color="gray.600">
                  {t("adminInline.heroPropertyAutoHint", {
                    defaultValue: "Auto mode picks the first rich listing with photos.",
                  })}
                </Text>
              )}

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  pl={10}
                  placeholder={t("adminInline.heroPropertySearch", {
                    defaultValue: "Search by title or address",
                  })}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </InputGroup>

              <VStack align="stretch" spacing={2} maxH="360px" overflowY="auto">
                {filtered.map((property) => {
                  const isActive = String(pendingId) === String(property?._id);
                  return (
                    <HStack
                      key={property._id}
                      p={3}
                      borderRadius="16px"
                      border="1px solid"
                      borderColor={isActive ? "brand.400" : "blackAlpha.100"}
                      bg={isActive ? "brand.50" : "white"}
                      cursor="pointer"
                      onClick={() => setPendingId(property._id)}
                      align="start"
                      spacing={3}
                    >
                      <Image
                        src={getPrimaryImage(property)}
                        fallbackSrc={placeholderImage}
                        alt=""
                        boxSize="56px"
                        borderRadius="12px"
                        objectFit="cover"
                        flexShrink={0}
                      />
                      <Box minW={0}>
                        <Text fontWeight="700" noOfLines={1}>
                          {propertyLabel(property, t, i18n.language)}
                        </Text>
                        <Text fontSize="sm" color="gray.600" noOfLines={1}>
                          {property?.propertyAddress}
                        </Text>
                        <Text fontSize="sm" fontWeight="600" mt={1}>
                          {formatPrice(property?.listingPrice, t, i18n.language)}
                        </Text>
                      </Box>
                    </HStack>
                  );
                })}
                {!filtered.length ? (
                  <Text fontSize="sm" color="gray.500" py={4} textAlign="center">
                    {t("adminInline.heroPropertyEmpty", {
                      defaultValue: "No listings match your search.",
                    })}
                  </Text>
                ) : null}
              </VStack>
            </Stack>
          </ModalBody>
          <ModalFooter gap={2} flexWrap="wrap">
            <Button variant="ghost" onClick={handleClear} isLoading={isSaving}>
              {t("adminInline.heroPropertyAuto", { defaultValue: "Auto pick" })}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel", { defaultValue: "Cancel" })}
            </Button>
            <Button variant="brand" onClick={handleApply} isLoading={isSaving}>
              {t("common.save", { defaultValue: "Save" })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
