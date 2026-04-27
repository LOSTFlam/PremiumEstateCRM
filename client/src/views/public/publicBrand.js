import publicBrandPrimary from "assets/img/layout/public-brand-primary.svg";
import publicBrandMark from "assets/img/layout/public-brand-mark.svg";
import publicBrandMono from "assets/img/layout/public-brand-monochrome.svg";
import brandIconStacked from "assets/img/layout/brand-icon-stacked.svg";

export const PUBLIC_FORCE_LOCAL_BRAND = true;

export const publicBrand = {
  name: "Premium Estate",
  colors: {
    ink: "#08111a",
    inkSoft: "#101a25",
    inkElevated: "#152130",
    inkMuted: "#1b2838",
    paper: "#f3ede3",
    paperMuted: "#ebe3d7",
    panel: "#121d2b",
    panelRaised: "#192433",
    line: "rgba(227, 211, 184, 0.16)",
    lineStrong: "rgba(227, 211, 184, 0.28)",
    text: "#f8f4ea",
    textMuted: "rgba(224, 231, 240, 0.74)",
    textSoft: "#68768a",
    gold: "#d4af37",
    champagne: "#f7e7ce",
    copper: "#b97737",
    moss: "#55686a",
    success: "#8fc19a",
  },
  gradients: {
    page: "radial-gradient(circle at 18% -8%, rgba(247,231,206,0.12) 0%, rgba(247,231,206,0) 28%), radial-gradient(circle at 82% -12%, rgba(143,193,154,0.10) 0%, rgba(143,193,154,0) 24%), linear-gradient(180deg, #0c141e 0%, #162132 38%, #263447 100%)",
    pageLight: "linear-gradient(180deg, #f4eee5 0%, #ece3d7 100%)",
    hero: "radial-gradient(circle at 14% 14%, rgba(247,231,206,0.20) 0%, rgba(247,231,206,0) 30%), radial-gradient(circle at 84% 8%, rgba(185,119,55,0.24) 0%, rgba(185,119,55,0) 26%), radial-gradient(circle at 72% 68%, rgba(143,193,154,0.12) 0%, rgba(143,193,154,0) 24%), linear-gradient(145deg, #0d1620 0%, #172434 42%, #28384b 100%)",
    brass:
      "linear-gradient(135deg, rgba(243,217,161,0.95) 0%, rgba(212,175,55,0.92) 48%, rgba(166,106,45,0.95) 100%)",
    lightBrass: "linear-gradient(135deg, rgba(247,231,206,0.96) 0%, rgba(238,223,198,0.92) 100%)",
    panel: "linear-gradient(140deg, rgba(18,29,43,0.76) 0%, rgba(25,36,51,0.58) 46%, rgba(31,43,61,0.70) 100%)",
    panelLight: "linear-gradient(145deg, rgba(255,250,244,0.84) 0%, rgba(246,239,231,0.78) 52%, rgba(239,231,221,0.84) 100%)",
    accentLine:
      "linear-gradient(90deg, rgba(243,217,161,0) 0%, rgba(212,175,55,0.85) 50%, rgba(185,119,55,0) 100%)",
  },
  shadows: {
    soft: "0 22px 54px rgba(10, 16, 24, 0.16), 0 2px 0 rgba(255,255,255,0.28) inset",
    deep: "0 30px 90px rgba(4, 8, 14, 0.28), 0 2px 0 rgba(255,255,255,0.16) inset",
    glow: "0 24px 70px rgba(185, 119, 55, 0.14)",
    inset: "inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  radii: {
    xl: "36px",
    lg: "30px",
    md: "22px",
    sm: "18px",
  },
};

export const publicBrandAssets = {
  primary: publicBrandPrimary,
  mark: publicBrandMark,
  mono: publicBrandMono,
  stacked: brandIconStacked,
};

export const publicFallbackBrandRecord = {
  _id: "public-brand-local-fallback",
  isActive: true,
  logoLgImg: publicBrandPrimary,
  logoSmImg: publicBrandMark,
  logoLgImgMono: publicBrandMono,
  logoStacked: brandIconStacked,
};

export const resolvePublicBrandRecord = (remoteBrandRecord) =>
  PUBLIC_FORCE_LOCAL_BRAND
    ? publicFallbackBrandRecord
    : remoteBrandRecord || publicFallbackBrandRecord;

export const getPublicTagline = (language = "en") =>
  String(language).toLowerCase().startsWith("ru")
    ? "Кураторская недвижимость и частный брокеридж"
    : "Curated Estates & Private Brokerage";

export const getPublicSubline = (language = "en") =>
  String(language).toLowerCase().startsWith("ru")
    ? "Инвестиции, резиденции и приватные сделки"
    : "Residences, investments, and private transactions";

export const publicPanelStyles = {
  dark: {
    bg: publicBrand.gradients.panel,
    border: `1px solid ${publicBrand.colors.line}`,
    boxShadow: `${publicBrand.shadows.deep}, ${publicBrand.shadows.inset}`,
    color: publicBrand.colors.text,
  },
  light: {
    bg: publicBrand.gradients.panelLight,
    border: `1px solid rgba(9, 18, 32, 0.08)`,
    boxShadow: publicBrand.shadows.soft,
    color: publicBrand.colors.ink,
  },
  ghost: {
    bg: "rgba(255,255,255,0.05)",
    border: `1px solid ${publicBrand.colors.lineStrong}`,
    backdropFilter: "blur(16px)",
    color: publicBrand.colors.text,
  },
};
