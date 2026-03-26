import React, { useState, useEffect, memo } from 'react';
import { Box, Container, Heading, Text, Grid, GridItem, Button, Flex, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getFavoriteIds, toggleFavoriteId } from 'views/public/catalog/catalogStorage';
import { getPrimaryImage, formatPrice } from 'views/public/catalog/catalogData';
import ModernPropertyCard from 'components/ModernPropertyCard';
import { PropertyCardSkeleton } from 'components/skeletons/Skeletons';
import { getApi } from 'services/api';
import { FiHeart, FiHome } from 'react-icons/fi';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const ids = getFavoriteIds();
        setFavoriteIds(ids);
        
        if (ids.length > 0) {
          const response = await getApi('api/property/public');
          const properties = Array.isArray(response) ? response : response?.data || [];
          const favoriteProperties = properties.filter(p => ids.includes(p._id));
          setFavorites(favoriteProperties);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFromFavorites = (propertyId) => {
    setFavoriteIds(toggleFavoriteId(propertyId));
    setFavorites(favorites.filter(f => f._id !== propertyId));
    
    toast({
      title: 'Removed from favorites',
      status: 'info',
      duration: 2000,
    });
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={10}>
        <Heading mb={8}>My Favorites</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </Grid>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container maxW="8xl" py={10}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={20}
          textAlign="center"
        >
          <FiHeart size={64} color="gray.300" mb={4} />
          <Heading size="lg" mb={2}>No Favorites Yet</Heading>
          <Text color="gray.500" mb={6}>
            Start adding properties to your favorites to see them here
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/offers')}
            leftIcon={<FiHome />}
          >
            Browse Properties
          </Button>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="8xl" py={10}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading>
          My Favorites ({favorites.length})
        </Heading>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
        {favorites.map((property) => (
          <Box key={property._id} position="relative">
            <ModernPropertyCard
              property={property}
              t={t}
              isFavorite={true}
              isInCompare={false}
              onFavoriteToggle={handleRemoveFromFavorites}
              onCompareToggle={() => {}}
            />
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default FavoritesPage;
