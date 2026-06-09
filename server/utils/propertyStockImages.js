const TYPE_PRESETS = {
  house: [
    {
      title: "Дом",
      subtitle: "Загородная резиденция",
      primary: "#153c47",
      secondary: "#7ca68b",
      accent: "#c47a3d",
    },
    {
      title: "Вилла",
      subtitle: "Частный дом",
      primary: "#243b32",
      secondary: "#8db39b",
      accent: "#c78d49",
    },
    {
      title: "Таунхаус",
      subtitle: "Семейный дом",
      primary: "#0e4954",
      secondary: "#6aa7a2",
      accent: "#d0914f",
    },
  ],
  apartment: [
    {
      title: "Квартира",
      subtitle: "Городская недвижимость",
      primary: "#232d4b",
      secondary: "#7187b9",
      accent: "#ce8741",
    },
    {
      title: "Апартаменты",
      subtitle: "Панорама города",
      primary: "#54313f",
      secondary: "#c88ea5",
      accent: "#8a6132",
    },
    {
      title: "Студия",
      subtitle: "Компактный формат",
      primary: "#325844",
      secondary: "#8db19b",
      accent: "#cb8d56",
    },
  ],
  land: [
    {
      title: "Участок",
      subtitle: "Земля под строительство",
      primary: "#355d36",
      secondary: "#9bbd77",
      accent: "#a96c32",
    },
    {
      title: "Земля",
      subtitle: "Загородный участок",
      primary: "#6a5d2c",
      secondary: "#c5b96f",
      accent: "#5d8440",
    },
    {
      title: "Площадка",
      subtitle: "Инвестиционный участок",
      primary: "#5c4b2e",
      secondary: "#c9b786",
      accent: "#607f45",
    },
  ],
  commercial: [
    {
      title: "Офис",
      subtitle: "Коммерческое пространство",
      primary: "#2d3448",
      secondary: "#9aa4b7",
      accent: "#be8047",
    },
    {
      title: "Ритейл",
      subtitle: "Торговое помещение",
      primary: "#3b3140",
      secondary: "#aa95b3",
      accent: "#c88648",
    },
    {
      title: "Бизнес",
      subtitle: "Представительский этаж",
      primary: "#283844",
      secondary: "#9ab1bf",
      accent: "#cf8b45",
    },
  ],
  floorPlan: [
    {
      title: "План",
      subtitle: "Планировка этажа",
      primary: "#30555b",
      secondary: "#ac9b77",
      accent: "#5b7f5b",
    },
  ],
  other: [
    {
      title: "Объект",
      subtitle: "Premium Estate",
      primary: "#1a202c",
      secondary: "#243b32",
      accent: "#d4af37",
    },
  ],
};

const normalizePropertyTypeKey = (value = "") => {
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

  if (normalized.includes("floor") || normalized.includes("plan") || normalized.includes("план")) {
    return "floorPlan";
  }

  return "other";
};

const deterministicIndex = (value = "", length = 1) => {
  if (length <= 1) return 0;
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % length;
};

const inlinePropertyImage = ({ title, subtitle, primary, secondary, accent }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${primary}"/>
          <stop offset="0.62" stop-color="${secondary}"/>
          <stop offset="1" stop-color="${accent}"/>
        </linearGradient>
        <radialGradient id="glow" cx="30%" cy="24%" r="70%">
          <stop offset="0" stop-color="rgba(255,255,255,0.32)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <rect width="1200" height="800" fill="url(#glow)"/>
      <path d="M120 560 L280 390 L420 470 L560 320 L820 560 Z" fill="rgba(255,255,255,0.22)"/>
      <circle cx="930" cy="170" r="72" fill="rgba(255,255,255,0.2)"/>
      <text x="90" y="120" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="58" font-weight="700">${title}</text>
      <text x="92" y="178" fill="rgba(255,255,255,0.76)" font-family="Arial, sans-serif" font-size="30">${subtitle}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const getStockImageForProperty = (propertyType, seed = "") => {
  const key = normalizePropertyTypeKey(propertyType);
  const presets = TYPE_PRESETS[key] || TYPE_PRESETS.other;
  const preset = presets[deterministicIndex(String(seed || propertyType || key), presets.length)];
  return inlinePropertyImage(preset);
};

const buildPhotoSet = (propertyType, seed = "", count = 3) =>
  Array.from({ length: count }, (_, index) => ({
    img: getStockImageForProperty(propertyType, `${seed}-${index}`),
  }));

module.exports = {
  buildPhotoSet,
  getStockImageForProperty,
  normalizePropertyTypeKey,
};
