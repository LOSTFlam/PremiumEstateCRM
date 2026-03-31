import {
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Card from "components/card/Card";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LuBath,
  LuBedDouble,
  LuBuilding2,
  LuCalendarClock,
  LuSearch,
  LuSparkles,
} from "react-icons/lu";
import {
  MdArrowForward,
  MdOutlineLocationOn,
  MdOutlineSquareFoot,
  MdOutlineTune,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getApi } from "services/api";
import { isRussianLocale, translateCrmText } from "i18n/crmDictionary";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

const pulseGlow = {
  animate: {
    boxShadow: ["0 0 20px rgba(102, 126, 234, 0.3)", "0 0 40px rgba(102, 126, 234, 0.6)", "0 0 20px rgba(102, 126, 234, 0.3)"],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  }
};

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);
const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const statusColorMap = {
  available: "green",
  active: "green",
  new: "teal",
  pending: "orange",
  booked: "orange",
  reserved: "yellow",
  sold: "red",
  inactive: "gray",
};

const getStatusKey = (value) =>
  ({
    available: "available",
    "доступно": "available",
    active: "active",
    "активно": "active",
    new: "new",
    "новое": "new",
    "новый": "new",
    pending: "pending",
    "в ожидании": "pending",
    booked: "booked",
    reserved: "reserved",
    "зарезервировано": "reserved",
    sold: "sold",
    "продано": "sold",
    inactive: "inactive",
  }[
    String(value ?? "")
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .trim()
  ] || "gray");

const placeholderImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23667eea'/%3E%3Cstop offset='0.55' stop-color='%23764ba2'/%3E%3Cstop offset='1' stop-color='%23f093fb'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23g)'/%3E%3C/svg%3E";

const formatPrice = (value, t, language) => {
  const amount = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) {
    return t?.("modules.dashboardHome.priceOnRequest");
  }
  return new Intl.NumberFormat(
    isRussianLocale(language) ? "ru-RU" : "en-US",
    { style: "currency", currency: "USD", maximumFractionDigits: 0 }
  ).format(amount);
};

const normalizeStatus = (value, t, language) => {
  if (!value) return t?.("modules.dashboardHome.statusAvailable");
  const normalized = String(value).replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
  return translateCrmText(normalized, { t, language });
};

const getPropertyType = (property, t, language) =>
  property?.propertyType
    ? translateCrmText(String(property.propertyType).replace(/\b\w/g, (letter) => letter.toUpperCase()), { t, language })
    : t?.("modules.dashboardHome.propertyFallback");

const getPropertyName = (property, t, language) => {
  if (property?.name) return property.name;
  if (property?.propertyType && property?.propertyAddress) {
    return isRussianLocale(language)
      ? `${getPropertyType(property, t, language)}: ${property.propertyAddress}`
      : `${getPropertyType(property, t, language)} in ${property.propertyAddress}`;
  }
  return property?.propertyAddress || t?.("modules.dashboardHome.untitledProperty");
};

const getShortDescription = (property, t) => {
  const text = property?.marketingDescription || property?.propertyDescription;
  if (!text) return t?.("modules.dashboardHome.spotlightFallbackDescription");
  return text.length > 180 ? text.substring(0, 180) + "..." : text;
};

const getArea = (property, t, language) => {
  if (!property?.squareFootage) return t?.("modules.dashboardHome.notSet");
  const area = String(property.squareFootage).replace(/[^\d]/g, "");
  if (!area) return t?.("modules.dashboardHome.notSet");
  return isRussianLocale(language) ? `${area} м²` : `${area} m²`;
};

const getPrimaryImage = (property) =>
  property?.propertyPhotos?.[0]?.img ||
  property?.images?.[0] ||
  placeholderImage;

const parsePrice = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;

