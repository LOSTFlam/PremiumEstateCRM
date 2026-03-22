import React from 'react';
import { Box, Container, SimpleGrid, Stack, Text, Heading, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import GlassCard from './GlassCard';

const statsData = [
  { value: '15+', label: 'publicListing.yearsExperience', description: 'publicListing.yearsExperienceText' },
  { value: '5000+', label: 'publicListing.propertiesSold', description: 'publicListing.propertiesSoldText' },
  { value: '98%', label: 'publicListing.clientSatisfaction', description: 'publicListing.clientSatisfactionText' },
  { value: '24/7', label: 'publicListing.support', description: 'publicListing.supportText' },
];

export default function TrustedService() {
  const { t } = useTranslation();
  
  const sectionBg = useColorModeValue(
    'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(243, 236, 223, 0.6) 100%)',
    'linear-gradient(135deg, rgba(18, 55, 42, 0.3) 0%, rgba(0, 0, 0, 0.2) 100%)'
  );

  const statColor = useColorModeValue('teal.600', 'teal.400');
  const labelColor = useColorModeValue('gray.700', 'gray.200');
  const descColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box py={{ base: 20, md: 28 }} bg={sectionBg} position="relative">
      <Container maxW="7xl">
        <Stack spacing={12}>
          {/* Header */}
          <Stack spacing={4} align="center" textAlign="center">
            <Heading size="2xl" color={labelColor}>
              {t('publicListing.trustedService')}
            </Heading>
            <Text fontSize={{ base: 'lg', md: 'xl' }} color={descColor}>
              {t('publicListing.trustedServiceHelp')}
            </Text>
          </Stack>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {statsData.map((stat, index) => (
              <GlassCard key={stat.label || index} p={8} textAlign="center">
                <Stack spacing={3} align="center">
                  <Heading size="3xl" color={statColor} fontWeight="800">
                    {stat.value}
                  </Heading>
                  <Text fontWeight="600" color={labelColor} fontSize="lg">
                    {t(stat.label)}
                  </Text>
                  <Text color={descColor} fontSize="sm">
                    {t(stat.description)}
                  </Text>
                </Stack>
              </GlassCard>
            ))}
          </SimpleGrid>

          {/* Trust Features */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <GlassCard p={6}>
              <Stack spacing={3}>
                <Heading size="md" color={labelColor}>
                  {t('publicListing.transparent')}
                </Heading>
                <Text color={descColor}>
                  {t('publicListing.transparentText')}
                </Text>
              </Stack>
            </GlassCard>

            <GlassCard p={6}>
              <Stack spacing={3}>
                <Heading size="md" color={labelColor}>
                  {t('publicListing.secureTransactions')}
                </Heading>
                <Text color={descColor}>
                  {t('publicListing.secureTransactionsText')}
                </Text>
              </Stack>
            </GlassCard>

            <GlassCard p={6}>
              <Stack spacing={3}>
                <Heading size="md" color={labelColor}>
                  {t('publicListing.provenTrack')}
                </Heading>
                <Text color={descColor}>
                  {t('publicListing.provenTrackText')}
                </Text>
              </Stack>
            </GlassCard>
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
