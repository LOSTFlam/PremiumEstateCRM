import { useCallback, useEffect, useState } from "react";
import { Badge, Box, Button, Flex, Heading, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LuCalendarClock, LuMessageSquare } from "react-icons/lu";
import { getApi } from "services/api";
import { extractCollection } from "utils/normalizeResponse";
import { useCabinetTheme } from "./useCabinetTheme";

const statusColor = (status) => {
  const key = String(status || "").toLowerCase();
  if (key.includes("close") || key.includes("won")) return "green";
  if (key.includes("pending") || key.includes("open")) return "yellow";
  if (key.includes("reject") || key.includes("lost")) return "red";
  return "gray";
};

const formatDate = (value, locale) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(locale?.startsWith("ru") ? "ru-RU" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const InquiriesSection = () => {
  const { t, i18n } = useTranslation();
  const theme = useCabinetTheme();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApi("api/user/inquiries", { silent: true });
      const items = extractCollection(response, "inquiries");
      setInquiries(Array.isArray(items) ? items : response?.inquiries || []);
    } catch {
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  if (loading) {
    return (
      <Stack spacing={4}>
        <Skeleton height="28px" width="260px" borderRadius="12px" />
        {[1, 2, 3].map((item) => (
          <Skeleton key={item} height="120px" borderRadius="20px" />
        ))}
      </Stack>
    );
  }

  if (!inquiries.length) {
    return (
      <Box {...theme.emptyStateStyle}>
        <Heading size="md" color={theme.heading} mb={2}>
          {t("cabinet.inquiries.emptyTitle")}
        </Heading>
        <Text color={theme.muted} mb={4}>
          {t("cabinet.inquiries.emptyText")}
        </Text>
        <Button as={RouterLink} to="/offers" colorScheme="green">
          {t("cabinet.empty.browse")}
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={5}>
      <Box>
        <Heading size="md" color={theme.heading} mb={2}>
          {t("cabinet.sections.inquiries")}
        </Heading>
        <Text color={theme.muted}>{t("cabinet.sections.inquiriesDesc")}</Text>
      </Box>

      <Stack spacing={3}>
        {inquiries.map((inquiry) => {
          const propertyId = inquiry?.associatedListing?._id || inquiry?.associatedListing;
          const propertyTitle =
            inquiry?.associatedListing?.title ||
            inquiry?.associatedListing?.name ||
            inquiry?.propertyName ||
            t("cabinet.inquiries.propertyFallback");
          const status = inquiry?.leadStatus || inquiry?.leadState || "pending";

          return (
            <Box key={inquiry._id} {...theme.listItemStyle}>
              <Flex justify="space-between" align="flex-start" gap={4} wrap="wrap">
                <Stack spacing={2} flex="1">
                  <HStack spacing={3} flexWrap="wrap">
                    <Badge colorScheme={statusColor(status)} borderRadius="full" px={3}>
                      {status}
                    </Badge>
                    <HStack color={theme.subtle} fontSize="sm">
                      <LuCalendarClock />
                      <Text>
                        {formatDate(inquiry.createdDate || inquiry.createdAt, i18n.language)}
                      </Text>
                    </HStack>
                  </HStack>
                  <Text color={theme.heading} fontWeight="700" fontSize="lg">
                    {propertyTitle}
                  </Text>
                  {inquiry?.leadMessage || inquiry?.leadNotes ? (
                    <HStack align="flex-start" spacing={2} color={theme.muted}>
                      <LuMessageSquare style={{ marginTop: 4, flexShrink: 0 }} />
                      <Text fontSize="sm">{inquiry.leadMessage || inquiry.leadNotes}</Text>
                    </HStack>
                  ) : null}
                </Stack>
                {propertyId ? (
                  <Button
                    as={RouterLink}
                    to={`/offers/${propertyId}`}
                    size="sm"
                    colorScheme="green"
                    variant="outline"
                  >
                    {t("cabinet.inquiries.openProperty")}
                  </Button>
                ) : null}
              </Flex>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default InquiriesSection;