const AnimatedStatCard = ({ icon, label, value, iconColor, delay }) => (
  <MotionBox
    variants={fadeInUp}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    flex={{ base: "1 1 calc(33.333% - 14px)", md: "1 1 calc(33.333% - 16px)" }}
    minW="180px"
  >
    <MotionBox
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      borderRadius="24px"
      px={{ base: 5, md: 6 }}
      py={{ base: 4, md: 5 }}
      bg="rgba(255,255,255,0.15)"
      border="1px solid rgba(255,255,255,0.2)"
      backdropFilter="blur(12px)"
      boxShadow="0 8px 32px rgba(0,0,0,0.1)"
      overflow="hidden"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: "-100%",
        w: "100%",
        h: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        transition: "left 0.5s",
      }}
      _hover={{
        _before: { left: "100%" },
      }}
    >
      <Stat>
        <HStack spacing={4} align="start">
          <MotionBox
            animate={pulseGlow.animate}
            as={Circle}
            size={{ base: "48px", md: "56px" }}
            bg={iconColor}
            color="white"
            flexShrink={0}
          >
            <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
          </MotionBox>
          <Box>
            <StatLabel color="whiteAlpha.800" fontSize={{ base: "sm", md: "md" }} fontWeight="500" mb={2}>
              {label}
            </StatLabel>
            <StatNumber fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="800">{value}</StatNumber>
          </Box>
        </HStack>
      </Stat>
    </MotionBox>
  </MotionBox>
);

const PropertyMetric = ({ icon, label, value, iconColor }) => (
  <MotionBox
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
    borderRadius="24px"
    px={{ base: 5, md: 6 }}
    py={{ base: 4, md: 5 }}
    bg="rgba(255,255,255,0.72)"
    border="1px solid rgba(18,55,42,0.08)"
    backdropFilter="blur(8px)"
    minW={0}
    w="100%"
    boxShadow="0 4px 20px rgba(0,0,0,0.08)"
  >
    <HStack spacing={{ base: 3, md: 4 }} align="start" wrap="wrap">
      <Circle size={{ base: "42px", md: "48px" }} bg={iconColor} color="white" flexShrink={0}>
        <Icon as={icon} boxSize={{ base: 5, md: 6 }} />
      </Circle>
      <Box flex={1} minW={0}>
        <Text fontSize={{ base: "sm", md: "md" }} textTransform="uppercase" letterSpacing="0.08em" color="gray.500" noOfLines={2} lineHeight="1.3">
          {label}
        </Text>
        <Text fontWeight="800" fontSize={{ base: "xl", md: "2xl" }} color="gray.800" mt={2} lineHeight="1.2">
          {value}
        </Text>
      </Box>
    </HStack>
  </MotionBox>
);

