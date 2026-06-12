export const HOMEPAGE_BLOCK_KEYS = [
  "hero",
  "features",
  "market",
  "collections",
  "services",
  "locations",
  "catalog",
];

const ruServices = [
  {
    key: "shortlist",
    title: "Подборка без хаоса",
    text: "Избранное и сравнение вынесены в ясный сценарий выбора, а не спрятаны в служебных экранах.",
  },
  {
    key: "trust",
    title: "Доверие к карточке",
    text: "Полные объявления с документами и фото стали заметным слоем продукта, а не скрытым преимуществом.",
  },
  {
    key: "growth",
    title: "Маркетинг под спрос",
    text: "Подборки и быстрые маршруты дают нормальную основу под рекламу, поисковое продвижение и ретаргетинг.",
  },
];

const enServices = [
  {
    key: "shortlist",
    title: "Shortlist without clutter",
    text: "Favorites and compare now sit inside a cleaner buyer flow instead of feeling like admin leftovers.",
  },
  {
    key: "trust",
    title: "Trust-ready listings",
    text: "Listings with photos and documents are positioned as a meaningful product layer, not hidden product hygiene.",
  },
  {
    key: "growth",
    title: "Demand-oriented marketing",
    text: "Collections and fast routes give you better surfaces for SEO, ads, and retargeting campaigns.",
  },
];

const ruPillars = [
  {
    title: "Кураторский отбор",
    text: "Каждая карточка собирается так, чтобы покупатель сразу видел суть предложения, уровень подачи и путь к показу.",
    points: ["Сильная визуальная подача", "Структурированные данные", "Проверяемая информация"],
  },
  {
    title: "Спокойный сервис",
    text: "От первого просмотра до сделки коммуникация остается точной, быстрой и личной, без лишнего маркетингового шума.",
    points: ["Частный брокеридж", "Быстрые ответы", "Сопровождение на всем пути"],
  },
  {
    title: "Решения с доверием",
    text: "Покупатель получает не просто подборку, а рабочий инструмент для отбора, сравнения и выхода на объект.",
    points: ["Избранное и сравнение", "Сохраненные поиски", "Прямая связь с консультантом"],
  },
];

const enPillars = [
  {
    title: "Curated selection",
    text: "Each offer is presented so the buyer immediately understands the proposition, the quality of the listing, and the route to viewing.",
    points: ["Stronger visual presentation", "Structured property data", "Clear verification cues"],
  },
  {
    title: "Calm private service",
    text: "From first browse to closing, communication stays precise, quick, and personal rather than noisy or transactional.",
    points: ["Private brokerage", "Faster responses", "Guided journey to the deal"],
  },
  {
    title: "Confidence in decisions",
    text: "The platform is not only a gallery, but a working buyer tool for shortlist building, comparison, and direct inquiry.",
    points: ["Favorites and compare", "Saved searches", "Direct consultant outreach"],
  },
];

