import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
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
  Spinner,
  Tooltip,
  Heading,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiUpload, FiX, FiImage, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { postApi, putApi, getApi } from 'services/api';

export default function PropertyPhotoManager({ propertyId, photos = [], onChange, isOpen, onClose }) {
  const { t } = useTranslation();
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos || []);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
      files.forEach(file => {
        formData.append('property', file);
      });

      const response = await postApi(`api/property/add-property-photos/${propertyId}`, formData, false, true);
      
      if (response?.status === 200 || response?.data) {
        // Fetch updated property data
        const updatedProperty = await getApi(`api/property/view/${propertyId}`);
        const newPhotos = updatedProperty?.data?.propertyPhotos || [];
        setLocalPhotos(newPhotos);
        if (onChange) {
          onChange(newPhotos);
        }

        toast({
          title: t?.('publicListing.photosUploaded') || 'Photos uploaded',
          description: `${files.length} photo(s) uploaded successfully`,
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: t?.('publicListing.uploadError') || 'Upload error',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemovePhoto = async (photoIndex) => {
    try {
      const photoToRemove = localPhotos[photoIndex];
      // Note: You might want to delete from server too
      const newPhotos = localPhotos.filter((_, i) => i !== photoIndex);
      
      // Update property with new photos array
      await putApi(`api/property/edit/${propertyId}`, {
        propertyPhotos: newPhotos
      }, false);
      
      setLocalPhotos(newPhotos);
      if (onChange) {
        onChange(newPhotos);
      }
      
      toast({
        title: t?.('publicListing.photoRemoved') || 'Photo removed',
        status: 'info',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: t?.('publicListing.removeError') || 'Error removing photo',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSetPrimary = async (photoIndex) => {
    try {
      const photoToSet = localPhotos[photoIndex];
      const newPhotos = [
        photoToSet,
        ...localPhotos.filter((_, i) => i !== photoIndex)
      ];
      
      await putApi(`api/property/edit/${propertyId}`, {
        propertyPhotos: newPhotos
      }, false);
      
      setLocalPhotos(newPhotos);
      if (onChange) {
        onChange(newPhotos);
      }
      
      toast({
        title: t?.('publicListing.primaryImageSet') || 'Primary image set',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error setting primary image',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Flex direction="column" gap={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md">{t?.('publicListing.propertyImages') || 'Property Images'}</Heading>
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
            loadingText="Uploading..."
            cursor="pointer"
          >
            Upload Photos
          </Button>
        </Flex>

        {localPhotos?.length > 0 ? (
          <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={3}>
            {localPhotos.map((photo, index) => (
              <Box
                key={index}
                position="relative"
                borderRadius="16px"
                overflow="hidden"
                borderWidth="2px"
                borderColor={index === 0 ? 'green.400' : borderColor}
                transition="all 0.3s"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'lg',
                }}
              >
                <Image
                  src={photo?.img}
                  alt={photo?.title || `Photo ${index + 1}`}
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
                    colorScheme="green"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    Primary
                  </Badge>
                )}

                {/* Action Buttons */}
                <Flex
                  position="absolute"
                  top={2}
                  right={2}
                  gap={1}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.3s"
                >
                  {index > 0 && (
                    <Tooltip label="Set as primary">
                      <IconButton
                        aria-label="Set as primary"
                        icon={<FiImage />}
                        size="sm"
                        colorScheme="green"
                        variant="solid"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(index);
                        }}
                      />
                    </Tooltip>
                  )}
                  <Tooltip label="Remove photo">
                    <IconButton
                      aria-label="Remove photo"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="solid"
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
              No photos uploaded yet
            </Text>
            <Text color="gray.400" fontSize="sm" mt={2}>
              Upload your first property photo
            </Text>
          </Box>
        )}
      </Flex>

      {/* Photo Preview Modal */}
      <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedPhoto?.title || 'Photo Preview'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPhoto && (
              <Image
                src={selectedPhoto?.img}
                alt={selectedPhoto?.title || 'Photo'}
                w="100%"
                maxH="600px"
                objectFit="contain"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setSelectedPhoto(null)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
