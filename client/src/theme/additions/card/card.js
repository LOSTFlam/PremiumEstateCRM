import { mode } from "@chakra-ui/theme-tools";
const Card = {
  baseStyle: (props) => ({
    p: "24px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderRadius: "30px",
    minWidth: "0px",
    wordWrap: "break-word",
    bg: mode("rgba(255, 255, 255, 0.86)", "navy.800")(props),
    border: "1px solid",
    borderColor: mode("rgba(148, 163, 184, 0.14)", "whiteAlpha.100")(props),
    boxShadow: mode(
      "0 24px 60px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.03)",
      "0 24px 60px rgba(0, 0, 0, 0.3)",
    )(props),
    backdropFilter: "blur(24px)",
    backgroundClip: "border-box",
    transition:
      "box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), transform 360ms cubic-bezier(0.22, 1, 0.36, 1), background-color 280ms cubic-bezier(0.22, 1, 0.36, 1), border-color 280ms cubic-bezier(0.22, 1, 0.36, 1)",
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
