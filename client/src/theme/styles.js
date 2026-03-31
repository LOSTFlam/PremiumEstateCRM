import { mode } from "@chakra-ui/theme-tools";
export const globalStyles = {
  colors: {
    brand: {
      100: "#EAF3FF",
      200: "#C6DDFF",
      300: "#9FC3FF",
      400: "#5FA0FF",
      500: "#0A84FF",
      600: "#0069D9",
      700: "#0051AB",
      800: "#003B7D",
      900: "#1F2937",
    },
    brandScheme: {
      100: "#EFF6FF",
      200: "#D9E8FF",
      300: "#BED7FF",
      400: "#93BAFF",
      500: "#0A84FF",
      600: "#0069D9",
      700: "#0051AB",
      800: "#003B7D",
      900: "#1E293B",
    },
    brandTabs: {
      100: "#EEF5FF",
      200: "#D7E7FF",
      300: "#BDD8FF",
      400: "#98BFFF",
      500: "#0A84FF",
      600: "#0069D9",
      700: "#0051AB",
      800: "#003B7D",
      900: "#243043",
    },
    secondaryGray: {
      100: "#F2F4F7",
      200: "#E8ECF1",
      300: "#DCE2EA",
      400: "#C9D1DC",
      500: "#98A2B3",
      600: "#667085",
      700: "#475467",
      800: "#344054",
      900: "#182230",
    },
    red: {
      100: "#FEF3F2",
      300: "#FDA29B",
      500: "#F04438",
      600: "#D92D20",
    },
    blue: {
      50: "#EFF8FF",
      500: "#0A84FF",
    },
    orange: {
      100: "#FFF7ED",
      400: "#FDBA74",
      500: "#F59E0B",
    },
    green: {
      100: "#ECFDF3",
      500: "#12B76A",
    },
    navy: {
      50: "#F8FAFC",
      100: "#E2E8F0",
      200: "#CBD5E1",
      300: "#94A3B8",
      400: "#64748B",
      500: "#475569",
      600: "#334155",
      700: "#1E293B",
      800: "#111827",
      900: "#0F172A",
    },
    gray: {
      100: "#F9FAFB",
      200: "#EAECF0",
      300: "#D0D5DD",
      400: "#98A2B3",
      500: "#667085",
      600: "#475467",
      700: "#344054",
      800: "#1D2939",
      900: "#101828",
    },
  },
  styles: {
    global: (props) => ({
      "html, body": {
        minHeight: "100%",
        bg: mode("#F5F5F7", "navy.900")(props),
        color: mode("gray.800", "white")(props),
      },
      body: {
        overflowX: "hidden",
        bg: mode(
          "linear-gradient(180deg, #FCFCFD 0%, #F3F4F6 40%, #ECEFF3 100%)",
          "navy.900",
        )(props),
        color: mode("gray.800", "white")(props),
        fontFamily:
          '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        letterSpacing: "0",
        lineHeight: "1.6",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      input: {
        color: "gray.800",
      },
      html: {
        fontFamily:
          '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        bg: mode("#F5F5F7", "navy.900")(props),
      },
      "#root": {
        minHeight: "100vh",
      },
      "p, .chakra-text, label, button, input, textarea, select, th, td": {
        letterSpacing: "0",
        lineHeight: "1.6",
      },
      "h1, h2, h3, h4, h5, h6, .chakra-heading": {
        letterSpacing: "-0.015em",
        lineHeight: "1.16",
        fontWeight: "600",
      },
      'html[lang="ru"] p, html[lang="ru"] .chakra-text, html[lang="ru"] label, html[lang="ru"] button, html[lang="ru"] input, html[lang="ru"] textarea, html[lang="ru"] select, html[lang="ru"] th, html[lang="ru"] td': {
        letterSpacing: "0",
        lineHeight: "1.68",
      },
      'html[lang="ru"] h1, html[lang="ru"] h2, html[lang="ru"] h3, html[lang="ru"] h4, html[lang="ru"] h5, html[lang="ru"] h6, html[lang="ru"] .chakra-heading': {
        letterSpacing: "0",
        lineHeight: "1.22",
      },
      "::selection": {
        bg: mode("rgba(10, 132, 255, 0.18)", "brand.600")(props),
        color: mode("gray.900", "white")(props),
      },
    }),
  },
};
