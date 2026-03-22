import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Container,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorModeValue,
  Icon,
  Text,
  Stack,
} from '@chakra-ui/react';
import { FiMenu, FiX, FiSearch, FiUser, FiHome, FiBriefcase, FiPhone, FiMail, FiGlobe } from 'react-icons/fi';
import { MdOutlineRealEstateAgent, MdDashboard, MdLanguage } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

export default function ModernHeader({ largeLogo }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language || 'en';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('publicListing.homeNav'), href: '/offers', icon: FiHome },
    { label: t('publicListing.propertiesNav'), href: '/offers', icon: MdOutlineRealEstateAgent },
    { label: t('publicListing.agentsNav'), href: '/offers#agents', icon: FiUser },
    { label: t('publicListing.contactNav'), href: '/offers#contact', icon: FiPhone },
  ];

  const handleNavigation = (href) => {
    navigate(href);
    onClose();
  };

  const bgColor = useColorModeValue('white/80', 'gray.900/80');
  const borderColor = useColorModeValue('gray.200/50', 'gray.700/50');

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        transition="all 0.3s ease"
        className={isScrolled ? 'glass-dark shadow-2xl' : 'bg-transparent'}
        style={{
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? `1px solid rgba(255,255,255,0.1)` : 'none',
        }}
      >
        <Container maxW="8xl">
          <Flex
            align="center"
            justify="space-between"
            py={4}
            px={2}
          >
            {/* Logo */}
            <RouterLink to="/offers" className="flex items-center space-x-3 group">
              {largeLogo && largeLogo.length > 0 && largeLogo[0]?.image ? (
                <img
                  src={largeLogo[0]?.image}
                  alt="Logo"
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Flex align="center" gap={2}>
                  <Box
                    className="p-2 rounded-xl bg-gradient-to-br from-luxury-gold to-accent-500"
                    style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)' }}
                  >
                    <MdOutlineRealEstateAgent className="text-white text-2xl" />
                  </Box>
                  <Box>
                    <Text fontWeight="bold" fontSize="xl" className="text-white">
                      {t('publicListing.footerTitle')}
                    </Text>
                    <Text fontSize="xs" className="text-luxury-gold/80">
                      {t('publicListing.premiumProperties')}
                    </Text>
                  </Box>
                </Flex>
              )}
            </RouterLink>

            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  color="white"
                  _hover={{ 
                    color: 'luxury.gold',
                    bg: 'whiteAlpha.100'
                  }}
                  onClick={() => handleNavigation(link.href)}
                  className="relative group"
                >
                  <HStack spacing={2}>
                    <Icon as={link.icon} className="transition-transform duration-300 group-hover:scale-110" />
                    <Text fontWeight="500">{link.label}</Text>
                  </HStack>
                  <Box
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-luxury-gold to-accent-500 rounded-full"
                    style={{ width: '0%', transition: 'width 0.3s ease' }}
                    _groupHover={{ width: '100%' }}
                  />
                </Button>
              ))}
            </HStack>

            {/* Action Buttons */}
            <HStack spacing={4} display={{ base: 'none', lg: 'flex' }}>
              {/* Language Switcher */}
              <HStack spacing={1} bg="whiteAlpha.100" borderRadius="xl" px={2} py={1}>
                <Button
                  size="xs"
                  variant={currentLanguage === 'en' ? 'solid' : 'ghost'}
                  onClick={() => changeLanguage('en')}
                  style={{
                    background: currentLanguage === 'en' 
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(205, 127, 50, 0.9) 100%)'
                      : 'transparent',
                    border: 'none',
                    color: currentLanguage === 'en' ? 'white' : 'gray.300',
                    fontWeight: '700',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  _hover={{
                    transform: 'scale(1.05)',
                    color: 'white',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.7) 0%, rgba(205, 127, 50, 0.7) 100%)',
                  }}
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                >
                  EN
                </Button>
                <Box w="1px" h="4" bg="whiteAlpha.300" />
                <Button
                  size="xs"
                  variant={currentLanguage === 'ru' ? 'solid' : 'ghost'}
                  onClick={() => changeLanguage('ru')}
                  style={{
                    background: currentLanguage === 'ru'
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.9) 0%, rgba(205, 127, 50, 0.9) 100%)'
                      : 'transparent',
                    border: 'none',
                    color: currentLanguage === 'ru' ? 'white' : 'gray.300',
                    fontWeight: '700',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  _hover={{
                    transform: 'scale(1.05)',
                    color: 'white',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.7) 0%, rgba(205, 127, 50, 0.7) 100%)',
                  }}
                  _active={{
                    transform: 'scale(0.98)',
                  }}
                >
                  РУ
                </Button>
              </HStack>
              
              <IconButton
                aria-label="Search"
                icon={isSearchOpen ? <FiX /> : <FiSearch />}
                variant="ghost"
                color="white"
                _hover={{ bg: 'whiteAlpha.100', color: 'luxury.gold' }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              />
              
              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  className="btn-luxury"
                  leftIcon={<FiUser />}
                >
                  {t('navigation.dashboard')}
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/auth/sign-in"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.100' }}
                  >
                    {t('auth.signIn.signInButton')}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/auth/sign-up"
                    className="btn-luxury"
                  >
                    {t('auth.signUp.createAccountButton')}
                  </Button>
                </>
              )}
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              aria-label="Menu"
              icon={isOpen ? <FiX /> : <FiMenu />}
              variant="ghost"
              color="white"
              size="lg"
              display={{ base: 'flex', lg: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>

          {/* Search Bar */}
          {isSearchOpen && (
            <Box
              pb={4}
              className="animate-fade-in-down"
              display={{ base: 'none', lg: 'block' }}
            >
              <Flex gap={2}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="input-luxury flex-1"
                  autoFocus
                />
                <Button className="btn-luxury">
                  <FiSearch />
                </Button>
              </Flex>
            </Box>
          )}
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay className="bg-black/50" />
        <DrawerContent className="bg-gradient-luxury border-l border-white/10">
          <DrawerCloseButton color="white" />
          <DrawerHeader className="border-b border-white/10 pt-8">
            <Flex align="center" gap={3}>
              <Box className="p-2 rounded-xl bg-gradient-to-br from-luxury-gold to-accent-500">
                <MdOutlineRealEstateAgent className="text-white text-2xl" />
              </Box>
              <Box>
                <Text fontWeight="bold" fontSize="xl" className="text-white">
                  {t('publicListing.footerTitle')}
                </Text>
                <Text fontSize="xs" className="text-luxury-gold/80">
                  {t('publicListing.premiumProperties')}
                </Text>
              </Box>
            </Flex>
          </DrawerHeader>
          <DrawerBody className="py-6">
            <Stack spacing={4}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  color="white"
                  justifyContent="flex-start"
                  _hover={{ bg: 'whiteAlpha.100', color: 'luxury.gold' }}
                  onClick={() => handleNavigation(link.href)}
                  className="group"
                >
                  <HStack spacing={3}>
                    <Icon as={link.icon} className="transition-transform duration-300 group-hover:scale-110" />
                    <Text fontWeight="500">{link.label}</Text>
                  </HStack>
                </Button>
              ))}

              {/* Language Switcher in Mobile Menu */}
              <Box className="border-t border-white/10 my-4" />
              <Box>
                <Text fontSize="sm" color="gray.400" mb={3}>Language / Язык</Text>
                <HStack spacing={3}>
                  <Button
                    flex={1}
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
                    flex={1}
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
              </Box>

              <Box className="border-t border-white/10 my-4" />
              
              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/dashboard"
                  className="btn-luxury w-full"
                  leftIcon={<FiUser />}
                  onClick={onClose}
                >
                  {t('navigation.dashboard')}
                </Button>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/auth/sign-in"
                    variant="ghost"
                    color="white"
                    justifyContent="flex-start"
                    _hover={{ bg: 'whiteAlpha.100' }}
                    onClick={onClose}
                  >
                    {t('auth.signIn.signInButton')}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/auth/sign-up"
                    className="btn-luxury w-full"
                    onClick={onClose}
                  >
                    {t('auth.signUp.createAccountButton')}
                  </Button>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
