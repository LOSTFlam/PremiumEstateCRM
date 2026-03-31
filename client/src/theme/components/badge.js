import { mode } from "@chakra-ui/theme-tools";
export const badgeStyles = {
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "9999px",
        lineHeight: "100%",
        padding: "8px",
        paddingLeft: "14px",
        paddingRight: "14px",
        fontWeight: "600",
        letterSpacing: "-0.01em",
      },
      variants: {
        outline: () => ({
          borderRadius: "9999px",
        }),
        brand: (props) => ({
          bg: mode("brand.100", "brand.400")(props),
          color: mode("brand.700", "white")(props),
          _focus: {
            bg: mode("brand.100", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.200", "brand.400")(props),
          },
          _hover: {
            bg: mode("brand.200", "brand.400")(props),
          },
        }),
      },
    },
  },
};
