import React, { useEffect, useMemo } from "react";

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

const upsertHeadTag = (selector, tagName, attributes) => {
  if (typeof document === "undefined") return null;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      element.setAttribute(key, value);
    }
  });

  return element;
};

/**
 * SEO Component for consistent meta tags across the application
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.image - OG image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, article, etc.)
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
  const resolvedUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");

  const schemaData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": type,
      name: resolvedTitle,
      description: resolvedDescription,
      image,
      url: resolvedUrl,
      publisher: {
        "@type": "Organization",
        name: resolvedSiteName,
        logo: {
          "@type": "ImageObject",
          url: `${typeof window !== "undefined" ? window.location.origin : ""}/logo.png`,
        },
      },
    }),
    [image, resolvedDescription, resolvedSiteName, resolvedTitle, resolvedUrl, type],
  );

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    document.title = resolvedTitle;

    upsertHeadTag('meta[name="description"]', "meta", {
      name: "description",
      content: resolvedDescription,
    });
    upsertHeadTag('meta[name="robots"]', "meta", {
      name: "robots",
      content: "index, follow",
    });
    upsertHeadTag('meta[property="og:type"]', "meta", {
      property: "og:type",
      content: type,
    });
    upsertHeadTag('meta[property="og:url"]', "meta", {
      property: "og:url",
      content: resolvedUrl,
    });
    upsertHeadTag('meta[property="og:title"]', "meta", {
      property: "og:title",
      content: resolvedTitle,
    });
    upsertHeadTag('meta[property="og:description"]', "meta", {
      property: "og:description",
      content: resolvedDescription,
    });
    upsertHeadTag('meta[property="og:image"]', "meta", {
      property: "og:image",
      content: image,
    });
    upsertHeadTag('meta[property="og:site_name"]', "meta", {
      property: "og:site_name",
      content: resolvedSiteName,
    });
    upsertHeadTag('meta[name="twitter:card"]', "meta", {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertHeadTag('meta[name="twitter:url"]', "meta", {
      name: "twitter:url",
      content: resolvedUrl,
    });
    upsertHeadTag('meta[name="twitter:title"]', "meta", {
      name: "twitter:title",
      content: resolvedTitle,
    });
    upsertHeadTag('meta[name="twitter:description"]', "meta", {
      name: "twitter:description",
      content: resolvedDescription,
    });
    upsertHeadTag('meta[name="twitter:image"]', "meta", {
      name: "twitter:image",
      content: image,
    });
    upsertHeadTag('meta[name="keywords"]', "meta", {
      name: "keywords",
      content: defaults.keywords,
    });
    upsertHeadTag('meta[name="author"]', "meta", {
      name: "author",
      content: defaults.author,
    });
    upsertHeadTag('meta[name="theme-color"]', "meta", {
      name: "theme-color",
      content: "#F5F5F7",
    });

    if (resolvedUrl) {
      upsertHeadTag('link[rel="canonical"]', "link", {
        rel: "canonical",
        href: resolvedUrl,
      });
    }

    const structuredData = upsertHeadTag(
      'script[data-seo="structured-data"]',
      "script",
      {
        type: "application/ld+json",
        "data-seo": "structured-data",
      },
    );

    if (structuredData) {
      structuredData.textContent = JSON.stringify(schemaData);
    }

    return undefined;
  }, [
    defaults.author,
    defaults.keywords,
    image,
    resolvedDescription,
    resolvedSiteName,
    resolvedTitle,
    resolvedUrl,
    schemaData,
    type,
  ]);

  return null;
};

export default SEO;
