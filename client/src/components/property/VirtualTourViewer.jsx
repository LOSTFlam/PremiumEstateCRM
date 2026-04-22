import React, { useState, useRef, useEffect as _useEffect } from "react";
import {
  Box,
  Button as _Button,
  Flex,
  Heading as _Heading,
  IconButton,
  Text,
  useColorModeValue as _useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Image,
  Badge,
  HStack,
  VStack,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiMaximize,
  FiMinimize,
  FiRotateCw,
  FiRotateCcw,
  FiZoomIn,
  FiZoomOut,
  FiHome,
  FiMapPin,
  FiDollarSign as _FiDollarSign,
} from "react-icons/fi";
import { getPrimaryImage } from "views/public/catalog/catalogData";

export const VirtualTourViewer = ({ property, isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef(null);

  // Mock property images (in real app, use property.propertyPhotos)
  const images =
    property?.propertyPhotos?.length > 0
      ? property.propertyPhotos.map((p) => p.img)
      : [getPrimaryImage(property)];

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleRotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent bg="black">
        <ModalHeader color="white">
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              Virtual Tour - {property?.name}
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme="blue">{property?.propertyType}</Badge>
              <Badge colorScheme="green">{property?.listingStatus}</Badge>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody p={0}>
          <Box
            ref={containerRef}
            position="relative"
            w="100%"
            h="calc(100vh - 200px)"
            bg="gray.900"
            overflow="hidden"
          >
            {/* Main Image */}
            <Box
              position="relative"
              w="100%"
              h="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                transform={`scale(${zoom}) rotate(${rotation}deg)`}
                transition="transform 0.3s ease"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={`Property view ${currentImageIndex + 1}`}
                  maxH="100%"
                  maxW="100%"
                  objectFit="contain"
                />
              </Box>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <IconButton
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    icon={<FiRotateCcw />}
                    onClick={handlePrev}
                    colorScheme="whiteAlpha"
                    size="lg"
                    aria-label="Previous"
                  />

                  <IconButton
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    icon={<FiRotateCw />}
                    onClick={handleNext}
                    colorScheme="whiteAlpha"
                    size="lg"
                    aria-label="Next"
                  />
                </>
              )}
            </Box>

            {/* Controls */}
            <Box position="absolute" bottom={4} left={0} right={0} px={4}>
              <Flex justify="center" gap={2}>
                <Tooltip label="Zoom In">
                  <IconButton
                    icon={<FiZoomIn />}
                    onClick={handleZoomIn}
                    colorScheme="whiteAlpha"
                    aria-label="Zoom In"
                  />
                </Tooltip>
                <Tooltip label="Zoom Out">
                  <IconButton
                    icon={<FiZoomOut />}
                    onClick={handleZoomOut}
                    colorScheme="whiteAlpha"
                    aria-label="Zoom Out"
                  />
                </Tooltip>
                <Tooltip label="Rotate Left">
                  <IconButton
                    icon={<FiRotateCcw />}
                    onClick={handleRotateLeft}
                    colorScheme="whiteAlpha"
                    aria-label="Rotate Left"
                  />
                </Tooltip>
                <Tooltip label="Rotate Right">
                  <IconButton
                    icon={<FiRotateCw />}
                    onClick={handleRotateRight}
                    colorScheme="whiteAlpha"
                    aria-label="Rotate Right"
                  />
                </Tooltip>
                <Tooltip label="Reset">
                  <IconButton
                    icon={<FiHome />}
                    onClick={handleReset}
                    colorScheme="whiteAlpha"
                    aria-label="Reset"
                  />
                </Tooltip>
                <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  <IconButton
                    icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
                    onClick={toggleFullscreen}
                    colorScheme="whiteAlpha"
                    aria-label="Toggle Fullscreen"
                  />
                </Tooltip>
              </Flex>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <Flex justify="center" gap={2} mt={4}>
                  {images.map((img, index) => (
                    <Box
                      key={index}
                      w="60px"
                      h="60px"
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      border={
                        index === currentImageIndex ? "2px solid white" : "2px solid transparent"
                      }
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        w="100%"
                        h="100%"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </Flex>
              )}

              {/* Image Counter */}
              {images.length > 1 && (
                <Text textAlign="center" color="white" mt={2} fontSize="sm">
                  {currentImageIndex + 1} / {images.length}
                </Text>
              )}
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter bg="gray.900">
          <Flex justify="space-between" w="100%">
            <VStack align="start" spacing={1}>
              <Text color="white" fontSize="lg" fontWeight="bold">
                {property?.name}
              </Text>
              <HStack>
                <Icon as={FiMapPin} color="gray.400" />
                <Text color="gray.400">{property?.propertyAddress}</Text>
              </HStack>
            </VStack>
            <VStack align="end" spacing={1}>
              <Text color="green.400" fontSize="2xl" fontWeight="bold">
                ${property?.listingPrice?.toLocaleString()}
              </Text>
              <Text color="gray.400" fontSize="sm">
                {property?.bedrooms} bed • {property?.bathrooms} bath • {property?.squareFootage}{" "}
                sqft
              </Text>
            </VStack>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VirtualTourViewer;
