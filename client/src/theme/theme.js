import { extendTheme } from "@chakra-ui/react";
import { CardComponent } from "./additions/card/card";
import { buttonStyles } from "./components/button";
import { badgeStyles } from "./components/badge";
import { inputStyles } from "./components/input";
import { progressStyles } from "./components/progress";
import { sliderStyles } from "./components/slider";
import { textareaStyles } from "./components/textarea";
import { switchStyles } from "./components/switch";
import { linkStyles } from "./components/link";
import { globalStyles } from "./styles";
import foundations from "./foundations";

export default extendTheme(
  foundations,
  globalStyles,
  badgeStyles,
  buttonStyles,
  linkStyles,
  progressStyles,
  sliderStyles,
  inputStyles,
  textareaStyles,
  switchStyles,
  CardComponent,
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    styles: {
      global: {
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
        "*::selection": {
          bg: "gold.300",
          color: "white",
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          borderRadius: "full",
          fontWeight: "600",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
        variants: {
          brand: {
            bg: "gold.500",
            color: "white",
            _hover: {
              bg: "gold.600",
              transform: "translateY(-3px)",
              boxShadow: "0 8px 25px rgba(212, 175, 55, 0.2)",
            },
            _active: {
              transform: "translateY(-1px)",
              boxShadow: "premium",
            },
          },
        },
      },
      Input: {
        variants: {
          outline: {
            field: {
              _focus: {
                boxShadow: "0 0 0 3px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.1)",
                borderColor: "gold.400",
              },
            },
          },
        },
      },
      Card: {
        baseStyle: {
          container: {
            borderRadius: "2xl",
            boxShadow: "sm",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            _hover: {
              boxShadow: "hover-lift",
              transform: "translateY(-4px)",
            },
          },
        },
      },
    },
    fonts: {
      heading: '"Manrope", "Inter", -apple-system, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
    },
    radii: {
      none: "0",
      sm: "0.125rem",
      base: "0.25rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      "4xl": "2rem",
      premium: "2.5rem",
      full: "9999px",
    },
    transitions: {
      property: {
        common: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      easing: {
        "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
        "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      duration: {
        "ultra-fast": "50ms",
        faster: "100ms",
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
        slower: "800ms",
        "ultra-slow": "1s",
      },
    },
  }
);
