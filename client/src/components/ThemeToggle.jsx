import { useEffect, useState } from "react";
import { IconButton, useColorMode } from "@chakra-ui/react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference on mount
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (!savedTheme && systemPrefersDark) {
      if (colorMode !== "dark") {
        toggleColorMode();
      }
    } else if (savedTheme === "dark" && colorMode !== "dark") {
      toggleColorMode();
    } else if (savedTheme === "light" && colorMode !== "light") {
      toggleColorMode();
    }
  }, []);

  const handleToggle = () => {
    toggleColorMode();
    localStorage.setItem("theme", colorMode === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <IconButton
      onClick={handleToggle}
      icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
      aria-label="Toggle theme"
      variant="ghost"
      color={colorMode === "dark" ? "yellow.400" : "gray.600"}
      _hover={{
        bg: colorMode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
      borderRadius="full"
      size="md"
    />
  );
};

export default ThemeToggle;
