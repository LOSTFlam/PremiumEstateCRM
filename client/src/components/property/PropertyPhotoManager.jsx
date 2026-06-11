import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem as _GridItem,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useToast,
  IconButton,
  Badge,
  Spinner as _Spinner,
  Tooltip,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  FiUpload,
  FiX as _FiX,
  FiImage,
  FiPlus as _FiPlus,
  FiTrash2,
  FiEdit as _FiEdit,
} from "react-icons/fi";
import { postApi, putApi, getApi } from "services/api";

export default function PropertyPhotoManager({
  propertyId,
  photos = [],
  onChange,
  isOpen: _isOpen,
  onClose: _onClose,
}) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos || []);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [_isEditing, _setIsEditing] = useState(false);
  const isRu = i18n.language?.startsWith("ru");

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Sync with parent photos
  React.useEffect(() => {
    if (photos) {
      setLocalPhotos(photos);
    }
  }, [photos]);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !propertyId) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("property", file);
      });

      const response = await postApi(
        `api/property/add-property-photos/${propertyId}`,
        formData,
        false,
        true
      );

      if (response?.status === 200 || response?.data) {
        // Fetch updated property data
        const updatedProperty = await getApi(`api/property/view/${propertyId}`);
        const newPhotos = updatedProperty?.data?.propertyPhotos || [];
        setLocalPhotos(newPhotos);
        if (onChange) {
          onChange(newPhotos);
        }

        toast({
          title: t?.("publicListing.photosUploaded") || "Photos uploaded",
          description: isRu
            ? `${files.length} фото успешно загружено`
            : `${files.length} photo(s) uploaded successfully`,
          status: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      // Console statement removed
      toast({
        title: t?.("publicListing.uploadError") || (isRu ? "Ошибка загрузки" : "Upload error"),
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemovePhoto = async (photoIndex) => {
    try {
      const _photoToRemove = localPhotos[photoIndex];
      // Note: You might want to delete from server too
      const newPhotos = localPhotos.filter((_, i) => i !== photoIndex);

      // Update property with new photos array
      await putApi(
        `api/property/edit/${propertyId}`,
        {
          propertyPhotos: newPhotos,
        },
        false
      );

      setLocalPhotos(newPhotos);
      if (onChange) {
        onChange(newPhotos);
      }

      toast({
        title: t?.("publicListing.photoRemoved") || "Photo removed",
        status: "info",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title:
          t?.("publicListing.removeError") ||
          (isRu ? "Ошибка удаления фото" : "Error removing photo"),
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleSetPrimary = async (photoIndex) => {
    try {
      const photoToSet = localPhotos[photoIndex];
      const newPhotos = [photoToSet, ...localPhotos.filter((_, i) => i !== photoIndex)];

      await putApi(
        `api/property/edit/${propertyId}`,
        {
          propertyPhotos: newPhotos,
        },
        false
      );

      setLocalPhotos(newPhotos);
      if (onChange) {
        onChange(newPhotos);
      }

      toast({
        title: t?.("publicListing.primaryImageSet") || "Primary image set",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: isRu ? "Ошибка выбора основного изображения" : "Error setting primary image",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md">
            {t?.("publicListing.propertyImages") ||
              (isRu ? "Изображения объекта" : "Property Images")}
          </Heading>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            display="none"
            id="property-photo-upload"
          />

          <Button
            as="label"
            htmlFor="property-photo-upload"
            colorScheme="green"
            size="sm"
            leftIcon={<Icon as={FiUpload} />}
            isLoading={isUploading}
            loadingText={isRu ? "Загрузка..." : "Uploading..."}
            cursor="pointer"
          >
            {isRu ? "Загрузить фото" : "Upload Photos"}
          </Button>
        </Flex>

        {localPhotos?.length > 0 ? (
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={3}
          >
            {localPhotos.map((photo, index) => (
              <Box
                key={index}
                role="group"
                position="relative"
                borderRadius="16px"
                overflow="hidden"
                borderWidth="2px"
                borderColor={index === 0 ? "green.400" : borderColor}
                transition="all 0.3s"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
              >
                <Image
                  src={photo?.img}
                  alt={photo?.title || (isRu ? `Фото ${index + 1}` : `Photo ${index + 1}`)}
                  w="100%"
                  h="200px"
                  objectFit="cover"
                  onClick={() => setSelectedPhoto(photo)}
                  cursor="pointer"
                />

                {/* Primary Badge */}
                {index === 0 && (
                  <Badge
                    position="absolute"
                    top={2}
                    left={2}
                    bg="green.600"
                    color="white"
                    fontSize="xs"
                    fontWeight="700"
                    px={2}
                    py={1}
                    borderRadius="md"
                    boxShadow="0 4px 14px rgba(0,0,0,0.35)"
                    zIndex={2}
                  >
                    {isRu ? "Основное" : "Primary"}
                  </Badge>
                )}

                {/* Action Buttons */}
                <Flex
                  position="absolute"
                  top={2}
                  right={2}
                  gap={1}
                  zIndex={2}
                  p={1}
                  borderRadius="10px"
                  bg="rgba(8, 17, 26, 0.78)"
                  backdropFilter="blur(8px)"
                  boxShadow="0 8px 24px rgba(0,0,0,0.35)"
                  opacity={{ base: 1, md: 0.92 }}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s ease"
                >
                  {index > 0 && (
                    <Tooltip label={isRu ? "Сделать основным" : "Set as primary"}>
                      <IconButton
                        aria-label={isRu ? "Сделать основным" : "Set as primary"}
                        icon={<FiImage />}
                        size="sm"
                        colorScheme="green"
                        variant="solid"
                        bg="green.500"
                        color="white"
                        _hover={{ bg: "green.400" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(index);
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip label={isRu ? "Удалить фото" : "Remove photo"}>
                    <IconButton
                      aria-label={isRu ? "Удалить фото" : "Remove photo"}
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="solid"
                      bg="red.500"
                      color="white"
                      _hover={{ bg: "red.400" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(index);
                      }}
                    />
                  </Tooltip>
                </Flex>
              </Box>
            ))}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={10}
            bg={cardBg}
            borderRadius="20px"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Icon as={FiImage} boxSize={12} color="gray.400" mb={3} />
            <Text color="gray.500" fontSize="lg">
              {isRu ? "Фотографии пока не загружены" : "No photos uploaded yet"}
            </Text>
            <Text color="gray.400" fontSize="sm" mt={2}>
              {isRu ? "Загрузите первую фотографию объекта" : "Upload your first property photo"}
            </Text>
          </Box>
        )}
      </Flex>

      {/* Photo Preview Modal */}
      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedPhoto?.title || (isRu ? "Просмотр фото" : "Photo Preview")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPhoto && (
              <Image
                src={selectedPhoto?.img}
                alt={selectedPhoto?.title || (isRu ? "Фото" : "Photo")}
                w="100%"
                maxH="600px"
                objectFit="contain"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setSelectedPhoto(null)}>
              {isRu ? "Закрыть" : "Close"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
