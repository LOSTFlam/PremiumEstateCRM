import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import ScrollReveal from "components/public/ScrollReveal";
import { blogPosts } from "data/blogPosts";
import { publicBrand } from "views/public/publicBrand";

const PAGE_SIZE = 6;

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map((post) => post.category[locale]));
    return ["all", ...Array.from(set)];
  }, [locale]);

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = category === "all" || post.category[locale] === category;
      const haystack = `${post.title[locale]} ${post.excerpt[locale]}`.toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, locale, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PublicPageShell
      title={t("publicPages.blog.title")}
      subtitle={t("publicPages.blog.subtitle")}
      badge={t("publicPages.blog.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.blog.title") },
      ]}
      seo={{
        title: t("publicPages.blog.title"),
        description: t("publicPages.blog.subtitle"),
        path: "/blog",
      }}
    >
      <Stack spacing={8}>
        <HStack spacing={3} flexWrap="wrap">
          <InputGroup maxW="360px" flex={1}>
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={t("publicPages.blog.searchPlaceholder")}
              borderRadius="full"
              bg="white"
            />
          </InputGroup>
          <HStack spacing={2} flexWrap="wrap">
            {categories.map((item) => (
              <Button
                key={item}
                size="sm"
                borderRadius="full"
                variant={category === item ? "solid" : "outline"}
                bg={category === item ? publicBrand.colors.ink : "white"}
                color={category === item ? "white" : publicBrand.colors.ink}
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
              >
                {item === "all" ? t("publicPages.blog.allCategories") : item}
              </Button>
            ))}
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={5}>
          {paginated.map((post, index) => (
            <ScrollReveal key={post.slug} delay={index * 0.06}>
              <Box
                as={RouterLink}
                to={`/blog/${post.slug}`}
                borderRadius="28px"
                overflow="hidden"
                bg="white"
                border="1px solid rgba(9,18,32,0.08)"
                boxShadow={publicBrand.shadows.soft}
                transition="transform 0.3s ease"
                _hover={{ transform: "translateY(-4px)" }}
                display="block"
              >
                <Image src={post.image} alt={post.title[locale]} h="200px" w="100%" objectFit="cover" loading="lazy" />
                <Stack p={5} spacing={3}>
                  <Badge w="fit-content" colorScheme="yellow">
                    {post.category[locale]}
                  </Badge>
                  <Heading size="md" fontFamily="heading" noOfLines={2}>
                    {post.title[locale]}
                  </Heading>
                  <Text color={publicBrand.colors.textSoft} noOfLines={3} lineHeight="1.7">
                    {post.excerpt[locale]}
                  </Text>
                  <Text fontSize="sm" color={publicBrand.colors.textSoft}>
                    {post.date}
                  </Text>
                </Stack>
              </Box>
            </ScrollReveal>
          ))}
        </SimpleGrid>

        {totalPages > 1 ? (
          <HStack justify="center" spacing={2}>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                size="sm"
                borderRadius="full"
                bg={page === pageNumber ? publicBrand.colors.ink : "white"}
                color={page === pageNumber ? "white" : publicBrand.colors.ink}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </Button>
            ))}
          </HStack>
        ) : null}
      </Stack>
    </PublicPageShell>
  );
}
