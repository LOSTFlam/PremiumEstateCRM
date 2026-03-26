import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Box, Container, useToast, Spinner, Flex, Text, Heading, Button, HStack, IconButton } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { getApi } from 'services/api';
import ThreeBackground from 'components/ThreeBackground';
import ParticleCanvas from 'components/ParticleCanvas';
import GradientOrbs from 'components/GradientOrbs';
import PropertyBackground from 'components/PropertyBackground';
import GlassCard from 'components/GlassCard';
import ModernHeader from 'components/ModernHeader';
import ModernHero from 'components/ModernHero';
import ModernFeatures from 'components/ModernFeatures';
import ModernPropertyCard from 'components/ModernPropertyCard';
import ModernFooter from 'components/ModernFooter';
import WhyChooseUs from 'components/WhyChooseUs';
import TrustedService from 'components/TrustedService';
import { PropertyCardSkeleton } from 'components/skeletons/Skeletons';
import PropertyFilters from 'components/property/PropertyFilters';
import { PropertySort, PropertyPagination, usePropertyPagination } from 'hooks/usePropertyPagination';
import AIPropertyMatcher from 'components/property/AIPropertyMatcher';
import {
  formatCompactNumber,
  getCatalogDataset,
  getPrimaryImage,
  isRichListing,
  normalizePropertyTypeKey,
  normalizeStatus,
  parsePrice,
  placeholderImage,
  samplePublicProperties,
} from 'views/public/catalog/catalogData';
import {
  getCompareIds,
  getFavoriteIds,
  toggleCompareId,
  toggleFavoriteId,
} from 'views/public/catalog/catalogStorage';
import { MdArrowForward, FiFilter } from 'react-icons/md';
import { FiFilter as FiFilterIcon } from 'react-icons/fi';

// Memoize child components to prevent unnecessary re-renders
const MemoizedModernHeader = memo(ModernHeader);
const MemoizedModernHero = memo(ModernHero);
const MemoizedModernFeatures = memo(ModernFeatures);
const MemoizedModernPropertyCard = memo(ModernPropertyCard);
const MemoizedWhyChooseUs = memo(WhyChooseUs);
const MemoizedTrustedService = memo(TrustedService);
const MemoizedModernFooter = memo(ModernFooter);

