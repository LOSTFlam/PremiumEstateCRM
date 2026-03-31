import { mode } from "@chakra-ui/theme-tools";
export const textareaStyles = {
  components: {
    Textarea: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: "18px",
        },
      },

      variants: {
        main: (props) => ({
          field: {
            bg: mode("rgba(255, 255, 255, 0.9)", "navy.800")(props),
            border: "1px solid !important",
            color: mode("gray.800", "white")(props),
            borderColor: mode("secondaryGray.300", "whiteAlpha.100")(props),
            borderRadius: "18px",
            fontSize: "sm",
            p: "20px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        auth: () => ({
          field: {
            bg: "rgba(255, 255, 255, 0.88)",
            border: "1px solid",
            borderColor: "secondaryGray.300",
            color: "gray.800",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        authSecondary: () => ({
          field: {
            bg: "rgba(255, 255, 255, 0.88)",
            border: "1px solid",
            borderColor: "secondaryGray.300",
            color: "gray.800",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        search: () => ({
          field: {
            border: "none",
            py: "11px",
            borderRadius: "inherit",
            color: "gray.800",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
      },
    },
  },
};
