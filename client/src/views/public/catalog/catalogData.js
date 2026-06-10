import i18next from "i18next";
import { normalizeUrl } from "../../../constant";
import {
  getStockImageForProperty,
  placeholderImage as stockPlaceholderImage,
} from "utils/propertyStockImages";

const EX_RATE_KEY = "premium_estate_usd_rub";
const EX_RATE_TTL = 60 * 60 * 1000;
const EX_RATE_DEFAULT = 88;

const getRubRate = () => {
  try {
    const raw = localStorage.getItem(EX_RATE_KEY);
    if (!raw) return EX_RATE_DEFAULT;
    const { rate, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > EX_RATE_TTL) return EX_RATE_DEFAULT;
    return rate;
  } catch {
    return EX_RATE_DEFAULT;
  }
};

// Helper to create photo sets from local stock photos
// (served from the same origin, no VPN/external hosts needed)
export const makePhotoSet = ({ title, subtitle }) => [
  {
    img: getStockImageForProperty(title, `${title}-${subtitle}-1`),
    title,
    subtitle,
  },
  {
    img: getStockImageForProperty(title, `${title}-${subtitle}-2`),
    title,
    subtitle,
  },
  {
    img: getStockImageForProperty(title, `${title}-${subtitle}-3`),
    title,
    subtitle,
  },
];

export const placeholderImage = stockPlaceholderImage;

const docLink = (name) => ({ name, url: "#" });

export const getPropertyById = (properties, id) => properties?.find((p) => p?._id === id);

const runtimeLanguage = () => {
  if (typeof window === "undefined") return "ru";
  try {
    if (i18next.language) return i18next.language;
  } catch {
    // Fall back to browser storage below when i18next is not ready.
  }
  return window.localStorage?.getItem("i18nextLng") || window.navigator?.language || "ru";
};

const isRu = (language = runtimeLanguage()) => String(language).toLowerCase().startsWith("ru");

const runtimeLocale = (language = runtimeLanguage()) => (isRu(language) ? "ru-RU" : "en-US");

export const formatCompactNumber = (num, language = runtimeLanguage()) => {
  if (!num) return "0";
  return new Intl.NumberFormat(runtimeLocale(language), {
    notation: "compact",
    compactDisplay: "short",
  }).format(num);
};

