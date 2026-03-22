import {
  Box,
  Container,
  Stack,
  Heading,
  Text,
  Button,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiSearch, FiHome, FiKey, FiShield, FiGlobe } from 'react-icons/fi';
import { MdOutlineRealEstateAgent, MdArrowForward, MdCompareArrows, MdLanguage } from 'react-icons/md';
import { LuBuilding2, LuMapPin } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

export default function ModernHero({ 
  properties, 
  t, 
  onSearch, 
  searchQuery, 
  setSearchQuery 
}) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  const heroBg = useColorModeValue(
    'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 50%, rgba(51,65,85,0.85) 100%)',
    'linear-gradient(135deg, rgba(10,15,30,0.98) 0%, rgba(15,23,42,0.95) 50%, rgba(30,41,59,0.9) 100%)'
  );

  const availableNow = properties?.filter(
    (item) => ['available', 'active', 'new'].includes(String(item?.listingStatus || 'available').toLowerCase())
  ).length || 0;

  const totalProperties = properties?.length || 0;

  const categoryConfig = {
    house: {
      titleKey: 'publicListing.categoryHouses',
      descriptionKey: 'publicListing.categoryHousesText',
      route: '/offers/houses',
      icon: FiHome,
    },
    apartment: {
      titleKey: 'publicListing.categoryApartments',
      descriptionKey: 'publicListing.categoryApartmentsText',
      route: '/offers/apartments',
      icon: LuBuilding2,
    },
    land: {
      titleKey: 'publicListing.categoryPlots',
      descriptionKey: 'publicListing.categoryPlotsText',
      route: '/offers/plots',
      icon: LuMapPin,
    },
    commercial: {
      titleKey: 'publicListing.categoryCommercial',
      descriptionKey: 'publicListing.categoryCommercialText',
      route: '/offers/commercial',
      icon: MdOutlineRealEstateAgent,
    },
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      alignItems="center"
      style={{
        background: heroBg,
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
        }}
      />
      <Box
        position="absolute"
        top="0"
        right="0"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle at 80% 20%, rgba(205, 127, 50, 0.1) 0%, transparent 50%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      
      <Container maxW="8xl" position="relative" zIndex={1} py={{ base: 20, md: 28 }}>
        <Stack spacing={12}>
          {/* Hero Content */}
          <Stack spacing={8} align="center" textAlign="center">
            {/* Badge */}
            <Badge
              className="animate-fade-in-down"
              style={{
                background: 'rgba(212, 175, 55, 0.2)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '10px 24px',
                borderRadius: '30px',
                color: '#D4AF37',
                fontWeight: '600',
                fontSize: '14px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                backdropFilter: 'blur(10px)',
              }}
            >
              ✨ {t('publicListing.heroBadge') || 'Premium Real Estate'}
            </Badge>

            {/* Language Switcher */}
            <HStack spacing={2} className="animate-fade-in-down">
              <Button
                size="sm"
                variant={currentLanguage === 'en' ? 'solid' : 'outline'}
                onClick={() => changeLanguage('en')}
                style={{
                  background: currentLanguage === 'en' 
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(205, 127, 50, 0.9) 100%)'
                    : 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.7) 0%, rgba(205, 127, 50, 0.7) 100%)',
                }}
                _active={{
                  transform: 'scale(0.98)',
                }}
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={currentLanguage === 'ru' ? 'solid' : 'outline'}
                onClick={() => changeLanguage('ru')}
                style={{
                  background: currentLanguage === 'ru'
                    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(205, 127, 50, 0.9) 100%)'
                    : 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.7) 0%, rgba(205, 127, 50, 0.7) 100%)',
                }}
                _active={{
                  transform: 'scale(0.98)',
                }}
              >
                РУ
              </Button>
            </HStack>

            {/* Main Heading */}
            <Heading
              as="h1"
              size="2xl"
              className="text-white animate-fade-in-up"
              style={{
                maxWidth: '900px',
                lineHeight: '1.1',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {t('publicListing.catalogTitle') || 'Find Your Dream Property'}
              <Text
                as="span"
                className="text-gradient"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 3s linear infinite',
                }}
              >
                {' '}in Prime Locations
              </Text>
            </Heading>

            {/* Description */}
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.300"
              className="animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
              maxW="700px"
            >
              {t('publicListing.heroDescription') || 
                'Discover exclusive properties with unparalleled luxury and sophistication. Your dream home awaits.'}
            </Text>

            {/* Search Bar */}
            <Box
              className="animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
              w="100%"
              maxW="700px"
            >
              <Box
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '24px',
                  padding: '8px',
                }}
              >
                <HStack spacing={3}>
                  <Icon as={FiSearch} className="text-gray-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('publicListing.searchPlaceholder') || 'Search by location, property type...'}
                    className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none px-4 py-3"
                    onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                  />
                  <Button
                    className="btn-luxury"
                    onClick={onSearch}
                    style={{
                      borderRadius: '16px',
                      padding: '12px 32px',
                    }}
                  >
                    <FiSearch />
                  </Button>
                </HStack>
              </Box>
            </Box>

            {/* Quick Links */}
            <HStack spacing={4} className="animate-fade-in-up" style={{ animationDelay: '600ms' }} flexWrap="wrap" justify="center">
              <Button
                as={RouterLink}
                to="/offers"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.100' }}
                rightIcon={<MdArrowForward />}
              >
                {t('publicListing.allOffers') || 'All Properties'}
              </Button>
              <Button
                as={RouterLink}
                to="/offers/compare"
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.100' }}
                leftIcon={<MdCompareArrows />}
              >
                {t('publicListing.compareAction') || 'Compare'}
              </Button>
              {!localStorage.getItem('token') && (
                <Button
                  as={RouterLink}
                  to="/auth/sign-in"
                  className="btn-luxury-outline"
                >
                  {t('publicListing.signIn') || 'Sign In'}
                </Button>
              )}
            </HStack>
          </Stack>

          {/* Stats */}
          <SimpleGrid
            columns={{ base: 2, md: 4 }}
            gap={6}
            className="animate-fade-in-up"
            style={{ animationDelay: '800ms' }}
          >
            {[
              {
                label: t('publicListing.totalOffers') || 'Total Properties',
                value: totalProperties,
                help: t('publicListing.totalOffersHelp') || 'Available listings',
                icon: FiHome,
              },
              {
                label: t('publicListing.availableNow') || 'Available Now',
                value: availableNow,
                help: t('publicListing.availableHelp') || 'Ready to move in',
                icon: FiKey,
              },
              {
                label: t('publicListing.categories') || 'Categories',
                value: '4',
                help: t('publicListing.categoriesHelp') || 'Property types',
                icon: LuBuilding2,
              },
              {
                label: t('publicListing.trusted') || 'Trusted',
                value: '100%',
                help: t('publicListing.trustedHelp') || 'Verified listings',
                icon: FiShield,
              },
            ].map((stat, index) => (
              <Box
                key={index}
                className="group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '24px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                }}
                _hover={{
                  transform: 'translateY(-4px)',
                  background: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
              >
                <Stat textAlign="center">
                  <Flex justify="center" mb={3}>
                    <Box
                      className="p-3 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(205, 127, 50, 0.2) 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      <Icon as={stat.icon} className="text-luxury-gold text-xl" />
                    </Box>
                  </Flex>
                  <StatNumber
                    className="text-4xl font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </StatNumber>
                  <StatLabel color="gray.300" fontSize="sm" fontWeight="500">
                    {stat.label}
                  </StatLabel>
                  <StatHelpText color="gray.500" fontSize="xs" mt={1}>
                    {stat.help}
                  </StatHelpText>
                </Stat>
              </Box>
            ))}
          </SimpleGrid>

          {/* Category Cards */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            gap={5}
            className="animate-fade-in-up"
            style={{ animationDelay: '1000ms' }}
          >
            {Object.entries(categoryConfig).map(([key, config]) => (
              <RouterLink key={key} to={config.route}>
                <Box
                  className="group cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '24px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  _hover={{
                    transform: 'translateY(-6px)',
                    background: 'rgba(255,255,255,0.06)',
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 25px 80px rgba(0,0,0,0.3), 0 0 40px rgba(212, 175, 55, 0.1)',
                  }}
                >
                  <Stack spacing={4}>
                    <Box
                      className="p-4 rounded-2xl inline-block"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(205, 127, 50, 0.2) 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        transition: 'all 0.3s ease',
                      }}
                      _groupHover={{
                        transform: 'scale(1.1) rotate(5deg)',
                      }}
                    >
                      <Icon as={config.icon} className="text-luxury-gold text-2xl" />
                    </Box>
                    <Box>
                      <Text fontWeight="bold" fontSize="lg" color="white" mb={1}>
                        {t(config.titleKey)}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {t(config.descriptionKey)}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </RouterLink>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
