import { useState, useEffect } from "react";
import {
  Box,
  Image,
  Button,
  Text,
  Heading,
  Stack,
  HStack,
  VStack,
  Grid,
  GridItem,
  Icon,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Container,
  Divider,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  FiHeart,
  FiShare2,
  FiMapPin,
  FiDollarSign,
  FiHome,
  FiMaximize,
  FiUsers,
  FiBath,
  FiCalendar,
  FiVideo,
  FiImage,
  FiFileText,
} from "react-icons/fi";
import { MdCompareArrows, MdMeetingRoom, MdBathtub, MdOutlineSquareFoot } from "react-icons/md";
import { LuMapPin, LuTrees, LuBuilding2 } from "react-icons/lu";
import { getApi } from "services/api";
import { useTranslation } from "react-i18next";
import LeadCaptureForm from "components/property/LeadCaptureForm";
import SimilarProperties from "components/property/SimilarProperties";
import PropertyGallery from "components/property/PropertyGallery";
import { publicBrand } from "views/public/publicBrand";

const detailCopy = {
  ru: {
    loadError: "Не удалось загрузить объект",
    removed: "Удалено из избранного",
    added: "Добавлено в избранное",
    linkCopied: "Ссылка скопирована",
    linkCopyFailed: "Не удалось скопировать ссылку",
    notFound: "Объект не найден",
    back: "Назад в каталог",
    bedrooms: "Спальни",
    bathrooms: "Санузлы",
    area: "Площадь",
    price: "Цена",
    onRequest: "По запросу",
    available: "Доступно",
    property: "Объект",
    viewAllPhotos: (count) => `Открыть все фото: ${count}`,
    description: "Описание",
    noDescription: "Описание пока не добавлено.",
    features: "Особенности",
    videoTour: "Видеообзор",
    videoThumb: "Превью видео",
    schedule: "Записаться на просмотр",
    requestInfo: "Запросить информацию",
    makeOffer: "Отправить предложение",
    contactAgent: "Связаться с агентом",
  },
  en: {
    loadError: "Error loading property",
    removed: "Removed from favorites",
    added: "Added to favorites",
    linkCopied: "Link copied!",
    linkCopyFailed: "Failed to copy link",
    notFound: "Property not found",
    back: "Back to catalog",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Area",
    price: "Price",
    onRequest: "On request",
    available: "Available",
    property: "Property",
    viewAllPhotos: (count) => `View all ${count} photos`,
    description: "Description",
    noDescription: "No description available.",
    features: "Features",
    videoTour: "Video Tour",
    videoThumb: "Video thumbnail",
    schedule: "Schedule a Viewing",
    requestInfo: "Request Information",
    makeOffer: "Make an Offer",
    contactAgent: "Contact Agent",
  },
};

const PropertyDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormType, setLeadFormType] = useState("viewing");
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = detailCopy[locale];

  useEffect(() => {
    fetchProperty();
  }, [slug]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await getApi(`api/property/public/${slug}`);
      if (response && response.data) {
        setProperty(response.data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast({
        title: copy.loadError,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== property._id);
      toast({ title: copy.removed, status: "info", duration: 2000 });
    } else {
      newFavorites = [...favorites, property._id];
      toast({ title: copy.added, status: "success", duration: 2000 });
    }
    
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: copy.linkCopied, status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: copy.linkCopyFailed, status: "error", duration: 2000 });
    }
  };

  const openLeadForm = (type) => {
    setLeadFormType(type);
    setShowLeadForm(true);
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={4} align="center">
          <Box className="skeleton" h="400px" w="100%" borderRadius="20px" />
          <Box className="skeleton" h="40px" w="80%" borderRadius="10px" />
          <Box className="skeleton" h="20px" w="60%" borderRadius="10px" />
        </Stack>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={4} align="center">
          <Heading size="xl">{copy.notFound}</Heading>
          <Button as={RouterLink} to="/offers" colorScheme="green">
            {copy.back}
          </Button>
        </Stack>
      </Container>
    );
  }

  const propertyTypeIcons = {
    house: FiHome,
    apartment: LuBuilding2,
    land: LuTrees,
    commercial: LuMapPin,
  };

  const amenities = [
    { icon: MdMeetingRoom, label: copy.bedrooms, value: property.numberofBedrooms || "—" },
    { icon: MdBathtub, label: copy.bathrooms, value: property.numberofBathrooms || "—" },
    { icon: MdOutlineSquareFoot, label: copy.area, value: `${property.squareFootage || "—"} m²` },
    { icon: FiDollarSign, label: copy.price, value: `$${property.listingPrice?.toLocaleString() || copy.onRequest}` },
  ];

  return (
    <Box bg={publicBrand.gradients.page} minH="100vh" color="white">
      {/* Hero Image */}
      <Box position="relative" h={{ base: "400px", md: "600px" }} overflow="hidden">
        <Image
          src={property.images?.[0] || property.primaryImage}
          alt={property.name || property.propertyAddress}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)"
        />
        
        {/* Action Buttons */}
        <HStack position="absolute" top={6} right={6} spacing={3}>
          <IconButton
            icon={<FiHeart />}
            onClick={handleFavoriteToggle}
            bg={isFavorite ? "red.500" : "rgba(255,255,255,0.2)"}
            color="white"
            backdropFilter="blur(10px)"
            borderRadius="full"
            _hover={{ bg: isFavorite ? "red.600" : "rgba(255,255,255,0.3)" }}
          />
          <IconButton
            icon={<FiShare2 />}
            onClick={handleShare}
            bg="rgba(255,255,255,0.2)"
            color="white"
            backdropFilter="blur(10px)"
            borderRadius="full"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
          />
        </HStack>

        {/* Status Badge */}
        <Badge
          position="absolute"
          top={6}
          left={6}
          px={4}
          py={2}
          borderRadius="full"
          bg="rgba(212,175,55,0.9)"
          color="white"
          fontWeight="600"
        >
          {property.listingStatus || copy.available}
        </Badge>

        {/* Gallery Button */}
        {property.images?.length > 1 && (
          <Button
            position="absolute"
            bottom={6}
            right={6}
            leftIcon={<FiImage />}
            bg="rgba(255,255,255,0.9)"
            color="gray.800"
            onClick={() => setShowGallery(true)}
            _hover={{ bg: "white" }}
          >
            {copy.viewAllPhotos(property.images.length)}
          </Button>
        )}
      </Box>

      {/* Content */}
      <Container maxW="8xl" py={10}>
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10}>
          {/* Main Content */}
          <Stack spacing={8}>
            {/* Title & Price */}
            <Stack spacing={4}>
              <HStack spacing={4} flexWrap="wrap">
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="rgba(212,175,55,0.2)"
                  color="#F5D076"
                  border="1px solid rgba(212,175,55,0.3)"
                >
                  <HStack spacing={2}>
                    <Icon as={propertyTypeIcons[property.propertyTypeKey] || FiHome} />
                    <Text textTransform="capitalize">{property.propertyTypeKey || copy.property}</Text>
                  </HStack>
                </Badge>
                {property.features?.map((feature, idx) => (
                  <Badge key={idx} px={3} py={1} borderRadius="full" bg="rgba(255,255,255,0.1)">
                    {feature}
                  </Badge>
                ))}
              </HStack>
              
              <Heading size="2xl">{property.name || property.propertyAddress}</Heading>
              
              <HStack color="gray.400">
                <Icon as={FiMapPin} />
                <Text>{property.propertyAddress}</Text>
              </HStack>
            </Stack>

            {/* Price */}
            <Box
              p={6}
              borderRadius="20px"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
            >
              <HStack justify="space-between">
                <Stack spacing={1}>
                  <Text color="gray.400" fontSize="sm">{copy.price}</Text>
                  <Heading size="xl" color="#F5D076">
                    ${property.listingPrice?.toLocaleString() || copy.onRequest}
                  </Heading>
                </Stack>
                {property.pricePerSqm && (
                  <Text color="gray.400" fontSize="sm">
                    ${property.pricePerSqm}/m²
                  </Text>
                )}
              </HStack>
            </Box>

            {/* Amenities */}
            <SimpleGrid columns={2} spacing={4}>
              {amenities.map((amenity, idx) => (
                <Box
                  key={idx}
                  p={4}
                  borderRadius="16px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                >
                  <HStack spacing={3}>
                    <Box
                      w={12}
                      h={12}
                      borderRadius="12px"
                      bg="rgba(212,175,55,0.2)"
                      display="grid"
                      placeItems="center"
                      color="#F5D076"
                    >
                      <Icon as={amenity.icon} boxSize={6} />
                    </Box>
                    <Stack spacing={0}>
                      <Text color="gray.400" fontSize="xs">{amenity.label}</Text>
                      <Text fontWeight="600">{amenity.value}</Text>
                    </Stack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>

            {/* Description */}
            <Stack spacing={4}>
              <Heading size="lg">{copy.description}</Heading>
              <Text color="gray.300" lineHeight="1.8">
                {property.propertyDescription || property.marketingDescription || copy.noDescription}
              </Text>
            </Stack>

            {/* Features */}
            {property.features?.length > 0 && (
              <Stack spacing={4}>
                <Heading size="lg">{copy.features}</Heading>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                  {property.features.map((feature, idx) => (
                    <HStack key={idx} spacing={2}>
                      <Box w={2} h={2} borderRadius="full" bg="#F5D076" />
                      <Text color="gray.300">{feature}</Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </Stack>
            )}

            {/* Video Tour */}
            {property.videoTour && (
              <Stack spacing={4}>
                <Heading size="lg">{copy.videoTour}</Heading>
                <Box
                  borderRadius="20px"
                  overflow="hidden"
                  bg="rgba(255,255,255,0.05)"
                  aspectRatio="16/9"
                  onClick={() => setShowVideo(true)}
                  cursor="pointer"
                  _hover={{ opacity: 0.9 }}
                >
                  <Image src={property.videoThumbnail} alt={copy.videoThumb} w="100%" h="100%" objectFit="cover" />
                  <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                    <Icon as={FiVideo} boxSize={16} color="white" />
                  </Box>
                </Box>
              </Stack>
            )}

            {/* Similar Properties */}
            <SimilarProperties currentProperty={property} />
          </Stack>

          {/* Sidebar - Contact Form */}
          <Stack spacing={6}>
            <Box
              p={6}
              borderRadius="20px"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              position="sticky"
              top={100}
            >
              <Stack spacing={4} mb={6}>
                <Button
                  w="full"
                  colorScheme="green"
                  size="lg"
                  borderRadius="12px"
                  onClick={() => openLeadForm("viewing")}
                >
                  {copy.schedule}
                </Button>
                <Button
                  w="full"
                  variant="outline"
                  borderColor="rgba(212,175,55,0.3)"
                  color="#F5D076"
                  size="lg"
                  borderRadius="12px"
                  onClick={() => openLeadForm("info")}
                >
                  {copy.requestInfo}
                </Button>
                <Button
                  w="full"
                  variant="ghost"
                  size="lg"
                  borderRadius="12px"
                  onClick={() => openLeadForm("offer")}
                >
                  {copy.makeOffer}
                </Button>
              </Stack>

              <Divider borderColor="rgba(255,255,255,0.1)" />

              <Stack spacing={4} mt={6}>
                <Text color="gray.400" fontSize="sm">{copy.contactAgent}</Text>
                {property.agent && (
                  <HStack spacing={4}>
                    <Box
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="rgba(212,175,55,0.2)"
                      display="grid"
                      placeItems="center"
                      color="#F5D076"
                    >
                      <Text fontSize="xl" fontWeight="bold">
                        {property.agent.name?.charAt(0)}
                      </Text>
                    </Box>
                    <Stack spacing={0}>
                      <Text fontWeight="600">{property.agent.name}</Text>
                      <Text color="gray.400" fontSize="sm">{property.agent.phone}</Text>
                      <Text color="gray.400" fontSize="sm">{property.agent.email}</Text>
                    </Stack>
                  </HStack>
                )}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Container>

      {/* Gallery Modal */}
      {showGallery && (
        <Modal isOpen={showGallery} onClose={() => setShowGallery(false)} size="full">
          <ModalOverlay />
          <ModalContent bg="black">
            <ModalCloseButton color="white" zIndex={10} />
            <ModalBody p={0}>
              <PropertyGallery
                images={property.images || []}
                onClose={() => setShowGallery(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      {/* Lead Capture Form Modal */}
      <LeadCaptureForm
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
        property={property}
        type={leadFormType}
      />
    </Box>
  );
};

export default PropertyDetailPage;
