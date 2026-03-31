import {
  Badge,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Skeleton,
  Stack,
  Text,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useUsdRubRate } from "hooks/useUsdRubRate";
import {
  buildPropertyPricingPayload,
  formatCurrencyAmount,
  getPreferredCurrency,
  parseNumericAmount,
  RUB_CURRENCY,
  USD_CURRENCY,
} from "utils/pricing";

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.24); }
  70% { box-shadow: 0 0 0 12px rgba(49, 130, 206, 0); }
  100% { box-shadow: 0 0 0 0 rgba(49, 130, 206, 0); }
`;

const formatTimestamp = (value, language) => {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    language?.startsWith("ru") ? "ru-RU" : "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(parsed);
};

const PropertyPriceEditor = ({ values = {}, setFieldValue }) => {
  const { t, i18n } = useTranslation();
  const { data: rateData, isLoading } = useUsdRubRate();
  const panelBg = useColorModeValue(
    "linear-gradient(135deg, rgba(247,250,252,0.98) 0%, rgba(237,242,247,0.94) 100%)",
    "linear-gradient(135deg, rgba(23,25,35,0.92) 0%, rgba(45,55,72,0.9) 100%)",
  );
  const panelBorder = useColorModeValue("rgba(49, 130, 206, 0.16)", "rgba(99, 179, 237, 0.22)");
  const subtleText = useColorModeValue("gray.600", "gray.300");

  const priceCurrency = values?.priceCurrency || getPreferredCurrency(i18n.language);
  const editableValue =
    priceCurrency === RUB_CURRENCY
      ? values?.listingPriceRub ?? ""
      : values?.listingPrice ?? "";

  const convertedValue = useMemo(() => {
    const amount = parseNumericAmount(editableValue);
    if (amount === null) {
      return null;
    }

    const payload = buildPropertyPricingPayload({
      amount,
      currency: priceCurrency,
      rateData,
    });

    return priceCurrency === RUB_CURRENCY
      ? payload.listingPrice
      : payload.listingPriceRub;
  }, [editableValue, priceCurrency, rateData]);

  const displayCurrency = getPreferredCurrency(i18n.language);
  const otherCurrency = displayCurrency === RUB_CURRENCY ? USD_CURRENCY : RUB_CURRENCY;
  const currentRate =
    rateData?.rate ||
    values?.priceExchangeRate ||
    "—";

  const applyPricing = (amount, currency) => {
    const payload = buildPropertyPricingPayload({
      amount,
      currency,
      rateData: rateData || {
        rate: values?.priceExchangeRate,
        fetchedAt: values?.priceExchangeUpdatedAt,
      },
    });

    Object.entries(payload).forEach(([key, value]) => {
      setFieldValue?.(key, value);
    });
  };

  const handleAmountChange = (event) => {
    applyPricing(event.target.value, priceCurrency);
  };

  const handleCurrencyChange = (event) => {
    const nextCurrency = event.target.value;
    const currentAmount =
      priceCurrency === RUB_CURRENCY ? values?.listingPriceRub : values?.listingPrice;
    applyPricing(currentAmount, nextCurrency);
  };

  return (
    <Box
      mt={6}
      p={{ base: 4, md: 5 }}
      borderRadius="24px"
      bg={panelBg}
      border="1px solid"
      borderColor={panelBorder}
      boxShadow="0 18px 50px rgba(15, 23, 42, 0.08)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        inset="-30% auto auto 58%"
        w="220px"
        h="220px"
        bg="radial-gradient(circle, rgba(56, 178, 172, 0.18) 0%, rgba(56, 178, 172, 0) 72%)"
        pointerEvents="none"
      />
      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex justify="space-between" align={{ base: "start", md: "center" }} gap={3} wrap="wrap">
          <Box>
            <Text fontSize="lg" fontWeight="800">
              {t("propertyPricing.title")}
            </Text>
            <Text color={subtleText} fontSize="sm">
              {t("propertyPricing.subtitle")}
            </Text>
          </Box>
          <Badge
            px={3}
            py={1.5}
            borderRadius="full"
            bg="blue.50"
            color="blue.700"
            border="1px solid rgba(49, 130, 206, 0.18)"
            animation={`${pulseGlow} 2.4s infinite`}
          >
            {t("propertyPricing.rateBadge", { rate: currentRate })}
          </Badge>
        </Flex>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 3 }}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="700">
                {t("propertyPricing.inputCurrency")}
              </FormLabel>
              <Select value={priceCurrency} onChange={handleCurrencyChange}>
                <option value={USD_CURRENCY}>{t("propertyPricing.currencyUsd")}</option>
                <option value={RUB_CURRENCY}>{t("propertyPricing.currencyRub")}</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 5 }}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="700">
                {t("propertyPricing.enterAmount")}
              </FormLabel>
              <Input
                type="number"
                min="0"
                step={priceCurrency === RUB_CURRENCY ? "1" : "0.01"}
                value={editableValue}
                onChange={handleAmountChange}
                placeholder={t("propertyPricing.enterAmountPlaceholder")}
              />
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="700">
                {t("propertyPricing.updatedAt")}
              </FormLabel>
              <Text
                px={4}
                py={2.5}
                borderRadius="16px"
                bg="rgba(148, 163, 184, 0.10)"
                fontWeight="600"
              >
                {formatTimestamp(
                  rateData?.fetchedAt || values?.priceExchangeUpdatedAt,
                  i18n.language,
                )}
              </Text>
            </FormControl>
          </GridItem>
        </Grid>

        <Grid templateColumns="repeat(12, 1fr)" gap={4}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box
              p={4}
              borderRadius="20px"
              bg={displayCurrency === RUB_CURRENCY ? "rgba(56, 161, 105, 0.10)" : "rgba(49, 130, 206, 0.10)"}
              border="1px solid rgba(148, 163, 184, 0.14)"
              transform="translateZ(0)"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              _hover={{ transform: "translateY(-2px)", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)" }}
            >
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color={subtleText}>
                {t("propertyPricing.crmDisplayLanguage")}
              </Text>
              <Text fontSize="2xl" fontWeight="900" mt={1}>
                {formatCurrencyAmount(
                  displayCurrency === RUB_CURRENCY ? values?.listingPriceRub : values?.listingPrice,
                  { currency: displayCurrency, language: i18n.language },
                ) || "—"}
              </Text>
              <Text mt={2} color={subtleText} fontSize="sm">
                {t("propertyPricing.crmDisplayHint", {
                  currency:
                    displayCurrency === RUB_CURRENCY
                      ? t("propertyPricing.currencyRub")
                      : t("propertyPricing.currencyUsd"),
                })}
              </Text>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Box
              p={4}
              borderRadius="20px"
              bg="rgba(226, 232, 240, 0.22)"
              border="1px solid rgba(148, 163, 184, 0.14)"
              transition="transform 0.3s ease, box-shadow 0.3s ease"
              _hover={{ transform: "translateY(-2px)", boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)" }}
            >
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color={subtleText}>
                {t("propertyPricing.autoConverted")}
              </Text>
              {isLoading ? (
                <Skeleton h="34px" mt={2} borderRadius="14px" />
              ) : (
                <Text fontSize="2xl" fontWeight="900" mt={1}>
                  {formatCurrencyAmount(convertedValue, {
                    currency: otherCurrency,
                    language: i18n.language,
                    maximumFractionDigits: otherCurrency === RUB_CURRENCY ? 0 : 2,
                  }) || "—"}
                </Text>
              )}
              <Text mt={2} color={subtleText} fontSize="sm">
                {t("propertyPricing.officialSource")}
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Stack>
    </Box>
  );
};

export default PropertyPriceEditor;
