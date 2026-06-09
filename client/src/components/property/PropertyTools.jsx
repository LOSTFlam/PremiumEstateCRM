import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Text,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Badge as _Badge,
  Icon,
  VStack,
  HStack as _HStack,
  useToast,
  Divider,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import {
  FiDollarSign as _FiDollarSign,
  FiPercent as _FiPercent,
  FiTrendingUp,
  FiBell,
  FiSave,
  FiMail,
  FiPhone,
  FiCalendar,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { formatPrice } from "views/public/catalog/catalogData";

// Investment Calculator
export const InvestmentCalculator = ({ propertyPrice, isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const bgColor = useColorModeValue("white", "gray.800");
  const _toast = useToast();
  const formatCurrency = (value) => {
    if (typeof value !== "number") return String(value ?? "");
    const ru = String(i18n?.language ?? "").startsWith("ru");
    return (ru ? "\u20BD" : "\u0024") + value.toLocaleString(ru ? "ru-RU" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const [purchasePrice, setPurchasePrice] = useState(propertyPrice || 500000);
  const [downPayment, setDownPayment] = useState(100000);
  const [monthlyRent, setMonthlyRent] = useState(3000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [insurance, _setInsurance] = useState(1200);
  const [maintenance, setMaintenance] = useState(1);
  const [vacancy, _setVacancy] = useState(5);
  const [_appreciation, _setAppreciation] = useState(3);

  const calculations = {
    monthlyMortgage:
      ((purchasePrice - downPayment) * (interestRate / 100 / 12)) /
      (1 - Math.pow(1 + interestRate / 100 / 12, -360)),
    monthlyPropertyTax: (purchasePrice * (propertyTax / 100)) / 12,
    monthlyInsurance: insurance / 12,
    monthlyMaintenance: monthlyRent * (maintenance / 100),
    monthlyVacancy: monthlyRent * (vacancy / 100),
  };

  const monthlyExpenses =
    calculations.monthlyMortgage +
    calculations.monthlyPropertyTax +
    calculations.monthlyInsurance +
    calculations.monthlyMaintenance +
    calculations.monthlyVacancy;

  const monthlyCashFlow = monthlyRent - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;
  const cashOnCashReturn = ((annualCashFlow / downPayment) * 100).toFixed(2);
  const capRate = (((monthlyRent * 12 - monthlyExpenses * 12) / purchasePrice) * 100).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bgColor} borderRadius="2xl">
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Icon as={FiTrendingUp} boxSize={6} color="green.500" />
            <Text fontSize="2xl" fontWeight="bold">
              Investment Calculator
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Flex gap={4}>
              <Box flex={1}>
                <Heading size="md" mb={4}>
                  Investment Details
                </Heading>
                <FormControl mb={4}>
                  <FormLabel>Purchase Price</FormLabel>
                  <NumberInput
                    value={purchasePrice}
                    onChange={(value) => setPurchasePrice(Number(value))}
                    prefix="$"
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Down Payment</FormLabel>
                  <NumberInput
                    value={downPayment}
                    onChange={(value) => setDownPayment(Number(value))}
                    prefix="$"
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Monthly Rent</FormLabel>
                  <NumberInput
                    value={monthlyRent}
                    onChange={(value) => setMonthlyRent(Number(value))}
                    prefix="$"
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Box>

              <Box flex={1}>
                <Heading size="md" mb={4}>
                  Expenses
                </Heading>
                <FormControl mb={4}>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <NumberInput
                    value={interestRate}
                    onChange={(value) => setInterestRate(Number(value))}
                    step={0.1}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Property Tax (%)</FormLabel>
                  <NumberInput
                    value={propertyTax}
                    onChange={(value) => setPropertyTax(Number(value))}
                    step={0.1}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Maintenance (%)</FormLabel>
                  <NumberInput
                    value={maintenance}
                    onChange={(value) => setMaintenance(Number(value))}
                    step={0.5}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Box>
            </Flex>

            <Divider />

            <Box bg="green.50" p={6} borderRadius="xl">
              <Heading size="lg" mb={4} color="green.700">
                Returns
              </Heading>
              <Flex gap={4}>
                <Box flex={1} bg="white" p={4} borderRadius="lg" textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Monthly Cash Flow
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color={monthlyCashFlow >= 0 ? "green.500" : "red.500"}
                  >
                    {formatCurrency(monthlyCashFlow)}
                  </Text>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius="lg" textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Cash on Cash Return
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color={parseFloat(cashOnCashReturn) >= 8 ? "green.500" : "orange.500"}
                  >
                    {cashOnCashReturn}%
                  </Text>
                </Box>
                <Box flex={1} bg="white" p={4} borderRadius="lg" textAlign="center">
                  <Text fontSize="sm" color="gray.600">
                    Cap Rate
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color={parseFloat(capRate) >= 6 ? "green.500" : "orange.500"}
                  >
                    {capRate}%
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box bg="blue.50" p={4} borderRadius="lg">
              <Text fontSize="sm" fontWeight="600">
                💡 Tip: A good investment property should have a cash on cash return of at least
                8-12%
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Saved Searches
export const SavedSearches = () => {
  const [searches, _setSearches] = useState([
    { id: 1, name: "Downtown Apartments", criteria: "2 bed, 2 bath, $400-600K", alerts: true },
    { id: 2, name: "Family Homes", criteria: "4 bed, 3 bath, Good Schools", alerts: true },
  ]);

  return (
    <Box>
      <Heading size="md" mb={4}>
        Saved Searches
      </Heading>
      <VStack spacing={3} align="stretch">
        {searches.map((search) => (
          <Box key={search.id} p={4} borderWidth="1px" borderRadius="lg" _hover={{ bg: "gray.50" }}>
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="bold">{search.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  {search.criteria}
                </Text>
              </Box>
              <Flex gap={2}>
                <Icon
                  as={FiBell}
                  color={search.alerts ? "green.500" : "gray.300"}
                  cursor="pointer"
                />

                <Icon as={FiSave} color="blue.500" cursor="pointer" />
              </Flex>
            </Flex>
          </Box>
        ))}
        <Button leftIcon={<FiSave />} variant="outline">
          Save New Search
        </Button>
      </VStack>
    </Box>
  );
};

// Property Alerts
export const PropertyAlerts = () => {
  const [alerts, _setAlerts] = useState([
    { id: 1, type: "price_drop", active: true },
    { id: 2, type: "new_listing", active: true },
    { id: 3, type: "open_house", active: false },
  ]);

  return (
    <Box>
      <Heading size="md" mb={4}>
        Property Alerts
      </Heading>
      <VStack spacing={3} align="stretch">
        {alerts.map((alert) => (
          <Box key={alert.id} p={4} borderWidth="1px" borderRadius="lg">
            <Flex justify="space-between" align="center">
              <Text>
                {alert.type === "price_drop" && "📉 Price Drop Alert"}
                {alert.type === "new_listing" && "🏠 New Listing Alert"}
                {alert.type === "open_house" && "🏡 Open House Alert"}
              </Text>
              <Switch isChecked={alert.active} colorScheme="green" />
            </Flex>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

// Contact Agent Form
export const ContactAgentForm = ({ property, onClose }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contactMethod: "email",
    tourDate: "",
  });

  const handleSubmit = () => {
    toast({
      title: "Message Sent!",
      description: "The agent will contact you within 24 hours",
      status: "success",
      duration: 3000,
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bgColor} borderRadius="2xl">
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Icon as={FiMail} boxSize={6} color="blue.500" />
            <Text fontSize="2xl" fontWeight="bold">
              Contact Agent
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Box bg="blue.50" p={4} borderRadius="lg">
              <Text fontWeight="bold">{property?.name}</Text>
              <Text color="blue.500" fontWeight="bold">
                {formatPrice(property?.listingPrice)}
              </Text>
            </Box>

            <FormControl>
              <FormLabel>Your Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Preferred Contact Method</FormLabel>
              <Flex gap={4}>
                <Flex align="center" gap={2}>
                  <Icon as={FiMail} />
                  <input
                    type="radio"
                    name="contact"
                    checked={formData.contactMethod === "email"}
                    onChange={() => setFormData((prev) => ({ ...prev, contactMethod: "email" }))}
                  />

                  <Text>Email</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Icon as={FiPhone} />
                  <input
                    type="radio"
                    name="contact"
                    checked={formData.contactMethod === "phone"}
                    onChange={() => setFormData((prev) => ({ ...prev, contactMethod: "phone" }))}
                  />

                  <Text>Phone</Text>
                </Flex>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="I'm interested in this property..."
                rows={4}
              />
            </FormControl>

            <FormControl>
              <FormLabel>
                <Flex align="center" gap={2}>
                  <Icon as={FiCalendar} />
                  Schedule a Tour
                </Flex>
              </FormLabel>
              <Input
                type="datetime-local"
                value={formData.tourDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, tourDate: e.target.value }))}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit} width="full">
            Send Message
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default {
  InvestmentCalculator,
  SavedSearches,
  PropertyAlerts,
  ContactAgentForm,
};
