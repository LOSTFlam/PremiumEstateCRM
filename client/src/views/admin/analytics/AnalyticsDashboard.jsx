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
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiEye,
  FiHome,
  FiDownload,
} from "react-icons/fi";
import { MdCompareArrows, MdFavorite } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GlassCard from "components/GlassCard";

const AnalyticsDashboard = () => {
  const { i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");
  const copy = {
    title: isRu ? "Аналитика" : "Analytics Dashboard",
    description: isRu
      ? "Отслеживайте эффективность объектов и вовлеченность клиентов"
      : "Track your property performance and user engagement",
    export: isRu ? "Экспорт" : "Export",
    last7Days: isRu ? "Последние 7 дней" : "Last 7 days",
    last30Days: isRu ? "Последние 30 дней" : "Last 30 days",
    last90Days: isRu ? "Последние 90 дней" : "Last 90 days",
    lastYear: isRu ? "Последний год" : "Last year",
    totalViews: isRu ? "Всего просмотров" : "Total Views",
    totalLeads: isRu ? "Всего лидов" : "Total Leads",
    favorites: isRu ? "Избранное" : "Favorites",
    comparisons: isRu ? "Сравнения" : "Comparisons",
    conversionRate: isRu ? "Конверсия" : "Conversion Rate",
    properties: isRu ? "Объекты" : "Properties",
    viewsByType: isRu ? "Просмотры по типам" : "Views by Property Type",
    recentActivity: isRu ? "Последняя активность" : "Recent Activity",
    popularProperties: isRu ? "Популярные объекты" : "Popular Properties",
    propertyName: isRu ? "Название объекта" : "Property Name",
    views: isRu ? "Просмотры" : "Views",
    leads: isRu ? "Лиды" : "Leads",
    conversion: isRu ? "Конверсия" : "Conversion",
    view: isRu ? "Просмотр" : "View",
    lead: isRu ? "Лид" : "Lead",
    favorite: isRu ? "Избранное" : "Favorite",
    compare: isRu ? "Сравнение" : "Compare",
  };
  const [timeRange, setTimeRange] = useState("30d");
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
      // Mock data - replace with actual API call
      const mockData = {
        totalViews: 15420,
        totalLeads: 342,
        totalFavorites: 1250,
        totalComparisons: 480,
        conversionRate: 2.2,
        popularProperties: [
          { id: 1, name: isRu ? "Роскошная вилла" : "Luxury Villa", views: 2340, leads: 45 },
          { id: 2, name: isRu ? "Современные апартаменты" : "Modern Apartment", views: 1890, leads: 38 },
          { id: 3, name: isRu ? "Дом у побережья" : "Beach House", views: 1560, leads: 32 },
          { id: 4, name: isRu ? "Городской пентхаус" : "City Penthouse", views: 1420, leads: 28 },
          { id: 5, name: isRu ? "Загородная усадьба" : "Country Estate", views: 1280, leads: 25 },
        ],
        viewsByType: {
          houses: 45,
          apartments: 30,
          plots: 15,
          commercial: 10,
        },
        recentActivity: [
          { type: "view", property: isRu ? "Роскошная вилла" : "Luxury Villa", time: isRu ? "2 мин назад" : "2 min ago" },
          { type: "lead", property: isRu ? "Современные апартаменты" : "Modern Apartment", time: isRu ? "5 мин назад" : "5 min ago" },
          { type: "favorite", property: isRu ? "Дом у побережья" : "Beach House", time: isRu ? "10 мин назад" : "10 min ago" },
          { type: "compare", property: isRu ? "Городской пентхаус" : "City Penthouse", time: isRu ? "15 мин назад" : "15 min ago" },
        ],
      };
      setAnalytics(mockData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
    }
  };

  const statCards = [
    {
      title: copy.totalViews,
      value: analytics.totalViews.toLocaleString(),
      change: "+12.5%",
      isPositive: true,
      icon: FiEye,
      color: "#F5D076",
    },
    {
      title: copy.totalLeads,
      value: analytics.totalLeads.toLocaleString(),
      change: "+8.3%",
      isPositive: true,
      icon: FiUsers,
      color: "#48BB78",
    },
    {
      title: copy.favorites,
      value: analytics.totalFavorites.toLocaleString(),
      change: "+15.2%",
      isPositive: true,
      icon: MdFavorite,
      color: "#F56565",
    },
    {
      title: copy.comparisons,
      value: analytics.totalComparisons.toLocaleString(),
      change: "+5.7%",
      isPositive: true,
      icon: MdCompareArrows,
      color: "#4299E1",
    },
    {
      title: copy.conversionRate,
      value: `${analytics.conversionRate}%`,
      change: "+0.3%",
      isPositive: true,
      icon: FiTrendingUp,
      color: "#9F7AEA",
    },
    {
      title: copy.properties,
      value: "248",
      change: "+12",
      isPositive: true,
      icon: FiHome,
      color: "#ED8936",
    },
  ];

  return (
    <Container maxW="8xl" py={8}>
      <Stack spacing={8}>
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack spacing={1}>
            <Heading size="xl">{copy.title}</Heading>
            <Text color="gray.500">{copy.description}</Text>
          </Stack>
          <HStack spacing={3}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              maxW="150px"
              borderRadius="12px"
            >
              <option value="7d">{copy.last7Days}</option>
              <option value="30d">{copy.last30Days}</option>
              <option value="90d">{copy.last90Days}</option>
              <option value="1y">{copy.lastYear}</option>
            </Select>
            <Button
              leftIcon={<FiDownload />}
              variant="outline"
              borderRadius="12px"
              onClick={() => window.print()}
            >
              {copy.export}
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
              <Heading size="md">{copy.viewsByType}</Heading>
              <Stack spacing={3}>
                {Object.entries(analytics.viewsByType).map(([type, percentage]) => (
                  <Stack key={type} spacing={2}>
                    <HStack justify="space-between">
                      <Text textTransform="capitalize" fontWeight="500">
                        {isRu
                          ? {
                              houses: "Дома",
                              apartments: "Квартиры",
                              plots: "Участки",
                              commercial: "Коммерция",
                            }[type] || type
                          : type}
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
              <Heading size="md">{copy.recentActivity}</Heading>
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
                        {copy[activity.type] || activity.type}
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
            <Heading size="md">{copy.popularProperties}</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>{copy.propertyName}</Th>
                  <Th isNumeric>{copy.views}</Th>
                  <Th isNumeric>{copy.leads}</Th>
                  <Th isNumeric>{copy.conversion}</Th>
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
                        bg={index === 0 ? "yellow.100" : index === 1 ? "gray.100" : index === 2 ? "orange.100" : "transparent"}
                        color={index === 0 ? "yellow.600" : index === 1 ? "gray.600" : index === 2 ? "orange.600" : "gray.400"}
                      >
                        {index + 1}
                      </Badge>
                    </Td>
                    <Td fontWeight="600">{property.name}</Td>
                    <Td isNumeric>{property.views.toLocaleString()}</Td>
                    <Td isNumeric>{property.leads.toLocaleString()}</Td>
                    <Td isNumeric>
                      <Badge colorScheme="green">{((property.leads / property.views) * 100).toFixed(1)}%</Badge>
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
