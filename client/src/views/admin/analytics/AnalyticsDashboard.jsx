import { useState, useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  HStack,
  Text,
  Heading,
  Icon,
  Badge,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiEye,
  FiDollarSign as _FiDollarSign,
  FiHome,
  FiCalendar as _FiCalendar,
  FiDownload,
} from "react-icons/fi";
import { MdCompareArrows, MdFavorite } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { publicBrand as _publicBrand } from "views/public/publicBrand";
import { getApi as _getApi } from "services/api";
import GlassCard from "components/GlassCard";

const AnalyticsDashboard = () => {
  const { t: _t } = useTranslation();
  const [timeRange, setTimeRange] = useState("30d");
  const [_loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalLeads: 0,
    totalFavorites: 0,
    totalComparisons: 0,
    conversionRate: 0,
    popularProperties: [],
    viewsByType: {},
    recentActivity: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        totalViews: 15420,
        totalLeads: 342,
        totalFavorites: 1250,
        totalComparisons: 480,
        conversionRate: 2.2,
        popularProperties: [
          { id: 1, name: "Luxury Villa", views: 2340, leads: 45 },
          { id: 2, name: "Modern Apartment", views: 1890, leads: 38 },
          { id: 3, name: "Beach House", views: 1560, leads: 32 },
          { id: 4, name: "City Penthouse", views: 1420, leads: 28 },
          { id: 5, name: "Country Estate", views: 1280, leads: 25 },
        ],

        viewsByType: {
          houses: 45,
          apartments: 30,
          plots: 15,
          commercial: 10,
        },
        recentActivity: [
          { type: "view", property: "Luxury Villa", time: "2 min ago" },
          { type: "lead", property: "Modern Apartment", time: "5 min ago" },
          { type: "favorite", property: "Beach House", time: "10 min ago" },
          { type: "compare", property: "City Penthouse", time: "15 min ago" },
        ],
      };
      setAnalytics(mockData);
    } catch (error) {
      // Console statement removed
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Views",
      value: analytics.totalViews.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      icon: FiEye,
      color: "#F5D076",
    },
    {
      title: "Total Leads",
      value: analytics.totalLeads.toLocaleString(),
      change: "+8.3%",
      isPositive: true,
      icon: FiUsers,
      color: "#48BB78",
    },
    {
      title: "Favorites",
      value: analytics.totalFavorites.toLocaleString(),
      change: "+15.2%",
      isPositive: true,
      icon: MdFavorite,
      color: "#F56565",
    },
    {
      title: "Comparisons",
      value: analytics.totalComparisons.toLocaleString(),
      change: "+5.7%",
      isPositive: true,
      icon: MdCompareArrows,
      color: "#4299E1",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.conversionRate}%`,
      change: "+0.3%",
      isPositive: true,
      icon: FiTrendingUp,
      color: "#9F7AEA",
    },
    {
      title: "Properties",
      value: "248",
      change: "+12",
      isPositive: true,
      icon: FiHome,
      color: "#ED8936",
    },
  ];

  const _bgColor = useColorModeValue("gray.50", "gray.900");
  const _cardBg = useColorModeValue("white", "gray.800");

  return (
    <Container maxW="8xl" py={8}>
      <Stack spacing={8}>
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack spacing={1}>
            <Heading size="xl">Analytics Dashboard</Heading>
            <Text color="gray.500">Track your property performance and user engagement</Text>
          </Stack>
          <HStack spacing={3}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              maxW="150px"
              borderRadius="12px"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </Select>
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              borderRadius="12px"
              onClick={() => window.print()}
            >
              Export
            </Button>
          </HStack>
        </HStack>

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {statCards.map((stat, index) => (
            <GlassCard key={index} p={6} borderRadius="20px">
              <Stack spacing={4}>
                <HStack justify="space-between">
                  <Box
                    w={12}
                    h={12}
                    borderRadius="14px"
                    bg={`${stat.color}20`}
                    display="grid"
                    placeItems="center"
                    color={stat.color}
                  >
                    <Icon as={stat.icon} boxSize={6} />
                  </Box>
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg={stat.isPositive ? "green.100" : "red.100"}
                    color={stat.isPositive ? "green.600" : "red.600"}
                    fontSize="xs"
                    fontWeight="600"
                  >
                    <HStack spacing={1}>
                      <Icon as={stat.isPositive ? FiTrendingUp : FiTrendingDown} boxSize={3} />
                      <Text>{stat.change}</Text>
                    </HStack>
                  </Badge>
                </HStack>
                <Stack spacing={1}>
                  <Text color="gray.500" fontSize="sm" fontWeight="500">
                    {stat.title}
                  </Text>
                  <Heading size="2xl" color={stat.color}>
                    {stat.value}
                  </Heading>
                </Stack>
              </Stack>
            </GlassCard>
          ))}
        </SimpleGrid>

        {/* Charts Row */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Views by Property Type */}
          <GlassCard p={6} borderRadius="20px">
            <Stack spacing={4}>
              <Heading size="md">Views by Property Type</Heading>
              <Stack spacing={3}>
                {Object.entries(analytics.viewsByType).map(([type, percentage]) => (
                  <Stack key={type} spacing={2}>
                    <HStack justify="space-between">
                      <Text textTransform="capitalize" fontWeight="500">
                        {type}
                      </Text>
                      <Text fontWeight="600">{percentage}%</Text>
                    </HStack>
                    <Progress
                      value={percentage}
                      size="sm"
                      borderRadius="full"
                      colorScheme="green"
                      bg="gray.100"
                    />
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard p={6} borderRadius="20px">
            <Stack spacing={4}>
              <Heading size="md">Recent Activity</Heading>
              <Stack spacing={3}>
                {analytics.recentActivity.map((activity, index) => (
                  <HStack key={index} spacing={3}>
                    <Box
                      w={10}
                      h={10}
                      borderRadius="12px"
                      bg={
                        activity.type === "view"
                          ? "blue.100"
                          : activity.type === "lead"
                            ? "green.100"
                            : activity.type === "favorite"
                              ? "red.100"
                              : "purple.100"
                      }
                      display="grid"
                      placeItems="center"
                      color={
                        activity.type === "view"
                          ? "blue.600"
                          : activity.type === "lead"
                            ? "green.600"
                            : activity.type === "favorite"
                              ? "red.600"
                              : "purple.600"
                      }
                    >
                      <Icon
                        as={
                          activity.type === "view"
                            ? FiEye
                            : activity.type === "lead"
                              ? FiUsers
                              : activity.type === "favorite"
                                ? MdFavorite
                                : MdCompareArrows
                        }
                        boxSize={5}
                      />
                    </Box>
                    <Stack spacing={0} flex={1}>
                      <Text fontWeight="600" fontSize="sm">
                        {activity.property}
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </Text>
                    </Stack>
                    <Text color="gray.400" fontSize="xs">
                      {activity.time}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Stack>
          </GlassCard>
        </SimpleGrid>

        {/* Popular Properties Table */}
        <GlassCard p={6} borderRadius="20px">
          <Stack spacing={4}>
            <Heading size="md">Popular Properties</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Property Name</Th>
                  <Th isNumeric>Views</Th>
                  <Th isNumeric>Leads</Th>
                  <Th isNumeric>Conversion</Th>
                </Tr>
              </Thead>
              <Tbody>
                {analytics.popularProperties.map((property, index) => (
                  <Tr key={property.id}>
                    <Td>
                      <Badge
                        px={2}
                        py={1}
                        borderRadius="full"
                        bg={
                          index === 0
                            ? "yellow.100"
                            : index === 1
                              ? "gray.100"
                              : index === 2
                                ? "orange.100"
                                : "transparent"
                        }
                        color={
                          index === 0
                            ? "yellow.600"
                            : index === 1
                              ? "gray.600"
                              : index === 2
                                ? "orange.600"
                                : "gray.400"
                        }
                      >
                        {index + 1}
                      </Badge>
                    </Td>
                    <Td fontWeight="600">{property.name}</Td>
                    <Td isNumeric>{property.views.toLocaleString()}</Td>
                    <Td isNumeric>{property.leads.toLocaleString()}</Td>
                    <Td isNumeric>
                      <Badge colorScheme="green">
                        {((property.leads / property.views) * 100).toFixed(1)}%
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Stack>
        </GlassCard>
      </Stack>
    </Container>
  );
};

export default AnalyticsDashboard;
