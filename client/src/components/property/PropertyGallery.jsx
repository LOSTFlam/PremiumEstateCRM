import { useState } from "react";
import {
  Box,
  Image,
  HStack,
  IconButton,
  VStack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

const PropertyGallery = ({ images = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailsPerView = useBreakpointValue({ base: 3, md: 5 });

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <VStack h="100vh" spacing={4} p={8}>
      {/* Main Image */}
      <Box flex={1} w="100%" position="relative" display="flex" alignItems="center" justifyContent="center">
        <Image
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          maxH="80vh"
          maxW="100%"
          objectFit="contain"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <IconButton
              icon={<FiChevronLeft />}
              position="absolute"
              left={4}
              onClick={prevImage}
              bg="rgba(0,0,0,0.5)"
              color="white"
              size="lg"
              _hover={{ bg: "rgba(0,0,0,0.7)" }}
            />
            <IconButton
              icon={<FiChevronRight />}
              position="absolute"
              right={4}
              onClick={nextImage}
              bg="rgba(0,0,0,0.5)"
              color="white"
              size="lg"
              _hover={{ bg: "rgba(0,0,0,0.7)" }}
            />
          </>
        )}

        {/* Image Counter */}
        <Box
          position="absolute"
          top={4}
          right={4}
          px={4}
          py={2}
          bg="rgba(0,0,0,0.7)"
          borderRadius="full"
          color="white"
          fontWeight="600"
        >
          {currentIndex + 1} / {images.length}
        </Box>
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <HStack spacing={2} w="100%" justify="center">
          {images.slice(0, thumbnailsPerView).map((img, idx) => (
            <Box
              key={idx}
              w={20}
              h={20}
              borderRadius="12px"
              overflow="hidden"
              cursor="pointer"
              border={currentIndex === idx ? "2px solid #F5D076" : "2px solid transparent"}
              onClick={() => goToIndex(idx)}
              _hover={{ transform: "scale(1.05)" }}
              transition="all 0.2s"
            >
              <Image src={img} alt={`Thumbnail ${idx + 1}`} w="100%" h="100%" objectFit="cover" />
            </Box>
          ))}
        </HStack>
      )}
    </VStack>
  );
};

export default PropertyGallery;
