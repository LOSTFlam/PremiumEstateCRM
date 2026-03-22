import { isRichListing, normalizePropertyTypeKey, parsePrice } from "./catalogData";

const hasFeaturedCollection = (property, slug) =>
  Array.isArray(property?.featuredCollections) && property.featuredCollections.includes(slug);

const filters = {
  verified: (property) => hasFeaturedCollection(property, "verified") || property?.verification?.status === "verified" || isRichListing(property),
  "family-homes": (property) => hasFeaturedCollection(property, "family-homes") || (normalizePropertyTypeKey(property?.propertyType) === "house" && Number(property?.numberofBedrooms || 0) >= 3),
  "city-apartments": (property) => hasFeaturedCollection(property, "city-apartments") || normalizePropertyTypeKey(property?.propertyType) === "apartment",
  "investment-plots": (property) => hasFeaturedCollection(property, "investment-plots") || normalizePropertyTypeKey(property?.propertyType) === "land",
  "premium-commercial": (property) => hasFeaturedCollection(property, "premium-commercial") || (normalizePropertyTypeKey(property?.propertyType) === "commercial" && (isRichListing(property) || parsePrice(property?.listingPrice) >= 200000)),
};

const copy = {
  ru: {
    verified: {
      badge: "Verified collection",
      title: "Проверенные объявления недвижимости",
      description: "Подборка объектов с лучшим уровнем заполнения карточки, документами, фото и подтверждённой структурой объявления.",
      heroPoints: ["Документы и фото", "Проверяемая карточка", "Публичный агент и быстрый лид"],
      faq: [
        { q: "Что считается проверенным объектом?", a: "Объект имеет расширенное описание, цену, адрес, фото, документы и агентскую карточку либо ручной verified-статус из CRM." },
        { q: "Можно ли оставлять заявку без регистрации?", a: "Да. Лид-форма на странице подборки и в карточке объекта сразу создаёт лид в CRM." },
      ],
    },
    "family-homes": {
      badge: "Family focus",
      title: "Семейные дома и виллы",
      description: "SEO-лендинг под большой семейный запрос: просторные дома, несколько спален, участки и удобный контакт с агентом.",
      heroPoints: ["От 3 спален", "Участки и резиденции", "Агент на подборке"],
      faq: [
        { q: "Для кого эта подборка?", a: "Для семей, которым важны площадь, приватность, участок и удобство повторного просмотра объектов." },
        { q: "Можно ли использовать подборку как посадочную страницу для рекламы?", a: "Да. Страница имеет отдельный title, description и текстовые SEO-блоки." },
      ],
    },
    "city-apartments": {
      badge: "Urban living",
      title: "Городские квартиры и резиденции",
      description: "Подборка квартир с акцентом на городскую жизнь, быструю коммуникацию с брокером и удобный сценарий просмотра карточек.",
      heroPoints: ["Городской формат", "Карточки без авторизации", "Прямой контакт с агентом"],
      faq: [
        { q: "Почему отдельная SEO-страница лучше простого фильтра?", a: "У неё своя структура контента, заголовки, description и текстовые блоки под поисковый интент." },
        { q: "Что получает посетитель?", a: "Быстрый доступ к готовой подборке, просмотру объектов и заявке агенту без регистрации." },
      ],
    },
    "investment-plots": {
      badge: "Land deals",
      title: "Участки под строительство и инвестиции",
      description: "Подборка участков для девелопмента и инвестиций с понятным лид-сценарием и SEO-текстом под земельный спрос.",
      heroPoints: ["Под инвестиции", "Под строительство", "Заявка агенту в 1 форме"],
      faq: [
        { q: "Подходит ли страница для земельного трафика?", a: "Да. Подборка собирает релевантные участки и даёт отдельный поисковый посадочный экран." },
        { q: "Можно ли оставить запрос на подбор?", a: "Да. Форма отправляет лид в CRM с привязкой к объекту и агенту." },
      ],
    },
    "premium-commercial": {
      badge: "Commercial prime",
      title: "Премиальная коммерческая недвижимость",
      description: "Отдельная витрина под офисы и коммерческие пространства с richer listing-сигналами и быстрым lead capture.",
      heroPoints: ["Офисы и шоурумы", "Полные карточки", "Lead capture для брокера"],
      faq: [
        { q: "Что делает коммерческую подборку сильнее?", a: "Отдельный SEO-лендинг, быстрый доступ к документам и агентский контакт без лишних шагов." },
        { q: "Можно ли продвигать подборку отдельно от общего каталога?", a: "Да. У страницы собственные мета-теги и понятный коммерческий интент." },
      ],
    },
  },
  en: {
    verified: {
      badge: "Verified collection",
      title: "Verified real estate listings",
      description: "A landing page for listings with stronger completeness, documents, photos and verified listing structure.",
      heroPoints: ["Documents and photos", "Trust-ready listing", "Public agent and fast lead capture"],
      faq: [
        { q: "What counts as a verified property?", a: "The listing has strong content completeness or an explicit verified status from the CRM workflow." },
        { q: "Can visitors submit a lead without registration?", a: "Yes. The public lead form on the collection and property page writes directly into CRM leads." },
      ],
    },
    "family-homes": {
      badge: "Family focus",
      title: "Family homes and villas",
      description: "A dedicated SEO page for spacious homes with multiple bedrooms, land plots and direct contact with an agent.",
      heroPoints: ["3+ bedrooms", "Plots and villas", "Collection-level agent form"],
      faq: [
        { q: "Who is this collection for?", a: "Families that need more space, privacy and a straightforward shortlist workflow." },
        { q: "Can this page be used for paid traffic?", a: "Yes. It has dedicated title, description and supporting SEO copy blocks." },
      ],
    },
    "city-apartments": {
      badge: "Urban living",
      title: "City apartments and residences",
      description: "A search-optimized page for apartment demand with a clear contact path and frictionless listing browsing.",
      heroPoints: ["Urban format", "Open guest access", "Direct broker contact"],
      faq: [
        { q: "Why use a collection page instead of a plain filter?", a: "It has its own SEO structure, headings, description and supporting search-intent content." },
        { q: "What does the visitor get?", a: "A ready shortlist, property detail pages and a no-login lead form." },
      ],
    },
    "investment-plots": {
      badge: "Land deals",
      title: "Investment and development land plots",
      description: "A focused SEO page for land demand with a clean lead path and stronger search relevance for investment queries.",
      heroPoints: ["Investment-ready", "Development land", "Single agent form"],
      faq: [
        { q: "Does this support land-related search traffic?", a: "Yes. The page creates a dedicated search landing for land and development inventory." },
        { q: "Can visitors request подбор?", a: "Yes. The form creates a CRM lead linked to the listing and the responsible agent." },
      ],
    },
    "premium-commercial": {
      badge: "Commercial prime",
      title: "Premium commercial real estate",
      description: "A dedicated landing page for offices and business-ready spaces with richer listing trust signals and fast lead capture.",
      heroPoints: ["Offices and showrooms", "Rich listing cards", "Broker lead capture"],
      faq: [
        { q: "What makes this stronger for commercial demand?", a: "It combines a dedicated SEO page, documents, listing detail and immediate broker contact." },
        { q: "Can it be promoted separately from the main catalog?", a: "Yes. The page has its own meta tags and commercial intent messaging." },
      ],
    },
  },
};

const resolveLang = (language = "ru") => (String(language).toLowerCase().startsWith("ru") ? "ru" : "en");

export const getSeoCollectionConfig = (slug, language = "ru") => {
  const lang = resolveLang(language);
  const content = copy[lang]?.[slug];
  if (!content || !filters[slug]) return null;
  return { slug, ...content, filter: filters[slug] };
};

export const getSeoCollectionCards = (language = "ru") =>
  Object.keys(filters)
    .map((slug) => getSeoCollectionConfig(slug, language))
    .filter(Boolean);
