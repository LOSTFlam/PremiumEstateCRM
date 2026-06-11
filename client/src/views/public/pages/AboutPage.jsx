import { Box, Heading, SimpleGrid, Stack, Text, Image } from "@chakra-ui/react";
import CountUp from "react-countup";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

const panelProps = {
  borderRadius: "28px",
  px: { base: 5, md: 7 },
  py: { base: 6, md: 8 },
  bg: "white",
  border: "1px solid rgba(9,18,32,0.08)",
  boxShadow: publicBrand.shadows.soft,
};

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";

  const stats = [
    { value: 12, suffix: "+", label: t("publicPages.stats.years") },
    { value: 850, suffix: "+", label: t("publicPages.stats.deals") },
    { value: 42, suffix: "", label: t("publicPages.stats.agents") },
    { value: 98, suffix: "%", label: t("publicPages.stats.satisfaction") },
  ];

  const team = [
    {
      name: locale === "ru" ? "Анна Волкова" : "Anna Volkova",
      role: locale === "ru" ? "Управляющий партнёр" : "Managing Partner",
      bio: locale === "ru"
        ? "15 лет в премиальном сегменте Москвы и Подмосковья."
        : "15 years in Moscow and region premium segment.",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    },
    {
      name: locale === "ru" ? "Дмитрий Орлов" : "Dmitry Orlov",
      role: locale === "ru" ? "Директор по инвестициям" : "Investment Director",
      bio: locale === "ru"
        ? "Специализируется на off-market сделках и портфельных покупках."
        : "Specializes in off-market deals and portfolio acquisitions.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    },
    {
      name: locale === "ru" ? "Елена Морозова" : "Elena Morozova",
      role: locale === "ru" ? "Руководитель клиентского сервиса" : "Client Experience Lead",
      bio: locale === "ru"
        ? "Курирует частные показы и сопровождение международных клиентов."
        : "Leads private viewings and international client journeys.",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    },
  ];

  const values = [
    { title: t("publicPages.values.discretion"), text: t("publicPages.values.discretionText") },
    { title: t("publicPages.values.expertise"), text: t("publicPages.values.expertiseText") },
    { title: t("publicPages.values.integrity"), text: t("publicPages.values.integrityText") },
  ];

  return (
    <PublicPageShell
      title={t("publicPages.about.title")}
      subtitle={t("publicPages.about.subtitle")}
      badge={t("publicPages.about.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.about.title") },
      ]}
      seo={{
        title: t("publicPages.about.title"),
        description: t("publicPages.about.subtitle"),
        path: "/about",
      }}
    >
      <Stack spacing={{ base: 10, md: 14 }}>
        <ScrollReveal>
          <Box {...panelProps}>
            <Heading size="lg" mb={4} fontFamily="heading">
              {t("publicPages.about.missionTitle")}
            </Heading>
            <Text color={publicBrand.colors.textSoft} lineHeight="1.9" fontSize="lg">
              {t("publicPages.about.missionText")}
            </Text>
          </Box>
        </ScrollReveal>

        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <Box {...panelProps} textAlign="center">
                <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color={publicBrand.colors.ink}>
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
                </Text>
                <Text mt={2} fontSize="sm" color={publicBrand.colors.textSoft}>
                  {stat.label}
                </Text>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>

        <Stack spacing={6}>
          <Heading size="lg" fontFamily="heading">
            {t("publicPages.about.teamTitle")}
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            {team.map((member, index) => (
              <ScrollReveal key={member.name} delay={index * 0.1}>
                <Box {...panelProps}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    borderRadius="20px"
                    h="220px"
                    w="100%"
                    objectFit="cover"
                    loading="lazy"
                    mb={4}
                  />
                  <Heading size="md">{member.name}</Heading>
                  <Text color={publicBrand.colors.copper} fontSize="sm" mt={1}>
                    {member.role}
                  </Text>
                  <Text mt={3} color={publicBrand.colors.textSoft} lineHeight="1.7">
                    {member.bio}
                  </Text>
                </Box>
              </ScrollReveal>
            ))}
          </SimpleGrid>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          {values.map((value, index) => (
            <ScrollReveal key={value.title} delay={index * 0.08}>
              <Box {...panelProps}>
                <Heading size="md" mb={3}>
                  {value.title}
                </Heading>
                <Text color={publicBrand.colors.textSoft} lineHeight="1.8">
                  {value.text}
                </Text>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>
      </Stack>
    </PublicPageShell>
  );
}
