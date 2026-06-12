import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Image,
  Button,
  Text,
  Heading,
  Stack,
  HStack,
  Grid,
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
  Flex,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getFavoriteIds, pushRecentlyViewedId, toggleFavoriteId } from "./catalog/catalogStorage";
import { FiHeart, FiShare2, FiMapPin, FiHome, FiVideo, FiImage } from "react-icons/fi";
import { MdMeetingRoom, MdBathtub, MdOutlineSquareFoot } from "react-icons/md";
import { LuMapPin, LuTrees, LuBuilding2 } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import AdminEditButton from "components/admin/AdminEditButton";
import AdminSectionHeader from "components/admin/AdminSectionHeader";
import PropertyAdminEditLayer from "components/admin/PropertyAdminEditLayer";
import PropertyPhotoManager from "components/property/PropertyPhotoManager";
import LeadCaptureForm from "components/property/LeadCaptureForm";
import { usePropertyInlineEdit } from "hooks/usePropertyInlineEdit";
import { fetchPublicPropertyBySlug } from "./catalog/catalogService";
import SimilarProperties from "components/property/SimilarProperties";
import PropertyGallery from "components/property/PropertyGallery";
import MortgageCalculator from "components/property/MortgageCalculator";
import MobileBottomNav from "components/public/MobileBottomNav";
import ModernHeader from "components/ModernHeader";
import ModernFooter from "components/ModernFooter";
import { formatAreaValue, parsePrice, formatPrice } from "./catalog/catalogData";
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
  const { i18n, t } = useTranslation();
  const toast = useToast();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormType, setLeadFormType] = useState("viewing");
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = detailCopy[locale];

  const {
    canEditListing,
    propertyAdminPath,
    editSection,
    openEdit,
    closeEdit,
    handlePropertySaved,
  } = usePropertyInlineEdit(property, setProperty);

  const fetchProperty = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPublicPropertyBySlug(slug);
      if (data) {
        setProperty(data);
        const propertyId = data._id;
        if (propertyId) {
          pushRecentlyViewedId(propertyId);
          setIsFavorite(getFavoriteIds().includes(propertyId));
        }
      } else {
        setProperty(null);
      }
    } catch {
      toast({
        title: copy.loadError,
        status: "error",
        duration: 3000,
      });
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [slug, copy.loadError, toast]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const galleryImages = useMemo(() => {
    const fromPhotos = (property?.propertyPhotos || []).map((photo) => photo?.img).filter(Boolean);
    if (fromPhotos.length) return fromPhotos;
    if (Array.isArray(property?.images) && property.images.length) return property.images;
    return property?.primaryImage ? [property.primaryImage] : [];
  }, [property]);

  const handleFavoriteToggle = async () => {
    if (!property?._id) return;

    const next = toggleFavoriteId(property._id);
    const nowFavorite = next.includes(property._id);
    setIsFavorite(nowFavorite);
    toast({
      title: nowFavorite ? copy.added : copy.removed,
      status: nowFavorite ? "success" : "info",
      duration: 2000,
    });
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
          <Button as={RouterLink} to="/offers" colorScheme="gold">
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
    {
      icon: MdOutlineSquareFoot,
      label: copy.area,
      value: formatAreaValue(property.squareFootage),
    },
  ];

  return (
    <Box
      bg={publicBrand.gradients.page}
      minH="100vh"
      color="white"
      className="public-brand-shell property-detail-shell"
      overflowX="hidden"
      maxW="100vw"
    >
      <ModernHeader />
      {/* Hero Image */}
      <Box
        position="relative"
        h={{ base: "280px", sm: "360px", md: "600px" }}
        overflow="hidden"
        mt={{ base: "88px", md: 0 }}
        borderBottom={`1px solid ${publicBrand.colors.line}`}
        boxShadow="0 34px 120px rgba(0,0,0,0.34)"
      >
        <Image
          src={galleryImages[0]}
          alt={property.name || property.propertyAddress}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(180deg, rgba(4,8,14,0.2) 0%, rgba(4,8,14,0.36) 42%, rgba(8,17,26,0.9) 100%)"
        />
        <Box
          position="absolute"
          inset={0}
          bg="radial-gradient(circle at 18% 18%, rgba(245,208,118,0.2), transparent 34%), radial-gradient(circle at 84% 22%, rgba(185,119,55,0.18), transparent 30%)"
        />

        {/* Action Buttons */}
        <HStack position="absolute" top={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} spacing={2}>
          <IconButton
            aria-label={isFavorite ? copy.removed : copy.added}
            icon={<FiHeart />}
            onClick={handleFavoriteToggle}
            bg={isFavorite ? "rgba(185, 56, 56, 0.88)" : "rgba(8,17,26,0.52)"}
            color="white"
            border={`1px solid ${publicBrand.colors.lineStrong}`}
            backdropFilter="blur(18px)"
            borderRadius="full"
            boxShadow={publicBrand.shadows.inset}
            _hover={{ bg: isFavorite ? "rgba(185, 56, 56, 0.96)" : "rgba(255,255,255,0.16)" }}
          />
          <IconButton
            aria-label={copy.linkCopied}
            icon={<FiShare2 />}
            onClick={handleShare}
            bg="rgba(8,17,26,0.52)"
            color="white"
            border={`1px solid ${publicBrand.colors.lineStrong}`}
            backdropFilter="blur(18px)"
            borderRadius="full"
            boxShadow={publicBrand.shadows.inset}
            _hover={{ bg: "rgba(255,255,255,0.16)" }}
          />
        </HStack>

        {/* Status Badge */}
        <Badge
          position="absolute"
          top={{ base: 4, md: 6 }}
          left={{ base: 4, md: 6 }}
          px={4}
          py={2}
          borderRadius="full"
          bg="rgba(8,17,26,0.58)"
          color="#F5D076"
          border="1px solid rgba(245,208,118,0.28)"
          backdropFilter="blur(18px)"
          fontWeight="700"
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          {property.listingStatus || copy.available}
        </Badge>

        {/* Gallery Button */}
        {galleryImages.length > 1 && (
          <Button
            position="absolute"
            bottom={{ base: 4, md: 6 }}
            right={{ base: 4, md: 6 }}
            left={{ base: 4, md: "auto" }}
            w={{ base: "calc(100% - 32px)", md: "auto" }}
            size={{ base: "sm", md: "md" }}
            leftIcon={<FiImage />}
            bg="rgba(8,17,26,0.66)"
            color="white"
            border="1px solid rgba(245,208,118,0.28)"
            backdropFilter="blur(18px)"
            boxShadow={publicBrand.shadows.deep}
            onClick={() => setShowGallery(true)}
            _hover={{ bg: "rgba(245,208,118,0.16)", transform: "translateY(-1px)" }}
          >
            {copy.viewAllPhotos(galleryImages.length)}
          </Button>
        )}
      </Box>

      {/* Content */}
      <Container
        maxW="8xl"
        py={{ base: 6, md: 10 }}
        pb={{ base: 28, md: 10 }}
        px={{ base: 4, md: 6 }}
        position="relative"
        mt={{ md: "-52px" }}
        zIndex={1}
      >
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={{ base: 6, md: 10 }}>
          {/* Main Content */}
          <Stack spacing={8}>
            {/* Title & Price */}
            <Stack spacing={4}>
              {canEditListing ? (
                <Flex justify="flex-end">
                  <AdminEditButton onClick={() => openEdit("hero")} href={propertyAdminPath} />
                </Flex>
              ) : null}
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
                    <Text textTransform="capitalize">
                      {property.propertyTypeKey || copy.property}
                    </Text>
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
              borderRadius={publicBrand.radii.md}
              bg="linear-gradient(145deg, rgba(18,29,43,0.88), rgba(22,35,52,0.72))"
              border={`1px solid ${publicBrand.colors.line}`}
              boxShadow={`${publicBrand.shadows.deep}, ${publicBrand.shadows.inset}`}
              backdropFilter="blur(18px)"
            >
              <Flex
                direction={{ base: "column", sm: "row" }}
                align={{ base: "flex-start", sm: "center" }}
                justify="space-between"
                gap={3}
              >
                <Stack spacing={1} minW={0}>
                  <Text color="gray.400" fontSize="sm">
                    {copy.price}
                  </Text>
                  <Heading
                    size={{ base: "lg", md: "xl" }}
                    color="#F5D076"
                    wordBreak="normal"
                    overflowWrap="normal"
                  >
                    {formatPrice(property.listingPrice, t, i18n.language) || copy.onRequest}
                  </Heading>
                </Stack>
                {property.pricePerSqm && (
                  <Text color="gray.400" fontSize="sm" flexShrink={0}>
                    ${property.pricePerSqm}/m²
                  </Text>
                )}
              </Flex>
            </Box>

            <AdminSectionHeader
              title={t("publicListing.featuresTitle")}
              canEdit={canEditListing}
              onEdit={() => openEdit("features")}
              editHref={propertyAdminPath}
            />

            <SimpleGrid columns={{ base: 2, md: 2 }} spacing={{ base: 2, md: 4 }}>
              {amenities.map((amenity, idx) => (
                <Box
                  key={idx}
                  p={{ base: 3, md: 4 }}
                  borderRadius={publicBrand.radii.sm}
                  bg="rgba(255,255,255,0.055)"
                  border={`1px solid ${publicBrand.colors.line}`}
                  boxShadow={publicBrand.shadows.inset}
                  minW={0}
                >
                  <HStack spacing={3} align="flex-start">
                    <Box
                      w={{ base: 10, md: 12 }}
                      h={{ base: 10, md: 12 }}
                      borderRadius="12px"
                      bg="rgba(245,208,118,0.13)"
                      border="1px solid rgba(245,208,118,0.2)"
                      display="grid"
                      placeItems="center"
                      color="#F5D076"
                      flexShrink={0}
                    >
                      <Icon as={amenity.icon} boxSize={{ base: 5, md: 6 }} />
                    </Box>
                    <Stack spacing={0} minW={0}>
                      <Text color="gray.400" fontSize="xs" noOfLines={1}>
                        {amenity.label}
                      </Text>
                      <Text
                        fontWeight="600"
                        fontSize={{ base: "sm", md: "md" }}
                        noOfLines={2}
                        wordBreak="normal"
                        overflowWrap="normal"
                      >
                        {amenity.value}
                      </Text>
                    </Stack>
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>

            <Box
              p={{ base: 4, md: 5 }}
              borderRadius={publicBrand.radii.lg}
              bg="linear-gradient(150deg, rgba(255,255,255,0.075), rgba(255,255,255,0.035))"
              border={`1px solid ${publicBrand.colors.line}`}
              boxShadow={`${publicBrand.shadows.deep}, ${publicBrand.shadows.inset}`}
            >
              {canEditListing && property?._id ? (
                <PropertyPhotoManager
                  propertyId={property._id}
                  photos={property?.propertyPhotos || []}
                  onChange={(photos) =>
                    handlePropertySaved({ ...property, propertyPhotos: photos })
                  }
                  showEditButton
                  editHref={propertyAdminPath}
                />
              ) : galleryImages.length ? (
                <>
                  <AdminSectionHeader title={t("publicListing.propertyImages")} />
                  <SimpleGrid columns={{ base: 2, md: 3 }} gap={{ base: 2, md: 3 }} mt={4}>
                    {galleryImages.map((image, index) => (
                      <Box
                        key={`${image}-${index}`}
                        position="relative"
                        overflow="hidden"
                        borderRadius="18px"
                        border={`1px solid ${publicBrand.colors.line}`}
                        cursor="pointer"
                        role="group"
                        onClick={() => setShowGallery(true)}
                        _hover={{
                          transform: "translateY(-2px)",
                          borderColor: "rgba(245,208,118,0.44)",
                        }}
                        transition="all 0.2s ease"
                      >
                        <Image
                          src={image}
                          alt={`Photo ${index + 1}`}
                          h={{ base: "132px", md: "168px" }}
                          w="100%"
                          objectFit="cover"
                          transition="transform 0.3s ease"
                          _groupHover={{ transform: "scale(1.04)" }}
                        />
                        <Box
                          position="absolute"
                          inset={0}
                          bg="linear-gradient(180deg, transparent 42%, rgba(4,8,14,0.42) 100%)"
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </>
              ) : (
                <>
                  <AdminSectionHeader title={t("publicListing.propertyImages")} />
                  <Text color="gray.400" mt={4}>
                    {t("publicListing.noPhotos")}
                  </Text>
                </>
              )}
            </Box>

            <Tabs
              variant="unstyled"
              bg="rgba(255,255,255,0.045)"
              border={`1px solid ${publicBrand.colors.line}`}
              borderRadius={publicBrand.radii.lg}
              p={{ base: 3, md: 5 }}
              boxShadow={publicBrand.shadows.inset}
            >
              <TabList flexWrap="wrap" gap={2}>
                {[
                  copy.description,
                  copy.features,
                  locale === "ru" ? "Ипотека" : "Mortgage",
                  locale === "ru" ? "Расположение" : "Location",
                ].map((label) => (
                  <Tab
                    key={label}
                    borderRadius="full"
                    color="whiteAlpha.760"
                    border={`1px solid ${publicBrand.colors.line}`}
                    bg="rgba(255,255,255,0.04)"
                    _selected={{
                      color: publicBrand.colors.ink,
                      bg: publicBrand.gradients.brass,
                      borderColor: "rgba(245,208,118,0.5)",
                      boxShadow: publicBrand.shadows.glow,
                    }}
                    _hover={{ color: "white", borderColor: "rgba(245,208,118,0.36)" }}
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>
              <TabPanels mt={5}>
                <TabPanel px={0}>
                  <AdminSectionHeader
                    title={copy.description}
                    canEdit={canEditListing}
                    onEdit={() => openEdit("about")}
                    editHref={propertyAdminPath}
                    headingSize="sm"
                  />
                  <Text color="gray.300" lineHeight="1.8" mt={4}>
                    {property.propertyDescription ||
                      property.marketingDescription ||
                      copy.noDescription}
                  </Text>
                </TabPanel>
                <TabPanel px={0}>
                  <AdminSectionHeader
                    title={copy.features}
                    canEdit={canEditListing}
                    onEdit={() => openEdit("amenities")}
                    editHref={propertyAdminPath}
                    headingSize="sm"
                  />
                  {property.features?.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3} mt={4}>
                      {property.features.map((feature, idx) => (
                        <HStack key={idx} spacing={2}>
                          <Box w={2} h={2} borderRadius="full" bg="#F5D076" />
                          <Text color="gray.300">{feature}</Text>
                        </HStack>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Text color="gray.400">{copy.noDescription}</Text>
                  )}
                </TabPanel>
                <TabPanel px={0}>
                  <MortgageCalculator
                    propertyPrice={parsePrice(property.listingPrice) || 25000000}
                    onApply={() => openLeadForm("info")}
                  />
                </TabPanel>
                <TabPanel px={0}>
                  <AdminSectionHeader
                    title={locale === "ru" ? "Расположение" : "Location"}
                    canEdit={canEditListing}
                    onEdit={() => openEdit("hero")}
                    editHref={propertyAdminPath}
                    headingSize="sm"
                  />
                  <Stack spacing={3} mt={4}>
                    <HStack color="gray.300">
                      <Icon as={FiMapPin} />
                      <Text>{property.propertyAddress}</Text>
                    </HStack>
                    <Text color="gray.400" fontSize="sm">
                      {locale === "ru"
                        ? "Точные координаты и карта доступны менеджеру при записи на просмотр."
                        : "Exact coordinates and map details are shared by your manager when booking a viewing."}
                    </Text>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            {/* Video Tour */}
            {property.videoTour && (
              <Stack spacing={4}>
                <Heading size="lg">{copy.videoTour}</Heading>
                <Box
                  position="relative"
                  borderRadius="20px"
                  overflow="hidden"
                  bg="rgba(255,255,255,0.05)"
                  aspectRatio="16/9"
                  cursor="pointer"
                  _hover={{ opacity: 0.9 }}
                >
                  <Image
                    src={property.videoThumbnail}
                    alt={copy.videoThumb}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
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
          <Stack spacing={6} minW={0} maxW="100%">
            <Box
              className="property-contact-panel"
              p={{ base: 4, md: 6 }}
              borderRadius={publicBrand.radii.lg}
              bg="linear-gradient(160deg, rgba(18,29,43,0.94), rgba(22,35,52,0.88))"
              border={`1px solid ${publicBrand.colors.lineStrong}`}
              boxShadow={`${publicBrand.shadows.deep}, ${publicBrand.shadows.inset}`}
              backdropFilter="blur(18px)"
              position={{ base: "static", lg: "sticky" }}
              top={100}
              maxW="100%"
            >
              <Stack spacing={4} mb={6}>
                <Button
                  w="full"
                  maxW="100%"
                  bg={publicBrand.gradients.brass}
                  color={publicBrand.colors.ink}
                  size="lg"
                  borderRadius="full"
                  boxShadow={publicBrand.shadows.glow}
                  whiteSpace="normal"
                  onClick={() => openLeadForm("viewing")}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "0 28px 72px rgba(185,119,55,0.26)",
                  }}
                >
                  {copy.schedule}
                </Button>
                <Button
                  w="full"
                  maxW="100%"
                  variant="outline"
                  borderColor="rgba(245,208,118,0.32)"
                  color="#F5D076"
                  size="lg"
                  borderRadius="full"
                  whiteSpace="normal"
                  onClick={() => openLeadForm("info")}
                  _hover={{ bg: "rgba(245,208,118,0.1)", borderColor: "rgba(245,208,118,0.52)" }}
                >
                  {copy.requestInfo}
                </Button>
                <Button
                  w="full"
                  maxW="100%"
                  variant="ghost"
                  size="lg"
                  borderRadius="full"
                  color="gray.200"
                  whiteSpace="normal"
                  _hover={{ color: "#F5D076", bg: "rgba(255,255,255,0.06)" }}
                  onClick={() => openLeadForm("offer")}
                >
                  {copy.makeOffer}
                </Button>
              </Stack>

              <Divider borderColor="rgba(255,255,255,0.1)" />

              <Stack spacing={4} mt={6}>
                <Text color="gray.400" fontSize="sm">
                  {copy.contactAgent}
                </Text>
                {property.agent && (
                  <HStack spacing={4}>
                    <Box
                      w={12}
                      h={12}
                      borderRadius="full"
                      bg="rgba(245,208,118,0.13)"
                      border="1px solid rgba(245,208,118,0.22)"
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
                      <Text color="gray.400" fontSize="sm">
                        {property.agent.phone}
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        {property.agent.email}
                      </Text>
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
              <PropertyGallery images={galleryImages} onClose={() => setShowGallery(false)} />
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

      <PropertyAdminEditLayer
        property={property}
        editSection={editSection}
        onClose={closeEdit}
        onSaved={handlePropertySaved}
      />

      <ModernFooter />
      <MobileBottomNav />
    </Box>
  );
};

export default PropertyDetailPage;
