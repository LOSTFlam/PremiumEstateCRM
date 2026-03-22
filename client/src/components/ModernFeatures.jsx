import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  HStack,
  Badge,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCheck, FiStar, FiUsers, FiAward } from 'react-icons/fi';
import { MdArrowForward } from 'react-icons/md';

export default function ModernFeatures({ properties, t }) {
  const cardBg = useColorModeValue('white/5', 'gray.800/50');
  const borderColor = useColorModeValue('white/10', 'white/5');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const features = [
    {
      icon: FiAward,
      title: t('publicListing.premiumProperties'),
      description: t('publicListing.premiumPropertiesText'),
      benefits: [
        t('publicListing.verifiedListings'),
        t('publicListing.exclusiveAccess'),
        t('publicListing.premiumSupport'),
      ],
    },
    {
      icon: FiUsers,
      title: t('publicListing.expertAgents'),
      description: t('publicListing.expertAgentsText'),
      benefits: [
        t('publicListing.support247'),
        t('publicListing.expertAdvice'),
        t('publicListing.personalizedService'),
      ],
    },
    {
      icon: FiStar,
      title: t('publicListing.trustedService'),
      description: t('publicListing.trustedServiceHelp'),
      benefits: [
        t('publicListing.transparent'),
        t('publicListing.secureTransactions'),
        t('publicListing.provenTrack'),
      ],
    },
  ];

  const stats = [
    { value: '500+', label: t('publicListing.propertiesSoldCount'), icon: FiAward },
    { value: '98%', label: t('publicListing.happyClientsCount'), icon: FiStar },
    { value: '15+', label: t('publicListing.yearsExperienceCount'), icon: FiCheck },
    { value: '50+', label: t('publicListing.expertAgentsCount'), icon: FiUsers },
  ];

  return (
    <Box
      py={20}
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(10,15,30,0.8) 100%)',
      }}
    >
      <Container maxW="8xl">
        <Stack spacing={16}>
          {/* Features Section */}
          <Stack spacing={10}>
            {/* Section Header */}
            <Stack spacing={4} align="center" textAlign="center">
              <Badge
                style={{
                  background: 'rgba(212, 175, 55, 0.2)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  color: '#D4AF37',
                  fontWeight: '600',
                  fontSize: '13px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                {t('publicListing.whyChooseUs')}
              </Badge>
              <Heading
                as="h2"
                size="2xl"
                className="text-white"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
              >
                {t('publicListing.whyChooseUsHelp')}
              </Heading>
              <Text color="gray.300" fontSize="lg" maxW="700px">
                {t('publicListing.featuresDescription')}
              </Text>
            </Stack>

            {/* Feature Cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
              {features.map((feature, index) => (
                <Box
                  key={feature.titleKey || index}
                  className="group"
                  style={{
                    background: cardBg,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '32px',
                    padding: '40px',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  _hover={{
                    transform: 'translateY(-12px)',
                    borderColor: 'rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 30px 100px rgba(0,0,0,0.4), 0 0 60px rgba(212, 175, 55, 0.1)',
                  }}
                >
                  {/* Gradient Overlay on Hover */}
                  <Box
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(205, 127, 50, 0.05) 100%)',
                    }}
                  />
                  
                  <Stack spacing={6} position="relative" zIndex={1}>
                    {/* Icon */}
                    <Box
                      className="p-4 rounded-2xl inline-block"
                      style={{
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(205, 127, 50, 0.2) 100%)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        width: 'fit-content',
                        transition: 'all 0.4s ease',
                      }}
                      _groupHover={{
                        transform: 'scale(1.1) rotate(-5deg)',
                        boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      <Icon as={feature.icon} className="text-luxury-gold text-3xl" />
                    </Box>

                    {/* Content */}
                    <Box>
                      <Heading as="h3" size="lg" className="text-white mb-3">
                        {feature.title}
                      </Heading>
                      <Text color={mutedColor} lineHeight="relaxed">
                        {feature.description}
                      </Text>
                    </Box>

                    {/* Benefits */}
                    <Stack spacing={3}>
                      {feature.benefits.map((benefit, idx) => (
                        <HStack key={idx} spacing={3}>
                          <Box
                            className="rounded-full p-1"
                            style={{
                              background: 'rgba(212, 175, 55, 0.2)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                            }}
                          >
                            <FiCheck className="text-luxury-gold text-xs" />
                          </Box>
                          <Text color="gray.300" fontSize="sm" fontWeight="500">
                            {benefit}
                          </Text>
                        </HStack>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </SimpleGrid>
          </Stack>

          {/* Stats Section */}
          <Box
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(205, 127, 50, 0.05) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              padding: '60px 40px',
            }}
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-50%"
              right="-20%"
              w="600px"
              h="600px"
              style={{
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                filter: 'blur(100px)',
              }}
            />
            
            <Stack spacing={10} position="relative" zIndex={1}>
              {/* Section Header */}
              <Stack spacing={4} align="center" textAlign="center">
                <Heading as="h2" size="xl" className="text-white">
                  Trusted by{' '}
                  <Text
                    as="span"
                    className="text-gradient"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {t('publicListing.trustedByThousands')}
                  </Text>
                </Heading>
                <Text color="gray.300" fontSize="lg">
                  {t('publicListing.trackRecordSpeaks')}
                </Text>
              </Stack>

              {/* Stats Grid */}
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={8}>
                {stats.map((stat, index) => (
                  <Box
                    key={index}
                    textAlign="center"
                    className="group"
                    style={{
                      padding: '30px 20px',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease',
                    }}
                    _hover={{
                      background: 'rgba(255,255,255,0.05)',
                      transform: 'translateY(-4px)',
                    }}
                  >
                    <Flex justify="center" mb={4}>
                      <Box
                        className="p-3 rounded-xl"
                        style={{
                          background: 'rgba(212, 175, 55, 0.1)',
                          border: '1px solid rgba(212, 175, 55, 0.2)',
                          transition: 'all 0.3s ease',
                        }}
                        _groupHover={{
                          background: 'rgba(212, 175, 55, 0.2)',
                          borderColor: 'rgba(212, 175, 55, 0.4)',
                          transform: 'scale(1.1)',
                        }}
                      >
                        <Icon as={stat.icon} className="text-luxury-gold text-2xl" />
                      </Box>
                    </Flex>
                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      className="text-gradient"
                      style={{
                        background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7CE 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Text>
                    <Text color="gray.400" fontSize="sm" fontWeight="500" mt={2}>
                      {stat.label}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Stack>
          </Box>

          {/* CTA Section */}
          <Box
            textAlign="center"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(205, 127, 50, 0.1) 100%)',
              borderRadius: '32px',
              padding: '60px 40px',
              border: '1px solid rgba(212, 175, 55, 0.2)',
            }}
          >
            <Stack spacing={6} align="center">
              <Heading size="xl" className="text-white">
                {t('publicListing.readyToFindDream')}
              </Heading>
              <Text color="gray.300" fontSize="lg" maxW="600px">
                {t('publicListing.startJourneyToday')}
              </Text>
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  as={RouterLink}
                  to="/offers"
                  className="btn-luxury"
                  rightIcon={<MdArrowForward />}
                  size="lg"
                >
                  {t('publicListing.browseProperties')}
                </Button>
                <Button
                  as={RouterLink}
                  to="/auth/sign-up"
                  className="btn-luxury-outline"
                  size="lg"
                >
                  {t('publicListing.createAccountCta')}
                </Button>
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
