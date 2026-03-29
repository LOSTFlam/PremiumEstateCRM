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
    page: "linear-gradient(180deg, #08111a 0%, #101924 38%, #162334 100%)",
    pageLight: "linear-gradient(180deg, #f4eee5 0%, #ece3d7 100%)",
    hero:
      "radial-gradient(circle at 20% 12%, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0) 32%), radial-gradient(circle at 88% 10%, rgba(185,119,55,0.22) 0%, rgba(185,119,55,0) 28%), linear-gradient(145deg, #08111a 0%, #121b28 38%, #162334 100%)",
    brass: "linear-gradient(135deg, rgba(243,217,161,0.95) 0%, rgba(212,175,55,0.92) 48%, rgba(166,106,45,0.95) 100%)",
    lightBrass: "linear-gradient(135deg, rgba(247,231,206,0.96) 0%, rgba(238,223,198,0.92) 100%)",
    panel: "linear-gradient(160deg, rgba(18,29,43,0.98) 0%, rgba(22,35,52,0.96) 100%)",
    panelLight: "linear-gradient(145deg, rgba(255,250,244,0.98) 0%, rgba(241,233,223,0.96) 100%)",
    accentLine: "linear-gradient(90deg, rgba(243,217,161,0) 0%, rgba(212,175,55,0.85) 50%, rgba(185,119,55,0) 100%)",
  },
  shadows: {
    soft: "0 28px 80px rgba(6, 10, 16, 0.18)",
    deep: "0 35px 100px rgba(4, 8, 14, 0.38)",
    glow: "0 24px 70px rgba(185, 119, 55, 0.18)",
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
