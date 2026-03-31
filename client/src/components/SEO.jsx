import React from 'react';
import { Helmet } from 'react-helmet';

const resolveLocale = () => {
  if (typeof window === 'undefined') return 'ru';
  const stored = window.localStorage?.getItem('i18nextLng');
  const fallback = stored || window.navigator?.language || 'ru';
  return String(fallback).toLowerCase().startsWith('ru') ? 'ru' : 'en';
};

const seoDefaults = {
  ru: {
    title: 'Премиальная недвижимость',
    description: 'Подборка домов, квартир, участков и коммерческой недвижимости с удобным каталогом и прямой связью с агентом.',
    siteName: 'Премиальная недвижимость',
    keywords: 'недвижимость, премиальные объекты, дома, квартиры, участки, коммерческая недвижимость',
    author: 'Премиальная недвижимость',
  },
  en: {
    title: 'Premium Estate - Luxury Real Estate',
    description: 'Discover exceptional properties with unparalleled service and expertise in the premium real estate market.',
    siteName: 'Premium Estate',
    keywords: 'real estate, luxury properties, premium homes, apartments, land, commercial property',
    author: 'Premium Estate',
  },
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
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  siteName,
}) => {
  const locale = resolveLocale();
  const defaults = seoDefaults[locale];
  const resolvedTitle = title || defaults.title;
  const resolvedDescription = description || defaults.description;
  const resolvedSiteName = siteName || defaults.siteName;
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: resolvedTitle,
    description: resolvedDescription,
    image: image,
    url: url,
    publisher: {
      '@type': 'Organization',
      name: resolvedSiteName,
      logo: {
        '@type': 'ImageObject',
        url: `${typeof window !== 'undefined' ? window.location.origin : ''}/logo.png`,
      },
    },
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={resolvedSiteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO meta tags */}
      <meta name="keywords" content={defaults.keywords} />
      <meta name="author" content={defaults.author} />
      <meta name="theme-color" content="#0F172A" />

      {/* Structured data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default SEO;
