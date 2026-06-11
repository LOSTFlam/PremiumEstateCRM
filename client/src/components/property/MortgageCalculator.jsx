import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { publicBrand } from "views/public/publicBrand";

const calcAnnuity = (principal, annualRate, years) => {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  if (!principal || !months) return 0;
  if (!monthlyRate) return principal / months;
  return (
    (principal * monthlyRate * (1 + monthlyRate) ** months) /
    ((1 + monthlyRate) ** months - 1)
  );
};

export default function MortgageCalculator({ propertyPrice = 25000000, onApply }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const [downPaymentPct, setDownPaymentPct] = useState(30);
  const [termYears, setTermYears] = useState(20);
  const [rate, setRate] = useState(12.5);

  const principal = useMemo(
    () => Math.max(propertyPrice * (1 - downPaymentPct / 100), 0),
    [downPaymentPct, propertyPrice]
  );
  const monthlyPayment = useMemo(
    () => calcAnnuity(principal, rate, termYears),
    [principal, rate, termYears]
  );

  const chartData = useMemo(() => {
    const months = termYears * 12;
    const monthlyRate = rate / 100 / 12;
    let balance = principal;
    const points = [];
    for (let month = 1; month <= months; month += Math.max(1, Math.floor(months / 24))) {
      const interest = balance * monthlyRate;
      const body = monthlyPayment - interest;
      balance = Math.max(balance - body, 0);
      points.push({
        month: locale === "ru" ? `Мес ${month}` : `Mo ${month}`,
        balance: Math.round(balance),
      });
      if (balance <= 0) break;
    }
    return points;
  }, [locale, monthlyPayment, principal, rate, termYears]);

  const formatMoney = (value) =>
    new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: locale === "ru" ? "RUB" : "USD",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <Box
      borderRadius="28px"
      p={{ base: 5, md: 7 }}
      bg="white"
      color={publicBrand.colors.ink}
      border="1px solid rgba(9,18,32,0.08)"
      boxShadow={publicBrand.shadows.soft}
    >
      <Stack spacing={6}>
        <Heading size="md" fontFamily="heading" color={publicBrand.colors.ink}>
          {locale === "ru" ? "Ипотечный калькулятор" : "Mortgage calculator"}
        </Heading>

        <FormControl>
          <FormLabel color={publicBrand.colors.ink} fontWeight="600" mb={2}>
            {locale === "ru" ? "Первоначальный взнос" : "Down payment"}: {downPaymentPct}%
          </FormLabel>
          <Slider value={downPaymentPct} min={10} max={80} onChange={setDownPaymentPct}>
            <SliderTrack>
              <SliderFilledTrack bg={publicBrand.colors.gold} />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel color={publicBrand.colors.ink} fontWeight="600" mb={2}>
            {locale === "ru" ? "Срок" : "Term"}: {termYears} {locale === "ru" ? "лет" : "years"}
          </FormLabel>
          <Slider value={termYears} min={5} max={30} onChange={setTermYears}>
            <SliderTrack>
              <SliderFilledTrack bg={publicBrand.colors.gold} />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel color={publicBrand.colors.ink} fontWeight="600" mb={2}>
            {locale === "ru" ? "Ставка" : "Rate"}: {rate.toFixed(1)}%
          </FormLabel>
          <Slider value={rate} min={5} max={20} step={0.1} onChange={setRate}>
            <SliderTrack>
              <SliderFilledTrack bg={publicBrand.colors.gold} />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <Box borderRadius="20px" bg="rgba(212,175,55,0.1)" px={5} py={4}>
          <Text fontSize="sm" color={publicBrand.colors.textSoft}>
            {locale === "ru" ? "Ежемесячный платёж" : "Monthly payment"}
          </Text>
          <Text fontSize="2xl" fontWeight="800" color={publicBrand.colors.ink}>
            {formatMoney(monthlyPayment)}
          </Text>
        </Box>

        <Box h="220px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `${Math.round(v / 1000000)}M`} width={40} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={publicBrand.colors.copper}
                fill="rgba(212,175,55,0.25)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Button
          borderRadius="full"
          bg={publicBrand.gradients.brass}
          color={publicBrand.colors.ink}
          onClick={() =>
            onApply?.({
              downPaymentPct,
              termYears,
              rate,
              monthlyPayment,
              principal,
            })
          }
        >
          {locale === "ru" ? "Подать заявку" : "Apply for mortgage"}
        </Button>
      </Stack>
    </Box>
  );
}
