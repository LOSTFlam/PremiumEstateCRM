import { Badge, Box, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PublicPageShell from "components/public/PublicPageShell";
import { getBlogPost } from "data/blogPosts";
import { publicBrand } from "views/public/publicBrand";

export default function BlogArticlePage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const post = getBlogPost(slug);

  if (!post) {
    return (
      <PublicPageShell
        title={t("publicPages.blog.notFound")}
        breadcrumbs={[
          { label: t("publicListing.homeNav"), href: "/" },
          { label: t("publicPages.blog.title"), href: "/blog" },
          { label: t("publicPages.blog.notFound") },
        ]}
      >
        <Text as={RouterLink} to="/blog" color={publicBrand.colors.copper}>
          {t("publicPages.blog.backToBlog")}
        </Text>
      </PublicPageShell>
    );
  }

  return (
    <PublicPageShell
      hero={false}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.blog.title"), href: "/blog" },
        { label: post.title[locale] },
      ]}
      seo={{
        title: post.title[locale],
        description: post.excerpt[locale],
        path: `/blog/${post.slug}`,
        type: "article",
        image: post.image,
      }}
    >
      <Stack spacing={8} maxW="820px">
        <Image
          src={post.image}
          alt={post.title[locale]}
          borderRadius="28px"
          h={{ base: "220px", md: "360px" }}
          w="100%"
          objectFit="cover"
          loading="lazy"
        />
        <Stack spacing={3}>
          <Badge w="fit-content">{post.category[locale]}</Badge>
          <Heading as="h1" size="2xl" fontFamily="heading">
            {post.title[locale]}
          </Heading>
          <Text color={publicBrand.colors.textSoft}>{post.date}</Text>
        </Stack>
        <Stack spacing={4}>
          {post.body[locale].map((paragraph) => (
            <Text key={paragraph} color={publicBrand.colors.textSoft} lineHeight="1.9" fontSize="lg">
              {paragraph}
            </Text>
          ))}
        </Stack>
      </Stack>
    </PublicPageShell>
  );
}
