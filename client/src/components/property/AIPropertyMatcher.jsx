import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiSliders } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { normalizePropertyTypeKey, parsePrice } from "views/public/catalog/catalogData";
import { publicBrand } from "views/public/publicBrand";

const copy = {
  ru: {
    badge: "Пошаговый подбор",
    title: "Консьерж-подбор",
    subtitle: "Короткий сценарий, который мягко сужает поиск и отправляет в подходящие предложения.",
    open: "Открыть подбор",
    propertyType: "Тип объекта",
    budget: "Бюджет",
    bedrooms: "Спальни",
    apply: "Применить",
    all: "Все",
    house: "Дом",
    apartment: "Квартира",
    land: "Участок",
    commercial: "Коммерция",
  },
  en: {
    badge: "Guided finder",
    title: "Concierge finder",
    subtitle: "A short guided flow that narrows the search and moves you straight into relevant offers.",
    open: "Open finder",
    propertyType: "Property type",
    budget: "Budget",
    bedrooms: "Bedrooms",
    apply: "Apply",
    all: "All",
    house: "House",
    apartment: "Apartment",
    land: "Land",
    commercial: "Commercial",
  },
};

export default function GuidedFinder({ properties = [], onMatchFound, variant = "dark" }) {
  const { i18n } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [propertyType, setPropertyType] = useState("all");
  const [budget, setBudget] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const text = copy[locale];
  const budgetOptions =
    locale === "ru"
      ? [
          { value: "all", label: text.all },
          { value: "150000", label: "До 150 000 $" },
          { value: "300000", label: "До 300 000 $" },
          { value: "600000", label: "До 600 000 $" },
          { value: "1000000", label: "До 1 000 000 $" },
        ]
      : [
          { value: "all", label: text.all },
          { value: "150000", label: "$150k" },
          { value: "300000", label: "$300k" },
          { value: "600000", label: "$600k" },
          { value: "1000000", label: "$1M" },
        ];

  const match = useMemo(() => {
    return properties.find((property) => {
      const matchesType =
        propertyType === "all" ||
        normalizePropertyTypeKey(property?.propertyType) === propertyType ||
        property?.propertyTypeKey === propertyType;
      const matchesBudget = budget === "all" || parsePrice(property?.listingPrice) <= Number(budget);
      const matchesBedrooms =
        bedrooms === "all" || Number(property?.numberofBedrooms || 0) >= Number(bedrooms);

      return matchesType && matchesBudget && matchesBedrooms;
    });
  }, [bedrooms, budget, properties, propertyType]);

  const darkVariant = variant !== "light";

  return (
    <>
      <Box
        borderRadius="30px"
        px={5}
        py={5}
        bg={darkVariant ? "rgba(255,255,255,0.06)" : publicBrand.gradients.panelLight}
        color={darkVariant ? "white" : publicBrand.colors.ink}
        border={
          darkVariant
            ? "1px solid rgba(227, 211, 184, 0.14)"
            : "1px solid rgba(9,18,32,0.08)"
        }
        boxShadow={darkVariant ? publicBrand.shadows.inset : publicBrand.shadows.soft}
      >
        <HStack justify="space-between" align="start" spacing={4}>
          <Box maxW="320px">
            <Badge
              mb={3}
              px={3}
              py={1.5}
              borderRadius="full"
              bg={darkVariant ? "rgba(245,208,118,0.14)" : "rgba(212,175,55,0.12)"}
              color={darkVariant ? "#f5d076" : publicBrand.colors.copper}
              border={
                darkVariant
                  ? "1px solid rgba(245,208,118,0.24)"
                  : "1px solid rgba(212,175,55,0.16)"
              }
            >
              {text.badge}
            </Badge>
            <Heading size="md">{text.title}</Heading>
            <Text mt={2} color={darkVariant ? "whiteAlpha.760" : publicBrand.colors.textSoft}>
              {text.subtitle}
            </Text>
          </Box>
          <Button
            leftIcon={<FiSliders />}
            borderRadius="full"
            bg={publicBrand.gradients.brass}
            color={publicBrand.colors.ink}
            fontWeight="700"
            _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
            onClick={onOpen}
          >
            {text.open}
          </Button>
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay bg="rgba(7,12,20,0.55)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="32px" bg={publicBrand.gradients.panelLight} overflow="hidden">
          <ModalHeader pt={6}>{text.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={7}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>{text.propertyType}</FormLabel>
                <Select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  borderRadius="18px"
                  h="54px"
                >
                  <option value="all">{text.all}</option>
                  <option value="house">{text.house}</option>
                  <option value="apartment">{text.apartment}</option>
                  <option value="land">{text.land}</option>
                  <option value="commercial">{text.commercial}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>{text.budget}</FormLabel>
                <Select
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  borderRadius="18px"
                  h="54px"
                >
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>{text.bedrooms}</FormLabel>
                <Select
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value)}
                  borderRadius="18px"
                  h="54px"
                >
                  <option value="all">{text.all}</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </Select>
              </FormControl>
              <Button
                mt={2}
                borderRadius="full"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
                fontWeight="700"
                onClick={() => {
                  if (match) {
                    onMatchFound?.(match);
                  }
                  onClose();
                }}
              >
                {text.apply}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
