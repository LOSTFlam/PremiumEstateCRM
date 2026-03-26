import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Badge,
  Icon,
  Progress,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { FiAward, FiHeart, FiHome, FiDollarSign, FiMapPin, FiStar } from 'react-icons/fi';
import { getApi } from 'services/api';

export default function AIPropertyMatcher({ properties, onMatchFound }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [step, setStep] = useState(1);

  // User preferences
  const [preferences, setPreferences] = useState({
    budget: 500000,
    location: '',
    propertyType: 'all',
    bedrooms: 2,
    bathrooms: 2,
    mustHaves: [],
  });

  const mustHaveOptions = [
    { id: 'garage', label: 'Garage', icon: FiHome },
    { id: 'pool', label: 'Pool', icon: FiHeart },
    { id: 'gym', label: 'Gym', icon: FiAward },
    { id: 'park', label: 'Near Park', icon: FiMapPin },
    { id: 'school', label: 'Good Schools', icon: FiStar },
    { id: 'transport', label: 'Public Transport', icon: FiMapPin },
  ];

  const handleMatch = async () => {
    setLoading(true);
    
    // Simulate AI matching algorithm
    setTimeout(() => {
      // Filter properties based on preferences
      const matched = properties.filter(property => {
        const score = calculateMatchScore(property, preferences);
        return score >= 60; // 60% match or higher
      }).map(property => ({
        ...property,
        matchScore: calculateMatchScore(property, preferences),
      })).sort((a, b) => b.matchScore - a.matchScore);

      setMatches(matched.slice(0, 5)); // Top 5 matches
      setStep(2);
      setLoading(false);

      toast({
        title: 'AI Match Complete!',
        description: `Found ${matched.length} properties that match your preferences`,
        status: 'success',
        duration: 3000,
      });
    }, 2000);
  };

  const calculateMatchScore = (property, prefs) => {
    let score = 0;
    let maxScore = 0;

    // Budget match (40 points)
    maxScore += 40;
    if (property.listingPrice <= prefs.budget) {
      score += 40;
    } else if (property.listingPrice <= prefs.budget * 1.1) {
      score += 30;
    } else if (property.listingPrice <= prefs.budget * 1.2) {
      score += 20;
    }

    // Property type match (20 points)
    maxScore += 20;
    if (prefs.propertyType === 'all' || property.propertyType === prefs.propertyType) {
      score += 20;
    }

    // Bedrooms match (20 points)
    maxScore += 20;
    if (property.numberofBedrooms >= prefs.bedrooms) {
      score += 20;
    } else if (property.numberofBedrooms >= prefs.bedrooms - 1) {
      score += 10;
    }

    // Bathrooms match (10 points)
    maxScore += 10;
    if (property.numberofBathrooms >= prefs.bathrooms) {
      score += 10;
    }

    // Must-haves bonus (10 points)
    maxScore += 10;
    // In real implementation, check property features
    score += prefs.mustHaves.length * 2;

    return Math.min(100, Math.round((score / maxScore) * 100));
  };

  const resetSearch = () => {
    setStep(1);
    setMatches([]);
    setPreferences({
      budget: 500000,
      location: '',
      propertyType: 'all',
      bedrooms: 2,
      bathrooms: 2,
      mustHaves: [],
    });
  };

  return (
    <>
      <Button
        leftIcon={<FiAward />}
        colorScheme="purple"
        onClick={() => setIsOpen(true)}
        size="lg"
      >
        AI Property Matcher
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="xl"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <Flex align="center" gap={3}>
              <Icon as={FiAward} boxSize={6} color="purple.500" />
              <Text fontSize="2xl" fontWeight="bold">AI Property Matcher</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {step === 1 ? (
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" color="gray.600">
                  Tell us what you're looking for and our AI will find your perfect match!
                </Text>

                {/* Budget */}
                <FormControl>
                  <FormLabel fontWeight="600">
                    Budget: ${preferences.budget.toLocaleString()}
                  </FormLabel>
                  <Slider
                    value={preferences.budget}
                    onChange={(value) => setPreferences(prev => ({ ...prev, budget: value }))}
                    min={100000}
                    max={2000000}
                    step={50000}
                    colorScheme="purple"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6} />
                  </Slider>
                </FormControl>

                {/* Property Type */}
                <FormControl>
                  <FormLabel fontWeight="600">Property Type</FormLabel>
                  <Select
                    value={preferences.propertyType}
                    onChange={(e) => setPreferences(prev => ({ ...prev, propertyType: e.target.value }))}
                  >
                    <option value="all">Any Type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                  </Select>
                </FormControl>

                {/* Bedrooms */}
                <FormControl>
                  <FormLabel fontWeight="600">Bedrooms: {preferences.bedrooms}+</FormLabel>
                  <Slider
                    value={preferences.bedrooms}
                    onChange={(value) => setPreferences(prev => ({ ...prev, bedrooms: value }))}
                    min={0}
                    max={6}
                    step={1}
                    colorScheme="purple"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>{preferences.bedrooms}</SliderThumb>
                  </Slider>
                </FormControl>

                {/* Bathrooms */}
                <FormControl>
                  <FormLabel fontWeight="600">Bathrooms: {preferences.bathrooms}+</FormLabel>
                  <Slider
                    value={preferences.bathrooms}
                    onChange={(value) => setPreferences(prev => ({ ...prev, bathrooms: value }))}
                    min={1}
                    max={5}
                    step={1}
                    colorScheme="purple"
                  >
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb boxSize={6}>{preferences.bathrooms}</SliderThumb>
                  </Slider>
                </FormControl>

                {/* Must Haves */}
                <FormControl>
                  <FormLabel fontWeight="600">Must Haves</FormLabel>
                  <SimpleGrid columns={2} gap={3}>
                    {mustHaveOptions.map(option => (
                      <Checkbox
                        key={option.id}
                        isChecked={preferences.mustHaves.includes(option.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferences(prev => ({
                              ...prev,
                              mustHaves: [...prev.mustHaves, option.id],
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              mustHaves: prev.mustHaves.filter(id => id !== option.id),
                            }));
                          }
                        }}
                      >
                        <Flex align="center" gap={2}>
                          <Icon as={option.icon} />
                          <Text>{option.label}</Text>
                        </Flex>
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </FormControl>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Heading size="md">Top Matches</Heading>
                {matches.map((property, index) => (
                  <Box
                    key={property._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    position="relative"
                  >
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme={property.matchScore >= 80 ? 'green' : 'blue'}
                      fontSize="sm"
                    >
                      {property.matchScore}% Match
                    </Badge>
                    <Text fontWeight="bold">{property.name}</Text>
                    <Text color="blue.500" fontWeight="bold">
                      ${property.listingPrice.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {property.bedrooms} bed • {property.bathrooms} bath • {property.squareFootage} sqft
                    </Text>
                    <Progress
                      value={property.matchScore}
                      colorScheme={property.matchScore >= 80 ? 'green' : 'blue'}
                      size="sm"
                      mt={2}
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            {step === 1 ? (
              <Button
                colorScheme="purple"
                onClick={handleMatch}
                isLoading={loading}
                loadingText="AI is thinking..."
                leftIcon={<FiAward />}
              >
                Find My Perfect Match
              </Button>
            ) : (
              <Button colorScheme="blue" onClick={resetSearch}>
                Start New Search
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
