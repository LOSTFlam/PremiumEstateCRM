import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import ModernHeader from "components/ModernHeader";
import ModernFooter from "components/ModernFooter";
import Breadcrumbs from "components/public/Breadcrumbs";
import PublicSeoMeta from "components/public/PublicSeoMeta";
import ScrollToTopButton from "components/public/ScrollToTopButton";
import MobileBottomNav from "components/public/MobileBottomNav";
import { publicBrand } from "views/public/publicBrand";

export default function PublicPageShell({
  children,
  title,
  subtitle,
  badge,
  breadcrumbs = [],
  seo = {},
  hero = true,
}) {
  return (
    <Box minH="100vh" bg={publicBrand.gradients.pageLight} color={publicBrand.colors.ink}>
      <PublicSeoMeta {...seo} />
      <ModernHeader />
      <Box as="main" pt={{ base: "96px", md: "108px" }} pb={{ base: 28, md: 12 }}>
        <Container maxW="8xl" px={{ base: 4, md: 6, xl: 8 }}>
          {breadcrumbs.length ? (
            <Box mb={6}>
              <Breadcrumbs items={breadcrumbs} />
            </Box>
          ) : null}

          {hero && title ? (
            <Stack spacing={4} mb={{ base: 10, md: 14 }} maxW="840px">
              {badge ? (
                <Text
                  fontSize="xs"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  color={publicBrand.colors.copper}
                  fontWeight="600"
                >
                  {badge}
                </Text>
              ) : null}
              <Heading
                as="h1"
                fontSize={{ base: "3xl", md: "5xl" }}
                fontFamily="heading"
                lineHeight="1.1"
                color={publicBrand.colors.ink}
              >
                {title}
              </Heading>
              {subtitle ? (
                <Text fontSize={{ base: "md", md: "lg" }} color={publicBrand.colors.textSoft} lineHeight="1.8">
                  {subtitle}
                </Text>
              ) : null}
            </Stack>
          ) : null}

          {children}
        </Container>
      </Box>
      <ModernFooter />
      <ScrollToTopButton />
      <MobileBottomNav />
    </Box>
  );
}
