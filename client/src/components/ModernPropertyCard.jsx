import {
  Box,
  Image,
  Stack,
  Text,
  HStack,
  Badge,
  Button,
  Icon,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  FiHeart,
  FiShare2,
  FiVideo,
  FiMapPin,
  FiHome,
  FiMaximize,
  FiPercent,
  FiPrinter,
} from 'react-icons/fi';
import { MdCompareArrows, MdArrowForward, MdMeetingRoom, MdBathtub, MdSquareFoot } from 'react-icons/md';
import { LuMapPin } from 'react-icons/lu';
import {
  formatPrice,
  getPrimaryImage,
  normalizeStatus,
  normalizePropertyTypeKey
} from 'views/public/catalog/catalogData';
import { useState, memo, useCallback } from 'react';
import MortgageCalculator from './property/MortgageCalculator';
import { VirtualTourViewer } from './property/VirtualTourViewer';
import { ShareProperty, PrintProperty } from './property/PropertyExtras';

const ModernPropertyCard = memo(function ModernPropertyCard({ property, t, isFavorite, isInCompare, onFavoriteToggle, onCompareToggle }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Modal states
  const { isOpen: isMortgageOpen, onOpen: onMortgageOpen, onClose: onMortgageClose } = useDisclosure();
  const { isOpen: isTourOpen, onOpen: onTourOpen, onClose: onTourClose } = useDisclosure();
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  const { isOpen: isPrintOpen, onOpen: onPrintOpen, onClose: onPrintClose } = useDisclosure();

  const cardBg = useColorModeValue('white', 'gray.800');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const propertyType = normalizePropertyTypeKey(property?.propertyType);
  const status = normalizeStatus(property?.listingStatus, t);
  const price = formatPrice(property?.listingPrice, t);
  const primaryImage = getPrimaryImage(property);

  // Memoize handlers to prevent re-creation on every render
  const handleFavoriteClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(property?._id);
  }, [property?._id, onFavoriteToggle]);

  const handleCompareClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onCompareToggle?.(property?._id);
  }, [property?._id, onCompareToggle]);

  return (
    <Box
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Main Card */}
      <Box
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: isHovered 
            ? '0 25px 80px rgba(0,0,0,0.3), 0 0 40px rgba(212, 175, 55, 0.1)' 
            : '0 10px 40px rgba(0,0,0,0.2)',
          transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Image Container */}
        <Box className="relative overflow-hidden" style={{ height: '280px' }}>
          <Image
            src={primaryImage}
            alt={property?.name || property?.propertyAddress}
            className="w-full h-full object-cover"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Gradient Overlay */}
          <Box
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />

          {/* Badges */}
          <HStack position="absolute" top={4} left={4} spacing={2} flexWrap="wrap">
            <Badge
              className="backdrop-blur-md"
              style={{
                background: 'rgba(212, 175, 55, 0.9)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: '600',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {status}
            </Badge>
            {propertyType === 'house' && (
              <Badge
                className="backdrop-blur-md"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontWeight: '500',
                  fontSize: '11px',
                }}
              >
                {t('publicListing.categoryHouses')}
              </Badge>
            )}
          </HStack>

          {/* Action Buttons */}
          <HStack position="absolute" top={4} right={4} spacing={2}>
            <IconButton
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              icon={<FiHeart />}
              size="md"
              className={`backdrop-blur-md transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-red-500/80'
              }`}
              style={{
                borderRadius: '12px',
                width: '40px',
                height: '40px',
              }}
              onClick={handleFavoriteClick}
            />
            <IconButton
              aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
              icon={<MdCompareArrows />}
              size="md"
              className={`backdrop-blur-md transition-all duration-300 ${
                isInCompare 
                  ? 'bg-luxury-gold text-white' 
                  : 'bg-white/20 text-white hover:bg-luxury-gold/80'
              }`}
              style={{
                borderRadius: '12px',
                width: '40px',
                height: '40px',
              }}
              onClick={(e) => {
                e.preventDefault();
                onCompareToggle(property?._id);
              }}
            />
          </HStack>

          {/* Price Tag */}
          <Box
            position="absolute"
            bottom={4}
            left={4}
            className="backdrop-blur-md"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '10px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <Text
              fontWeight="bold"
              fontSize="2xl"
              className="text-gradient"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {price}
            </Text>
          </Box>

          {/* Quick Actions */}
          <HStack
            position="absolute"
            bottom={4}
            right={4}
            spacing={2}
            className={`transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <IconButton
              aria-label="View photos"
              icon={<FiVideo />}
              size="md"
              className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
              style={{ borderRadius: '12px' }}
            />
            <IconButton
              aria-label="Share"
              icon={<FiShare2 />}
              size="md"
              className="backdrop-blur-md bg-white/20 text-white hover:bg-white/30"
              style={{ borderRadius: '12px' }}
            />
          </HStack>
        </Box>

        {/* Content */}
        <Stack p={6} spacing={4}>
          {/* Title */}
          <Box>
            <RouterLink to={`/offers/${property?._id}`}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                className="text-white group-hover:text-luxury-gold transition-colors duration-300"
                noOfLines={2}
                style={{ cursor: 'pointer' }}
              >
                {property?.name || property?.propertyAddress}
              </Text>
            </RouterLink>
            <HStack mt={2} spacing={1} className="text-gray-400">
              <Icon as={LuMapPin} />
              <Text fontSize="sm" noOfLines={1}>
                {property?.propertyAddress || t('publicListing.notSpecified')}
              </Text>
            </HStack>
          </Box>

          {/* Description */}
          <Text
            color={mutedColor}
            fontSize="sm"
            noOfLines={2}
            minH="40px"
          >
            {property?.marketingDescription || property?.propertyDescription || t('publicListing.notSpecified')}
          </Text>

          {/* Features */}
          <HStack spacing={4} justify="space-between" className="border-t border-white/10 pt-4">
            <HStack spacing={2} className="text-gray-400">
              <Icon as={MdMeetingRoom} className="text-luxury-gold" />
              <Text fontSize="sm" fontWeight="600">
                {property?.numberofBedrooms || '-'}
              </Text>
              <Text fontSize="xs">{t('publicListing.beds')}</Text>
            </HStack>
            <HStack spacing={2} className="text-gray-400">
              <Icon as={MdBathtub} className="text-luxury-gold" />
              <Text fontSize="sm" fontWeight="600">
                {property?.numberofBathrooms || '-'}
              </Text>
              <Text fontSize="xs">{t('publicListing.baths')}</Text>
            </HStack>
            <HStack spacing={2} className="text-gray-400">
              <Icon as={MdSquareFoot} className="text-luxury-gold" />
              <Text fontSize="sm" fontWeight="600">
                {property?.squareFootage || '-'}
              </Text>
              <Text fontSize="xs">{t('publicListing.sqFt')}</Text>
            </HStack>
          </HStack>

          {/* Quick Actions */}
          <HStack spacing={2} mt={3}>
            <Tooltip label="Mortgage Calculator">
              <IconButton
                size="sm"
                icon={<FiPercent />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMortgageOpen();
                }}
                aria-label="Mortgage Calculator"
                variant="ghost"
                colorScheme="green"
              />
            </Tooltip>
            <Tooltip label="Virtual Tour">
              <IconButton
                size="sm"
                icon={<FiVideo />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTourOpen();
                }}
                aria-label="Virtual Tour"
                variant="ghost"
                colorScheme="blue"
              />
            </Tooltip>
            <Tooltip label="Share">
              <IconButton
                size="sm"
                icon={<FiShare2 />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onShareOpen();
                }}
                aria-label="Share"
                variant="ghost"
                colorScheme="purple"
              />
            </Tooltip>
            <Tooltip label="Print">
              <IconButton
                size="sm"
                icon={<FiPrinter />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPrintOpen();
                }}
                aria-label="Print"
                variant="ghost"
                colorScheme="orange"
              />
            </Tooltip>
          </HStack>

          {/* View Button */}
          <Button
            as={RouterLink}
            to={`/offers/${property?._id}`}
            className="w-full btn-luxury group/btn"
            rightIcon={
              <MdArrowForward 
                className={`transition-transform duration-300 ${
                  isHovered ? 'translate-x-1' : ''
                }`}
              />
            }
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(205, 127, 50, 0.2) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
            _hover={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(205, 127, 50, 0.3) 100%)',
            }}
          >
            {t('publicListing.viewOffer')}
          </Button>
        </Stack>
      </Box>

      {/* Modals */}
      <MortgageCalculator
        propertyPrice={property?.listingPrice}
        isOpen={isMortgageOpen}
        onClose={onMortgageClose}
      />
      <VirtualTourViewer
        property={property}
        isOpen={isTourOpen}
        onClose={onTourClose}
      />
      <ShareProperty
        property={property}
        isOpen={isShareOpen}
        onClose={onShareClose}
      />
      <PrintProperty
        property={property}
        isOpen={isPrintOpen}
        onClose={onPrintClose}
      />
    </Box>
  );
});

export default ModernPropertyCard;
