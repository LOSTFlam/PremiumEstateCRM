import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  Icon,
  HStack,
  Link,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputMask from "react-input-mask";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone, FiYoutube } from "react-icons/fi";
import PublicPageShell from "components/public/PublicPageShell";
import OfficeMap from "components/public/OfficeMap";
import ScrollReveal from "components/public/ScrollReveal";
import { publicBrand } from "views/public/publicBrand";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  message: z.string().min(10),
});

export default function ContactsPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    reset();
    toast({ title: t("publicPages.contacts.success"), status: "success", duration: 3000 });
    navigate("/thank-you?source=contact");
  };

  const panel = {
    borderRadius: "28px",
    px: { base: 5, md: 7 },
    py: { base: 6, md: 8 },
    bg: "white",
    border: "1px solid rgba(9,18,32,0.08)",
    boxShadow: publicBrand.shadows.soft,
  };

  return (
    <PublicPageShell
      title={t("publicPages.contacts.title")}
      subtitle={t("publicPages.contacts.subtitle")}
      badge={t("publicPages.contacts.badge")}
      breadcrumbs={[
        { label: t("publicListing.homeNav"), href: "/" },
        { label: t("publicPages.contacts.title") },
      ]}
      seo={{
        title: t("publicPages.contacts.title"),
        description: t("publicPages.contacts.subtitle"),
        path: "/contacts",
      }}
    >
      <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={8}>
        <ScrollReveal>
          <Box {...panel} as="form" onSubmit={handleSubmit(onSubmit)}>
            <Heading size="md" mb={6}>
              {t("publicPages.contacts.formTitle")}
            </Heading>
            <Stack spacing={5}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>{t("common.name")}</FormLabel>
                <Input {...register("name")} borderRadius="12px" />
                <FormErrorMessage>{t("publicPages.contacts.nameError")}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>{t("common.email")}</FormLabel>
                <Input type="email" {...register("email")} borderRadius="12px" />
                <FormErrorMessage>{t("publicPages.contacts.emailError")}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>{t("common.phone")}</FormLabel>
                <Input
                  as={InputMask}
                  mask="+7 (999) 999-99-99"
                  value={watch("phone")}
                  onChange={(event) =>
                    setValue("phone", event.target.value, { shouldValidate: true })
                  }
                  borderRadius="12px"
                />
                <FormErrorMessage>{t("publicPages.contacts.phoneError")}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.message}>
                <FormLabel>{t("common.description")}</FormLabel>
                <Textarea rows={5} {...register("message")} borderRadius="12px" />
                <FormErrorMessage>{t("publicPages.contacts.messageError")}</FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                isLoading={isSubmitting}
                borderRadius="full"
                bg={publicBrand.gradients.brass}
                color={publicBrand.colors.ink}
              >
                {t("common.submit")}
              </Button>
            </Stack>
          </Box>
        </ScrollReveal>

        <Stack spacing={6}>
          <ScrollReveal delay={0.1}>
            <Box {...panel}>
              <Stack spacing={4}>
                {[
                  { icon: FiMapPin, text: t("publicListing.footerAddress") },
                  { icon: FiPhone, text: t("publicListing.footerPhone") },
                  { icon: FiMail, text: t("publicListing.footerEmail") },
                ].map((item) => (
                  <HStack key={item.text} align="flex-start" spacing={3}>
                    <Icon as={item.icon} color={publicBrand.colors.copper} mt={1} />
                    <Text color={publicBrand.colors.textSoft} lineHeight="1.7">
                      {item.text}
                    </Text>
                  </HStack>
                ))}
                <HStack spacing={3} pt={2}>
                  {[FiInstagram, FiLinkedin, FiYoutube].map((SocialIcon, index) => (
                    <Link
                      key={index}
                      href="#"
                      display="grid"
                      placeItems="center"
                      w="44px"
                      h="44px"
                      borderRadius="14px"
                      bg="rgba(212,175,55,0.1)"
                      _hover={{ bg: "rgba(212,175,55,0.2)" }}
                    >
                      <Icon as={SocialIcon} />
                    </Link>
                  ))}
                </HStack>
              </Stack>
            </Box>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <OfficeMap label={t("publicPages.contacts.mapLabel")} />
          </ScrollReveal>
        </Stack>
      </Grid>
    </PublicPageShell>
  );
}
