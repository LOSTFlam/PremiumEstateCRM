import { useColorModeValue } from "@chakra-ui/react";

export const useCabinetTheme = () => {
  const panelBg = useColorModeValue("white", "rgba(255,255,255,0.06)");
  const panelBorder = useColorModeValue("gray.200", "whiteAlpha.200");
  const sidebarBg = useColorModeValue("white", "rgba(255,255,255,0.04)");
  const cardBg = useColorModeValue("gray.50", "rgba(255,255,255,0.06)");
  const listItemBg = useColorModeValue("gray.50", "whiteAlpha.50");

  const heading = useColorModeValue("gray.800", "white");
  const text = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "whiteAlpha.700");
  const subtle = useColorModeValue("gray.500", "whiteAlpha.600");
  const label = useColorModeValue("gray.700", "whiteAlpha.800");

  const inputBg = useColorModeValue("white", "whiteAlpha.100");
  const inputBorder = useColorModeValue("gray.300", "whiteAlpha.300");
  const inputColor = useColorModeValue("gray.800", "white");

  const navInactive = useColorModeValue("gray.700", "whiteAlpha.800");
  const navHoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const navMenuLabel = useColorModeValue("gray.500", "whiteAlpha.600");

  const emptyBorder = useColorModeValue("gray.300", "whiteAlpha.300");
  const emptyBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const divider = useColorModeValue("gray.200", "whiteAlpha.200");

  const heroGradient = useColorModeValue(
    "linear(135deg, #fbf4dd, #f7e7ce)",
    "linear(135deg, rgba(212, 175, 55, 0.18), rgba(8, 17, 26, 0.94))"
  );
  const heroHeading = useColorModeValue("gray.900", "white");
  const heroText = useColorModeValue("gray.600", "whiteAlpha.800");
  const heroButtonColor = useColorModeValue("gold.700", "white");
  const heroButtonBorder = useColorModeValue("gold.300", "whiteAlpha.300");

  const accentLink = useColorModeValue("gold.600", "gold.300");
  const accentIcon = useColorModeValue("gold.600", "gold.300");
  const onboardingBg = useColorModeValue("gold.50", "rgba(212, 175, 55, 0.12)");
  const onboardingCardBg = useColorModeValue("white", "rgba(255,255,255,0.05)");

  const panelStyle = {
    borderRadius: "24px",
    bg: panelBg,
    border: "1px solid",
    borderColor: panelBorder,
    p: { base: 5, md: 7 },
  };

  const cardStyle = {
    p: { base: 5, md: 6 },
    borderRadius: "24px",
    bg: cardBg,
    border: "1px solid",
    borderColor: panelBorder,
    backdropFilter: "blur(12px)",
  };

  const listItemStyle = {
    borderRadius: "20px",
    bg: listItemBg,
    border: "1px solid",
    borderColor: panelBorder,
    p: { base: 4, md: 5 },
  };

  const emptyStateStyle = {
    minH: "280px",
    borderRadius: "24px",
    border: "1px dashed",
    borderColor: emptyBorder,
    bg: emptyBg,
    p: 8,
    textAlign: "center",
  };

  const sidebarStyle = {
    borderRadius: "24px",
    bg: sidebarBg,
    border: "1px solid",
    borderColor: panelBorder,
    p: 3,
  };

  const tipCardStyle = {
    borderRadius: "20px",
    bg: onboardingCardBg,
    border: "1px solid",
    borderColor: panelBorder,
    p: 5,
  };

  const inputFieldProps = {
    bg: inputBg,
    borderColor: inputBorder,
    color: inputColor,
    _placeholder: { color: subtle },
  };

  return {
    panelStyle,
    cardStyle,
    listItemStyle,
    emptyStateStyle,
    sidebarStyle,
    tipCardStyle,
    panelBorder,
    heading,
    text,
    muted,
    subtle,
    label,
    inputFieldProps,
    navInactive,
    navHoverBg,
    navMenuLabel,
    heroGradient,
    heroHeading,
    heroText,
    heroButtonColor,
    heroButtonBorder,
    accentLink,
    accentIcon,
    onboardingBg,
    divider,
    emptyBorder,
    emptyBg,
  };
};
