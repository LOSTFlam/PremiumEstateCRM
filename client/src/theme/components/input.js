import { mode } from "@chakra-ui/theme-tools";
export const inputStyles = {
  components: {
    Input: {
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
            border: "1px solid",
            color: mode("gray.800", "white")(props),
            borderColor: mode("secondaryGray.300", "whiteAlpha.100")(props),
            borderRadius: "18px",
            fontSize: "sm",
            p: "20px",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        auth: (props) => ({
          field: {
            fontWeight: "500",
            color: mode("gray.800", "white")(props),
            bg: mode("rgba(255, 255, 255, 0.88)", "transparent")(props),
            border: "1px solid",
            borderColor: mode(
              "secondaryGray.300",
              "rgba(135, 140, 189, 0.3)",
            )(props),
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500", fontWeight: "400" },
          },
        }),
        authSecondary: (props) => ({
          field: {
            bg: mode("rgba(255, 255, 255, 0.88)", "transparent")(props),
            border: "1px solid",
            borderColor: "secondaryGray.300",
            borderRadius: "18px",
            color: "gray.800",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        search: (props) => ({
          field: {
            border: "none",
            py: "11px",
            borderRadius: "inherit",
            color: mode("gray.800", "white")(props),
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: "18px",
        },
      },

      variants: {
        main: () => ({
          field: {
            bg: "rgba(255, 255, 255, 0.9)",
            border: "1px solid",
            color: "gray.800",
            borderColor: "secondaryGray.300",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        auth: () => ({
          field: {
            bg: "rgba(255, 255, 255, 0.88)",
            border: "1px solid",
            color: "gray.800",
            borderColor: "secondaryGray.300",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        authSecondary: () => ({
          field: {
            bg: "rgba(255, 255, 255, 0.88)",
            border: "1px solid",
            color: "gray.800",
            borderColor: "secondaryGray.300",
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
    Select: {
      baseStyle: {
        field: {
          fontWeight: 400,
        },
      },

      variants: {
        main: (props) => ({
          field: {
            bg: mode("rgba(255, 255, 255, 0.9)", "navy.800")(props),
            border: "1px solid",
            color: mode("gray.800", "white")(props),
            borderColor: mode("secondaryGray.300", "whiteAlpha.100")(props),
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
          icon: {
            color: "secondaryGray.600",
          },
        }),
        mini: (props) => ({
          field: {
            bg: mode("transparent", "navy.800")(props),
            border: "0px solid transparent",
            fontSize: "0px",
            p: "10px",
            _placeholder: { color: "secondaryGray.500" },
          },
          icon: {
            color: "secondaryGray.600",
          },
        }),
        subtle: (props) => ({
          box: {
            width: "unset",
          },
          field: {
            bg: "transparent",
            border: "0px solid",
            color: "gray.700",
            borderColor: "transparent",
            width: "max-content",
            _placeholder: { color: "secondaryGray.500" },
          },
          icon: {
            color: "secondaryGray.600",
          },
        }),
        transparent: (props) => ({
          field: {
            bg: "transparent",
            border: "0px solid",
            width: "min-content",
            color: mode("gray.700", "secondaryGray.600")(props),
            borderColor: "transparent",
            padding: "0px",
            paddingLeft: "8px",
            paddingRight: "20px",
            fontWeight: "700",
            fontSize: "14px",
            _placeholder: { color: "secondaryGray.500" },
          },
          icon: {
            transform: "none !important",
            position: "unset !important",
            width: "unset",
            color: "secondaryGray.600",
            right: "0px",
          },
        }),
        auth: (props) => ({
          field: {
            bg: mode("rgba(255, 255, 255, 0.88)", "transparent")(props),
            border: "1px solid",
            color: mode("gray.800", "white")(props),
            borderColor: "secondaryGray.300",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        authSecondary: (props) => ({
          field: {
            bg: mode("rgba(255, 255, 255, 0.88)", "transparent")(props),
            border: "1px solid",
            color: mode("gray.800", "white")(props),
            borderColor: "secondaryGray.300",
            borderRadius: "18px",
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
        search: (props) => ({
          field: {
            border: "none",
            py: "11px",
            borderRadius: "inherit",
            color: mode("gray.800", "white")(props),
            _placeholder: { color: "secondaryGray.500" },
          },
        }),
      },
    },
    // PinInputField: {
    //   variants: {
    //     main: (props) => ({
    //       field: {
    //         bg: "red !important",
    //         border: "1px solid",
    //         color: mode("secondaryGray.900", "white")(props),
    //         borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
    //         borderRadius: "16px",
    //         _placeholder: { color: "secondaryGray.600" },
    //       },
    //     }),
    //   },
    // },
  },
};
