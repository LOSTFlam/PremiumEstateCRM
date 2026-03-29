import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Stack,
  HStack,
  Button,
  Text,
  SimpleGrid,
  useToast,
  Badge,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiHeart, FiShare2, FiDownload, FiTrash2, FiGrid, FiList } from "react-icons/fi";
import { MdCompareArrows } from "react-icons/md";
import ModernPropertyCard from "components/ModernPropertyCard";
import { getApi } from "services/api";
import { useTranslation } from "react-i18next";
import { publicBrand } from "views/public/publicBrand";
import jsPDF from "jspdf";
import 'jspdf-autotable';

const FavoritesPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const storedIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavoriteIds(storedIds);

      if (storedIds.length > 0) {
        const response = await getApi(`api/property/public/by-ids?ids=${storedIds.join(",")}`);
        if (response && response.data) {
          setFavorites(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error loading favorites",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = (propertyId) => {
    const newFavorites = favoriteIds.filter((id) => id !== propertyId);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavoriteIds(newFavorites);
    setFavorites(favorites.filter((p) => p._id !== propertyId));
    
    toast({
      title: "Removed from favorites",
      status: "info",
      duration: 2000,
    });
  };

  const clearAllFavorites = () => {
    localStorage.removeItem("favorites");
    setFavoriteIds([]);
    setFavorites([]);
    toast({
      title: "All favorites cleared",
      status: "info",
      duration: 2000,
    });
  };

  const toggleCompare = (propertyId) => {
    if (compareIds.includes(propertyId)) {
      setCompareIds(compareIds.filter((id) => id !== propertyId));
    } else {
      if (compareIds.length >= 3) {
        toast({
          title: "Maximum 3 properties for comparison",
          status: "warning",
          duration: 3000,
        });
        return;
      }
      setCompareIds([...compareIds, propertyId]);
      toast({
        title: "Added to compare",
        status: "success",
        duration: 2000,
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "My Favorite Properties",
      text: `Check out these ${favorites.length} properties I've saved!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(212, 175, 55);
    doc.text("My Favorite Properties", 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Property table
    const tableData = favorites.map((property, index) => [
      index + 1,
      property.name || property.propertyAddress || "Property",
      `$${property.listingPrice?.toLocaleString() || "On request"}`,
      `${property.squareFootage || "—"} m²`,
      `${property.numberofBedrooms || "—"} bed`,
      `${property.numberofBathrooms || "—"} bath`,
    ]);

    doc.autoTable({
      startY: 35,
      head: [["#", "Name", "Price", "Area", "Bedrooms", "Bathrooms"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [212, 175, 55] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save
    doc.save(`favorites-${Date.now()}.pdf`);
    
    toast({
      title: "PDF exported successfully",
      status: "success",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <Container maxW="8xl" py={20}>
        <Stack spacing={4}>
          <Box className="skeleton" h="40px" w="300px" borderRadius="10px" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} className="skeleton" h="520px" borderRadius="34px" />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={publicBrand.gradients.page} color="white" py={10}>
      <Container maxW="8xl">
        <Stack spacing={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <Stack spacing={2}>
              <HStack>
                <Icon as={FiHeart} color="#F5D076" boxSize={8} />
                <Heading size="xl">
                  {t("publicListing.favoritesTitle") || "My Favorites"}
                </Heading>
              </HStack>
              <Text color="gray.400">
                {favorites.length} {favorites.length === 1 ? "property" : "properties"} saved
              </Text>
            </Stack>

            <HStack spacing={3} flexWrap="wrap">
              {/* View Mode Toggle */}
              <HStack
                bg="rgba(255,255,255,0.05)"
                borderRadius="full"
                p={1}
                border="1px solid rgba(255,255,255,0.1)"
              >
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "solid" : "ghost"}
                  bg={viewMode === "grid" ? "rgba(212,175,55,0.3)" : "transparent"}
                  color={viewMode === "grid" ? "white" : "gray.400"}
                  borderRadius="full"
                  onClick={() => setViewMode("grid")}
                  leftIcon={<FiGrid />}
                >
                  Grid
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "solid" : "ghost"}
                  bg={viewMode === "list" ? "rgba(212,175,55,0.3)" : "transparent"}
                  color={viewMode === "list" ? "white" : "gray.400"}
                  borderRadius="full"
                  onClick={() => setViewMode("list")}
                  leftIcon={<FiList />}
                >
                  List
                </Button>
              </HStack>

              {/* Actions */}
              {favorites.length > 0 && (
                <>
                  <Button
                    leftIcon={<FiDownload />}
                    variant="outline"
                    borderColor="rgba(212,175,55,0.3)"
                    color="#F5D076"
                    onClick={exportToPDF}
                  >
                    Export PDF
                  </Button>
                  <Button
                    leftIcon={<FiShare2 />}
                    variant="outline"
                    borderColor="rgba(255,255,255,0.2)"
                    onClick={handleShare}
                  >
                    Share
                  </Button>
                  <Button
                    leftIcon={<FiTrash2 />}
                    variant="ghost"
                    color="red.400"
                    onClick={clearAllFavorites}
                  >
                    Clear All
                  </Button>
                </>
              )}
            </HStack>
          </Flex>

          {/* Compare Bar */}
          {compareIds.length > 0 && (
            <Box
              p={4}
              borderRadius="20px"
              bg="rgba(212,175,55,0.1)"
              border="1px solid rgba(212,175,55,0.3)"
            >
              <HStack justify="space-between">
                <HStack>
                  <Icon as={MdCompareArrows} color="#F5D076" />
                  <Text>
                    {compareIds.length} property{compareIds.length !== 1 ? "ies" : "y"} selected for comparison
                  </Text>
                </HStack>
                <HStack>
                  <Button
                    as={RouterLink}
                    to={`/offers/compare?ids=${compareIds.join(",")}`}
                    colorScheme="green"
                    size="sm"
                    borderRadius="12px"
                  >
                    Compare Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompareIds([])}
                  >
                    Clear
                  </Button>
                </HStack>
              </HStack>
            </Box>
          )}

          {/* Properties Grid/List */}
          {favorites.length === 0 ? (
            <Stack spacing={6} align="center" py={20}>
              <Icon as={FiHeart} boxSize={20} color="gray.600" />
              <Heading size="lg" color="gray.500">
                No favorites yet
              </Heading>
              <Text color="gray.400" textAlign="center">
                Start exploring properties and save your favorites here
              </Text>
              <Button
                as={RouterLink}
                to="/offers"
                colorScheme="green"
                size="lg"
                borderRadius="12px"
                leftIcon={<FiHeart />}
              >
                Browse Properties
              </Button>
            </Stack>
          ) : (
            <SimpleGrid
              columns={viewMode === "grid" ? { base: 1, md: 2, lg: 3 } : 1}
              spacing={6}
            >
              {favorites.map((property) => (
                <Box key={property._id} position="relative">
                  <ModernPropertyCard
                    property={property}
                    isFavorite={true}
                    isInCompare={compareIds.includes(property._id)}
                    onFavoriteToggle={() => removeFromFavorites(property._id)}
                    onCompareToggle={() => toggleCompare(property._id)}
                  />
                  {/* Quick Remove Button */}
                  <Button
                    position="absolute"
                    top={4}
                    right={4}
                    size="sm"
                    bg="rgba(220, 38, 38, 0.9)"
                    color="white"
                    borderRadius="full"
                    onClick={() => removeFromFavorites(property._id)}
                    _hover={{ bg: "red.600" }}
                    zIndex={10}
                  >
                    <Icon as={FiTrash2} />
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default FavoritesPage;
