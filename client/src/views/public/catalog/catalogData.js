import { t } from 'i18next';

// Helper to create photo sets
export const makePhotoSet = ({ title, subtitle, primary, secondary, accent }) => [
  { img: `https://placehold.co/800x600/${primary.replace('#', '')}/${secondary.replace('#', '')}?text=${encodeURIComponent(title)}`, title, subtitle },
  { img: `https://placehold.co/800x600/${secondary.replace('#', '')}/${accent.replace('#', '')}?text=${encodeURIComponent(subtitle)}`, title, subtitle },
  { img: `https://placehold.co/800x600/${accent.replace('#', '')}/${primary.replace('#', '')}?text=${encodeURIComponent(title + ' ' + subtitle)}`, title, subtitle },
];

export const placeholderImage = "https://placehold.co/800x600/1a202c/ffffff?text=Property";

const docLink = (name) => ({ name, url: '#' });

export const getPropertyById = (properties, id) => properties?.find((p) => p?._id === id);

export const formatCompactNumber = (num) => {
  if (!num) return "0";
  return new Intl.NumberFormat("en-US", { notation: "compact", compactDisplay: "short" }).format(num);
};

export const samplePublicProperties = [
  {
    _id: "sample-rivera-villa",
    name: "Rivera Hills Villa",
    propertyType: "House",
    propertyAddress: "Silver Oak Avenue 18, Green Valley",
    listingPrice: "1250000",
    squareFootage: "420 m2",
    numberofBedrooms: 5,
    numberofBathrooms: 4,
    yearBuilt: 2023,
    lotSize: "12 sotok",
    parkingAvailability: "Garage for 2 cars + guest parking",
    listingStatus: "Available",
    listingDate: "2026-02-12",
    marketingDescription: "Private family villa with double-height living room, panoramic glazing, landscaped yard and barbecue terrace.",
    propertyDescription: "The house is designed for permanent residence, with a separate study, guest suite, utility room, smart climate control and a lounge block overlooking the garden.",
    communityAmenities: "Clubhouse, private school nearby, fitness studio, running routes",
    appliancesIncluded: "Built-in kitchen, wine cabinet, premium laundry equipment",
    heatingAndCoolingSystems: "Heat pump, underfloor heating, multi-zone air conditioning",
    flooringType: "Natural oak, porcelain stoneware, soft carpet in bedrooms",
    exteriorFeatures: "Landscaped plot, summer kitchen, outdoor fireplace, irrigation",
    propertyPhotos: makePhotoSet({
      title: "Villa",
      subtitle: "Panoramic family home",
      primary: "#153c47",
      secondary: "#7ca68b",
      accent: "#c47a3d",
    }),
    floorPlans: makePhotoSet({
      title: "Plan",
      subtitle: "Floor layout",
      primary: "#30555b",
      secondary: "#ac9b77",
      accent: "#5b7f5b",
    }).slice(0, 1),
    propertyDocuments: [docLink("Rivera brochure.pdf"), docLink("Technical specs.pdf")],
    unitType: [
      { _id: "rv-main", name: "Main residence", sqm: "420 m2", price: "1250000" },
      { _id: "rv-guest", name: "Guest studio", sqm: "46 m2", price: "95000" },
    ],
  },
  {
    _id: "sample-skyline-loft",
    name: "Skyline Loft Residence",
    propertyType: "Apartment",
    propertyAddress: "Central Embankment 4, Tower A",
    listingPrice: "345000",
    squareFootage: "118 m2",
    numberofBedrooms: 3,
    numberofBathrooms: 2,
    yearBuilt: 2025,
    lotSize: "Tower residence",
    parkingAvailability: "Underground parking, 1 reserved spot",
    listingStatus: "New",
    listingDate: "2026-03-05",
    marketingDescription: "Designer apartment with city panoramas, private lobby and concierge service.",
    propertyDescription: "A corner apartment with a living-dining zone, master suite, guest room, soundproof glazing, built-in storage and a smart lighting scenario system.",
    communityAmenities: "Concierge, fitness room, residents lounge, coworking, rooftop garden",
    appliancesIncluded: "Kitchen island, oven, dishwasher, washer-dryer",
    heatingAndCoolingSystems: "Central VRV, heated floors in bathrooms",
    flooringType: "Engineered board and porcelain tiles",
    exteriorFeatures: "Panoramic windows, loggia, facade lighting",
    propertyPhotos: makePhotoSet({
      title: "Loft",
      subtitle: "City skyline apartment",
      primary: "#232d4b",
      secondary: "#7187b9",
      accent: "#ce8741",
    }),
    floorPlans: makePhotoSet({
      title: "Layout",
      subtitle: "Apartment plan",
      primary: "#4b5877",
      secondary: "#9ca5c9",
      accent: "#cf9152",
    }).slice(0, 1),
    propertyDocuments: [docLink("Apartment passport.pdf")],
    unitType: [
      { _id: "sl-1", name: "3-bedroom residence", sqm: "118 m2", price: "345000" },
      { _id: "sl-2", name: "2-bedroom residence", sqm: "94 m2", price: "298000" },
    ],
  },
  {
    _id: "sample-forest-acre",
    name: "Forest Acre Plot",
    propertyType: "Land",
    propertyAddress: "Pine Lake District, parcel 24",
    listingPrice: "92000",
    squareFootage: "1800 m2",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    yearBuilt: "-",
    lotSize: "18 sotok",
    parkingAvailability: "Road access for construction vehicles",
    listingStatus: "Available",
    listingDate: "2026-01-28",
    marketingDescription: "Development-ready plot for a country house or boutique rental project near the lake.",
    propertyDescription: "The parcel has a rectangular shape, utility access along the boundary, a paved road, mature trees and a quiet residential environment.",
    communityAmenities: "Lake access, gated entry, cycling routes, nearby resort",
    appliancesIncluded: "Not applicable",
    heatingAndCoolingSystems: "Utility connection point prepared",
    flooringType: "Natural terrain",
    exteriorFeatures: "Forest edge, slight elevation, sunset-facing side",
    propertyPhotos: makePhotoSet({
      title: "Plot",
      subtitle: "Land for development",
      primary: "#355d36",
      secondary: "#9bbd77",
      accent: "#a96c32",
    }),
    floorPlans: makePhotoSet({
      title: "Site",
      subtitle: "Plot scheme",
      primary: "#496c41",
      secondary: "#b0c585",
      accent: "#8c6030",
    }).slice(0, 1),
    propertyDocuments: [docLink("Plot zoning.pdf"), docLink("Cadastral extract.pdf")],
    unitType: [
      { _id: "fa-1", name: "Residential build scenario", sqm: "1800 m2", price: "92000" },
    ],
  },
  {
    _id: "sample-harbor-townhouse",
    name: "Harbor Townhouse",
    propertyType: "House",
    propertyAddress: "Marina Quarter 7, waterfront line",
    listingPrice: "680000",
    squareFootage: "236 m2",
    numberofBedrooms: 4,
    numberofBathrooms: 3,
    yearBuilt: 2024,
    lotSize: "4.6 sotok",
    parkingAvailability: "Covered parking for 2 cars",
    listingStatus: "Active",
    listingDate: "2026-02-25",
    marketingDescription: "Contemporary townhouse with rooftop lounge and direct marina promenade access.",
    propertyDescription: "Three-level residence with open-plan social floor, rooftop terrace, private patio, walk-in wardrobes and a dedicated cinema room.",
    communityAmenities: "Yacht club, restaurants, promenade, spa complex",
    appliancesIncluded: "Kitchen suite, climate package, integrated audio",
    heatingAndCoolingSystems: "Gas boiler, zoned cooling, heated terraces",
    flooringType: "Microcement, oak board",
    exteriorFeatures: "Rooftop deck, sea-facing balcony, facade illumination",
    propertyPhotos: makePhotoSet({
      title: "Townhouse",
      subtitle: "Marina lifestyle home",
      primary: "#0e4954",
      secondary: "#6aa7a2",
      accent: "#d0914f",
    }),
    floorPlans: makePhotoSet({
      title: "Roof",
      subtitle: "Townhouse levels",
      primary: "#3c6a74",
      secondary: "#89b6b3",
      accent: "#bf7d33",
    }).slice(0, 1),
    propertyDocuments: [docLink("Townhouse brochure.pdf")],
    unitType: [
      { _id: "ht-1", name: "Full townhouse", sqm: "236 m2", price: "680000" },
    ],
  },
  {
    _id: "sample-aurora-suites",
    name: "Aurora Suites",
    propertyType: "Apartment",
    propertyAddress: "Park Boulevard 21, Residence B",
    listingPrice: "219000",
    squareFootage: "76 m2",
    numberofBedrooms: 2,
    numberofBathrooms: 2,
    yearBuilt: 2026,
    lotSize: "Residential complex",
    parkingAvailability: "Shared underground parking",
    listingStatus: "Available",
    listingDate: "2026-03-08",
    marketingDescription: "Compact premium apartment for city living or rental income near the central park.",
    propertyDescription: "The layout includes a kitchen-living room, master bedroom, flexible second room and large windows with a quiet courtyard orientation.",
    communityAmenities: "Park, playground, grocery gallery, yoga hall",
    appliancesIncluded: "Kitchen equipment package",
    heatingAndCoolingSystems: "Fan coil units, water floor heating in wet zones",
    flooringType: "Laminate, ceramic tiles",
    exteriorFeatures: "French balconies, landscaped courtyard",
    propertyPhotos: makePhotoSet({
      title: "Suites",
      subtitle: "Compact premium apartment",
      primary: "#54313f",
      secondary: "#c88ea5",
      accent: "#8a6132",
    }),
    floorPlans: makePhotoSet({
      title: "Unit",
      subtitle: "Residence plan",
      primary: "#785665",
      secondary: "#d5a3b7",
      accent: "#9f6b39",
    }).slice(0, 1),
    propertyDocuments: [docLink("Residence guide.pdf")],
    unitType: [
      { _id: "as-1", name: "2-room suite", sqm: "76 m2", price: "219000" },
      { _id: "as-2", name: "1-room suite", sqm: "58 m2", price: "179000" },
    ],
  },
  {
    _id: "sample-meadow-estates",
    name: "Meadow Estates Land",
    propertyType: "Land",
    propertyAddress: "North Meadows, sector C12",
    listingPrice: "64000",
    squareFootage: "1200 m2",
    numberofBedrooms: 0,
    numberofBathrooms: 0,
    yearBuilt: "-",
    lotSize: "12 sotok",
    parkingAvailability: "Public access road",
    listingStatus: "New",
    listingDate: "2026-03-11",
    marketingDescription: "Plot inside a new cottage settlement with central utilities and a fast route to the city.",
    propertyDescription: "Flat rectangular land parcel prepared for detached housing, with gas and power connection points and a finished gravel road network.",
    communityAmenities: "Security gate, sports field, pond, picnic area",
    appliancesIncluded: "Not applicable",
    heatingAndCoolingSystems: "Utility stub points",
    flooringType: "Prepared ground",
    exteriorFeatures: "Open meadow frontage, evening sun",
    propertyPhotos: makePhotoSet({
      title: "Meadow",
      subtitle: "Country land lot",
      primary: "#6a5d2c",
      secondary: "#c5b96f",
      accent: "#5d8440",
    }),
    floorPlans: makePhotoSet({
      title: "Parcel",
      subtitle: "Boundary scheme",
      primary: "#87793f",
      secondary: "#d4c784",
      accent: "#658d47",
    }).slice(0, 1),
    propertyDocuments: [docLink("Settlement plan.pdf")],
    unitType: [
      { _id: "me-1", name: "Detached home plot", sqm: "1200 m2", price: "64000" },
    ],
  },
  {
    _id: "sample-atrium-office",
    name: "Atrium Office Loft",
    propertyType: "Commercial",
    propertyAddress: "Business District, Avenue 9",
    listingPrice: "510000",
    squareFootage: "310 m2",
    numberofBedrooms: 0,
    numberofBathrooms: 3,
    yearBuilt: 2022,
    lotSize: "Business center",
    parkingAvailability: "6 reserved office slots",
    listingStatus: "Available",
    listingDate: "2026-02-02",
    marketingDescription: "Flexible office floor for headquarters, showroom or client-facing consulting space.",
    propertyDescription: "The property includes open work areas, executive offices, meeting rooms, reception, kitchen, server room and panoramic glazing.",
    communityAmenities: "Reception desk, security, conference hub, cafe, gym",
    appliancesIncluded: "Meeting room AV, kitchen line, access control",
    heatingAndCoolingSystems: "Central ventilation and climate automation",
    flooringType: "Commercial carpet and raised floor",
    exteriorFeatures: "Corner glazing, branded lobby",
    propertyPhotos: makePhotoSet({
      title: "Office",
      subtitle: "Commercial loft space",
      primary: "#2d3448",
      secondary: "#9aa4b7",
      accent: "#be8047",
    }),
    floorPlans: makePhotoSet({
      title: "Office",
      subtitle: "Workspace layout",
      primary: "#505a72",
      secondary: "#bcc4d3",
      accent: "#d08d4f",
    }).slice(0, 1),
    propertyDocuments: [docLink("Commercial fact sheet.pdf")],
    unitType: [
      { _id: "ao-1", name: "Full office floor", sqm: "310 m2", price: "510000" },
    ],
  },
  {
    _id: "sample-garden-courtyard",
    name: "Garden Courtyard Residence",
    propertyType: "Apartment",
    propertyAddress: "Botanical Lane 16, House 3",
    listingPrice: "287000",
    squareFootage: "102 m2",
    numberofBedrooms: 3,
    numberofBathrooms: 2,
    yearBuilt: 2024,
    lotSize: "Private courtyard",
    parkingAvailability: "Outdoor and underground spots",
    listingStatus: "Available",
    listingDate: "2026-02-18",
    marketingDescription: "Family apartment overlooking a green inner garden with low-rise premium surroundings.",
    propertyDescription: "A quiet residence with a spacious day zone, separate utility room, family storage, master suite and direct access to the landscaped podium.",
    communityAmenities: "Private garden, daycare, gym, cafe, parcel room",
    appliancesIncluded: "Kitchen set, bathroom furniture, built-in storage",
    heatingAndCoolingSystems: "Individual climate modules",
    flooringType: "Wood and soft ceramic tile",
    exteriorFeatures: "Garden-facing windows, terrace balcony",
    propertyPhotos: makePhotoSet({
      title: "Garden",
      subtitle: "Family residence",
      primary: "#325844",
      secondary: "#8db19b",
      accent: "#cb8d56",
    }),
    floorPlans: makePhotoSet({
      title: "Suite",
      subtitle: "Family plan",
      primary: "#4d7861",
      secondary: "#afccb8",
      accent: "#d79b63",
    }).slice(0, 1),
    propertyDocuments: [docLink("Residence booklet.pdf")],
    unitType: [
      { _id: "gc-1", name: "3-bedroom apartment", sqm: "102 m2", price: "287000" },
    ],
  },
];

