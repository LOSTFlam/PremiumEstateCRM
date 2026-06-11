import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  HStack,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  FiUpload,
  FiX,
  FiImage,
} from "react-icons/fi";
import { postApi as _postApi } from "services/api";

export default function PropertyPhotoUpload({ propertyId: _propertyId, photos = [], onChange }) {
  const { t } = useTranslation();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos || []);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);

  const _cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadedPhotos = [];

      for (const file of files) {
        // Validate file
        if (!file.type.startsWith("image/")) {
          toast({
            title: t("publicListing.invalidFileType"),
            status: "error",
            duration: 3000,
          });
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          // 10MB max
          toast({
            title: t("publicListing.fileTooLarge"),
            status: "error",
            duration: 3000,
          });
          continue;
        }

        // Convert to base64 for preview
        const base64 = await fileToBase64(file);

        // Create photo object
        const photo = {
          img: base64,
          title: file.name,
          subtitle: "Uploaded image",
          file: file, // Keep original file for upload
        };

        uploadedPhotos.push(photo);
      }

      // Update local state
      const newPhotos = [...localPhotos, ...uploadedPhotos];
      setLocalPhotos(newPhotos);

      // Notify parent component
      if (onChange) {
        onChange(newPhotos);
      }

      toast({
        title: t("publicListing.photosUploaded"),
        description: `${uploadedPhotos.length} ${t("publicListing.photos")}`,
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      // Console statement removed
      toast({
        title: t("publicListing.uploadError"),
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = (index) => {
    const newPhotos = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(newPhotos);
    if (onChange) {
      onChange(newPhotos);
    }
    toast({
      title: t("publicListing.photoRemoved"),
      status: "info",
      duration: 2000,
    });
  };

  const handleSetPrimary = (index) => {
    setPrimaryImageIndex(index);
    // Reorder array to put primary first
    const newPhotos = [localPhotos[index], ...localPhotos.filter((_, i) => i !== index)];
    setLocalPhotos(newPhotos);
    if (onChange) {
      onChange(newPhotos);
    }
    toast({
      title: t("publicListing.primaryImageSet"),
      status: "success",
      duration: 2000,
    });
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;

    // Create a mock event for handleFileSelect
    handleFileSelect({ target: { files } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <Stack spacing={4}>
      {/* Upload Area */}
      <Box
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={isUploading ? "green.400" : borderColor}
        borderRadius="20px"
        p={8}
        textAlign="center"
        bg={isUploading ? "green.50" : hoverBg}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        transition="all 0.3s"
        _hover={{
          borderColor: "green.400",
          bg: "green.50",
        }}
      >
        <Stack align="center" spacing={4}>
          <Icon as={FiUpload} boxSize={12} color="green.500" />
          <Stack spacing={1}>
            <Text fontWeight="600" color="gray.700">
              {t("publicListing.dropPhotosHere")}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {t("publicListing.orClickToBrowse")}
            </Text>
          </Stack>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            display="none"
          />

          <Button
            colorScheme="green"
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
            loadingText={t("publicListing.uploading")}
          >
            {t("publicListing.selectPhotos")}
          </Button>
          <Text fontSize="xs" color="gray.400">
            {t("publicListing.supportedFormats")}
          </Text>
        </Stack>
      </Box>

      {/* Photo Grid */}
      {localPhotos.length > 0 && (
        <Stack spacing={3}>
          <HStack justify="space-between">
            <Text fontWeight="600">
              {t("publicListing.propertyImages")} ({localPhotos.length})
            </Text>
            <Badge colorScheme="green">
              {primaryImageIndex === 0
                ? t("publicListing.primaryImageSet")
                : t("publicListing.clickStarToSetPrimary")}
            </Badge>
          </HStack>
          <Flex wrap="wrap" gap={3}>
            {localPhotos.map((photo, index) => (
              <Box
                key={index}
                role="group"
                position="relative"
                width={{ base: "100px", md: "150px" }}
                height={{ base: "100px", md: "150px" }}
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
                  src={photo.img}
                  alt={photo.title || `Photo ${index + 1}`}
                  w="100%"
                  h="100%"
                  objectFit="cover"
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
                    {t("publicListing.primaryImage")}
                  </Badge>
                )}

                <Flex
                  position="absolute"
                  insetX={0}
                  bottom={0}
                  justify="flex-end"
                  align="center"
                  gap={2}
                  px={2}
                  py={2}
                  zIndex={2}
                  bg="linear-gradient(180deg, transparent 0%, rgba(7, 12, 20, 0.82) 100%)"
                  opacity={{ base: 1, md: 0 }}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s ease"
                >
                  {index > 0 ? (
                    <IconButton
                      aria-label={t("publicListing.setAsPrimary")}
                      icon={<FiImage />}
                      size="xs"
                      colorScheme="green"
                      variant="solid"
                      onClick={() => handleSetPrimary(index)}
                    />
                  ) : null}
                  <IconButton
                    aria-label={t("publicListing.removePhoto")}
                    icon={<FiX />}
                    size="xs"
                    colorScheme="red"
                    variant="solid"
                    onClick={() => handleRemovePhoto(index)}
                  />
                </Flex>
              </Box>
            ))}
          </Flex>
        </Stack>
      )}

      {/* Helper Text */}
      {localPhotos.length === 0 && (
        <Text fontSize="sm" color="gray.500" textAlign="center">
          {t("publicListing.noPhotosUploaded")}
        </Text>
      )}
    </Stack>
  );
}

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
