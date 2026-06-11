import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

export default function FaqPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const faqItems = t("publicPages.faq.items", { returnObjects: true }) || [];

  const filtered = useMemo(() => {
    if (!query.trim() || !Array.isArray(faqItems)) return faqItems;
    const fuse = new Fuse(faqItems, { keys: ["q", "a"], threshold: 0.35 });
    return fuse.search(query).map((result) => result.item);
  }, [faqItems, query]);

  return (
    <PublicPageShell
      title={t("publicPages.faq.title")}
      subtitle={t("publicPages.faq.subtitle")}
      badge={t("publicPages.faq.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.faq.title") },
      ]}
      seo={{
        title: t("publicPages.faq.title"),
        description: t("publicPages.faq.subtitle"),
        path: "/faq",
      }}
    >
      <Stack spacing={6} maxW="860px">
        <ScrollReveal>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color={publicBrand.colors.textSoft} />
            </InputLeftElement>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("publicPages.faq.searchPlaceholder")}
              borderRadius="full"
              bg="white"
              border="1px solid rgba(9,18,32,0.08)"
              pl={10}
            />
          </InputGroup>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <Box
            borderRadius="28px"
            overflow="hidden"
            bg="white"
            border="1px solid rgba(9,18,32,0.08)"
            boxShadow={publicBrand.shadows.soft}
          >
            {filtered?.length ? (
              <Accordion allowMultiple>
                {filtered.map((item, index) => (
                  <AccordionItem key={`${item.q}-${index}`} borderColor="rgba(9,18,32,0.06)">
                    <AccordionButton py={5} px={6} _hover={{ bg: "rgba(212,175,55,0.06)" }}>
                      <Box flex="1" textAlign="left" fontWeight="600">
                        {item.q}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel px={6} pb={5} color={publicBrand.colors.textSoft} lineHeight="1.8">
                      {item.a}
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Text p={8} color={publicBrand.colors.textSoft}>
                {t("publicPages.faq.empty")}
              </Text>
            )}
          </Box>
        </ScrollReveal>
      </Stack>
    </PublicPageShell>
  );
}