export const samplePublicProperties = [
  {
    _id: "sample-rivera-villa",
    name: "Вилла в Жуковке",
    propertyType: "House",
    propertyAddress: "Московская обл., Жуковка, Рублево-Успенское ш., 45",
    listingPrice: "1250000",
    squareFootage: "420 м²",
    numberofBedrooms: 5,
    numberofBathrooms: 4,
    yearBuilt: 2023,
    lotSize: "15 соток",
    parkingAvailability: "Гараж на 3 машины и гостевая парковка",
    listingStatus: "Available",
    listingDate: "2026-02-12",
    marketingDescription:
      "Современная семейная вилла с панорамным остеклением, приватным участком и террасой для отдыха.",
    propertyDescription:
      "Дом рассчитан на постоянное проживание: здесь есть кабинет, гостевой блок, хозяйственная зона и просторная гостиная с видом на сад.",
    communityAmenities: "Охрана поселка, частная школа рядом, фитнес-студия, прогулочные маршруты",
    appliancesIncluded: "Премиальная кухня, винный шкаф, прачечный блок",
    heatingAndCoolingSystems: "Тепловой насос, теплый пол, мультизональное кондиционирование",
    flooringType: "Натуральный дуб, керамогранит, мягкое покрытие в спальнях",
    exteriorFeatures: "Ландшафтный участок, летняя кухня, уличный камин, автополив",
    propertyPhotos: makePhotoSet({
      title: "Вилла",
      subtitle: "Семейный дом с панорамой",
      primary: "#153c47",
      secondary: "#7ca68b",
      accent: "#c47a3d",
    }),
    floorPlans: makePhotoSet({
      title: "План",
      subtitle: "Планировка этажа",
      primary: "#30555b",
      secondary: "#ac9b77",
      accent: "#5b7f5b",
    }).slice(0, 1),
    propertyDocuments: [docLink("Брошюра объекта"), docLink("Техническое описание")],
    unitType: [
      { _id: "rv-main", name: "Основная резиденция", sqm: "420 м²", price: "1250000" },
      { _id: "rv-guest", name: "Гостевая студия", sqm: "46 м²", price: "95000" },
    ],
  },
  {
    _id: "sample-skyline-loft",
    name: "Апартаменты в Москва-Сити",
    propertyType: "Apartment",
    propertyAddress: "Москва, Пресненская наб., 12, башня Федерация",
    listingPrice: "345000",
    squareFootage: "118 м²",
    numberofBedrooms: 3,
    numberofBathrooms: 2,
    yearBuilt: 2025,
    lotSize: "Высотная резиденция",
    parkingAvailability: "Подземный паркинг, 1 закрепленное место",
    listingStatus: "New",
    listingDate: "2026-03-05",
    marketingDescription:
      "Дизайнерские апартаменты с видом на центр Москвы, приватным холлом и консьерж-сервисом.",
    propertyDescription:
      "Угловой лот с кухней-гостиной, мастер-спальней, гостевой комнатой, встроенными системами хранения и продуманным сценарием освещения.",
    communityAmenities: "Консьерж, фитнес-зал, зона отдыха, коворкинг, сад на крыше",
    appliancesIncluded: "Островная кухня, духовой шкаф, посудомоечная машина, стиральный блок",
    heatingAndCoolingSystems:
      "Центральная мультизональная климатическая система, теплый пол в ванных комнатах",
    flooringType: "Инженерная доска и керамогранит",
    exteriorFeatures: "Панорамные окна, лоджия, фасадная подсветка",
    propertyPhotos: makePhotoSet({
      title: "Апартаменты",
      subtitle: "Панорама города",
      primary: "#232d4b",
      secondary: "#7187b9",
      accent: "#ce8741",
    }),
    floorPlans: makePhotoSet({
      title: "Планировка",
      subtitle: "План апартаментов",
      primary: "#4b5877",
      secondary: "#9ca5c9",
      accent: "#cf9152",
    }).slice(0, 1),
    propertyDocuments: [docLink("Паспорт объекта")],
    unitType: [
      { _id: "sl-1", name: "Резиденция с 3 спальнями", sqm: "118 м²", price: "345000" },
      { _id: "sl-2", name: "Резиденция с 2 спальнями", sqm: "94 м²", price: "298000" },
    ],
  },
  {
    _id: "sample-forest-acre",
    name: "Участок у Истринского водохранилища",
    propertyType: "Land",
    propertyAddress: "Московская обл., Истринский р-н, прибрежная линия, участок 24",
    listingPrice: "92000",
    squareFootage: "1800 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    yearBuilt: "-",
    lotSize: "18 соток",
    parkingAvailability: "Подъезд для строительной техники",
    listingStatus: "Available",
    listingDate: "2026-01-28",
    marketingDescription:
      "Видовой участок под частный дом или арендный проект рядом с водой и готовым подъездом.",
    propertyDescription:
      "Ровный земельный лот с подведенными точками подключения, лесной линией и спокойным жилым окружением.",
    communityAmenities:
      "Доступ к воде, закрытый въезд, веломаршруты, курортная инфраструктура рядом",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Точки подключения коммуникаций подготовлены",
    flooringType: "Природный рельеф",
    exteriorFeatures: "Лесная линия, легкий уклон, солнечная сторона",
    propertyPhotos: makePhotoSet({
      title: "Участок",
      subtitle: "Земля под строительство",
      primary: "#355d36",
      secondary: "#9bbd77",
      accent: "#a96c32",
    }),
    floorPlans: makePhotoSet({
      title: "Схема",
      subtitle: "План участка",
      primary: "#496c41",
      secondary: "#b0c585",
      accent: "#8c6030",
    }).slice(0, 1),
    propertyDocuments: [docLink("Зонирование участка"), docLink("Кадастровая выписка")],
    unitType: [{ _id: "fa-1", name: "Сценарий частной застройки", sqm: "1800 м²", price: "92000" }],
  },
  {
    _id: "sample-harbor-townhouse",
    name: "Таунхаус у яхт-клуба",
    propertyType: "House",
    propertyAddress: "Московская обл., Пирогово, Марина квартал, 7",
    listingPrice: "680000",
    squareFootage: "236 м²",
    numberofBedrooms: 4,
    numberofBathrooms: 3,
    yearBuilt: 2024,
    lotSize: "4,6 сотки",
    parkingAvailability: "Навес на 2 машины",
    listingStatus: "Active",
    listingDate: "2026-02-25",
    marketingDescription:
      "Современный таунхаус с террасой на крыше и прямым выходом к прогулочной линии у воды.",
    propertyDescription:
      "Трехуровневый дом с открытой общественной зоной, приватным патио, гардеробными и отдельной комнатой для кино.",
    communityAmenities: "Яхт-клуб, рестораны, прогулочная набережная, оздоровительный комплекс",
    appliancesIncluded: "Кухонный гарнитур, климатический пакет, встроенное аудио",
    heatingAndCoolingSystems: "Газовый котел, зональное охлаждение, подогрев террасы",
    flooringType: "Микроцемент и дубовая доска",
    exteriorFeatures: "Эксплуатируемая кровля, балкон с видом на воду, фасадная подсветка",
    propertyPhotos: makePhotoSet({
      title: "Таунхаус",
      subtitle: "Дом у марины",
      primary: "#0e4954",
      secondary: "#6aa7a2",
      accent: "#d0914f",
    }),
    floorPlans: makePhotoSet({
      title: "План",
      subtitle: "Уровни таунхауса",
      primary: "#3c6a74",
      secondary: "#89b6b3",
      accent: "#bf7d33",
    }).slice(0, 1),
    propertyDocuments: [docLink("Брошюра таунхауса")],
    unitType: [{ _id: "ht-1", name: "Полный таунхаус", sqm: "236 м²", price: "680000" }],
  },
  {
    _id: "sample-aurora-suites",
    name: "Апартаменты в Садовых кварталах",
    propertyType: "Apartment",
    dealType: "rent",
    propertyAddress: "Москва, Комсомольский пр-т, 42",
    listingPrice: "2500",
    squareFootage: "76 м²",
    numberofBedrooms: 2,
    numberofBathrooms: 2,
    yearBuilt: 2026,
    lotSize: "Жилой комплекс",
    parkingAvailability: "Общий подземный паркинг",
    listingStatus: "Available",
    listingDate: "2026-03-08",
    marketingDescription:
      "Компактные городские апартаменты для жизни или аренды рядом с парками и ресторанами центра.",
    propertyDescription:
      "Планировка включает кухню-гостиную, мастер-спальню, гибкую вторую комнату и большие окна с тихой ориентацией во двор.",
    communityAmenities: "Парк, детская площадка, торговая галерея, йога-зал",
    appliancesIncluded: "Базовый кухонный пакет",
    heatingAndCoolingSystems: "Фанкойлы, теплый пол в мокрых зонах",
    flooringType: "Ламинат и керамическая плитка",
    exteriorFeatures: "Французские балконы, благоустроенный двор",
    propertyPhotos: makePhotoSet({
      title: "Апартаменты",
      subtitle: "Компактный городской формат",
      primary: "#54313f",
      secondary: "#c88ea5",
      accent: "#8a6132",
    }),
    floorPlans: makePhotoSet({
      title: "Планировка",
      subtitle: "План резиденции",
      primary: "#785665",
      secondary: "#d5a3b7",
      accent: "#9f6b39",
    }).slice(0, 1),
    propertyDocuments: [docLink("Паспорт резиденции")],
    unitType: [
      { _id: "as-1", name: "Двухкомнатная резиденция", sqm: "76 м²", price: "219000" },
      { _id: "as-2", name: "Однокомнатная резиденция", sqm: "58 м²", price: "179000" },
    ],
  },
  {
    _id: "sample-meadow-estates",
    name: "Девелоперский участок на Новой Риге",
    propertyType: "Land",
    propertyAddress: "Московская обл., Новорижское ш., 19 км",
    listingPrice: "64000",
    squareFootage: "1200 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    yearBuilt: "-",
    lotSize: "12 соток",
    parkingAvailability: "Подъезд по готовой дороге",
    listingStatus: "New",
    listingDate: "2026-03-11",
    marketingDescription:
      "Земельный участок внутри нового поселка с центральными коммуникациями и быстрой логистикой до города.",
    propertyDescription:
      "Ровный прямоугольный лот подготовлен под малоэтажную застройку, имеет точки подключения газа и электричества и готовую дорожную сеть.",
    communityAmenities: "Охрана, спортивная площадка, пруд, зона пикника",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Выведены точки подключения коммуникаций",
    flooringType: "Подготовленный грунт",
    exteriorFeatures: "Открытый фасад, вечернее солнце",
    propertyPhotos: makePhotoSet({
      title: "Участок",
      subtitle: "Загородный земельный лот",
      primary: "#6a5d2c",
      secondary: "#c5b96f",
      accent: "#5d8440",
    }),
    floorPlans: makePhotoSet({
      title: "Схема",
      subtitle: "Границы участка",
      primary: "#87793f",
      secondary: "#d4c784",
      accent: "#658d47",
    }).slice(0, 1),
    propertyDocuments: [docLink("План поселка")],
    unitType: [{ _id: "me-1", name: "Участок под дом", sqm: "1200 м²", price: "64000" }],
  },
  {
    _id: "sample-atrium-office",
    name: "Офисный этаж в Москва-Сити",
    propertyType: "Commercial",
    dealType: "rent",
    propertyAddress: "Москва, Пресненская наб., 8, БЦ Город Столиц",
    listingPrice: "5800",
    squareFootage: "310 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 3,
    yearBuilt: 2022,
    lotSize: "Бизнес-центр",
    parkingAvailability: "6 закрепленных мест",
    listingStatus: "Available",
    listingDate: "2026-02-02",
    marketingDescription:
      "Гибкий офисный этаж для штаб-квартиры, шоурума или клиентского пространства в деловой локации.",
    propertyDescription:
      "Помещение включает открытую рабочую зону, кабинеты партнеров, переговорные, ресепшен, кухню, серверную и панорамное остекление.",
    communityAmenities: "Ресепшен, охрана, конференц-зона, кафе, спортзал",
    appliancesIncluded: "Аудио-видео пакет для переговорных, кухонная линия, контроль доступа",
    heatingAndCoolingSystems: "Центральная вентиляция и климатическая автоматика",
    flooringType: "Коммерческий ковролин и фальшпол",
    exteriorFeatures: "Угловое остекление, брендированный лобби-холл",
    propertyPhotos: makePhotoSet({
      title: "Офис",
      subtitle: "Коммерческое пространство",
      primary: "#2d3448",
      secondary: "#9aa4b7",
      accent: "#be8047",
    }),
    floorPlans: makePhotoSet({
      title: "План",
      subtitle: "Рабочая планировка",
      primary: "#505a72",
      secondary: "#bcc4d3",
      accent: "#d08d4f",
    }).slice(0, 1),
    propertyDocuments: [docLink("Коммерческое описание")],
    unitType: [{ _id: "ao-1", name: "Целый офисный этаж", sqm: "310 м²", price: "510000" }],
  },
  {
    _id: "sample-garden-courtyard",
    name: "Семейная квартира у ботанического сада",
    propertyType: "Apartment",
    dealType: "rent",
    propertyAddress: "Москва, Ботанический переулок, 16, корпус 3",
    listingPrice: "3200",
    squareFootage: "102 м²",
    numberofBedrooms: 3,
    numberofBathrooms: 2,
    yearBuilt: 2024,
    lotSize: "Приватный двор",
    parkingAvailability: "Наземные и подземные места",
    listingStatus: "Available",
    listingDate: "2026-02-18",
    marketingDescription:
      "Семейная квартира с видом на зеленый внутренний сад и спокойным малоэтажным окружением.",
    propertyDescription:
      "Тихая резиденция с просторной дневной зоной, хозяйственной комнатой, семейным хранением, мастер-спальней и выходом к благоустроенному подиуму.",
    communityAmenities: "Приватный сад, детская комната, спортзал, кафе, помещение для посылок",
    appliancesIncluded: "Кухонный комплект, мебель в ванных, встроенные системы хранения",
    heatingAndCoolingSystems: "Индивидуальные климатические модули",
    flooringType: "Дерево и мягкая керамическая плитка",
    exteriorFeatures: "Окна в сад, террасный балкон",
    propertyPhotos: makePhotoSet({
      title: "Квартира",
      subtitle: "Семейная резиденция",
      primary: "#325844",
      secondary: "#8db19b",
      accent: "#cb8d56",
    }),
    floorPlans: makePhotoSet({
      title: "Планировка",
      subtitle: "Семейный план",
      primary: "#4d7861",
      secondary: "#afccb8",
      accent: "#d79b63",
    }).slice(0, 1),
    propertyDocuments: [docLink("Буклет резиденции")],
    unitType: [{ _id: "gc-1", name: "Квартира с 3 спальнями", sqm: "102 м²", price: "287000" }],
  },
  {
    _id: "sample-cedar-crest-residence",
    name: "Вилла в Барвихе",
    propertyType: "House",
    propertyAddress: "Московская обл., Одинцовский р-н, Барвиха, 11",
    listingPrice: "1490000",
    squareFootage: "510 м²",
    numberofBedrooms: 6,
    numberofBathrooms: 5,
    yearBuilt: 2025,
    lotSize: "30 соток",
    parkingAvailability: "Отапливаемый гараж на 4 машины",
    listingStatus: "Available",
    listingDate: "2026-03-14",
    marketingDescription:
      "Большая семейная резиденция с оздоровительным этажом, открытым бассейном и отдельным гостевым павильоном.",
    propertyDescription:
      "Планировка включает двухсветный салон, кинотеатр, семейную кухню, три гардеробные, рабочее крыло и ландшафтный участок с взрослыми кедрами.",
    communityAmenities: "Приватный клуб, теннисные корты, частная школа, прогулочная у воды",
    appliancesIncluded: "Профессиональная кухня, сауна, винное хранение",
    heatingAndCoolingSystems: "Умное климатическое зонирование, тепловой насос, теплый пол",
    flooringType: "Камень, ореховый паркет, акустический ковролин",
    exteriorFeatures: "Открытый бассейн, терраса у воды, зона барбекю, гостевой павильон",
    propertyPhotos: makePhotoSet({
      title: "Вилла",
      subtitle: "Статусная резиденция",
      primary: "#243b32",
      secondary: "#8db39b",
      accent: "#c78d49",
    }),
    floorPlans: makePhotoSet({
      title: "Планировка",
      subtitle: "План резиденции",
      primary: "#446254",
      secondary: "#aecbb7",
      accent: "#d49a5a",
    }).slice(0, 1),
    propertyDocuments: [docLink("Досье объекта"), docLink("Пакет права собственности")],
    unitType: [{ _id: "cc-1", name: "Основная резиденция", sqm: "510 м²", price: "1490000" }],
  },
  {
    _id: "sample-capital-horizon-parcel",
    name: "Участок под клубный поселок",
    propertyType: "Land",
    propertyAddress: "Московская обл., Новорижское ш., участок А-17",
    listingPrice: "185000",
    squareFootage: "3200 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    yearBuilt: "-",
    lotSize: "32 сотки",
    parkingAvailability: "Прямой выезд на магистраль",
    listingStatus: "Active",
    listingDate: "2026-03-18",
    marketingDescription:
      "Крупный инвестиционный участок под таунхаусы, коммерцию у дороги или смешанный формат застройки.",
    propertyDescription:
      "Площадка расположена рядом с новым транспортным коридором, имеет удобный инженерный доступ и подходит для поэтапного строительства.",
    communityAmenities:
      "Транспортный узел, торговый кластер, инженерный коридор, логистический доступ",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Коммуникации проходят рядом",
    flooringType: "Подготовленный рельеф площадки",
    exteriorFeatures: "Угловое положение, хорошая видимость, ровный профиль",
    propertyPhotos: makePhotoSet({
      title: "Участок",
      subtitle: "Инвестиционная площадка",
      primary: "#5c4b2e",
      secondary: "#c9b786",
      accent: "#607f45",
    }),
    floorPlans: makePhotoSet({
      title: "Схема",
      subtitle: "План площадки",
      primary: "#7c6842",
      secondary: "#d9c89d",
      accent: "#709450",
    }).slice(0, 1),
    propertyDocuments: [docLink("Инвестиционный меморандум"), docLink("Геодезия участка")],
    unitType: [{ _id: "ch-1", name: "Девелоперский лот", sqm: "3200 м²", price: "185000" }],
  },
  {
    _id: "sample-north-gate-retail-gallery",
    name: "Торговая галерея Белая Площадь",
    propertyType: "Commercial",
    propertyAddress: "Москва, Лесная ул., 5, торговая галерея",
    listingPrice: "640000",
    squareFootage: "420 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 2,
    yearBuilt: 2024,
    lotSize: "Уличная торговая галерея",
    parkingAvailability: "Гостевая парковка и зона разгрузки",
    listingStatus: "New",
    listingDate: "2026-03-09",
    marketingDescription:
      "Торговый блок с высокой видимостью и двойным фасадом под шоурум, клинику или флагманский магазин.",
    propertyDescription:
      "Планировка включает открытый торговый зал, внутренний офис, склад, служебные комнаты и отдельный доступ для поставок.",
    communityAmenities:
      "Метро рядом, крупный торговый центр, банковский кластер, гастрономическое пространство",
    appliancesIncluded: "Защитные роллеты, климатический пакет, световые треки",
    heatingAndCoolingSystems: "Коммерческая климатическая система и приток свежего воздуха",
    flooringType: "Каменная плитка и полированный бетон",
    exteriorFeatures: "Двухсветный фасад, зона вывески, вечерняя подсветка",
    propertyPhotos: makePhotoSet({
      title: "Ритейл",
      subtitle: "Галерейный блок",
      primary: "#3b3140",
      secondary: "#aa95b3",
      accent: "#c88648",
    }),
    floorPlans: makePhotoSet({
      title: "План",
      subtitle: "План арендатора",
      primary: "#5a4d60",
      secondary: "#c2b1c9",
      accent: "#d39552",
    }).slice(0, 1),
    propertyDocuments: [docLink("Пакет для арендатора")],
    unitType: [{ _id: "ng-1", name: "Флагманский торговый блок", sqm: "420 м²", price: "640000" }],
  },
  {
    _id: "sample-summit-executive-center",
    name: "Представительский офис на Пресне",
    propertyType: "Commercial",
    propertyAddress: "Москва, Пресненская наб., 5, бизнес-центр Саммит",
    listingPrice: "870000",
    squareFootage: "560 м²",
    numberofBedrooms: 0,
    numberofBathrooms: 4,
    yearBuilt: 2025,
    lotSize: "Бизнес-центр",
    parkingAvailability: "12 представительских и гостевых мест",
    listingStatus: "Active",
    listingDate: "2026-03-21",
    marketingDescription:
      "Премиальный офисный этаж для юридических, финансовых и команд по частному капиталу, которым важен статус адреса.",
    propertyDescription:
      "Включает ресепшен, кабинеты партнеров, большую переговорную, клиентскую зону отдыха, архив, защищенную серверную и приватную террасу с видом на панораму города.",
    communityAmenities: "Валет-сервис, приватная столовая, конференц-зал, консьерж-холл",
    appliancesIncluded: "Аудио-видео пакет для переговорных, система доступа, встроенная кухня",
    heatingAndCoolingSystems: "Умная система автоматического управления климатом",
    flooringType: "Камень, инженерная доска, акустическая ковровая плитка",
    exteriorFeatures: "Терраса, панорамный фасад, премиальный входной лобби-холл",
    propertyPhotos: makePhotoSet({
      title: "Офис",
      subtitle: "Представительский этаж",
      primary: "#283844",
      secondary: "#9ab1bf",
      accent: "#cf8b45",
    }),
    floorPlans: makePhotoSet({
      title: "План",
      subtitle: "Представительская планировка",
      primary: "#435865",
      secondary: "#bdcbd3",
      accent: "#d99b58",
    }).slice(0, 1),
    propertyDocuments: [docLink("Пакет объекта"), docLink("Коммерческие условия")],
    unitType: [
      { _id: "se-1", name: "Полный представительский этаж", sqm: "560 м²", price: "870000" },
    ],
  },
];