export const parsePrice = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;

export const formatPrice = (value, t) => {
  const amount = parsePrice(value);
  if (!amount) return t?.("publicListing.priceOnRequest") || "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export const normalizeStatus = (status, t) => {
  if (!status) return t?.("modules.dashboardHome.statusAvailable") || "Available";
  return String(status)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getPrimaryImage = (property) =>
  property?.propertyPhotos?.[0]?.img || property?.floorPlans?.[0]?.img || "https://placehold.co/800x600";

export const getPhotoCount = (property) => Array.isArray(property?.propertyPhotos) ? property.propertyPhotos.length : 0;
export const getFloorPlanCount = (property) => Array.isArray(property?.floorPlans) ? property.floorPlans.length : 0;
export const getDocumentCount = (property) => Array.isArray(property?.propertyDocuments) ? property.propertyDocuments.length : 0;

export const isRichListing = (property) => {
  const hasDescription = Boolean(property?.marketingDescription || property?.propertyDescription);
  return getPhotoCount(property) >= 1 && hasDescription && (getFloorPlanCount(property) > 0 || getDocumentCount(property) > 0);
};

export const estimateMortgage = ({ price, downPaymentPercent = 30, years = 20, annualRate = 18 }) => {
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
  properties.map((p) => ({
    ...p,
    propertyType: normalizePropertyTypeKey(p?.propertyType),
  }));

export const splitFeatures = (...lists) =>
  lists
    .flat()
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter((item, idx, arr) => arr.indexOf(item) === idx);

export const buildHighlights = (property, t) => {
  const highlights = [];
  if (property?.yearBuilt && property.yearBuilt !== "-") highlights.push({ key: "yearBuilt", value: property.yearBuilt });
  if (property?.lotSize) highlights.push({ key: "lotSize", value: property.lotSize });
  if (property?.parkingAvailability) highlights.push({ key: "parking", value: property.parkingAvailability });
  return highlights;
};
