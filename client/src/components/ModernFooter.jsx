import {
  Box,
  Container,
  Stack,
  Text,
  HStack,
  Grid,
  GridItem,
  Icon,
  Link,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
} from 'react-icons/fi';
import { MdOutlineRealEstateAgent } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export default function ModernFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
  ];

  const quickLinks = [
    { label: t('publicListing.homeNav'), href: '/offers' },
    { label: t('publicListing.propertiesNav'), href: '/offers' },
    { label: t('publicListing.agentsNav'), href: '/offers#agents' },
    { label: t('publicListing.aboutNav'), href: '/offers#about' },
    { label: t('publicListing.contactNav'), href: '/offers#contact' },
  ];

  const propertyTypes = [
    { label: t('publicListing.housesNav'), href: '/offers/houses' },
    { label: t('publicListing.apartmentsNav'), href: '/offers/apartments' },
    { label: t('publicListing.plotsNav'), href: '/offers/plots' },
    { label: t('publicListing.commercialNav'), href: '/offers/commercial' },
  ];

  const contactInfo = [
    { icon: FiMapPin, text: t('publicListing.footerAddress') },
    { icon: FiPhone, text: t('publicListing.footerPhone') },
    { icon: FiMail, text: t('publicListing.footerEmail') },
    { icon: FiClock, text: t('publicListing.footerHours') },
  ];

  return (
    <Box
      className="relative"
      style={{
        background: 'linear-gradient(135deg, rgba(10,15,30,0.98) 0%, rgba(15,23,42,0.95) 50%, rgba(30,41,59,0.9) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      {/* Decorative Elements */}
      <Box
        position="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        w="400px"
        h="400px"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <Container maxW="8xl" py={16} position="relative" zIndex={1}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr 1fr 1fr' }} gap={10}>
          {/* Brand Section */}
          <GridItem>
            <Stack spacing={6}>
              <RouterLink to="/offers" className="flex items-center space-x-3">
                <Box
                  className="p-3 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
                    boxShadow: '0 8px 30px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <MdOutlineRealEstateAgent className="text-white text-3xl" />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="2xl" className="text-white">
                    {t('publicListing.footerTitle')}
                  </Text>
                  <Text fontSize="xs" className="text-luxury-gold/70">
                    {t('publicListing.premiumProperties')}
                  </Text>
                </Box>
              </RouterLink>

              <Text color="gray.400" fontSize="sm" lineHeight="relaxed">
                {t('publicListing.footerDescription')}
              </Text>

              {/* Social Links */}
              <HStack spacing={3}>
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="group"
                    _hover={{ transform: 'translateY(-3px)' }}
                    transition="all 0.3s ease"
                  >
                    <Box
                      className="p-3 rounded-xl"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                      }}
                      _hover={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(205, 127, 50, 0.3) 100%)',
                        borderColor: 'rgba(212, 175, 55, 0.5)',
                        transform: 'scale(1.1)',
                      }}
                    >
                      <Icon as={social.icon} className="text-gray-400 group-hover:text-luxury-gold transition-colors" />
                    </Box>
                  </Link>
                ))}
              </HStack>
            </Stack>
          </GridItem>

          {/* Quick Links */}
          <GridItem>
            <Stack spacing={6}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" className="text-white mb-4">
                  {t('publicListing.quickLinksNav')}
                </Text>
                <Divider borderColor="whiteAlpha.200" />
              </Box>
              <Stack spacing={3}>
                {quickLinks.map((link, index) => (
                  <RouterLink
                    key={index}
                    to={link.href}
                    className="group flex items-center space-x-2"
                  >
                    <Box
                      className="w-2 h-2 rounded-full bg-luxury-gold/30 group-hover:bg-luxury-gold transition-all duration-300"
                      style={{
                        transform: 'scale(0)',
                        opacity: '0',
                      }}
                      _groupHover={{
                        transform: 'scale(1)',
                        opacity: '1',
                      }}
                    />
                    <Text
                      color="gray.400"
                      fontSize="sm"
                      className="group-hover:text-luxury-gold transition-colors duration-300"
                    >
                      {link.label}
                    </Text>
                  </RouterLink>
                ))}
              </Stack>
            </Stack>
          </GridItem>

          {/* Property Types */}
          <GridItem>
            <Stack spacing={6}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" className="text-white mb-4">
                  {t('publicListing.propertyTypesNav')}
                </Text>
                <Divider borderColor="whiteAlpha.200" />
              </Box>
              <Stack spacing={3}>
                {propertyTypes.map((type, index) => (
                  <RouterLink
                    key={index}
                    to={type.href}
                    className="group flex items-center space-x-2"
                  >
                    <Box
                      className="w-2 h-2 rounded-full bg-luxury-gold/30 group-hover:bg-luxury-gold transition-all duration-300"
                      style={{
                        transform: 'scale(0)',
                        opacity: '0',
                      }}
                      _groupHover={{
                        transform: 'scale(1)',
                        opacity: '1',
                      }}
                    />
                    <Text
                      color="gray.400"
                      fontSize="sm"
                      className="group-hover:text-luxury-gold transition-colors duration-300"
                    >
                      {type.label}
                    </Text>
                  </RouterLink>
                ))}
              </Stack>
            </Stack>
          </GridItem>

          {/* Contact Info */}
          <GridItem>
            <Stack spacing={6}>
              <Box>
                <Text fontWeight="bold" fontSize="lg" className="text-white mb-4">
                  {t('publicListing.contactInfoNav')}
                </Text>
                <Divider borderColor="whiteAlpha.200" />
              </Box>
              <Stack spacing={4}>
                {contactInfo.map((item, index) => (
                  <HStack key={index} spacing={3}>
                    <Box
                      className="p-2 rounded-lg"
                      style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                      }}
                    >
                      <Icon as={item.icon} className="text-luxury-gold" />
                    </Box>
                    <Text color="gray.400" fontSize="sm">
                      {item.text}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Stack>
          </GridItem>
        </Grid>

        {/* Bottom Section */}
        <Box mt={12} pt={8} className="border-t border-white/10">
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
            <Text color="gray.500" fontSize="sm">
              {t('publicListing.rightsReserved')}
            </Text>
            <HStack spacing={6} justify={{ base: 'flex-start', md: 'flex-end' }}>
              <Link className="text-gray-500 hover:text-luxury-gold transition-colors text-sm">
                {t('publicListing.privacyNav')}
              </Link>
              <Link className="text-gray-500 hover:text-luxury-gold transition-colors text-sm">
                {t('publicListing.termsNav')}
              </Link>
              <Link className="text-gray-500 hover:text-luxury-gold transition-colors text-sm">
                {t('publicListing.cookiesNav')}
              </Link>
            </HStack>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
