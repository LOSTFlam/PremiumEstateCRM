import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PublicCatalogShell from "./PublicCatalogShell";
import SeoMeta from "./SeoMeta";
import { getSeoCollectionConfig } from "./seoCollections";

export default function SeoCollectionPage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const config = useMemo(() => getSeoCollectionConfig(slug, i18n.language), [i18n.language, slug]);

  if (!config) {
    return <PublicCatalogShell mode="catalog" />;
  }

  return (
    <>
      <SeoMeta
        title={config.title}
        description={config.description}
        keywords={[config.title, config.badge, slug].join(", ")}
        canonicalPath={`/collections/${slug}`}
      />
      <PublicCatalogShell mode="catalog" collectionSlug={slug}>
        {config?.faq?.length ? (
          <Container maxW="6xl" p={0}>
            <Box bg="white" borderRadius="28px" p={6} border="1px solid rgba(17,24,39,0.08)">
              <Heading size="md" mb={4}>
                FAQ
              </Heading>
              <Stack spacing={4}>
                {config.faq.map((item) => (
                  <Box key={item.q}>
                    <Text fontWeight="700">{item.q}</Text>
                    <Text mt={2} color="gray.500">
                      {item.a}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Container>
        ) : null}
      </PublicCatalogShell>
    </>
  );
}