export default function PropertyLandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const pageBg = useColorModeValue("#f8f9fa", "#0f1419");
  const surfaceBg = useColorModeValue("white", "#1a1f2e");
  const borderColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(255,255,255,0.1)");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const heroGradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    "linear-gradient(135deg, #1a1c2e 0%, #2d1b4e 50%, #4a1c6e 100%)",
  );
  const subtlePanel = useColorModeValue("rgba(102, 126, 234, 0.08)", "rgba(102, 126, 234, 0.12)");
  const softShadow = useColorModeValue("0 10px 40px rgba(102, 126, 234, 0.15)", "0 10px 40px rgba(0,0,0,0.4)");

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await getApi(user?.role === "superAdmin" ? "api/property/" : `api/property/?createBy=${user?._id}`);
        const propertiesData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        setProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [user?._id, user?.role]);

  const uniqueStatuses = useMemo(() => Array.from(new Set(properties.map((property) => normalizeStatus(property?.listingStatus, t, i18n.language))).filter(Boolean)), [properties, t, i18n.language]);
  const uniqueTypes = useMemo(() => Array.from(new Set(properties.map((property) => getPropertyType(property, t, i18n.language))).filter(Boolean)), [properties, t, i18n.language]);

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();
    const toSearchableValue = (property) => [property?.name, property?.propertyAddress, getPropertyType(property, t, i18n.language), normalizeStatus(property?.listingStatus, t, i18n.language)].filter(Boolean).join(" ").toLowerCase();
    const list = properties.filter((property) => {
      const matchesSearch = !query || toSearchableValue(property).includes(query);
      const matchesStatus = statusFilter === "all" || normalizeStatus(property?.listingStatus, t, i18n.language) === statusFilter;
      const matchesType = typeFilter === "all" || getPropertyType(property, t, i18n.language) === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
    return [...list].sort((left, right) => {
      if (sortBy === "price-high") return parsePrice(right?.listingPrice) - parsePrice(left?.listingPrice);
      if (sortBy === "price-low") return parsePrice(left?.listingPrice) - parsePrice(right?.listingPrice);
      return new Date(right?.createdAt || right?.updatedAt || 0) - new Date(left?.createdAt || left?.updatedAt || 0);
    });
  }, [properties, search, sortBy, statusFilter, typeFilter, t, i18n.language]);

  const featuredProperty = filteredProperties[0];
  const remainingProperties = featuredProperty ? filteredProperties.slice(1) : [];
  const availableInventory = properties.filter((property) => ["available", "active", "new", "доступно", "активно", "новый", "новое"].includes(String(property?.listingStatus || "available").toLowerCase())).length;
  const averagePrice = useMemo(() => {
    const values = properties.map((property) => parsePrice(property?.listingPrice)).filter(Boolean);
    if (!values.length) return t?.("modules.dashboardHome.priceOnRequest");
    return formatPrice(values.reduce((sum, current) => sum + current, 0) / values.length, t, i18n.language);
  }, [properties, t, i18n.language]);

  const sortModeLabel = { latest: t?.("modules.dashboardHome.newestFirst"), "price-high": t?.("modules.dashboardHome.highestPrice"), "price-low": t?.("modules.dashboardHome.lowestPrice") }[sortBy] || sortBy;
  const resetFilters = () => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); setSortBy("latest"); };

  return (
    <Box minH="100vh" bg={pageBg} overflow="hidden">
      {/* Animated Background */}
      <MotionBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        pointerEvents="none"
      >
        <MotionBox
          position="absolute"
          top="-10%"
          right="-5%"
          w="600px"
          h="600px"
          bg="radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <MotionBox
          position="absolute"
          bottom="-10%"
          left="-5%"
          w="500px"
          h="500px"
          bg="radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 0.5, 0.8],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </MotionBox>

      <Box position="relative" zIndex={1} px={{ base: 4, md: 6, lg: 8 }} py={{ base: 5, md: 6, lg: 8 }}>
        <Stack spacing={{ base: 6, md: 8, lg: 10 }}>
          {/* Hero Section with Animations */}
          <MotionCard
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            overflow="hidden"
            border="1px solid rgba(255,255,255,0.18)"
            bg={heroGradient}
            color="white"
            boxShadow={softShadow}
            position="relative"
            borderRadius="32px"
          >
            <Box position="absolute" inset="0" backgroundImage="linear-gradient(115deg, rgba(255,255,255,0.12), transparent 40%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.18), transparent 18%)" />
            
            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <MotionBox
                key={i}
                position="absolute"
                top={`${20 + i * 15}%`}
                left={`${10 + i * 15}%`}
                w={`${4 + i % 3}px`}
                h={`${4 + i % 3}px`}
                bg="rgba(255,255,255,0.6)"
                borderRadius="full"
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}

            <Grid templateColumns={{ base: "1fr", lg: "1.2fr 0.8fr" }} gap={{ base: 6, lg: 8 }} position="relative">
              <GridItem>
                <Stack spacing={{ base: 5, md: 6 }} p={{ base: 6, md: 8, lg: 10 }}>
                  <MotionWrap spacing={3} variants={fadeInUp}>
                    <WrapItem>
                      <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge px={4} py={1.5} borderRadius="full" bg="whiteAlpha.230" color="white" fontSize="sm" fontWeight="600" cursor="pointer">
                          {t?.("modules.dashboardHome.badgePrimary")}
                        </Badge>
                      </MotionBox>
                    </WrapItem>
                    <WrapItem>
                      <MotionBox whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge px={4} py={1.5} borderRadius="full" bg="rgba(255,255,255,0.14)" color="whiteAlpha.900" fontSize="sm" fontWeight="600" cursor="pointer">
                          {t?.("modules.dashboardHome.badgeSecondary")}
                        </Badge>
                      </MotionBox>
                    </WrapItem>
                  </MotionWrap>
                  
                  <MotionHeading
                    variants={fadeInLeft}
                    size={{ base: "xl", md: "2xl", lg: "3xl" }}
                    lineHeight="1.1"
                    maxW="900px"
                    fontWeight="800"
                  >
                    {t?.("modules.dashboardHome.heroTitle")}
                  </MotionHeading>
                  
                  <MotionText
                    variants={fadeInLeft}
                    color="whiteAlpha.900"
                    fontSize={{ base: "md", lg: "lg" }}
                    maxW="750px"
                    lineHeight="1.6"
                  >
                    {t?.("modules.dashboardHome.heroDescription")}
                  </MotionText>

                  {/* Stats with Stagger Animation */}
                  <MotionHStack
                    variants={staggerContainer}
                    spacing={{ base: 4, md: 5, lg: 6 }}
                    wrap="wrap"
                    w="100%"
                  >
                    <AnimatedStatCard icon={LuBuilding2} label={t?.("modules.dashboardHome.totalInventory")} value={properties.length} iconColor="green.500" delay={0.1} />
                    <AnimatedStatCard icon={LuSparkles} label={t?.("modules.dashboardHome.openInventory")} value={availableInventory} iconColor="teal.500" delay={0.2} />
                    <AnimatedStatCard icon={LuCalendarClock} label={t?.("modules.dashboardHome.averagePrice")} value={averagePrice} iconColor="orange.400" delay={0.3} />
                  </MotionHStack>
                </Stack>
              </GridItem>

              {/* Search Card with Slide Animation */}
              <GridItem>
                <MotionBox
                  variants={fadeInRight}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <MotionCard
                    whileHover={{ y: -4, boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}
                    transition={{ type: "spring", stiffness: 300 }}
                    bg="rgba(255,255,255,0.94)"
                    color="gray.900"
                    borderRadius="28px"
                    boxShadow="0 20px 60px rgba(0,0,0,0.16)"
                    p={{ base: 6, md: 8 }}
                  >
                    <Stack spacing={{ base: 4, md: 5 }}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{t?.("modules.dashboardHome.findInventory")}</Heading>
                        <MotionBox
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                          <Circle size="42px" bg="green.50" color="green.700">
                            <Icon as={MdOutlineTune} boxSize={5} />
                          </Circle>
                        </MotionBox>
                      </Flex>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none"><Icon as={LuSearch} color="gray.400" /></InputLeftElement>
                        <MotionInput
                          whileFocus={{ scale: 1.02, borderColor: "rgba(102, 126, 234, 0.5)" }}
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder={t?.("modules.dashboardHome.searchPlaceholder")}
                          bg="white"
                          borderRadius="18px"
                          h="52px"
                          border="2px solid"
                          borderColor="rgba(0,0,0,0.08)"
                        />
                      </InputGroup>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 4 }}>
                        <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} borderRadius="18px" h="52px"><option value="all">{t?.("modules.dashboardHome.allStatuses")}</option>{uniqueStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}</Select>
                        <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} borderRadius="18px" h="52px"><option value="all">{t?.("modules.dashboardHome.allTypes")}</option>{uniqueTypes.map((type) => (<option key={type} value={type}>{type}</option>))}</Select>
                      </SimpleGrid>
                      <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} borderRadius="18px" h="52px"><option value="latest">{t?.("modules.dashboardHome.newestFirst")}</option><option value="price-high">{t?.("modules.dashboardHome.highestPrice")}</option><option value="price-low">{t?.("modules.dashboardHome.lowestPrice")}</option></Select>
                      <HStack spacing={3} w="100%">
                        <MotionButton
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          flex={1}
                          colorScheme="green"
                          borderRadius="18px"
                          onClick={() => navigate("/properties")}
                          h="50px"
                          fontSize="md"
                        >
                          {t?.("modules.dashboardHome.fullTable")}
                        </MotionButton>
                        <MotionButton
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          flex={1}
                          variant="outline"
                          borderRadius="18px"
                          onClick={resetFilters}
                          h="50px"
                          fontSize="md"
                        >
                          {t?.("common.reset")}
                        </MotionButton>
                      </HStack>
                    </Stack>
                  </MotionCard>
                </MotionBox>
              </GridItem>
            </Grid>
          </MotionCard>

          {/* Metrics Row with Stagger */}
          <MotionSimpleGrid
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            columns={{ base: 1, md: 2, xl: 3 }}
            gap={{ base: 5, md: 6, lg: 8 }}
          >
            {[
              { icon: LuBuilding2, label: t?.("modules.dashboardHome.filteredResults"), value: filteredProperties.length, color: "green.500" },
              { icon: MdOutlineLocationOn, label: t?.("modules.dashboardHome.propertyTypes"), value: uniqueTypes.length || 0, color: "teal.500" },
              { icon: LuSparkles, label: t?.("modules.dashboardHome.statusesUsed"), value: uniqueStatuses.length || 0, color: "orange.400" },
            ].map((metric, index) => (
              <MotionBox key={index} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                <PropertyMetric {...metric} iconColor={metric.color} />
              </MotionBox>
            ))}
          </MotionSimpleGrid>

          {/* Featured Property with Parallax */}
          {featuredProperty && (
            <MotionCard
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              p={0}
              overflow="hidden"
              bg={surfaceBg}
              border={`1px solid ${borderColor}`}
              backdropFilter="blur(10px)"
              borderRadius="30px"
              whileHover={{ boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }}>
                <GridItem position="relative" minH={{ base: "280px", xl: "100%" }}>
                  <MotionBox
                    animate={floatAnimation}
                    position="absolute"
                    inset="0"
                    bg="linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.56))"
                    zIndex={2}
                  />
                  <Image src={getPrimaryImage(featuredProperty)} alt={getPropertyName(featuredProperty, t, i18n.language)} h="100%" w="100%" minH={{ base: "280px", xl: "100%" }} objectFit="cover" />
                  <Wrap position="absolute" top={5} left={5} spacing={3} zIndex={3}>
                    <WrapItem><Badge colorScheme={statusColorMap[getStatusKey(featuredProperty?.listingStatus)] || "gray"} px={4} py={2} borderRadius="full" fontSize="sm">{normalizeStatus(featuredProperty?.listingStatus, t, i18n.language)}</Badge></WrapItem>
                    <WrapItem><Badge bg="blackAlpha.600" color="white" px={4} py={2} borderRadius="full" fontSize="sm">{getPropertyType(featuredProperty, t, i18n.language)}</Badge></WrapItem>
                  </Wrap>
                  <Box position="absolute" left={5} right={5} bottom={5} color="white" zIndex={3}>
                    <Text fontSize="xs" letterSpacing="0.16em" textTransform="uppercase" mb={2}>{t?.("modules.dashboardHome.spotlight")}</Text>
                    <Heading size="lg" mb={2} noOfLines={2} sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{getPropertyName(featuredProperty, t, i18n.language)}</Heading>
                    <Text color="whiteAlpha.880" noOfLines={2} sx={{ wordWrap: "break-word", overflowWrap: "break-word" }}>{featuredProperty?.propertyAddress || t?.("modules.dashboardHome.addressNotSpecified")}</Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Stack spacing={{ base: 5, md: 6 }} p={{ base: 6, md: 8, lg: 10 }}>
                    <Flex justify="space-between" align="start" gap={4}>
                      <Box>
                        <Text fontSize="sm" textTransform="uppercase" letterSpacing="0.16em" color="gray.500" mb={2}>{t?.("modules.dashboardHome.flagship")}</Text>
                        <Heading size="xl" color="gray.800">{formatPrice(featuredProperty?.listingPrice, t, i18n.language)}</Heading>
                      </Box>
                      <MotionBox
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Circle size="52px" bg="green.50" color="green.700"><Icon as={LuSparkles} boxSize={6} /></Circle>
                      </MotionBox>
                    </Flex>
                    <Text color={mutedText} fontSize="md">{getShortDescription(featuredProperty, t)}</Text>
                    {/* Metrics Horizontal */}
                    <HStack spacing={{ base: 3, md: 4 }} wrap="wrap" w="100%">
                      <MotionHStack
                        whileHover={{ scale: 1.05, y: -4 }}
                        flex={{ base: "1 1 28%", md: "1 1 auto" }}
                        spacing={3}
                        p={3}
                        borderRadius="16px"
                        bg="rgba(255,255,255,0.6)"
                        border="1px solid rgba(0,0,0,0.05)"
                        cursor="pointer"
                      >
                        <Circle size="36px" bg="green.500" color="white" flexShrink={0}><Icon as={LuBedDouble} boxSize={4} /></Circle>
                        <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.bedrooms")}</Text><Text fontWeight="700" color="gray.800" fontSize="lg">{featuredProperty?.numberofBedrooms || "-"}</Text></Box>
                      </MotionHStack>
                      <MotionHStack
                        whileHover={{ scale: 1.05, y: -4 }}
                        flex={{ base: "1 1 28%", md: "1 1 auto" }}
                        spacing={3}
                        p={3}
                        borderRadius="16px"
                        bg="rgba(255,255,255,0.6)"
                        border="1px solid rgba(0,0,0,0.05)"
                        cursor="pointer"
                      >
                        <Circle size="36px" bg="teal.500" color="white" flexShrink={0}><Icon as={LuBath} boxSize={4} /></Circle>
                        <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.bathrooms")}</Text><Text fontWeight="700" color="gray.800" fontSize="lg">{featuredProperty?.numberofBathrooms || "-"}</Text></Box>
                      </MotionHStack>
                      <MotionHStack
                        whileHover={{ scale: 1.05, y: -4 }}
                        flex={{ base: "1 1 28%", md: "1 1 auto" }}
                        spacing={4}
                        p={3}
                        borderRadius="16px"
                        bg="rgba(255,255,255,0.6)"
                        border="1px solid rgba(0,0,0,0.08)"
                        boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                        cursor="pointer"
                      >
                        <Circle size="36px" bg="orange.400" color="white" flexShrink={0}><Icon as={MdOutlineSquareFoot} boxSize={4} /></Circle>
                        <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.area")}</Text><Text fontWeight="700" color="gray.800" fontSize="lg" noOfLines={1}>{getArea(featuredProperty, t, i18n.language)}</Text></Box>
                      </MotionHStack>
                    </HStack>
                    <Divider />
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 3, md: 4 }}>
                      <Box><Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">{t?.("modules.dashboardHome.propertyType")}</Text><Text fontWeight="700" color="gray.800">{getPropertyType(featuredProperty, t, i18n.language)}</Text></Box>
                      <Box><Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">{t?.("modules.dashboardHome.currentStatus")}</Text><Text fontWeight="700" color="gray.800">{normalizeStatus(featuredProperty?.listingStatus, t, i18n.language)}</Text></Box>
                    </SimpleGrid>
                    <MotionButton
                      whileHover={{ scale: 1.05, x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      colorScheme="green"
                      borderRadius="18px"
                      onClick={() => navigate(`/propertyView/${featuredProperty?._id}`)}
                      h="50px"
                      fontSize="md"
                      rightIcon={<MdArrowForward />}
                    >
                      {t?.("modules.dashboardHome.viewProperty")}
                    </MotionButton>
                  </Stack>
                </GridItem>
              </Grid>
            </MotionCard>
          )}

          {/* Remaining Properties with Stagger */}
          {remainingProperties.length > 0 && (
            <MotionSimpleGrid
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              columns={{ base: 1, md: 2, xl: 3 }}
              gap={{ base: 5, md: 6, lg: 8 }}
            >
              {remainingProperties.map((property, index) => {
                const statusLabel = normalizeStatus(property?.listingStatus, t, i18n.language);
                const statusColor = statusColorMap[getStatusKey(property?.listingStatus)] || "gray";
                return (
                  <MotionBox key={property?._id} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                    <MotionCard
                      whileHover={{ y: -8, boxShadow: "0 24px 80px rgba(0,0,0,0.15)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      p={0}
                      overflow="hidden"
                      bg={surfaceBg}
                      border={`1px solid ${borderColor}`}
                      backdropFilter="blur(10px)"
                      borderRadius="26px"
                    >
                      <Box position="relative">
                        <Image src={getPrimaryImage(property)} alt={getPropertyName(property, t, i18n.language)} h="236px" w="100%" objectFit="cover" />
                        <Box position="absolute" inset="0" bg="linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.42))" />
                        <Wrap position="absolute" top={4} left={4} spacing={2}>
                          <WrapItem><Badge colorScheme={statusColor} px={3} py={1} borderRadius="full">{statusLabel}</Badge></WrapItem>
                          <WrapItem><Badge bg="blackAlpha.650" color="white" px={3} py={1} borderRadius="full">{getPropertyType(property, t, i18n.language)}</Badge></WrapItem>
                        </Wrap>
                        <Text position="absolute" left={4} bottom={4} color="white" fontWeight="800" fontSize="xl">{formatPrice(property?.listingPrice, t, i18n.language)}</Text>
                      </Box>
                      <Stack spacing={{ base: 4, md: 5 }} p={{ base: 5, md: 6 }}>
                        <Box>
                          <Heading size="md" noOfLines={2} color="gray.800">{getPropertyName(property, t, i18n.language)}</Heading>
                          <Text color={mutedText} mt={2} noOfLines={1}>{property?.propertyAddress || t?.("modules.dashboardHome.addressNotSpecified")}</Text>
                        </Box>
                        <Text color={mutedText} fontSize="sm" minH="60px">{getShortDescription(property, t)}</Text>
                        {/* Metrics Horizontal */}
                        <HStack spacing={{ base: 2, md: 3 }} wrap="wrap" justify="space-between">
                          <HStack flex={{ base: "1 1 30%", md: "1 1 auto" }} spacing={2} p={2.5} borderRadius="14px" bg="rgba(255,255,255,0.6)" border="1px solid rgba(0,0,0,0.05)">
                            <Circle size="32px" bg="green.500" color="white" flexShrink={0}><Icon as={LuBedDouble} boxSize={3.5} /></Circle>
                            <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.beds")}</Text><Text fontWeight="700" color="gray.800" fontSize="md">{property?.numberofBedrooms || "-"}</Text></Box>
                          </HStack>
                          <HStack flex={{ base: "1 1 30%", md: "1 1 auto" }} spacing={2} p={2.5} borderRadius="14px" bg="rgba(255,255,255,0.6)" border="1px solid rgba(0,0,0,0.05)">
                            <Circle size="32px" bg="teal.500" color="white" flexShrink={0}><Icon as={LuBath} boxSize={3.5} /></Circle>
                            <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.baths")}</Text><Text fontWeight="700" color="gray.800" fontSize="md">{property?.numberofBathrooms || "-"}</Text></Box>
                          </HStack>
                          <HStack flex={{ base: "1 1 30%", md: "1 1 auto" }} spacing={2} p={2.5} borderRadius="14px" bg="rgba(255,255,255,0.6)" border="1px solid rgba(0,0,0,0.05)">
                            <Circle size="32px" bg="orange.400" color="white" flexShrink={0}><Icon as={MdOutlineSquareFoot} boxSize={3.5} /></Circle>
                            <Box minW={0}><Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.08em" noOfLines={1}>{t?.("modules.dashboardHome.area")}</Text><Text fontWeight="700" color="gray.800" fontSize="md" noOfLines={1}>{getArea(property, t, i18n.language)}</Text></Box>
                          </HStack>
                        </HStack>
                        <MotionButton
                          whileHover={{ scale: 1.05, x: 4 }}
                          whileTap={{ scale: 0.95 }}
                          size="sm"
                          borderRadius="18px"
                          colorScheme="green"
                          rightIcon={<MdArrowForward />}
                          onClick={() => navigate(`/propertyView/${property?._id}`)}
                          h="46px"
                          fontSize="md"
                        >
                          {t?.("modules.dashboardHome.openProperty")}
                        </MotionButton>
                      </Stack>
                    </MotionCard>
                  </MotionBox>
                );
              })}
            </MotionSimpleGrid>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

// Motion component wrappers
const MotionWrap = motion(Wrap);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionInput = motion(Input);
const MotionButton = motion(Button);
const MotionSimpleGrid = motion(SimpleGrid);
