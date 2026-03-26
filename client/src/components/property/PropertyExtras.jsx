import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
  Icon,
  VStack,
  HStack,
  Badge,
  Image,
  useDisclosure,
  Divider,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiShare2,
  FiPrinter,
  FiClock,
  FiHeart,
  FiEdit3,
  FiCopy,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiMessageCircle,
} from 'react-icons/fi';
import { getPrimaryImage, formatPrice } from 'views/public/catalog/catalogData';

// Share Property Modal
export const ShareProperty = ({ property, isOpen, onClose }) => {
  const toast = useToast();
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied!',
      description: 'Property link copied to clipboard',
      status: 'success',
      duration: 2000,
    });
  };

  const handleShare = (platform) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this property: ${property?.name}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(property?.name)}`,
      email: `mailto:?subject=Check out this property: ${property?.name}&body=Check out this amazing property: ${shareUrl}`,
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Icon as={FiShare2} />
            Share Property
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>{property?.name}</Text>
              <Text color="blue.500" fontWeight="bold">
                {formatPrice(property?.listingPrice)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>Share Link</Text>
              <Flex gap={2}>
                <Input value={shareUrl} readOnly size="sm" />
                <IconButton icon={<FiCopy />} onClick={handleCopy} aria-label="Copy link" />
              </Flex>
            </Box>

            <Divider />

            <Text fontSize="sm" fontWeight="600">Share on Social Media</Text>
            <Flex gap={2} justify="center">
              <IconButton
                icon={<FiFacebook />}
                colorScheme="facebook"
                onClick={() => handleShare('facebook')}
                aria-label="Share on Facebook"
              />
              <IconButton
                icon={<FiTwitter />}
                colorScheme="twitter"
                onClick={() => handleShare('twitter')}
                aria-label="Share on Twitter"
              />
              <IconButton
                icon={<FiLinkedin />}
                colorScheme="linkedin"
                onClick={() => handleShare('linkedin')}
                aria-label="Share on LinkedIn"
              />
              <IconButton
                icon={<FiMail />}
                colorScheme="email"
                onClick={() => handleShare('email')}
                aria-label="Share via Email"
              />
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Print Property Sheet
export const PrintProperty = ({ property, isOpen, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Icon as={FiPrinter} />
              Print Property Details
            </Flex>
            <Button leftIcon={<FiPrinter />} colorScheme="blue" onClick={handlePrint}>
              Print
            </Button>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Box id="print-area" p={6}>
            <Flex gap={6} mb={6}>
              <Box w="300px">
                <Image
                  src={getPrimaryImage(property)}
                  alt={property?.name}
                  borderRadius="lg"
                  w="100%"
                  h="200px"
                  objectFit="cover"
                />
              </Box>
              <Box flex={1}>
                <Heading size="lg" mb={2}>{property?.name}</Heading>
                <Text fontSize="2xl" color="blue.500" fontWeight="bold" mb={2}>
                  {formatPrice(property?.listingPrice)}
                </Text>
                <Flex gap={2} mb={4}>
                  <Badge colorScheme="blue">{property?.propertyType}</Badge>
                  <Badge colorScheme="green">{property?.listingStatus}</Badge>
                </Flex>
                <Text mb={2}>{property?.propertyAddress}</Text>
                <Flex gap={4}>
                  <Text><strong>{property?.numberofBedrooms}</strong> Beds</Text>
                  <Text><strong>{property?.numberofBathrooms}</strong> Baths</Text>
                  <Text><strong>{property?.squareFootage}</strong> Sq Ft</Text>
                </Flex>
              </Box>
            </Flex>

            <Box mb={6}>
              <Heading size="md" mb={3}>Description</Heading>
              <Text>{property?.propertyDescription || property?.marketingDescription}</Text>
            </Box>

            <Box>
              <Heading size="md" mb={3}>Property Details</Heading>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text color="gray.600">Property Type</Text>
                  <Text fontWeight="bold">{property?.propertyType}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Status</Text>
                  <Text fontWeight="bold">{property?.listingStatus}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Year Built</Text>
                  <Text fontWeight="bold">{property?.yearBuilt || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Lot Size</Text>
                  <Text fontWeight="bold">{property?.lotSize || 'N/A'}</Text>
                </Box>
              </SimpleGrid>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Recently Viewed
export const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(viewed.slice(0, 5));
  }, []);

  if (recentlyViewed.length === 0) return null;

  return (
    <Box>
      <Heading size="md" mb={4}>
        <Flex align="center" gap={2}>
          <Icon as={FiClock} />
          Recently Viewed
        </Flex>
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {recentlyViewed.map(property => (
          <Box
            key={property._id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            _hover={{ shadow: 'lg' }}
          >
            <Image
              src={getPrimaryImage(property)}
              alt={property.name}
              h="150px"
              w="100%"
              objectFit="cover"
            />
            <Box p={3}>
              <Text fontWeight="bold" noOfLines={1}>{property.name}</Text>
              <Text color="blue.500" fontWeight="bold" fontSize="sm">
                {formatPrice(property.listingPrice)}
              </Text>
              <Flex gap={2} mt={2}>
                <Badge fontSize="xs">{property.bedrooms} bed</Badge>
                <Badge fontSize="xs">{property.bathrooms} bath</Badge>
              </Flex>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

// Favorites with Notes
export const FavoritesWithNotes = ({ favorites }) => {
  const [notes, setNotes] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('favoriteNotes') || '{}');
    setNotes(savedNotes);
  }, []);

  const handleSaveNote = (propertyId, note) => {
    const updatedNotes = { ...notes, [propertyId]: note };
    setNotes(updatedNotes);
    localStorage.setItem('favoriteNotes', JSON.stringify(updatedNotes));
    onClose();
  };

  const handleOpenNotes = (property) => {
    setSelectedProperty(property);
    onOpen();
  };

  return (
    <Box>
      <Heading size="md" mb={4}>
        <Flex align="center" gap={2}>
          <Icon as={FiHeart} color="red.500" />
          Favorites {favorites.length > 0 && `(${favorites.length})`}
        </Flex>
      </Heading>

      {favorites.length === 0 ? (
        <Text color="gray.500">No favorites yet</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {favorites.map(property => (
            <Box
              key={property._id}
              position="relative"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              _hover={{ shadow: 'lg' }}
            >
              <Image
                src={getPrimaryImage(property)}
                alt={property.name}
                h="200px"
                w="100%"
                objectFit="cover"
              />
              <Box p={3}>
                <Text fontWeight="bold" noOfLines={1}>{property.name}</Text>
                <Text color="blue.500" fontWeight="bold" fontSize="lg">
                  {formatPrice(property.listingPrice)}
                </Text>
                <Flex gap={2} mt={2} mb={3}>
                  <Badge>{property.bedrooms} bed</Badge>
                  <Badge>{property.bathrooms} bath</Badge>
                  <Badge>{property.squareFootage} sqft</Badge>
                </Flex>
                {notes[property._id] && (
                  <Box
                    bg="yellow.50"
                    p={2}
                    borderRadius="md"
                    mb={3}
                    fontSize="sm"
                  >
                    <Text fontWeight="600" mb={1}>📝 Your Note:</Text>
                    <Text noOfLines={2}>{notes[property._id]}</Text>
                  </Box>
                )}
                <Flex gap={2}>
                  <Button
                    size="sm"
                    leftIcon={<FiEdit3 />}
                    onClick={() => handleOpenNotes(property)}
                    flex={1}
                  >
                    Add Note
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => {/* Remove from favorites */}}
                  >
                    Remove
                  </Button>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Notes Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Note for {selectedProperty?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              defaultValue={notes[selectedProperty?._id] || ''}
              placeholder="Add your notes about this property..."
              rows={6}
              id="property-note"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                const note = document.getElementById('property-note').value;
                handleSaveNote(selectedProperty._id, note);
              }}
            >
              Save Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default {
  ShareProperty,
  PrintProperty,
  RecentlyViewed,
  FavoritesWithNotes,
};
