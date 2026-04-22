import { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FiArrowRight, FiCheck, FiShield } from "react-icons/fi";
import { LuBuilding2, LuKeyRound, LuSparkles, LuTrees } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { publicBrand } from "views/public/publicBrand";
import { normalizePropertyTypeKey } from "views/public/catalog/catalogData";
import { useScrollReveal } from "hooks/useScrollReveal";

const pillarCopy = {
  ru: [
    {
      icon: LuSparkles,
      title: "Кураторский отбор",
      text: "Каждая карточка собирается так, чтобы покупатель сразу видел суть предложения, уровень подачи и путь к показу.",
      points: ["Сильная визуальная подача", "Структурированные данные", "Проверяемая информация"],
    },
    {
      icon: LuKeyRound,
      title: "Спокойный сервис",
      text: "От первого просмотра до сделки коммуникация остается точной, быстрой и личной, без лишнего маркетингового шума.",
      points: ["Частный брокеридж", "Быстрые ответы", "Сопровождение на всем пути"],
    },
    {
      icon: FiShield,
      title: "Решения с доверием",
      text: "Покупатель получает не просто подборку, а рабочий инструмент для отбора, сравнения и выхода на объект.",
      points: ["Избранное и сравнение", "Сохраненные поиски", "Прямая связь с консультантом"],
    },
  ],

  en: [
    {
      icon: LuSparkles,
      title: "Curated selection",
      text: "Each offer is presented so the buyer immediately understands the proposition, the quality of the listing, and the route to viewing.",
      points: [
        "Stronger visual presentation",
        "Structured property data",
        "Clear verification cues",
      ],
    },
    {
      icon: LuKeyRound,
      title: "Calm private service",
      text: "From first browse to closing, communication stays precise, quick, and personal rather than noisy or transactional.",
      points: ["Private brokerage", "Faster responses", "Guided journey to the deal"],
    },
    {
      icon: FiShield,
      title: "Confidence in decisions",
      text: "The platform is not only a gallery, but a working buyer tool for shortlist building, comparison, and direct inquiry.",
      points: ["Favorites and compare", "Saved searches", "Direct consultant outreach"],
    },
  ],
};