const ModernLandingPage = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [largeLogo, setLargeLogo] = useState([]);
  const [propertyCount, setPropertyCount] = useState(0);
  
  // New filter and pagination state
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    maxBedrooms: '',
    minBathrooms: '',
    maxBathrooms: '',
    minArea: '',
    maxArea: '',
  });
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use custom pagination hook
  const {
    filteredProperties,
    paginatedProperties,
    totalPages,
    currentPage: hookCurrentPage,
    totalResults,
  } = usePropertyPagination(properties, filters, sortBy, currentPage, 6);

  // Sync favorites and compare from localStorage - memoized
  const syncLocalCollections = useCallback(() => {
    setFavoriteIds(getFavoriteIds());
    setCompareIds(getCompareIds());
  }, []);

  useEffect(() => {
    syncLocalCollections();
    window.addEventListener('focus', syncLocalCollections);
    return () => window.removeEventListener('focus', syncLocalCollections);
  }, [syncLocalCollections]);

  // Fetch properties with caching
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await getApi('api/property/public');
        let propertiesData = [];

        if (Array.isArray(response)) {
          propertiesData = response;
        } else if (Array.isArray(response?.data)) {
          propertiesData = response.data;
        } else {
          propertiesData = samplePublicProperties;
        }

        if (propertiesData.length === 0) {
          propertiesData = samplePublicProperties;
        }

        setProperties(getCatalogDataset(propertiesData));
        setPropertyCount(propertiesData.length);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties(getCatalogDataset(samplePublicProperties));
        setPropertyCount(samplePublicProperties.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch logo (silent fail - not critical)
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await getApi('api/image/getall');
        const activeLogos = (response?.data || []).filter(item => item.isActive);
        setLargeLogo(activeLogos);
      } catch (error) {
        // Silently fail for logo - not critical
        setLargeLogo([]);
      }
    };

    fetchLogo();
  }, []);

  // Get featured properties (show first 6 with any image)
  const featuredProperties = useMemo(() => {
    const withImages = filteredProperties.filter((property) => {
      const img = getPrimaryImage(property);
      return img && !img.includes('placeholder');
    });
    // If no properties with images, show first 6 anyway
    return withImages.length > 0 ? withImages.slice(0, 6) : filteredProperties.slice(0, 6);
  }, [filteredProperties]);

  // Handle favorite toggle
  const handleFavoriteToggle = (id) => {
    setFavoriteIds(toggleFavoriteId(id));
    const isRemoving = favoriteIds.includes(id);
    toast({
      title: isRemoving ? t('publicListing.removeFromFavorites') : t('publicListing.addToFavorites'),
      status: isRemoving ? 'info' : 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle compare toggle
  const handleCompareToggle = (id) => {
    if (!compareIds.includes(id) && compareIds.length >= 3) {
      toast({ 
        title: t('publicListing.compareLimit'), 
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCompareIds(toggleCompareId(id));
    const isRemoving = compareIds.includes(id);
    toast({
      title: isRemoving ? t('publicListing.removeFromCompare') : t('publicListing.addToCompare'),
      status: isRemoving ? 'info' : 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // Handle search
  const handleSearch = () => {
    // Search is already applied via filteredProperties
    const element = document.getElementById('properties-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box className="relative min-h-screen" style={{ background: '#0F172A' }}>
      {/* Gradient Orbs Background */}
      <GradientOrbs />
      
      {/* Property Silhouettes Background */}
      <PropertyBackground />
      
      {/* Particle Canvas Background */}
      <ParticleCanvas />

      {/* Three.js Background */}
      <ThreeBackground />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .text-gradient {
          background: linear-gradient(135deg, #D4AF37 0%, #F7E7CE 50%, #D4AF37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }

        .btn-luxury {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.85) 0%, rgba(184, 134, 11, 0.8) 100%);
          color: #FFFFFF;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.5);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
        }

        .btn-luxury::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transition: left 0.5s;
        }

        .btn-luxury:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.5);
          border-color: rgba(212, 175, 55, 0.8);
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.95) 0%, rgba(184, 134, 11, 0.9) 100%);
        }

        .btn-luxury:hover::before {
          left: 100%;
        }

        /* Glass morphism utilities */
        .glass-panel {
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(100, 200, 150, 0.3);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 200, 150, 0.5);
        }
      `}</style>

      {/* Header */}
      <ModernHeader largeLogo={largeLogo} />

      {/* Main Content */}
      <Box position="relative" zIndex={1}>
        {/* Hero Section */}
        <ModernHero
          properties={properties}
          t={t}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Features Section */}
        <ModernFeatures properties={properties} t={t} />

        {/* Properties Section */}
        <Box
          id="properties-section"
          py={20}
          style={{
            background: 'linear-gradient(180deg, rgba(10,15,30,0.8) 0%, rgba(15,23,42,0.95) 100%)',
          }}
        >
          <Container maxW="8xl">
            <Box mb={12}>
              <Box mb={6}>
                <Box
                  className="inline-block px-5 py-2 rounded-full mb-4"
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#D4AF37',
                    fontWeight: '600',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('publicListing.featuredProperties') || 'Featured Properties'}
                </Box>
                <Box>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {searchQuery 
                      ? t('publicListing.searchResults') || 'Search Results'
                      : t('publicListing.catalogTitle') || 'Discover Exceptional Properties'}
                  </h2>
                  <p className="text-gray-400 text-lg max-w-700">
                    {searchQuery 
                      ? `${filteredProperties.length} properties found`
                      : t('publicListing.heroDescription') || 'Explore our curated selection of premium properties'}
                  </p>
                </Box>
              </Box>
            </Box>

            {/* Filter and Sort Controls */}
            <Flex justify="space-between" align="center" mb={6} gap={4} flexWrap="wrap">
              <HStack>
                <PropertyFilters
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                  filters={filters}
                  onApplyFilters={(newFilters) => {
                    setFilters(newFilters);
                    setCurrentPage(1);
                  }}
                  onClearFilters={(clearedFilters) => {
                    setFilters(clearedFilters);
                    setCurrentPage(1);
                  }}
                />
                <Text fontWeight="600">
                  {totalResults} {totalResults === 1 ? 'Property' : 'Properties'}
                </Text>
              </HStack>
              <HStack>
                <AIPropertyMatcher properties={properties} />
                <PropertySort sortBy={sortBy} onSortChange={setSortBy} />
              </HStack>
            </Flex>

            {/* Property Grid with Skeleton Loading */}
            {loading ? (
              <Box
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                style={{ perspective: '1000px' }}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </Box>
            ) : paginatedProperties.length > 0 ? (
              <>
                <Box
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  style={{ perspective: '1000px' }}
                >
                  {paginatedProperties.map((property, index) => (
                    <Box
                      key={property._id}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both',
                      }}
                    >
                      <MemoizedModernPropertyCard
                        property={property}
                        t={t}
                        isFavorite={favoriteIds.includes(property._id)}
                        isInCompare={compareIds.includes(property._id)}
                        onFavoriteToggle={handleFavoriteToggle}
                        onCompareToggle={handleCompareToggle}
                      />
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box
                textAlign="center"
                py={20}
                className="rounded-3xl"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '80px 40px',
                }}
              >
                <Box mb={6}>
                  <Text
                    fontSize="6xl"
                    className="text-gradient"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🔍
                  </Text>
                </Box>
                <Heading size="xl" className="text-white mb-4">
                  {t('publicListing.noResults') || 'No Properties Found'}
                </Heading>
                <Text color="gray.400" fontSize="lg" mb={8}>
                  {t('publicListing.noResultsText') ||
                    'We couldn\'t find any properties matching your search. Try adjusting your filters.'}
                </Text>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      type: 'all',
                      status: 'all',
                      minPrice: '',
                      maxPrice: '',
                      minBedrooms: '',
                      maxBedrooms: '',
                      minBathrooms: '',
                      maxBathrooms: '',
                      minArea: '',
                      maxArea: '',
                    });
                  }}
                  className="btn-luxury"
                >
                  {t('publicListing.resetFilters') || 'Clear All Filters'}
                </Button>
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <PropertyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </Container>
        </Box>

        {/* Why Choose Us Section */}
        <MemoizedWhyChooseUs />

        {/* Trusted Service Section */}
        <MemoizedTrustedService />

        {/* Footer */}
        <MemoizedModernFooter />
      </Box>
    </Box>
  );
};

export default ModernLandingPage;
