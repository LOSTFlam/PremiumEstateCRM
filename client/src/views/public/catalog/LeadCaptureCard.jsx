import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { postApi } from "services/api";

export default function LeadCaptureCard({
  property,
  agent,
  collectionSlug = "",
  title,
  subtitle,
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
    preferredContact: "phone",
  });

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("rgba(16,45,36,0.08)", "whiteAlpha.200");
  const subtleBg = useColorModeValue("#f8f2e7", "whiteAlpha.100");
  const mutedColor = useColorModeValue("gray.600", "gray.300");

  const resolvedAgent = useMemo(() => agent || property?.agent || null, [agent, property?.agent]);

  if (!property) return null;

  const submitLead = async () => {
    if (!values.fullName || !values.email || !values.phoneNumber) {
      toast({ title: t("publicListing.leadRequiredError"), status: "error" });
      return;
    }

    try {
      setSubmitting(true);
      const response = await postApi("api/lead/public-inquiry", {
        propertyId: property?._id,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        message: values.message,
        preferredContact: values.preferredContact,
        sourcePage: window.location.pathname,
        collectionSlug,
      });

      if (response?.status === 200) {
        setValues({
          fullName: "",
          email: "",
          phoneNumber: "",
          message: "",
          preferredContact: "phone",
        });
        toast({ title: t("publicListing.leadSuccess"), status: "success" });
        return;
      }

      toast({ title: t("publicListing.leadError"), status: "error" });
    } catch (error) {
      toast({ title: t("publicListing.leadError"), status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box bg={cardBg} borderRadius="32px" p={6} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
      <Stack spacing={4}>
        <Heading size="md">{title || t("publicListing.agentLeadTitle")}</Heading>
        <Text color={mutedColor}>{subtitle || t("publicListing.agentLeadText")}</Text>

        {resolvedAgent && (
          <Box bg={subtleBg} borderRadius="24px" p={4}>
            <Stack spacing={2}>
              <Text fontWeight="700">{resolvedAgent?.fullName || resolvedAgent?.label}</Text>
              {resolvedAgent?.label && resolvedAgent?.label !== resolvedAgent?.fullName && (
                <Text color={mutedColor}>{resolvedAgent.label}</Text>
              )}
              {resolvedAgent?.email && <Text color={mutedColor}>{resolvedAgent.email}</Text>}
              {resolvedAgent?.phoneNumber && <Text color={mutedColor}>{resolvedAgent.phoneNumber}</Text>}
              <Text fontSize="sm" color={mutedColor}>{resolvedAgent?.responseTimeText || t("publicListing.agentResponseTime")}</Text>
            </Stack>
          </Box>
        )}

        <FormControl>
          <FormLabel>{t("publicListing.leadName")}</FormLabel>
          <Input value={values.fullName} onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("publicListing.leadEmail")}</FormLabel>
          <Input type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("publicListing.leadPhone")}</FormLabel>
          <Input value={values.phoneNumber} onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))} />
        </FormControl>
        <FormControl>
          <FormLabel>{t("publicListing.preferredContact")}</FormLabel>
          <Select value={values.preferredContact} onChange={(event) => setValues((current) => ({ ...current, preferredContact: event.target.value }))}>
            <option value="phone">{t("publicListing.contactByPhone")}</option>
            <option value="email">{t("publicListing.contactByEmail")}</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>{t("publicListing.leadMessage")}</FormLabel>
          <Textarea value={values.message} onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))} rows={4} />
        </FormControl>

        <Button colorScheme="green" onClick={submitLead} isLoading={submitting}>
          {t("publicListing.sendLead")}
        </Button>
      </Stack>
    </Box>
  );
}