const sampleStorefrontMeta = {
  "sample-rivera-villa": {
    verification: { status: "verified", score: 98 },
    featuredCollections: ["verified", "family-homes"],
  },
  "sample-skyline-loft": {
    verification: { status: "verified", score: 94 },
    featuredCollections: ["verified", "city-apartments"],
  },
  "sample-forest-acre": {
    verification: { status: "pending", score: 78 },
    featuredCollections: ["investment-plots"],
  },
  "sample-harbor-townhouse": {
    verification: { status: "verified", score: 91 },
    featuredCollections: ["family-homes", "verified"],
  },
  "sample-aurora-suites": {
    verification: { status: "verified", score: 88 },
    featuredCollections: ["city-apartments"],
  },
  "sample-meadow-estates": {
    verification: { status: "pending", score: 72 },
    featuredCollections: ["investment-plots"],
  },
  "sample-atrium-office": {
    verification: { status: "verified", score: 93 },
    featuredCollections: ["premium-commercial", "verified"],
  },
  "sample-garden-courtyard": {
    verification: { status: "verified", score: 90 },
    featuredCollections: ["city-apartments", "verified"],
  },
  "sample-cedar-crest-residence": {
    verification: { status: "verified", score: 97 },
    featuredCollections: ["family-homes", "verified"],
  },
  "sample-capital-horizon-parcel": {
    verification: { status: "verified", score: 86 },
    featuredCollections: ["investment-plots", "verified"],
  },
  "sample-north-gate-retail-gallery": {
    verification: { status: "verified", score: 89 },
    featuredCollections: ["premium-commercial"],
  },
  "sample-summit-executive-center": {
    verification: { status: "verified", score: 96 },
    featuredCollections: ["premium-commercial", "verified"],
  },
};

