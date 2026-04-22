import {
  Box,
  Tag,
  TagCloseButton,
  TagLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { useState, useRef, useEffect, useCallback } from "react";

export const CUIAutoComplete = ({
  placeholder,
  items,
  selectedItems,
  onSelectedItemsChange,
  itemRenderer,
  itemValueKey = "value",
  itemLabelKey = "label",
  leftIcon,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const menuBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  const selectedValues = selectedItems.map((item) =>
    typeof item === "object" ? item[itemValueKey] : item
  );

  const filteredItems = items.filter((item) => {
    if (selectedValues.includes(typeof item === "object" ? item[itemValueKey] : item)) return false;
    if (!inputValue) return true;
    const label = typeof item === "object" ? item[itemLabelKey] : item;
    return label.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleSelect = useCallback(
    (item) => {
      const newItem = typeof item === "object" ? item : { value: item, label: item };
      onSelectedItemsChange({ selectedItems: [...selectedItems, newItem] });
      setInputValue("");
      setIsOpen(false);
    },
    [selectedItems, onSelectedItemsChange]
  );

  const handleRemove = useCallback(
    (valueToRemove) => {
      onSelectedItemsChange({
        selectedItems: selectedItems.filter(
          (item) => (typeof item === "object" ? item[itemValueKey] : item) !== valueToRemove
        ),
      });
    },
    [selectedItems, onSelectedItemsChange, itemValueKey]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box {...rest}>
      <Flex wrap="wrap" gap={2} mb={2}>
        {selectedItems.map((item) => {
          const value = typeof item === "object" ? item[itemValueKey] : item;
          const label = typeof item === "object" ? item[itemLabelKey] || item[itemValueKey] : item;
          return (
            <Tag key={value} size="md" borderRadius="full" variant="solid" colorScheme="blue">
              <TagLabel>{label}</TagLabel>
              <TagCloseButton onClick={() => handleRemove(value)} />
            </Tag>
          );
        })}
      </Flex>
      <Box ref={inputRef} position="relative">
        <InputGroup>
          {leftIcon && <InputLeftElement pointerEvents="none">{leftIcon}</InputLeftElement>}
          {!leftIcon && (
            <InputLeftElement pointerEvents="none">
              <FiSearch />
            </InputLeftElement>
          )}
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            pl={10}
          />
        </InputGroup>
        {isOpen && filteredItems.length > 0 && (
          <Box
            position="absolute"
            top="100%"
            left={0}
            right={0}
            zIndex={9999}
            bg={menuBg}
            boxShadow="lg"
            borderRadius="md"
            mt={1}
            maxH="200px"
            overflowY="auto"
          >
            {filteredItems.map((item, index) => {
              const _value = typeof item === "object" ? item[itemValueKey] : item;
              const label =
                typeof item === "object" ? item[itemLabelKey] || item[itemValueKey] : item;
              return (
                <Flex
                  key={index}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => handleSelect(item)}
                  alignItems="center"
                >
                  {itemRenderer ? itemRenderer(item) : <Text>{label}</Text>}
                </Flex>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CUIAutoComplete;
