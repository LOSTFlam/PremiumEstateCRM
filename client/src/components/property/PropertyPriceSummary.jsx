import { Badge, Box, Grid, GridItem, Text, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useUsdRubRate } from "hooks/useUsdRubRate";
import {
  formatPropertyPrice,
  formatPropertyPriceSecondary,
  getPreferredCurrency,
} from "utils/pricing";

const PropertyPriceSummary = ({ property }) => {
  const { t, i18n } = useTranslation();
  const { data: rateData } = useUsdRubRate();
  const accentBg = useColorModeValue("rgba(66, 153, 225, 0.09)", "rgba(66, 153, 225, 0.18)");
  const mutedBg = useColorModeValue("rgba(148, 163, 184, 0.10)", "rgba(148, 163, 184, 0.12)");
  const secondaryPrice = formatPropertyPriceSecondary(property, {
    language: i18n.language,
    rateData,
  });

  return (
    <Grid templateColumns="repeat(12, 1fr)" gap={3} mb={4}>
      <GridItem colSpan={{ base: 12, md: 8 }}>
        <Box
          p={5}
          borderRadius="22px"
          bg={accentBg}
          border="1px solid rgba(66, 153, 225, 0.18)"
          boxShadow="0 14px 34px rgba(15, 23, 42, 0.06)"
        >
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">
            {t("propertyPricing.primaryDisplay")}
          </Text>
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="900" mt={1}>
            {formatPropertyPrice(property, {
              language: i18n.language,
              t,
              rateData,
            })}
          </Text>
          {secondaryPrice ? (
            <Text color="gray.500" fontWeight="600" mt={2}>
              {secondaryPrice}
            </Text>
          ) : null}
        </Box>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 4 }}>
        <Box
          h="100%"
          p={5}
          borderRadius="22px"
          bg={mutedBg}
          border="1px solid rgba(148, 163, 184, 0.14)"
        >
          <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="gray.500">
            {t("propertyPricing.currentDisplayCurrency")}
          </Text>
          <Badge mt={2} px={3} py={1.5} borderRadius="full" colorScheme="blue">
            {getPreferredCurrency(i18n.language)}
          </Badge>
          <Text mt={4} color="gray.500" fontSize="sm">
            {t("propertyPricing.summaryHint")}
          </Text>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default PropertyPriceSummary;
