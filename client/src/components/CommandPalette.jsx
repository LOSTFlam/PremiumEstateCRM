import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Box,
  Flex,
  useColorModeValue,
  Kbd,
  Divider,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiHome,
  FiUsers,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiCalendar,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";

const COMMANDS = [
  { id: "dashboard", label: "Dashboard", shortcut: "D", icon: FiHome, path: "/dashboard" },
  { id: "leads", label: "Leads", shortcut: "L", icon: FiUsers, path: "/admin/leads" },
  {
    id: "properties",
    label: "Properties",
    shortcut: "P",
    icon: FiFileText,
    path: "/admin/properties",
  },
  {
    id: "analytics",
    label: "Analytics",
    shortcut: "A",
    icon: FiBarChart2,
    path: "/admin/analytics",
  },
  { id: "calendar", label: "Calendar", shortcut: "C", icon: FiCalendar, path: "/admin/calendar" },
  { id: "settings", label: "Settings", shortcut: "S", icon: FiSettings, path: "/admin/settings" },
  { id: "help", label: "Help & Support", shortcut: "H", icon: FiHelpCircle, path: "/admin/help" },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const bgHover = useColorModeValue("gray.50", "whiteAlpha.100");

  const filteredCommands = COMMANDS.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = useCallback(
    (path) => {
      navigate(path);
      setSearch("");
      onClose();
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" overflow="hidden">
        <ModalHeader pb={0}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
            <Input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              border="none"
              _focus={{ border: "none", boxShadow: "none" }}
              pl={10}
              fontSize="lg"
            />
          </InputGroup>
        </ModalHeader>
        <ModalCloseButton mt={2} />
        <Divider />
        <ModalBody pt={2} pb={4}>
          {filteredCommands.length === 0 ? (
            <Text textAlign="center" color="gray.500" py={8}>
              No results found
            </Text>
          ) : (
            <VStack spacing={1} align="stretch">
              {filteredCommands.map((cmd) => (
                <Flex
                  key={cmd.id}
                  as="button"
                  onClick={() => handleSelect(cmd.path)}
                  px={4}
                  py={3}
                  borderRadius="xl"
                  _hover={{ bg: bgHover }}
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                  textAlign="left"
                >
                  <Flex alignItems="center" gap={3}>
                    <Box as={cmd.icon} />
                    <Text fontWeight="medium">{cmd.label}</Text>
                  </Flex>
                  <Kbd fontSize="xs">{cmd.shortcut}</Kbd>
                </Flex>
              ))}
            </VStack>
          )}
          <Box mt={4} pt={3} borderTop="1px" borderColor="gray.200">
            <Flex justifyContent="center" gap={4} fontSize="xs" color="gray.500">
              <Text>
                <Kbd>↑</Kbd> <Kbd>↓</Kbd> Navigate
              </Text>
              <Text>
                <Kbd>↵</Kbd> Select
              </Text>
              <Text>
                <Kbd>esc</Kbd> Close
              </Text>
            </Flex>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommandPalette;
