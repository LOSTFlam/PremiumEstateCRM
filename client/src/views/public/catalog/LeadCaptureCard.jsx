import {
  Badge,
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
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { postApi } from "services/api";
import { publicBrand } from "../publicBrand";

export default function LeadCaptureCard({
  property,
  agent,
  collectionSlug = "",
  title,
  subtitle,
}) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    message: "",
    preferredContact: "phone",
  });

  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const resolvedAgent = useMemo(() => agent || property?.agent || null, [agent, property?.agent]);

  if (!property) return null;

  const submitLead = async () => {
    if (!values.fullName || !values.email || !values.phoneNumber) {
      toast({ title: t?.("publicListing.leadRequiredError"), status: "error" });
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
        toast({ title: t?.("publicListing.leadSuccess"), status: "success" });
        return;
      }

      toast({ title: t?.("publicListing.leadError"), status: "error" });
    } catch (error) {
      toast({ title: t?.("publicListing.leadError"), status: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      borderRadius="34px"
      p={6}
      bg={publicBrand.gradients.panel}
      color="white"
      boxShadow={publicBrand.shadows.deep}
      border="1px solid rgba(227, 211, 184, 0.14)"
    >
      <Stack spacing={5}>
        <Stack spacing={2}>
          <Badge
            w="fit-content"
            px={3}
            py={1.5}
            borderRadius="full"
            bg="rgba(245,208,118,0.14)"
            color="#f5d076"
            border="1px solid rgba(245,208,118,0.22)"
          >
            {locale === "ru" ? "Private inquiry" : "Private inquiry"}
          </Badge>
          <Heading size="md">{title || t?.("publicListing.agentLeadTitle")}</Heading>
          <Text color="whiteAlpha.740">{subtitle || t?.("publicListing.agentLeadText")}</Text>
        </Stack>

        {resolvedAgent && (
          <Box
            borderRadius="24px"
            p={4}
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(227, 211, 184, 0.12)"
          >
            <Stack spacing={2}>
              <Text fontWeight="700">{resolvedAgent?.fullName || resolvedAgent?.label}</Text>
              {resolvedAgent?.label && resolvedAgent?.label !== resolvedAgent?.fullName ? (
                <Text color="whiteAlpha.680">{resolvedAgent.label}</Text>
              ) : null}
              {resolvedAgent?.email ? <Text color="whiteAlpha.740">{resolvedAgent.email}</Text> : null}
              {resolvedAgent?.phoneNumber ? <Text color="whiteAlpha.740">{resolvedAgent.phoneNumber}</Text> : null}
              <Text fontSize="sm" color="#f5d076">
                {resolvedAgent?.responseTimeText || t?.("publicListing.agentResponseTime")}
              </Text>
            </Stack>
          </Box>
        )}

        <FormControl>
          <FormLabel color="whiteAlpha.880">{t?.("publicListing.leadName")}</FormLabel>
          <Input
            value={values.fullName}
            onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))}
            bg="rgba(255,255,255,0.08)"
            borderColor="rgba(227, 211, 184, 0.14)"
            borderRadius="18px"
            h="52px"
          />
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.880">{t?.("publicListing.leadEmail")}</FormLabel>
          <Input
            type="email"
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            bg="rgba(255,255,255,0.08)"
            borderColor="rgba(227, 211, 184, 0.14)"
            borderRadius="18px"
            h="52px"
          />
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.880">{t?.("publicListing.leadPhone")}</FormLabel>
          <Input
            value={values.phoneNumber}
            onChange={(event) => setValues((current) => ({ ...current, phoneNumber: event.target.value }))}
            bg="rgba(255,255,255,0.08)"
            borderColor="rgba(227, 211, 184, 0.14)"
            borderRadius="18px"
            h="52px"
          />
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.880">{t?.("publicListing.preferredContact")}</FormLabel>
          <Select
            value={values.preferredContact}
            onChange={(event) => setValues((current) => ({ ...current, preferredContact: event.target.value }))}
            bg="white"
            color={publicBrand.colors.ink}
            borderRadius="18px"
            h="52px"
          >
            <option value="phone">{t?.("publicListing.contactByPhone")}</option>
            <option value="email">{t?.("publicListing.contactByEmail")}</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel color="whiteAlpha.880">{t?.("publicListing.leadMessage")}</FormLabel>
          <Textarea
            value={values.message}
            onChange={(event) => setValues((current) => ({ ...current, message: event.target.value }))}
            rows={4}
            bg="rgba(255,255,255,0.08)"
            borderColor="rgba(227, 211, 184, 0.14)"
            borderRadius="18px"
          />
        </FormControl>

        <Button
          bg={publicBrand.gradients.brass}
          color={publicBrand.colors.ink}
          fontWeight="700"
          borderRadius="full"
          onClick={submitLead}
          isLoading={submitting}
          _hover={{ transform: "translateY(-1px)", boxShadow: publicBrand.shadows.glow }}
        >
          {t?.("publicListing.sendLead")}
        </Button>
      </Stack>
    </Box>
  );
}