export default function ModernFeatures({ properties = [], t }) {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const pillars = pillarCopy[locale];

  // Scroll reveal refs
  const [titleRef, titleRevealed] = useScrollReveal({ threshold: 0.2 });
  const [pillarsRef, pillarsRevealed] = useScrollReveal({ threshold: 0.1, delay: 200 });
  const [approachRef, _approachRevealed] = useScrollReveal({ threshold: 0.2, delay: 400 });
  const [statsRef, statsRevealed] = useScrollReveal({ threshold: 0.2, delay: 600 });

  const typeStats = useMemo(() => {
    const counts = properties.reduce((acc, property) => {
      const key = normalizePropertyTypeKey(property?.propertyType);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return [
      {
        key: "house",
        label: t("publicListing.categoryHouses"),
        value: counts.house || 0,
        icon: LuBuilding2,
      },
      {
        key: "apartment",
        label: t("publicListing.categoryApartments"),
        value: counts.apartment || 0,
        icon: LuBuilding2,
      },
      {
        key: "land",
        label: t("publicListing.categoryPlots"),
        value: counts.land || 0,
        icon: LuTrees,
      },
    ];
  }, [properties, t]);

  return (
    <Box
      py={{ base: 16, md: 20 }}
      bg="linear-gradient(180deg, rgba(7,12,20,0.24) 0%, rgba(10,16,25,0.02) 100%)"
    >
      <Container maxW="8xl">
        <Stack spacing={12}>
          <Grid templateColumns={{ base: "1fr", xl: "0.95fr 1.05fr" }} gap={8} alignItems="start">
            <GridItem>
              <Stack
                spacing={5}
                maxW="620px"
                ref={titleRef}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: titleRevealed ? 1 : 0,
                  transform: titleRevealed ? "translateY(0)" : "translateY(40px)",
                }}
              >
                <Badge
                  w="fit-content"
                  px={4}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(245,208,118,0.14)"
                  border="1px solid rgba(245,208,118,0.24)"
                  color="#f5d076"
                  letterSpacing="0.14em"
                  textTransform="uppercase"
                >
                  {t("publicListing.whyChooseUs")}
                </Badge>
                <Heading
                  as="h2"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  lineHeight={{ base: "1.08", md: "1.02" }}
                  letterSpacing="-0.04em"
                  color="white"
                >
                  {locale === "ru"
                    ? "Сайт больше не выглядит как шаблон. Он ведет покупателя через атмосферу, факты и действие."
                    : "The experience no longer reads like a template. It guides buyers through atmosphere, facts, and action."}
                </Heading>
                <Text color="whiteAlpha.760" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9">
                  {locale === "ru"
                    ? "Мы сместили акцент со случайных карточек и служебных блоков на более взрослую недвижимостную подачу: сильный визуал, кураторская структура, инструменты выбора и мягкий переход к личной консультации."
                    : "The focus shifts from utility blocks and generic cards toward a more mature real-estate presentation: stronger visuals, editorial structure, buyer tools, and a softer path into private consultation."}
                </Text>
                <HStack spacing={3} flexWrap="wrap">
                  <Button
                    as={RouterLink}
                    to="/offers"
                    rightIcon={<FiArrowRight />}
                    borderRadius="full"
                    bg={publicBrand.gradients.brass}
                    color={publicBrand.colors.ink}
                    fontWeight="700"
                    _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
                  >
                    {t("publicListing.viewAllProperties")}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/favorites"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.05)"
                    color="white"
                    border="1px solid rgba(227, 211, 184, 0.14)"
                    _hover={{ bg: "rgba(255,255,255,0.08)" }}
                  >
                    {t("publicListing.savedOffers")}
                  </Button>
                </HStack>
              </Stack>
            </GridItem>

            <GridItem>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={5}
                ref={pillarsRef}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: pillarsRevealed ? 1 : 0,
                  transform: pillarsRevealed ? "translateY(0)" : "translateY(40px)",
                }}
              >
                {pillars.map((pillar, idx) => (
                  <Box
                    key={pillar.title}
                    className={`hover-lift stagger-${idx}`}
                    style={{
                      transition:
                        "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    _hover={{
                      transform: "translateY(-10px)",
                      boxShadow:
                        "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 30px rgba(212, 175, 55, 0.15)",
                    }}
                  >
                    <Stack spacing={5}>
                      <Box
                        w="54px"
                        h="54px"
                        borderRadius="20px"
                        display="grid"
                        placeItems="center"
                        bg="rgba(245,208,118,0.12)"
                        color="#f5d076"
                      >
                        <Icon as={pillar.icon} boxSize={5} />
                      </Box>
                      <Stack spacing={2.5}>
                        <Heading size="md" color="white">
                          {pillar.title}
                        </Heading>
                        <Text color="whiteAlpha.760" lineHeight="1.8" fontSize="sm">
                          {pillar.text}
                        </Text>
                      </Stack>
                      <Stack spacing={3}>
                        {pillar.points.map((point) => (
                          <HStack key={point} align="start" spacing={3}>
                            <Box
                              mt={1}
                              w="22px"
                              h="22px"
                              borderRadius="full"
                              display="grid"
                              placeItems="center"
                              bg="rgba(245,208,118,0.12)"
                              color="#f5d076"
                            >
                              <FiCheck size={12} />
                            </Box>
                            <Text color="whiteAlpha.820" fontSize="sm" lineHeight="1.7">
                              {point}
                            </Text>
                          </HStack>
                        ))}
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ base: "1fr", xl: "1.1fr 0.9fr" }} gap={6}>
            <GridItem>
              <Box
                className="hover-lift"
                style={{
                  transition:
                    "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                _hover={{
                  transform: "translateY(-8px)",
                  boxShadow: "0 25px 70px rgba(0, 0, 0, 0.2)",
                }}
                ref={approachRef}
                borderRadius="38px"
                px={{ base: 6, md: 8 }}
                py={{ base: 7, md: 8 }}
                bg={publicBrand.gradients.panelLight}
                boxShadow={publicBrand.shadows.soft}
                border="1px solid rgba(9,18,32,0.08)"
              >
                <Stack spacing={5}>
                  <Text
                    color={publicBrand.colors.copper}
                    fontSize="xs"
                    letterSpacing="0.16em"
                    textTransform="uppercase"
                  >
                    {locale === "ru" ? "Подход к витрине" : "Storefront approach"}
                  </Text>
                  <Heading
                    color={publicBrand.colors.ink}
                    fontSize={{ base: "2xl", md: "4xl" }}
                    lineHeight="1.05"
                  >
                    {locale === "ru"
                      ? "Мы строим не просто каталог, а ощущение частной резиденции еще до первого звонка."
                      : "We build not only a catalog, but the feeling of a private residence before the first call."}
                  </Heading>
                  <Text
                    color={publicBrand.colors.textSoft}
                    fontSize={{ base: "md", md: "lg" }}
                    lineHeight="1.8"
                  >
                    {locale === "ru"
                      ? "Первый экран, карточки, сравнение и страницы объектов работают как одна история: вдохновить, дать уверенность, помочь выбрать и аккуратно подтолкнуть к действию."
                      : "Hero, cards, comparison, and detail pages now work as one story: inspire, build confidence, support decisions, and gently move toward action."}
                  </Text>
                </Stack>
              </Box>
            </GridItem>

            <GridItem>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={4}
                ref={statsRef}
                style={{
                  transition:
                    "opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: statsRevealed ? 1 : 0,
                  transform: statsRevealed ? "translateY(0)" : "translateY(40px)",
                }}
              >
                {typeStats.map((stat, idx) => (
                  <Box
                    key={stat.key}
                    className={`hover-lift stagger-${idx}`}
                    style={{
                      transition:
                        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    _hover={{
                      transform: "translateY(-8px)",
                      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(212, 175, 55, 0.1)",
                    }}
                  >
                    <Stack spacing={3}>
                      <Box
                        w="48px"
                        h="48px"
                        borderRadius="18px"
                        display="grid"
                        placeItems="center"
                        bg="rgba(245,208,118,0.12)"
                        color="#f5d076"
                      >
                        <Icon as={stat.icon} boxSize={5} />
                      </Box>
                      <Text
                        color="whiteAlpha.620"
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.14em"
                      >
                        {stat.label}
                      </Text>
                      <Text color="white" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700">
                        {stat.value}
                      </Text>
                    </Stack>
                  </Box>
                ))}
              </SimpleGrid>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
