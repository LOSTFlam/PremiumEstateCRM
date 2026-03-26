const mongoose = require('mongoose');
require('dotenv').config();

const propertySchema = new mongoose.Schema({
  name: String,
  propertyAddress: String,
  listingPrice: Number,
  propertyType: String,
  listingStatus: String,
  numberofBedrooms: Number,
  numberofBathrooms: Number,
  squareFootage: Number,
  yearBuilt: Number,
  lotSize: String,
  propertyDescription: String,
  marketingDescription: String,
  propertyPhotos: [{ img: String }],
  floorPlans: [{ img: String }],
  propertyDocuments: [{ img: String }],
  communityAmenities: String,
  heatingAndCoolingSystems: String,
  flooringType: String,
  parkingAvailability: String,
  listingDate: Date,
  updatedDate: Date,
  createBy: String,
  deleted: Boolean,
});

const Property = mongoose.model('Property', propertySchema);

const sampleProperties = [
  {
    name: "Роскошная вилла в Жуковке",
    propertyAddress: "Московская обл., Жуковка, Рублево-Успенское ш., 45",
    listingPrice: 125000000,
    propertyType: "House",
    listingStatus: "Available",
    numberofBedrooms: 5,
    numberofBathrooms: 4,
    squareFootage: 450,
    yearBuilt: 2022,
    lotSize: "15 соток",
    propertyDescription: "Роскошная вилла в престижном районе Жуковки. Современная архитектура, панорамные окна, дизайнерский ремонт. Закрытая охраняемая территория, бассейн, гараж на 3 машины.",
    marketingDescription: "Эксклюзивная вилла премиум-класса в одном из самых престижных районов Подмосковья. Идеальное сочетание комфорта, безопасности и приватности.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" },
      { img: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800" },
      { img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800" },
    ],
    floorPlans: [{ img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }],
    communityAmenities: "Охрана 24/7, бассейн, теннисный корт, детская площадка, фитнес-центр",
    heatingAndCoolingSystems: "Центральное отопление, кондиционирование Daikin, теплый пол",
    flooringType: "Натуральный мрамор, паркет из дуба",
    parkingAvailability: "Гараж на 3 машины + гостевая парковка",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
  {
    name: "Элитные апартаменты в Москва-Сити",
    propertyAddress: "Москва, Пресненская наб., 12 (Башня Федерация)",
    listingPrice: 85000000,
    propertyType: "Apartment",
    listingStatus: "Available",
    numberofBedrooms: 3,
    numberofBathrooms: 3,
    squareFootage: 280,
    yearBuilt: 2021,
    lotSize: "85 этаж",
    propertyDescription: "Роскошные апартаменты в башне Федерация с панорамным видом на Москву. Дизайнерский ремонт, мебель от ведущих итальянских брендов, система умный дом.",
    marketingDescription: "Жизнь на вершине успеха! Апартаменты премиум-класса в самом высоком здании Европы с breathtaking видами на столицу.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800" },
      { img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" },
      { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800" },
    ],
    floorPlans: [{ img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }],
    communityAmenities: "Консьерж 24/7, фитнес-центр, бассейн, ресторан, бизнес-центр",
    heatingAndCoolingSystems: "Центральное кондиционирование, теплый пол",
    flooringType: "Натуральный камень, паркет",
    parkingAvailability: "2 машиноместа в подземном паркинге",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
  {
    name: "Участок в Барвихе Luxury Village",
    propertyAddress: "Московская обл., Одинцовский р-н, Барвиха, Luxury Village",
    listingPrice: 95000000,
    propertyType: "Land",
    listingStatus: "Available",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    squareFootage: 0,
    yearBuilt: 0,
    lotSize: "25 соток",
    propertyDescription: "Участок в престижном коттеджном поселке Барвиха Luxury Village. Все центральные коммуникации, охраняемая территория, инфраструктура поселка 5*.",
    marketingDescription: "Уникальная возможность приобрести участок в одном из самых престижных поселков Подмосковья. Готовая инфраструктура, охрана 24/7, все коммуникации.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
      { img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" },
    ],
    floorPlans: [],
    communityAmenities: "Охрана 24/7, школа, детский сад, фитнес-центр, рестораны, спа",
    heatingAndCoolingSystems: "Все центральные коммуникации",
    flooringType: "-",
    parkingAvailability: "Гостевая парковка",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
  {
    name: "Коттедж в Новогорске",
    propertyAddress: "Московская обл., Химки, Новогорск, Олимпийская ул., 28",
    listingPrice: 65000000,
    propertyType: "House",
    listingStatus: "Available",
    numberofBedrooms: 4,
    numberofBathrooms: 3,
    squareFootage: 350,
    yearBuilt: 2020,
    lotSize: "12 соток",
    propertyDescription: "Современный коттедж в закрытом поселке Новогорск. Панорамное остекление, второй свет, терраса, гараж. Закрытая охраняемая территория.",
    marketingDescription: "Стильный современный дом в престижном районе. Идеальное сочетание комфорта, безопасности и удобной транспортной доступности.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
      { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" },
      { img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800" },
    ],
    floorPlans: [{ img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }],
    communityAmenities: "Охрана 24/7, детский сад, школа, фитнес-центр, парк",
    heatingAndCoolingSystems: "Газовое отопление, кондиционирование",
    flooringType: "Паркет, керамогранит",
    parkingAvailability: "Гараж на 2 машины",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
  {
    name: "Апартаменты в ЖК «Садовые Кварталы»",
    propertyAddress: "Москва, Комсомольский пр-т, 42",
    listingPrice: 45000000,
    propertyType: "Apartment",
    listingStatus: "Available",
    numberofBedrooms: 2,
    numberofBathrooms: 2,
    squareFootage: 120,
    yearBuilt: 2019,
    lotSize: "10 этаж",
    propertyDescription: "Светлые апартаменты в ЖК бизнес-класса. Панорамные окна, дизайнерский ремонт, мебель и техника премиум-класса. Закрытая территория, подземный паркинг.",
    marketingDescription: "Идеальные апартаменты для комфортной жизни в центре Москвы. Премиальная отделка, развитая инфраструктура, отличная транспортная доступность.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800" },
      { img: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800" },
    ],
    floorPlans: [{ img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" }],
    communityAmenities: "Охрана, консьерж, фитнес-центр, детский сад, парк",
    heatingAndCoolingSystems: "Центральное отопление, кондиционирование",
    flooringType: "Паркетная доска, керамогранит",
    parkingAvailability: "1 машиноместо в подземном паркинге",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
  {
    name: "Вилла в Барвихе",
    propertyAddress: "Московская обл., Одинцовский р-н, Барвиха, ул.Luxury, 15",
    listingPrice: 180000000,
    propertyType: "House",
    listingStatus: "Available",
    numberofBedrooms: 6,
    numberofBathrooms: 5,
    squareFootage: 650,
    yearBuilt: 2023,
    lotSize: "30 соток",
    propertyDescription: "Эксклюзивная вилла в самом престижном районе Подмосковья. Авторская архитектура, дизайнерский интерьер, бассейн, спа, кинотеатр, винный погреб.",
    marketingDescription: "Шедевр современной архитектуры в сердце Барвихи. Роскошь, комфорт и приватность высшего уровня. Дом для тех, кто привык к лучшему.",
    propertyPhotos: [
      { img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" },
      { img: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800" },
      { img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800" },
      { img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
    ],
    floorPlans: [
      { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" },
      { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" },
    ],
    communityAmenities: "Охрана 24/7, бассейн, теннисный корт, спа, кинотеатр, ресторан",
    heatingAndCoolingSystems: "Центральное отопление, кондиционирование Daikin, теплый пол",
    flooringType: "Натуральный мрамор, паркет из ценных пород дерева",
    parkingAvailability: "Гараж на 4 машины + гостевая парковка",
    listingDate: new Date(),
    updatedDate: new Date(),
    createBy: "admin",
    deleted: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017', {
      dbName: process.env.DB || 'PremiumEstateDB',
    });

    console.log('✅ Подключено к базе данных');

    // Очистить существующие данные
    await Property.deleteMany({});
    console.log('🗑️  Старые данные удалены');

    // Добавить новые данные
    const inserted = await Property.insertMany(sampleProperties);
    console.log(`✅ Добавлено ${inserted.length} объектов недвижимости`);

    console.log('\n📊 Примеры добавленных объектов:');
    inserted.forEach((prop, i) => {
      console.log(`\n${i + 1}. ${prop.name}`);
      console.log(`   Цена: ${prop.listingPrice.toLocaleString('ru-RU')} ₽`);
      console.log(`   Адрес: ${prop.propertyAddress}`);
      console.log(`   Тип: ${prop.propertyType}`);
      console.log(`   Спальни: ${prop.numberofBedrooms}, Ванные: ${prop.numberofBathrooms}`);
      console.log(`   Площадь: ${prop.squareFootage} м²`);
    });

    console.log('\n✅ База данных успешно заполнена!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
}

seedDatabase();
