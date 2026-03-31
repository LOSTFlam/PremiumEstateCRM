import { mode } from "@chakra-ui/theme-tools";
export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "20px",
        boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
        transition:
          "background-color 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms cubic-bezier(0.22, 1, 0.36, 1), color 280ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
        boxSizing: "border-box",
        fontWeight: "600",
        letterSpacing: "0",
        _focus: {
          boxShadow: "0 0 0 3px rgba(10, 132, 255, 0.18)",
        },
        _active: {
          transform: "translateY(0)",
          boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
        },
      },
      variants: {
        outline: () => ({
          borderRadius: "20px",
        }),
        brand: (props) => ({
          bg: mode("brand.500", "brand.400")(props),
          color: "white",
          border: "1px solid transparent",
          _focus: {
            bg: mode("brand.500", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.600", "brand.500")(props),
          },
          _hover: {
            bg: mode("brand.600", "brand.400")(props),
            transform: "translateY(-1px)",
            boxShadow: "0 18px 42px rgba(10, 132, 255, 0.18)",
          },
        }),
        darkBrand: (props) => ({
          bg: mode("brand.900", "brand.400")(props),
          color: "white",
          _focus: {
            bg: mode("brand.900", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.900", "brand.400")(props),
          },
          _hover: {
            bg: mode("brand.800", "brand.400")(props),
          },
        }),
        lightBrand: (props) => ({
          bg: mode("brand.100", "whiteAlpha.100")(props),
          color: mode("brand.700", "white")(props),
          boxShadow: "none",
          _focus: {
            bg: mode("brand.100", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("brand.200", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("brand.200", "whiteAlpha.200")(props),
            transform: "translateY(-1px)",
            boxShadow: "0 16px 36px rgba(10, 132, 255, 0.1)",
          },
        }),
        light: (props) => ({
          bg: mode("secondaryGray.200", "whiteAlpha.100")(props),
          color: mode("gray.800", "white")(props),
          boxShadow: "none",
          _focus: {
            bg: mode("secondaryGray.200", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _hover: {
            bg: mode("secondaryGray.300", "whiteAlpha.200")(props),
            transform: "translateY(-1px)",
            boxShadow: "0 14px 32px rgba(15, 23, 42, 0.07)",
          },
        }),
        action: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("secondaryGray.100", "brand.400")(props),
          color: mode("brand.700", "white")(props),
          boxShadow: "none",
          _focus: {
            bg: mode("secondaryGray.100", "brand.400")(props),
          },
          _active: { bg: mode("secondaryGray.200", "brand.400")(props) },
          _hover: {
            bg: mode("secondaryGray.200", "brand.400")(props),
          },
        }),
        setup: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("transparent", "brand.400")(props),
          border: mode("1px solid", "0px solid")(props),
          borderColor: mode("secondaryGray.300", "transparent")(props),
          color: mode("gray.800", "white")(props),
          boxShadow: "none",
          _focus: {
            bg: mode("transparent", "brand.400")(props),
          },
          _active: { bg: mode("transparent", "brand.400")(props) },
          _hover: {
            bg: mode("secondaryGray.100", "brand.400")(props),
          },
        }),
      },
    },
  },
};
