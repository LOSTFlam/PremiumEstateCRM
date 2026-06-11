import { Helmet } from "react-helmet";

const SITE_NAME = "Premium Estate";

export default function PublicSeoMeta({
  title,
  description,
  path = "",
  type = "website",
  image = "/og-default.jpg",
  jsonLd,
}) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const url = `${origin}${path}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={pageTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image.startsWith("http") ? image : `${origin}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Helmet>
  );
}
