export const blogPosts = [
  {
    slug: "premium-market-outlook-2026",
    category: { ru: "Аналитика", en: "Insights" },
    tags: { ru: ["рынок", "инвестиции"], en: ["market", "investment"] },
    date: "2026-05-12",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    title: {
      ru: "Премиальный рынок недвижимости: прогноз на 2026",
      en: "Premium real estate market outlook for 2026",
    },
    excerpt: {
      ru: "Как меняется спрос на резиденции класса de luxe и какие локации остаются устойчивыми.",
      en: "How demand for de luxe residences is shifting and which locations remain resilient.",
    },
    body: {
      ru: [
        "Премиальный сегмент продолжает отличаться от массового рынка: покупатели выбирают не только метраж, но и приватность, сервис и юридическую чистоту сделки.",
        "В 2026 году мы видим рост интереса к объектам с готовой инфраструктурой, закрытыми дворами и персональным сопровождением на всех этапах.",
        "Для инвесторов ключевыми остаются ликвидность выхода, прозрачная история цены и возможность частного показа без публичного шума.",
      ],
      en: [
        "The premium segment continues to diverge from the mass market: buyers choose privacy, service, and legal clarity—not square meters alone.",
        "In 2026 we see rising interest in residences with mature infrastructure, gated environments, and private guidance at every step.",
        "For investors, exit liquidity, transparent price history, and discreet viewings remain the decisive factors.",
      ],
    },
  },
  {
    slug: "private-viewing-checklist",
    category: { ru: "Гайды", en: "Guides" },
    tags: { ru: ["показ", "покупка"], en: ["viewing", "buying"] },
    date: "2026-04-03",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    title: {
      ru: "Чек-лист частного показа для покупателя",
      en: "A buyer's checklist for a private viewing",
    },
    excerpt: {
      ru: "7 вопросов, которые стоит задать до подписания брони или задатка.",
      en: "Seven questions worth asking before reservation or deposit.",
    },
    body: {
      ru: [
        "Частный показ — это возможность оценить объект без спешки и лишних глаз.",
        "Проверьте естественное освещение в разное время суток, шумовой фон, состояние инженерии и реальную планировку.",
        "Зафиксируйте договорённости письменно: сроки, включённые опции, порядок расчётов и ответственность сторон.",
      ],
      en: [
        "A private viewing lets you evaluate a property without rush or unnecessary exposure.",
        "Review natural light across the day, acoustic comfort, engineering condition, and the real floor plan.",
        "Capture agreements in writing: timelines, included options, payment order, and responsibilities.",
      ],
    },
  },
  {
    slug: "mortgage-strategies-luxury",
    category: { ru: "Финансы", en: "Finance" },
    tags: { ru: ["ипотека", "банки"], en: ["mortgage", "banks"] },
    date: "2026-03-18",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    title: {
      ru: "Ипотечные стратегии для премиальных объектов",
      en: "Mortgage strategies for premium properties",
    },
    excerpt: {
      ru: "Когда имеет смысл фиксировать ставку, а когда — работать с гибридными программами.",
      en: "When to lock a rate and when hybrid programs make more sense.",
    },
    body: {
      ru: [
        "На премиальном рынке ипотека часто сочетается с крупным первоначальным взносом и индивидуальным андеррайтингом.",
        "Сравнивайте не только ставку, но и полную стоимость владения: страховки, комиссии, досрочное погашение.",
        "Наши менеджеры помогут подобрать программу под ваш профиль и подготовить пакет для банка.",
      ],
      en: [
        "In the premium market, mortgages often pair with a substantial down payment and bespoke underwriting.",
        "Compare total cost of ownership—not just the rate: insurance, fees, and prepayment terms.",
        "Our managers can align a program with your profile and prepare the bank package.",
      ],
    },
  },
];

export const getBlogPost = (slug) => blogPosts.find((post) => post.slug === slug);
