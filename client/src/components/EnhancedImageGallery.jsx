import { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, ViewIcon } from "@chakra-ui/icons";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";
import { placeholderImage } from "utils/propertyStockImages";

// Локальный фолбэк без обращения к внешним хостам
const FALLBACK_IMG = placeholderImage;

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (!img) return null;
      if (typeof img === "string") return { src: img, alt: "Property photo" };
      if (typeof img === "object" && typeof img.url === "string")
        return { src: img.url, alt: img.alt || "Property photo" };
      if (typeof img === "object" && typeof img.src === "string")
        return { src: img.src, alt: img.alt || "Property photo" };
      return null;
    })
    .filter(Boolean);
}

export default function EnhancedImageGallery({ images = [], title = "Gallery" }) {
  const normalized = useMemo(() => normalizeImages(images), [images]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const panelBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const tileBg = useColorModeValue("gray.50", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.300");
  const viewBtnBg = useColorModeValue("whiteAlpha.900", "blackAlpha.600");
  const viewBtnHoverBg = useColorModeValue("white", "blackAlpha.700");

  const hasImages = normalized.length > 0;
  const active = normalized[activeIndex];

  const openAt = (index) => {
    setActiveIndex(index);
    setZoom(1);
    onOpen();
  };

  const goPrev = () => {
    setActiveIndex((i) => (i - 1 + normalized.length) % normalized.length);
    setZoom(1);
  };

  const goNext = () => {
    setActiveIndex((i) => (i + 1) % normalized.length);
    setZoom(1);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));

  const handleDownload = async () => {
    if (!active?.src) return;
    try {
      const res = await fetch(active.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `property-image-${activeIndex + 1}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Download failed:", err);
    }
  };

  if (!hasImages) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg={panelBg}
        borderRadius="lg"
        border={`1px solid ${borderColor}`}
      >
        <Text fontSize="lg" fontWeight="600">
          No images yet
        </Text>
        <Text mt={2} color={mutedTextColor}>
          Upload property photos to see them here.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg={panelBg} borderRadius="lg" border={`1px solid ${borderColor}`} p={4}>
      <Box display="flex" alignItems="baseline" justifyContent="space-between" mb={4}>
        <Text fontSize="lg" fontWeight="700">
          {title}
        </Text>
        <Text fontSize="sm" color={mutedTextColor}>
          {normalized.length} photos
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={3}>
        {normalized.map((img, idx) => (
          <Box
            key={`${img.src}-${idx}`}
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            border={`1px solid ${borderColor}`}
            bg={tileBg}
            transition="transform 0.15s ease"
            _hover={{ transform: "scale(1.02)" }}
            onClick={() => openAt(idx)}
            position="relative"
          >
            <Skeleton isLoaded>
              <Image
                src={img.src}
                alt={img.alt}
                w="100%"
                h="160px"
                objectFit="cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = FALLBACK_IMG;
                }}
              />
            </Skeleton>
            <Box position="absolute" right={2} top={2}>
              <IconButton
                size="sm"
                icon={<ViewIcon />}
                aria-label="View"
                bg={viewBtnBg}
                _hover={{ bg: viewBtnHoverBg }}
              />
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay />
        <ModalContent bg={panelBg} border={`1px solid ${borderColor}`}>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Text fontWeight="700">
                {activeIndex + 1} / {normalized.length}
              </Text>
              <Box display="flex" gap={2}>
                <IconButton
                  size="sm"
                  icon={<FiZoomOut />}
                  onClick={handleZoomOut}
                  aria-label="Zoom out"
                  isDisabled={zoom <= 1}
                />
                <IconButton
                  size="sm"
                  icon={<FiZoomIn />}
                  onClick={handleZoomIn}
                  aria-label="Zoom in"
                  isDisabled={zoom >= 2.5}
                />
                <IconButton
                  size="sm"
                  icon={<DownloadIcon />}
                  onClick={handleDownload}
                  aria-label="Download"
                />
              </Box>
            </Box>

            <Box position="relative" borderRadius="lg" overflow="hidden" bg={tileBg}>
              <Box
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                pointerEvents="none"
              />

              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minH={{ base: "50vh", md: "70vh" }}
                p={3}
              >
                <Image
                  src={active?.src}
                  alt={active?.alt || "Property photo"}
                  maxH={{ base: "50vh", md: "70vh" }}
                  maxW="100%"
                  objectFit="contain"
                  transform={`scale(${zoom})`}
                  transition="transform 0.15s ease"
                  onError={(e) => {
                    e.target.src = FALLBACK_IMG;
                  }}
                />
              </Box>

              {normalized.length > 1 && (
                <>
                  <IconButton
                    icon={<ChevronLeftIcon />}
                    aria-label="Previous"
                    position="absolute"
                    top="50%"
                    left={2}
                    transform="translateY(-50%)"
                    size="lg"
                    colorScheme="blackAlpha"
                    variant="solid"
                    onClick={goPrev}
                  />
                  <IconButton
                    icon={<ChevronRightIcon />}
                    aria-label="Next"
                    position="absolute"
                    top="50%"
                    right={2}
                    transform="translateY(-50%)"
                    size="lg"
                    colorScheme="blackAlpha"
                    variant="solid"
                    onClick={goNext}
                  />
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
