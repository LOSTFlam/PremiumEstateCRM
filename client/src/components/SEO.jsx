import { useEffect } from "react";

const resolveLocale = () => {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage?.getItem("i18nextLng");
  const fallback = stored || window.navigator?.language || "ru";
  return String(fallback).toLowerCase().startsWith("ru") ? "ru" : "en";
};

const seoDefaults = {
  ru: {
    title: "Премиальная недвижимость",
    description:
      "Подборка домов, квартир, участков и коммерческой недвижимости с удобным каталогом и прямой связью с агентом.",
    siteName: "Премиальная недвижимость",
    keywords:
      "недвижимость, премиальные объекты, дома, квартиры, участки, коммерческая недвижимость",
    author: "Премиальная недвижимость",
  },
  en: {
    title: "Premium Estate - Luxury Real Estate",
    description:
      "Discover exceptional properties with unparalleled service and expertise in the premium real estate market.",
    siteName: "Premium Estate",
    keywords:
      "real estate, luxury properties, premium homes, apartments, land, commercial property",
    author: "Premium Estate",
  },
};

const setMetaTag = (selector, attributes, content) => {
  if (typeof document === "undefined") return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const setLinkTag = (selector, attributes) => {
  if (typeof document === "undefined") return;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const setJsonLdScript = (schemaData) => {
  if (typeof document === "undefined") return;

  let script = document.head.querySelector(
    'script[type="application/ld+json"][data-seo="primary"]'
  );

  if (!script) {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("data-seo", "primary");
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schemaData);
};

/**
 * SEO component without react-helmet.
 * Keeps root metadata in sync without legacy side-effect lifecycles.
 */
const SEO = ({
  title,
  description,
  image = "/og-image.jpg",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  siteName,
}) => {
  const locale = resolveLocale();
  const defaults = seoDefaults[locale];
  const resolvedTitle = title || defaults.title;
  const resolvedDescription = description || defaults.description;
  const resolvedSiteName = siteName || defaults.siteName;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const resolvedImage = image.startsWith("http") ? image : `${origin}${image}`;
  const resolvedUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = resolvedTitle;
    document.documentElement.lang = locale;

    setMetaTag('meta[name="description"]', { name: "description" }, resolvedDescription);
    setMetaTag('meta[name="robots"]', { name: "robots" }, "index, follow");
    setMetaTag('meta[name="keywords"]', { name: "keywords" }, defaults.keywords);
    setMetaTag('meta[name="author"]', { name: "author" }, defaults.author);
    setMetaTag('meta[name="theme-color"]', { name: "theme-color" }, "#0F172A");

    setMetaTag('meta[property="og:type"]', { property: "og:type" }, type);
    setMetaTag('meta[property="og:url"]', { property: "og:url" }, resolvedUrl);
    setMetaTag('meta[property="og:title"]', { property: "og:title" }, resolvedTitle);
    setMetaTag(
      'meta[property="og:description"]',
      { property: "og:description" },
      resolvedDescription
    );
    setMetaTag('meta[property="og:image"]', { property: "og:image" }, resolvedImage);
    setMetaTag('meta[property="og:site_name"]', { property: "og:site_name" }, resolvedSiteName);

    setMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMetaTag('meta[name="twitter:url"]', { name: "twitter:url" }, resolvedUrl);
    setMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, resolvedTitle);
    setMetaTag(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      resolvedDescription
    );
    setMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, resolvedImage);

    setLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: resolvedUrl,
    });

    setJsonLdScript({
      "@context": "https://schema.org",
      "@type": type,
      name: resolvedTitle,
      description: resolvedDescription,
      image: resolvedImage,
      url: resolvedUrl,
      publisher: {
        "@type": "Organization",
        name: resolvedSiteName,
        logo: {
          "@type": "ImageObject",
          url: `${origin}/logo.png`,
        },
      },
    });
  }, [
    defaults.author,
    defaults.keywords,
    locale,
    origin,
    resolvedDescription,
    resolvedImage,
    resolvedSiteName,
    resolvedTitle,
    resolvedUrl,
    type,
  ]);

  return null;
};

export default SEO;