export const parsePrice = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;

export const formatPrice = (value, t, language = runtimeLanguage()) => {
  const amount = parsePrice(value);
  if (!amount) return t?.("publicListing.priceOnRequest") || "Price on request";
  const isRussian = isRu(language);
  if (isRussian) {
    const rubAmount = Math.round(amount * getRubRate());
    return rubAmount.toLocaleString("ru-RU") + " \u20BD";
  }
  return amount.toLocaleString("en-US") + " \u0024";
};

export const formatCompactPrice = (value, t, language = runtimeLanguage()) => {
  const amount = parsePrice(value);
  if (!amount) return formatPrice(value, t, language);
  const isRussian = isRu(language);
  const locale = isRussian ? "ru-RU" : "en-US";
  const currency = isRussian ? "RUB" : "USD";
  const converted = isRussian ? Math.round(amount * getRubRate()) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(converted);
};

export const formatDate = (value, language = runtimeLanguage()) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return new Intl.DateTimeFormat(isRu(language) ? "ru-RU" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export const normalizeStatus = (status, t) => {
  if (!status)
    return t?.("modules.dashboardHome.statusAvailable") || (isRu() ? "Доступно" : "Available");
  const key = String(status).toLowerCase().trim();
  const statusMap = {
    available: t?.("publicListing.available") || (isRu() ? "Доступно" : "Available"),
    active: t?.("publicListing.active") || (isRu() ? "Активно" : "Active"),
    new: t?.("publicListing.new") || (isRu() ? "Новое" : "New"),
    pending: t?.("publicListing.verificationPending") || (isRu() ? "Ожидает проверки" : "Pending"),
    reserved: isRu() ? "В резерве" : "Reserved",
  };

  return (
    statusMap[key] ||
    String(status)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

export const normalizePropertyMedia = (property) => {
  if (!property) return property;

  const normalizeMediaList = (items, type) =>
    Array.isArray(items)
      ? items.map((item) => ({
          ...item,
          img: normalizeUrl(item?.img, type),
        }))
      : items;

  return {
    ...property,
    propertyPhotos: normalizeMediaList(property.propertyPhotos, property.propertyType),
    floorPlans: normalizeMediaList(property.floorPlans, "floorPlan"),
  };
};

export const getPrimaryImage = (property) =>
  normalizeUrl(
    property?.propertyPhotos?.[0]?.img || property?.floorPlans?.[0]?.img || placeholderImage,
    property?.propertyPhotos?.[0]?.img ? property?.propertyType : "floorPlan"
  );

export const getPhotoCount = (property) =>
  Array.isArray(property?.propertyPhotos) ? property.propertyPhotos.length : 0;
export const getFloorPlanCount = (property) =>
  Array.isArray(property?.floorPlans) ? property.floorPlans.length : 0;
export const getDocumentCount = (property) =>
  Array.isArray(property?.propertyDocuments) ? property.propertyDocuments.length : 0;

export const isRichListing = (property) => {
  const hasDescription = Boolean(property?.marketingDescription || property?.propertyDescription);
  return (
    getPhotoCount(property) >= 1 &&
    hasDescription &&
    (getFloorPlanCount(property) > 0 || getDocumentCount(property) > 0)
  );
};

export const estimateMortgage = ({
  price,
  downPaymentPercent = 30,
  years = 20,
  annualRate = 18,
}) => {
  const totalPrice = parsePrice(price);
  const downPaymentAmount = totalPrice * (Number(downPaymentPercent || 0) / 100);
  const loanAmount = Math.max(totalPrice - downPaymentAmount, 0);
  const months = Math.max(Number(years || 0) * 12, 1);
  const monthlyRate = Number(annualRate || 0) / 12 / 100;

  const monthlyPayment = monthlyRate
    ? loanAmount * (monthlyRate / (1 - (1 + monthlyRate) ** -months))
    : loanAmount / months;

  return {
    totalPrice,
    downPaymentAmount,
    loanAmount,
    monthlyPayment: Number.isFinite(monthlyPayment) ? monthlyPayment : 0,
  };
};

export const normalizePropertyTypeKey = (value = "") => {
  const normalized = String(value).toLowerCase();

  if (
    normalized.includes("house") ||
    normalized.includes("villa") ||
    normalized.includes("townhouse") ||
    normalized.includes("дом") ||
    normalized.includes("вилла") ||
    normalized.includes("таунхаус") ||
    normalized.includes("коттедж")
  ) {
    return "house";
  }

  if (
    normalized.includes("apartment") ||
    normalized.includes("flat") ||
    normalized.includes("residence") ||
    normalized.includes("квартира") ||
    normalized.includes("апартамент") ||
    normalized.includes("студия")
  ) {
    return "apartment";
  }

  if (
    normalized.includes("land") ||
    normalized.includes("plot") ||
    normalized.includes("lot") ||
    normalized.includes("участ") ||
    normalized.includes("земл")
  ) {
    return "land";
  }

  if (
    normalized.includes("commercial") ||
    normalized.includes("office") ||
    normalized.includes("retail") ||
    normalized.includes("коммер") ||
    normalized.includes("офис") ||
    normalized.includes("помещ")
  ) {
    return "commercial";
  }

  return "other";
};

export const getCatalogDataset = (properties) =>
  properties.map((item) => {
    const p = normalizePropertyMedia(item);
    const storefrontMeta = sampleStorefrontMeta[p?._id] || {};

    return {
      ...storefrontMeta,
      ...p,
      verification: p?.verification || storefrontMeta.verification,
      verificationStatus:
        p?.verificationStatus ||
        p?.verification?.status ||
        storefrontMeta?.verification?.status ||
        "pending",
      featuredCollections: Array.isArray(p?.featuredCollections)
        ? p.featuredCollections
        : storefrontMeta.featuredCollections || [],
      propertyTypeKey: normalizePropertyTypeKey(p?.propertyType),
      publicSlugResolved: p?.publicSlug || p?.seo?.slug || p?.seoSlug || "",
      createdDate: p?.createdDate || p?.listingDate || null,
      updatedDate: p?.updatedDate || p?.listingDate || null,
      normalizedStatus: normalizeStatus(p?.listingStatus, i18next.t.bind(i18next)),
      searchableText: [
        p?.name,
        p?.propertyAddress,
        p?.propertyType,
        p?.marketingDescription,
        p?.propertyDescription,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    };
  });

export const splitFeatures = (...lists) =>
  lists
    .flat()
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter((item, idx, arr) => arr.indexOf(item) === idx);

export const buildHighlights = (property, _t) => {
  const highlights = [];
  if (property?.yearBuilt && property.yearBuilt !== "-")
    highlights.push({ key: "yearBuilt", value: property.yearBuilt });
  if (property?.lotSize) highlights.push({ key: "lotSize", value: property.lotSize });
  if (property?.parkingAvailability)
    highlights.push({ key: "parking", value: property.parkingAvailability });
  return highlights;
};