export const DEFAULT_HOMEPAGE_CONTENT = {
  visibility: {
    hero: true,
    features: true,
    market: true,
    collections: true,
    services: true,
    locations: true,
    catalog: true,
  },
  locales: {
    ru: {
      hero: {
        eyebrow: "Агентский маркетплейс",
        kicker: "Структурированный поиск и прямой путь к показу",
        title: "Подберите объект как на портале",
        accent: "с сопровождением агентства",
        description:
          "Понятные сегменты, быстрый поиск и спокойный маршрут от первого клика до звонка брокеру.",
        searchHint: "Адрес, тип объекта, район, сценарий жизни",
        primary: "Открыть каталог",
        secondary: "Показать подборку ниже",
        trustLine: ["Проверенные карточки", "Сравнение и подборка", "Прямая заявка на просмотр"],
        panelTitle: "С чего начать поиск",
        panelText: "Выберите сегмент, введите запрос и уйдите в каталог уже с нужным контекстом.",
        routesTitle: "Частые маршруты",
        routesText:
          "Быстрые входы в самые востребованные сценарии без длинного фильтрационного экрана.",
        pulseTitle: "Срез витрины",
        pulseSubtitle: "Что происходит в каталоге прямо сейчас",
        marketLabel: "Рынок в одном экране",
        marketText:
          "Домашняя страница больше не просто красива. Она сразу ведёт в нужный раздел, подборку или конкретный объект.",
      },
      features: {
        badge: "Почему выбирают нас",
        title:
          "Сайт больше не выглядит как шаблон. Он ведет покупателя через атмосферу, факты и действие.",
        description:
          "Мы сместили акцент со случайных карточек и служебных блоков на более взрослую недвижимостную подачу: сильный визуал, кураторская структура, инструменты выбора и мягкий переход к личной консультации.",
        pillars: ruPillars,
      },
      market: {
        badge: "Маршруты спроса",
        title: "Быстрые входы в нужный сценарий поиска",
        text: "Семейный дом, городская квартира, проверенная витрина, участки и премиальная коммерция — каждый маршрут на отдельной странице.",
        statsLabel: "Живые сигналы витрины",
        openLabel: "Открыть маршрут",
      },
      collections: {
        badge: "Редакционные подборки",
        title:
          "Подборки получили свой смысл: это уже не просто фильтр, а отдельные входы под поисковый интент.",
        text: "Каждая подборка может работать как рекламная или поисковая посадочная страница с быстрым переходом в релевантные объекты.",
        openLabel: "Открыть подборку",
      },
      services: {
        badge: "Инструменты покупателя",
        title: "Инструменты для спокойного выбора",
        text: "Сохранение, сравнение и интеллектуальный подбор воспринимаются как часть процесса покупки.",
        items: ruServices,
      },
      locations: {
        title: "Локации на витрине",
        text: "Показываем не абстрактные карточки, а понятные зоны спроса, которые уже видны в базе.",
        fromLabel: "от",
      },
      catalog: {
        badge: "Витрина объектов",
        text: "Ниже остается живая витрина предложений, связанная с поиском и подборками выше.",
      },
    },
    en: {
      hero: {
        eyebrow: "Agency marketplace",
        kicker: "Structured discovery and a direct route to viewing",
        title: "Search property like a serious portal,",
        accent: "with the guidance of a private agency",
        description:
          "Clearer segments, faster search, live collections, and a calmer route from first click to broker contact.",
        searchHint: "Address, property type, district, lifestyle",
        primary: "Open catalog",
        secondary: "Preview below",
        trustLine: ["Verified listings", "Compare and shortlist", "Direct viewing request"],
        panelTitle: "Start the search with structure",
        panelText:
          "Choose a segment, enter a query, and move into the catalog with the right context.",
        routesTitle: "High-intent routes",
        routesText: "Fast entry points into the most common buying scenarios.",
        pulseTitle: "Market pulse",
        pulseSubtitle: "A quick read of the current storefront",
        marketLabel: "The market in one screen",
        marketText:
          "The homepage routes buyers directly into the right category, collection, or listing.",
      },
      features: {
        badge: "Why choose us",
        title: "The experience no longer reads like a template.",
        description:
          "The focus shifts toward a more mature real-estate presentation: stronger visuals, editorial structure, buyer tools, and a softer path into private consultation.",
        pillars: enPillars,
      },
      market: {
        badge: "Demand routes",
        title: "Fast entry into the right search scenario",
        text: "Family homes, city apartments, verified listings, land, and premium commercial — each route on its own page.",
        statsLabel: "Live storefront signals",
        openLabel: "Open route",
      },
      collections: {
        badge: "Editorial collections",
        title: "Collections work like focused search landings, not just saved filters.",
        text: "Each collection can support SEO or paid traffic with a direct route into relevant inventory.",
        openLabel: "Open collection",
      },
      services: {
        badge: "Buyer tools",
        title: "Tools for calmer decision-making",
        text: "Favorites, compare, and the guided finder read like part of the buying process.",
        items: enServices,
      },
      locations: {
        title: "Locations on display",
        text: "The storefront surfaces understandable demand zones that already exist in the catalog.",
        fromLabel: "from",
      },
      catalog: {
        badge: "Property storefront",
        text: "The listing grid stays live below and connects to the search layer above.",
      },
    },
  },
};
