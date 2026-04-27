import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Flex,
  Text,
  HStack,
  Badge,
  useDisclosure,
  Spinner,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  ViewIcon,
} from '@chakra-ui/icons';
import { FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';

/**
 * Enhanced Image Gallery Component
 * Features:
 * - Lazy loading
 * - Lightbox modal
 * - Image zoom
 * - Download capability
 * - Responsive grid
 */
const EnhancedImageGallery = ({
  images = [],
  title = 'Gallery',
  columns = { base: 1, md: 2, lg: 3 },
  allowDownload = true,
  onImageClick = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [imageLoading, setImageLoading] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const currentImage = useMemo(() => {
    return images?.[selectedIndex];
  }, [images, selectedIndex]);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const openImage = (index) => {
    setSelectedIndex(index);
    setZoom(100);
    setRotation(0);
    onOpen();
    onImageClick?.(images[index], index);
  };

  if (!images.length) {
    return (
      <Box p={8} textAlign="center" bg={bgColor} borderRadius="lg" border={`1px solid ${borderColor}`}>
        <Text color="gray.500">No images available</Text>
      </Box>
    );
  }

  return (
    <>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          {title} ({images.length})
        </Text>

        <Grid templateColumns={columns} gap={4} mb={4}>
          {images.map((image, index) => (
            <GridItem key={index} position="relative" group>
              <Box
                position="relative"
                paddingBottom="100%"
                bg={bgColor}
                borderRadius="lg"
                overflow="hidden"
                border={`1px solid ${borderColor}`}
                cursor="pointer"
                transition="all 0.3s"
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'lg',
                  borderColor: 'blue.500',
                }}
              >
                <Image
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  src={image.url || image}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  objectFit="cover"
                  loading="lazy"
                  onLoad={() => setImageLoading((prev) => ({ ...prev, [index]: false }))}
                  onError={() => setImageLoading((prev) => ({ ...prev, [index]: false }))}
                />

                {imageLoading[index] && (
                  <Flex position="absolute" top={0} left={0} w="100%" h="100%" align="center" justify="center">
                    <Spinner size="sm" />
                  </Flex>
                )}

                <Flex
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                  bg="blackAlpha.600"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                  gap={2}
                >
                  <Tooltip label="View">
                    <IconButton
                      icon={<ViewIcon />}
                      size="lg"
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => openImage(index)}
                      aria-label="View full image"
                    />
                  </Tooltip>
                  {allowDownload && (
                    <Tooltip label="Download">
                      <IconButton
                        icon={<DownloadIcon />}
                        size="lg"
                        colorScheme="green"
                        variant="solid"
                        onClick={() => handleDownload(image.url || image)}
                        aria-label="Download image"
                      />
                    </Tooltip>
                  )}
                </Flex>

                {image.size && (
                  <Badge position="absolute" bottom={2} right={2} colorScheme="gray" fontSize="xs">
                    {(image.size / 1024 / 1024).toFixed(1)}MB
                  </Badge>
                )}
              </Box>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Lightbox Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" bg="blackAlpha.700" />
        <ModalContent bg={bgColor} maxW="90vw" maxH="90vh">
          <ModalCloseButton size="lg" top={4} right={4} zIndex={10} />

          <ModalBody p={0} display="flex" flexDirection="column" h="100%">
            {/* Main Image Display */}
            <Flex
              flex={1}
              align="center"
              justify="center"
              bg="black"
              position="relative"
              overflow="hidden"
            >
              {currentImage && (
                <Image
                  src={currentImage.url || currentImage}
                  alt="Full view"
                  maxW="100%"
                  maxH="100%"
                  objectFit="contain"
                  transform={`scale(${zoom / 100}) rotate(${rotation}deg)`}
                  transition="transform 0.2s"
                />
              )}

              {imageLoading[selectedIndex] && <Spinner size="xl" color="white" />}
            </Flex>

            {/* Controls */}
            <Box bg={bgColor} p={4} borderTop={`1px solid ${borderColor}`}>
              <Flex justify="space-between" align="center" gap={4} flexWrap="wrap">
                {/* Image Counter */}
                <Text fontSize="sm" color="gray.500">
                  {selectedIndex + 1} / {images.length}
                </Text>

                {/* Navigation Buttons */}
                <HStack spacing={2}>
                  <Tooltip label="Previous (←)">
                    <IconButton
                      icon={<ChevronLeftIcon />}
                      onClick={handlePrevious}
                      aria-label="Previous image"
                      isDisabled={images.length <= 1}
                    />
                  </Tooltip>
                  <Tooltip label="Next (→)">
                    <IconButton
                      icon={<ChevronRightIcon />}
                      onClick={handleNext}
                      aria-label="Next image"
                      isDisabled={images.length <= 1}
                    />
                  </Tooltip>
                </HStack>

                {/* Zoom & Rotation Controls */}
                <HStack spacing={2}>
                  <Tooltip label="Zoom Out">
                    <IconButton
                      icon={<FiZoomOut />}
                      onClick={handleZoomOut}
                      aria-label="Zoom out"
                    />
                  </Tooltip>
                  <Text fontSize="sm" minW="50px" textAlign="center">
                    {zoom}%
                  </Text>
                  <Tooltip label="Zoom In">
                    <IconButton
                      icon={<FiZoomIn />}
                      onClick={handleZoomIn}
                      aria-label="Zoom in"
                    />
                  </Tooltip>
                  <Tooltip label="Rotate">
                    <IconButton
                      icon={<FiRotateCw />}
                      onClick={handleRotate}
                      aria-label="Rotate image"
                    />
                  </Tooltip>
                  <Tooltip label="Reset">
                    <IconButton
                      icon={<ChevronLeftIcon />}
                      onClick={handleReset}
                      aria-label="Reset view"
                    />
                  </Tooltip>
                </HStack>

                {/* Download Button */}
                {allowDownload && (
                  <Tooltip label="Download">
                    <IconButton
                      icon={<DownloadIcon />}
                      onClick={() => handleDownload(currentImage?.url || currentImage)}
                      colorScheme="green"
                      aria-label="Download image"
                    />
                  </Tooltip>
                )}
              </Flex>

              {/* Image Info */}
              {currentImage?.alt && (
                <Text fontSize="xs" color="gray.500" mt={2}>
                  {currentImage.alt}
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EnhancedImageGallery;
