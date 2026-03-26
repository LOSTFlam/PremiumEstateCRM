import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Divider,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { FiDollarSign, FiPercent, FiCalendar } from 'react-icons/fi';

export default function MortgageCalculator({ propertyPrice, isOpen, onClose }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const [homePrice, setHomePrice] = useState(propertyPrice || 500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [hoaFees, setHoaFees] = useState(0);

  // Calculate mortgage
  const calculations = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    // Number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Monthly principal & interest
    const monthlyPrincipalInterest = loanAmount * monthlyRate * 
      Math.pow(1 + monthlyRate, numberOfPayments) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Monthly property tax
    const monthlyPropertyTax = (homePrice * (propertyTax / 100)) / 12;
    
    // Monthly insurance
    const monthlyInsurance = homeInsurance / 12;
    
    // Total monthly payment
    const totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + hoaFees;
    
    // Total interest paid
    const totalInterest = (monthlyPrincipalInterest * numberOfPayments) - loanAmount;
    
    // Total cost
    const totalCost = downPayment + loanAmount + totalInterest + (monthlyPropertyTax * numberOfPayments) + (monthlyInsurance * numberOfPayments) + (hoaFees * numberOfPayments);

    return {
      downPayment,
      loanAmount,
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHOA: hoaFees,
      totalMonthlyPayment,
      totalInterest,
      totalCost,
      loanToValue: (loanAmount / homePrice) * 100,
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance, hoaFees]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent bg={bgColor} borderRadius="2xl">
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Icon as={FiDollarSign} boxSize={6} color="blue.500" />
            <Text fontSize="2xl" fontWeight="bold">Mortgage Calculator</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
            {/* Input Section */}
            <Box>
              <Heading size="md" mb={4}>Loan Details</Heading>
              
              {/* Home Price */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">Home Price</FormLabel>
                <NumberInput
                  value={homePrice}
                  onChange={(value) => setHomePrice(Number(value))}
                  min={0}
                  step={1000}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* Down Payment */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">
                  Down Payment ({downPaymentPercent}%)
                </FormLabel>
                <Slider
                  value={downPaymentPercent}
                  onChange={(value) => setDownPaymentPercent(value)}
                  min={0}
                  max={100}
                  step={1}
                  colorScheme="blue"
                  mb={2}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6}>
                    <Box color="blue.500" fontWeight="bold">{downPaymentPercent}%</Box>
                  </SliderThumb>
                </Slider>
                <Text fontSize="sm" color="gray.500">
                  {formatCurrency(calculations.downPayment)}
                </Text>
              </FormControl>

              {/* Interest Rate */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">Interest Rate (%)</FormLabel>
                <NumberInput
                  value={interestRate}
                  onChange={(value) => setInterestRate(Number(value))}
                  min={0.1}
                  max={20}
                  step={0.1}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* Loan Term */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">Loan Term (Years)</FormLabel>
                <NumberInput
                  value={loanTerm}
                  onChange={(value) => setLoanTerm(Number(value))}
                  min={5}
                  max={40}
                  step={5}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* Property Tax */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">Property Tax Rate (%)</FormLabel>
                <NumberInput
                  value={propertyTax}
                  onChange={(value) => setPropertyTax(Number(value))}
                  min={0}
                  max={5}
                  step={0.1}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* Home Insurance */}
              <FormControl mb={4}>
                <FormLabel fontWeight="600">Home Insurance (Yearly)</FormLabel>
                <NumberInput
                  value={homeInsurance}
                  onChange={(value) => setHomeInsurance(Number(value))}
                  min={0}
                  step={100}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              {/* HOA Fees */}
              <FormControl>
                <FormLabel fontWeight="600">HOA Fees (Monthly)</FormLabel>
                <NumberInput
                  value={hoaFees}
                  onChange={(value) => setHoaFees(Number(value))}
                  min={0}
                  step={50}
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </Box>

            {/* Results Section */}
            <Box>
              <Heading size="md" mb={4}>Monthly Payment</Heading>
              
              <Box
                bg="blue.500"
                color="white"
                p={6}
                borderRadius="xl"
                mb={6}
                textAlign="center"
              >
                <Text fontSize="sm" opacity={0.9}>Total Monthly Payment</Text>
                <Text fontSize="5xl" fontWeight="bold">
                  {formatCurrency(calculations.totalMonthlyPayment)}
                </Text>
              </Box>

              <Box bg={bgColor} borderWidth="1px" borderRadius="xl" p={4} borderColor={borderColor}>
                <Flex justify="space-between" mb={3} pb={3} borderBottomWidth="1px">
                  <Text>Principal & Interest</Text>
                  <Text fontWeight="bold">{formatCurrency(calculations.monthlyPrincipalInterest)}</Text>
                </Flex>
                <Flex justify="space-between" mb={3} pb={3} borderBottomWidth="1px">
                  <Text>Property Tax</Text>
                  <Text fontWeight="bold">{formatCurrency(calculations.monthlyPropertyTax)}</Text>
                </Flex>
                <Flex justify="space-between" mb={3} pb={3} borderBottomWidth="1px">
                  <Text>Home Insurance</Text>
                  <Text fontWeight="bold">{formatCurrency(calculations.monthlyInsurance)}</Text>
                </Flex>
                <Flex justify="space-between" mb={3} pb={3} borderBottomWidth="1px">
                  <Text>HOA Fees</Text>
                  <Text fontWeight="bold">{formatCurrency(calculations.monthlyHOA)}</Text>
                </Flex>
                <Flex justify="space-between" pt={3}>
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold" fontSize="xl" color="blue.500">
                    {formatCurrency(calculations.totalMonthlyPayment)}
                  </Text>
                </Flex>
              </Box>

              <Divider my={6} />

              <Box>
                <Heading size="md" mb={4}>Loan Summary</Heading>
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="sm" color="gray.500">Loan Amount</Text>
                    <Text fontSize="xl" fontWeight="bold">{formatCurrency(calculations.loanAmount)}</Text>
                  </Box>
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="sm" color="gray.500">Down Payment</Text>
                    <Text fontSize="xl" fontWeight="bold">{formatCurrency(calculations.downPayment)}</Text>
                  </Box>
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="sm" color="gray.500">Total Interest</Text>
                    <Text fontSize="xl" fontWeight="bold" color="red.500">{formatCurrency(calculations.totalInterest)}</Text>
                  </Box>
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="sm" color="gray.500">Loan-to-Value</Text>
                    <Text fontSize="xl" fontWeight="bold">{calculations.loanToValue.toFixed(1)}%</Text>
                  </Box>
                </Grid>
              </Box>

              <Box mt={6} p={4} bg="yellow.50" borderRadius="lg" borderLeft="4px solid" borderColor="yellow.500">
                <Text fontSize="sm" fontWeight="600">
                  💡 Tip: A 20% down payment helps you avoid PMI (Private Mortgage Insurance)
                </Text>
              </Box>
            </Box>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="green" onClick={() => {
            // Here you could save the calculation or contact lender
            alert('Contact a lender to get pre-approved!');
          }}>
            Contact Lender
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
