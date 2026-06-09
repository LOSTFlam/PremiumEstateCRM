const mongoose = require("mongoose");
const User = require("./model/schema/user");
const bcrypt = require("bcryptjs");
const path = require("path");
const { connectWithFallback } = require("./utils/mongoConnect");

// Load env from server/.env first, then fallback to repo root .env
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const buildPhotos = (...urls) => urls.filter(Boolean).map((img) => ({ img }));
const buildDocs = (...names) =>
  names.filter(Boolean).map((name) => ({ name, url: "#" }));

const sampleProperties = [
  {
    name: "Роскошная вилла в Жуковке",
    publicSlug: "villa-zhukovka-river-club",
    propertyAddress: "Московская обл., Жуковка, Рублево-Успенское ш., 45",
    listingPrice: 125000000,
    propertyType: "House",
    listingStatus: "Available",
    numberofBedrooms: 5,
    numberofBathrooms: 4,
    squareFootage: "450 м²",
    yearBuilt: 2022,
    lotSize: "15 соток",
    propertyDescription:
      "Современная семейная вилла с панорамным остеклением, приватным участком, бассейном и отдельным блоком для персонала.",
    marketingDescription:
      "Премиальная резиденция для семьи, которой важны безопасность, тишина и быстрый выезд в Москву.",
    communityAmenities:
      "Охрана 24/7, теннисный корт, клубный сервис, детская площадка",
    appliancesIncluded: "Премиальная кухня, прачечный блок, винный шкаф",
    heatingAndCoolingSystems:
      "Газовое отопление, мультизональное кондиционирование, теплый пол",
    flooringType: "Натуральный камень, дубовый паркет",
    exteriorFeatures: "Бассейн, барбекю-зона, терраса, ландшафтный сад",
    parkingAvailability: "Гараж на 3 машины + гостевая парковка",
    listingDate: new Date("2026-02-10"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Брошюра объекта.pdf", "Планировка.pdf"),
    verificationStatus: "verified",
    verificationScore: 98,
    featuredCollections: ["verified", "family-homes"],
  },
  {
    name: "Коттедж в Новогорске",
    publicSlug: "cottage-novogorsk-olympic",
    propertyAddress: "Московская обл., Химки, Новогорск, Олимпийская ул., 28",
    listingPrice: 65000000,
    propertyType: "House",
    listingStatus: "Available",
    numberofBedrooms: 4,
    numberofBathrooms: 3,
    squareFootage: "350 м²",
    yearBuilt: 2020,
    lotSize: "12 соток",
    propertyDescription:
      "Современный коттедж с вторым светом, террасой и семейной планировкой в закрытом поселке рядом со школой и спорткомплексом.",
    marketingDescription:
      "Готовый семейный дом с удобной логистикой, охраной и качественным инженерным пакетом.",
    communityAmenities: "Охрана, парк, детский клуб, фитнес, школа",
    appliancesIncluded:
      "Кухонный гарнитур, встроенная техника, системы хранения",
    heatingAndCoolingSystems: "Газовый котел, кондиционирование, теплые полы",
    flooringType: "Паркет, керамогранит",
    exteriorFeatures: "Терраса, участок с газоном, фасадная подсветка",
    parkingAvailability: "Гараж на 2 машины",
    listingDate: new Date("2026-02-24"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Технический паспорт.pdf"),
    verificationStatus: "verified",
    verificationScore: 91,
    featuredCollections: ["family-homes", "verified"],
  },
  {
    name: "Вилла в Барвихе",
    publicSlug: "villa-barvikha-luxury",
    propertyAddress:
      "Московская обл., Одинцовский р-н, Барвиха, Luxury Village, 15",
    listingPrice: 180000000,
    propertyType: "House",
    listingStatus: "New",
    numberofBedrooms: 6,
    numberofBathrooms: 5,
    squareFootage: "650 м²",
    yearBuilt: 2023,
    lotSize: "30 соток",
    propertyDescription:
      "Авторская вилла с бассейном, wellness-зоной, кинотеатром и приватным садом в одной из самых востребованных локаций Рублевки.",
    marketingDescription:
      "Флагманский объект для покупателей, которые ищут статусную резиденцию без компромиссов по инженерии и приватности.",
    communityAmenities:
      "Охрана, ресторанный сервис, spa, клубная инфраструктура",
    appliancesIncluded: "Chef kitchen, винный шкаф, smart home",
    heatingAndCoolingSystems: "Центральное отопление, VRV-система, теплый пол",
    flooringType: "Мрамор, ценные породы дерева",
    exteriorFeatures: "Открытый бассейн, зона BBQ, гостевой дом",
    parkingAvailability: "Гараж на 4 машины + гостевая парковка",
    listingDate: new Date("2026-03-12"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs(
      "Презентация виллы.pdf",
      "Юридический пакет.pdf",
    ),
    verificationStatus: "verified",
    verificationScore: 99,
    featuredCollections: ["family-homes", "verified"],
  },
  {
    name: "Элитные апартаменты в Москва-Сити",
    publicSlug: "moscow-city-federation-apartment",
    propertyAddress: "Москва, Пресненская наб., 12, Башня Федерация",
    listingPrice: 85000000,
    propertyType: "Apartment",
    listingStatus: "Available",
    numberofBedrooms: 3,
    numberofBathrooms: 3,
    squareFootage: "280 м²",
    yearBuilt: 2021,
    lotSize: "85 этаж",
    propertyDescription:
      "Апартаменты с панорамным видом на Москву, дизайнерской отделкой и сервисной инфраструктурой внутри башни.",
    marketingDescription:
      "Городской лот высокого класса для собственного проживания или статусной инвестиции в центральной деловой локации.",
    communityAmenities:
      "Консьерж 24/7, фитнес, бассейн, ресторан, бизнес-центр",
    appliancesIncluded: "Премиальная бытовая техника, система умный дом",
    heatingAndCoolingSystems: "Центральное кондиционирование, теплый пол",
    flooringType: "Натуральный камень, инженерная доска",
    exteriorFeatures: "Панорамные окна, skyline views",
    parkingAvailability: "2 места в подземном паркинге",
    listingDate: new Date("2026-01-19"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Паспорт объекта.pdf"),
    verificationStatus: "verified",
    verificationScore: 95,
    featuredCollections: ["city-apartments", "verified"],
  },
  {
    name: "Апартаменты в ЖК Садовые Кварталы",
    publicSlug: "sadovye-kvartaly-apartment",
    propertyAddress: "Москва, Комсомольский пр-т, 42",
    listingPrice: 45000000,
    propertyType: "Apartment",
    listingStatus: "Available",
    numberofBedrooms: 2,
    numberofBathrooms: 2,
    squareFootage: "120 м²",
    yearBuilt: 2019,
    lotSize: "10 этаж",
    propertyDescription:
      "Светлые апартаменты с окнами во двор, готовой отделкой и пешей доступностью до парков и ресторанов Хамовников.",
    marketingDescription:
      "Комфортный городской формат для покупателей, которым нужен центр, сервис и понятная ликвидность.",
    communityAmenities: "Охрана, консьерж, фитнес, внутренний парк",
    appliancesIncluded: "Кухня, техника, встроенные шкафы",
    heatingAndCoolingSystems: "Центральное отопление, кондиционирование",
    flooringType: "Паркетная доска, керамогранит",
    exteriorFeatures: "Панорамные окна, благоустроенный двор",
    parkingAvailability: "1 место в подземном паркинге",
    listingDate: new Date("2026-02-04"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Планировка.pdf"),
    verificationStatus: "verified",
    verificationScore: 88,
    featuredCollections: ["city-apartments"],
  },
  {
    name: "Пентхаус у City Park",
    publicSlug: "city-park-penthouse",
    propertyAddress: "Москва, Мантулинская ул., 9",
    listingPrice: 118000000,
    propertyType: "Apartment",
    listingStatus: "New",
    numberofBedrooms: 4,
    numberofBathrooms: 4,
    squareFootage: "310 м²",
    yearBuilt: 2025,
    lotSize: "Пентхаус",
    propertyDescription:
      "Двухуровневый пентхаус с террасой, видом на парк Красная Пресня и приватным лифтовым холлом.",
    marketingDescription:
      "Редкий городской объект для семьи, которой нужен премиальный жилой формат внутри центра Москвы.",
    communityAmenities: "Консьерж, spa, lounge, приватный двор",
    appliancesIncluded: "Полный kitchen pack, прачечная, smart lighting",
    heatingAndCoolingSystems: "VRV, теплый пол, приточно-вытяжная вентиляция",
    flooringType: "Камень, инженерная доска",
    exteriorFeatures: "Терраса, панорамное остекление",
    parkingAvailability: "2 семейных машиноместа",
    listingDate: new Date("2026-03-15"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Пентхаус-презентация.pdf", "План этажа.pdf"),
    verificationStatus: "verified",
    verificationScore: 97,
    featuredCollections: ["city-apartments", "verified"],
  },
  {
    name: "Участок в Барвихе Luxury Village",
    publicSlug: "barvikha-luxury-village-land",
    propertyAddress:
      "Московская обл., Одинцовский р-н, Барвиха, Luxury Village",
    listingPrice: 95000000,
    propertyType: "Land",
    listingStatus: "Available",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    squareFootage: "0 м²",
    yearBuilt: 0,
    lotSize: "25 соток",
    propertyDescription:
      "Участок в престижном поселке с центральными коммуникациями, ровным рельефом и высокой приватностью застройки.",
    marketingDescription:
      "Редкое земельное предложение для строительства частной резиденции в top-tier поселке Подмосковья.",
    communityAmenities: "Охрана, школа, spa, ресторанный кластер",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Центральные коммуникации по границе",
    flooringType: "Подготовленный участок",
    exteriorFeatures: "Лесная линия, тихая улица",
    parkingAvailability: "Гостевая парковка",
    listingDate: new Date("2026-01-31"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Кадастровая выписка.pdf", "ГПЗУ.pdf"),
    verificationStatus: "verified",
    verificationScore: 84,
    featuredCollections: ["investment-plots", "verified"],
  },
  {
    name: "Девелоперский участок на Новой Риге",
    publicSlug: "new-riga-development-land",
    propertyAddress: "Московская обл., Новорижское ш., 19 км",
    listingPrice: 160000000,
    propertyType: "Land",
    listingStatus: "Active",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    squareFootage: "0 м²",
    yearBuilt: 0,
    lotSize: "48 соток",
    propertyDescription:
      "Крупный участок под малоэтажный девелопмент или клубный семейный поселок рядом с существующей инфраструктурой.",
    marketingDescription:
      "Инвестиционный земельный актив с хорошей логистикой и понятным сценарием развития.",
    communityAmenities:
      "Выезд на магистраль, торговая галерея, школы, сервисный кластер",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Коммуникации рядом",
    flooringType: "Ровный рельеф",
    exteriorFeatures: "Угловой участок, длинный фасад",
    parkingAvailability: "Подъезд для строительной техники",
    listingDate: new Date("2026-03-02"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/461960/pexels-photo-461960.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Инвест-мемо.pdf", "Схема участка.pdf"),
    verificationStatus: "verified",
    verificationScore: 86,
    featuredCollections: ["investment-plots", "verified"],
  },
  {
    name: "Участок у Истринского водохранилища",
    publicSlug: "istra-lake-land",
    propertyAddress: "Московская обл., Истринский р-н, прибрежная линия",
    listingPrice: 54000000,
    propertyType: "Land",
    listingStatus: "New",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    squareFootage: "0 м²",
    yearBuilt: 0,
    lotSize: "18 соток",
    propertyDescription:
      "Видовой участок для частного дома или boutique rental-проекта с доступом к воде и готовым подъездом.",
    marketingDescription:
      "Понятный земельный лот под строительство загородного дома с высоким спросом на посуточную аренду.",
    communityAmenities: "Пляж, яхт-клуб, охрана поселка",
    appliancesIncluded: "Не применимо",
    heatingAndCoolingSystems: "Точки подключения подготовлены",
    flooringType: "Природный рельеф",
    exteriorFeatures: "Вид на воду, лесная линия",
    parkingAvailability: "Гостевой карман у въезда",
    listingDate: new Date("2026-03-18"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/461960/pexels-photo-461960.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Схема поселка.pdf"),
    verificationStatus: "pending",
    verificationScore: 73,
    featuredCollections: ["investment-plots"],
  },
  {
    name: "Торговая галерея Белая Площадь",
    publicSlug: "belaya-ploshad-retail-gallery",
    propertyAddress: "Москва, Лесная ул., 5, retail gallery",
    listingPrice: 210000000,
    propertyType: "Commercial",
    listingStatus: "Available",
    numberofBedrooms: 0,
    numberofBathrooms: 3,
    squareFootage: "420 м²",
    yearBuilt: 2024,
    lotSize: "Street retail",
    propertyDescription:
      "Угловой retail-блок с высоким пешеходным трафиком под flagship store, showroom или premium clinic.",
    marketingDescription:
      "Премиальный торговый лот в сильной центральной локации с высокой видимостью и готовой витринной фасадной частью.",
    communityAmenities:
      "Метро, офисный кластер, рестораны, премиальная аудитория",
    appliancesIncluded: "Система доступа, lighting tracks, security shutters",
    heatingAndCoolingSystems: "Коммерческий HVAC",
    flooringType: "Камень, polished concrete",
    exteriorFeatures: "Двойной фасад, signage zone",
    parkingAvailability: "Гостевая парковка и зона разгрузки",
    listingDate: new Date("2026-02-14"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs(
      "Коммерческие условия.pdf",
      "План арендатора.pdf",
    ),
    verificationStatus: "verified",
    verificationScore: 90,
    featuredCollections: ["premium-commercial", "verified"],
  },
  {
    name: "Офисный этаж в Москва-Сити",
    publicSlug: "moscow-city-office-floor",
    propertyAddress: "Москва, Пресненская наб., 8, БЦ Город Столиц",
    listingPrice: 320000000,
    propertyType: "Commercial",
    listingStatus: "Active",
    numberofBedrooms: 0,
    numberofBathrooms: 4,
    squareFootage: "560 м²",
    yearBuilt: 2023,
    lotSize: "Офисный этаж",
    propertyDescription:
      "Готовый представительский офис с reception-зоной, board room, кабинетами партнёров и видом на деловой центр Москвы.",
    marketingDescription:
      "Премиальная коммерческая недвижимость для private wealth, legal и advisory-команд, которым важен статус адреса.",
    communityAmenities: "Валет, concierge lobby, конференц-сервис, рестораны",
    appliancesIncluded: "AV-пакет, серверная, система контроля доступа",
    heatingAndCoolingSystems: "BMS, VRV, приточно-вытяжная вентиляция",
    flooringType: "Инженерная доска, акустический ковролин",
    exteriorFeatures: "Панорамный фасад, private client lounge",
    parkingAvailability: "10 мест в подземном паркинге",
    listingDate: new Date("2026-03-06"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs(
      "Fit-out package.pdf",
      "Коммерческое предложение.pdf",
    ),
    verificationStatus: "verified",
    verificationScore: 96,
    featuredCollections: ["premium-commercial", "verified"],
  },
  {
    name: "Шоурум на Патриарших",
    publicSlug: "patriarchy-showroom",
    propertyAddress: "Москва, Малая Бронная, 24",
    listingPrice: 175000000,
    propertyType: "Commercial",
    listingStatus: "New",
    numberofBedrooms: 0,
    numberofBathrooms: 2,
    squareFootage: "260 м²",
    yearBuilt: 2025,
    lotSize: "Street retail",
    propertyDescription:
      "Бутик-пространство на первой линии под showroom, jewelry concept или gallery retail с private client room.",
    marketingDescription:
      "Адресный коммерческий лот в зоне с сильным luxury-footfall и понятным брендовым позиционированием.",
    communityAmenities:
      "Премиальный стрит-ритейл, рестораны, affluent audience",
    appliancesIncluded: "Световой трек, security pack, дизайнерский fit-out",
    heatingAndCoolingSystems: "Коммерческий HVAC",
    flooringType: "Натуральный камень, инженерная доска",
    exteriorFeatures: "Парадная витрина, отдельный вход",
    parkingAvailability: "Городская парковка и valet nearby",
    listingDate: new Date("2026-03-20"),
    propertyPhotos: buildPhotos(
      "https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=1200",
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ),
    floorPlans: buildPhotos(
      "https://placehold.co/1200x800/f7f4ec/2d3748?text=Premium+Estate+Floor+Plan",
    ),
    propertyDocuments: buildDocs("Showroom pack.pdf"),
    verificationStatus: "verified",
    verificationScore: 87,
    featuredCollections: ["premium-commercial"],
  },
];

const enrichProperty = (property, ownerId) => {
  const createdDate =
    property.createdDate || property.listingDate || new Date();

  return {
    deleted: false,
    featuredCollections: [],
    verificationStatus: "pending",
    verificationScore: 0,
    propertyPhotos: [],
    floorPlans: [],
    propertyDocuments: [],
    createdDate,
    updatedDate: new Date(),
    publicSlug:
      property.publicSlug ||
      slugify(property.name || property.propertyAddress || "property"),
    createBy: ownerId || null,
    ...property,
    createdDate,
    updatedDate: new Date(),
  };
};

async function seedDatabase() {
  try {
    await connectWithFallback({
      primaryUri: process.env.DB_URL || "mongodb://127.0.0.1:27017",
      fallbackUri: process.env.DB_URL_FALLBACK || "",
      dbName: process.env.DB || "PremiumEstateDB",
      context: "seed-properties",
    });

    const ensureAdminUser = async () => {
      const existing =
        (await User.findOne({ deleted: false, role: "superAdmin" })) ||
        (await User.findOne({ deleted: false }));

      if (existing?._id) return existing;

      const email = String(process.env.ADMIN_EMAIL || "admin@gmail.com")
        .trim()
        .toLowerCase();
      const password = String(process.env.ADMIN_PASSWORD || "").trim();
      if (!password) {
        throw new Error(
          "No users found in DB and ADMIN_PASSWORD is not set. Set ADMIN_PASSWORD in server/.env so the seeder can create an admin.",
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const created = await User.create({
        username: email,
        email,
        password: hashedPassword,
        firstName: process.env.ADMIN_FIRST_NAME || "Premium",
        lastName: process.env.ADMIN_LAST_NAME || "Estate",
        phoneNumber: process.env.ADMIN_PHONE || "",
        role: "superAdmin",
        deleted: false,
        createdDate: new Date(),
      });

      return created;
    };

    const owner = await ensureAdminUser();
    if (!owner?._id) {
      throw new Error(
        "No active user found to assign as createBy. Create an admin user first (superAdmin) and re-run seeding.",
      );
    }

    const collection = mongoose.connection.db.collection("Properties");
    let created = 0;
    let updated = 0;

    for (const property of sampleProperties) {
      const document = enrichProperty(property, owner._id);
      const { createdDate, ...documentWithoutCreatedDate } = document;
      const existing = await collection.findOne(
        { publicSlug: document.publicSlug },
        { projection: { _id: 1 } },
      );

      await collection.updateOne(
        { publicSlug: document.publicSlug },
        {
          $set: documentWithoutCreatedDate,
          $setOnInsert: {
            createdDate,
          },
        },
        { upsert: true },
      );

      if (existing) {
        updated += 1;
      } else {
        created += 1;
      }
    }

    // Console statement removed
    if (!owner?._id) {
      // Console statement removed
    }
    // Console statement removed
    // Console statement removed
    // Console statement removed
    // Console statement removed
    // Console statement removed
    // Console statement removed
  } catch (error) {
    console.error("[seed:properties] Failed:", error?.message || error);
    if (error?.stack) {
      console.error(error.stack);
    }
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

seedDatabase();
