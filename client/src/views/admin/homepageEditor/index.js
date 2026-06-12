import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Card from "components/card/Card";
import Spinner from "components/spinner/Spinner";
import { fetchHomepageContent, updateHomepageContent } from "services/homepageContent";
import { fetchPublicCatalog } from "views/public/catalog/catalogService";
import { getListingTitle } from "views/public/catalog/catalogData";
import { HOMEPAGE_BLOCK_KEYS, mergeHomepageContent } from "utils/homepageContent";
import { getPublicSitePath } from "utils/authPaths";

const cloneState = (value) => JSON.parse(JSON.stringify(value));

const setNestedValue = (source, path, value) => {
  const keys = path.split(".");
  const next = cloneState(source);
  let cursor = next;

  keys.slice(0, -1).forEach((key) => {
    if (!cursor[key] || typeof cursor[key] !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key];
  });

  cursor[keys[keys.length - 1]] = value;
  return next;
};

const Field = ({ label, value, onChange, multiline = false, rows = 3 }) => {
  const labelColor = useColorModeValue("secondaryGray.700", "whiteAlpha.800");
  const fieldBg = useColorModeValue("white", "navy.800");
  const fieldColor = useColorModeValue("secondaryGray.900", "white");
  const fieldBorder = useColorModeValue("secondaryGray.100", "whiteAlpha.200");
  const placeholderColor = useColorModeValue("secondaryGray.400", "whiteAlpha.500");
  const fieldHoverBorder = useColorModeValue("secondaryGray.200", "whiteAlpha.300");
  const fieldProps = {
    bg: fieldBg,
    color: fieldColor,
    border: "1px solid",
    borderColor: fieldBorder,
    borderRadius: "16px",
    _placeholder: { color: placeholderColor },
    _hover: { borderColor: fieldHoverBorder },
  };

  return (
    <FormControl>
      <FormLabel fontSize="sm" color={labelColor}>
        {label}
      </FormLabel>
      {multiline ? (
        <Textarea
          {...fieldProps}
          value={value || ""}
          rows={rows}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          {...fieldProps}
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </FormControl>
  );
};

const BlockFields = ({ blockKey, locale, content, onChange, t, catalogProperties = [] }) => {
  const nestedBorderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const nestedHeadingColor = useColorModeValue("secondaryGray.900", "white");
  const block = content.locales?.[locale]?.[blockKey] || {};

  const update = (path, value) =>
    onChange(setNestedValue(content, `locales.${locale}.${path}`, value));

  if (blockKey === "hero") {
    return (
      <VStack align="stretch" spacing={4}>
        {locale === "ru" ? (
          <FormControl>
            <FormLabel fontSize="sm">{t("homepageEditor.heroPropertyLabel")}</FormLabel>
            <Text fontSize="sm" color={nestedHeadingColor} mb={2}>
              {t("homepageEditor.heroPropertyHelp")}
            </Text>
            <Select
              value={content.heroPropertyId || ""}
              onChange={(event) =>
                onChange({
                  ...content,
                  heroPropertyId: event.target.value || null,
                })
              }
              borderRadius="16px"
            >
              <option value="">{t("adminInline.heroPropertyAuto")}</option>
              {catalogProperties.map((property) => (
                <option key={property._id} value={property._id}>
                  {getListingTitle(property, t, locale) || property?.propertyAddress}
                </option>
              ))}
            </Select>
          </FormControl>
        ) : null}
        <Field
          label={t("homepageEditor.fields.eyebrow")}
          value={block.eyebrow}
          onChange={(v) => update("hero.eyebrow", v)}
        />
        <Field
          label={t("homepageEditor.fields.kicker")}
          value={block.kicker}
          onChange={(v) => update("hero.kicker", v)}
        />
        <Field
          label={t("homepageEditor.fields.title")}
          value={block.title}
          onChange={(v) => update("hero.title", v)}
        />
        <Field
          label={t("homepageEditor.fields.accent")}
          value={block.accent}
          onChange={(v) => update("hero.accent", v)}
        />
        <Field
          label={t("homepageEditor.fields.description")}
          value={block.description}
          onChange={(v) => update("hero.description", v)}
          multiline
          rows={4}
        />
        <Field
          label={t("homepageEditor.fields.searchHint")}
          value={block.searchHint}
          onChange={(v) => update("hero.searchHint", v)}
        />
        <Field
          label={t("homepageEditor.fields.primaryCta")}
          value={block.primary}
          onChange={(v) => update("hero.primary", v)}
        />
        <Field
          label={t("homepageEditor.fields.secondaryCta")}
          value={block.secondary}
          onChange={(v) => update("hero.secondary", v)}
        />
        <Field
          label={t("homepageEditor.fields.panelTitle")}
          value={block.panelTitle}
          onChange={(v) => update("hero.panelTitle", v)}
        />
        <Field
          label={t("homepageEditor.fields.panelText")}
          value={block.panelText}
          onChange={(v) => update("hero.panelText", v)}
          multiline
        />
        <Field
          label={t("homepageEditor.fields.routesTitle")}
          value={block.routesTitle}
          onChange={(v) => update("hero.routesTitle", v)}
        />
        <Field
          label={t("homepageEditor.fields.routesText")}
          value={block.routesText}
          onChange={(v) => update("hero.routesText", v)}
          multiline
        />
        <Field
          label={t("homepageEditor.fields.pulseTitle")}
          value={block.pulseTitle}
          onChange={(v) => update("hero.pulseTitle", v)}
        />
        <Field
          label={t("homepageEditor.fields.pulseSubtitle")}
          value={block.pulseSubtitle}
          onChange={(v) => update("hero.pulseSubtitle", v)}
        />
      </VStack>
    );
  }

  if (blockKey === "features") {
    return (
      <VStack align="stretch" spacing={4}>
        <Field
          label={t("homepageEditor.fields.badge")}
          value={block.badge}
          onChange={(v) => update("features.badge", v)}
        />
        <Field
          label={t("homepageEditor.fields.title")}
          value={block.title}
          onChange={(v) => update("features.title", v)}
          multiline
          rows={2}
        />
        <Field
          label={t("homepageEditor.fields.description")}
          value={block.description}
          onChange={(v) => update("features.description", v)}
          multiline
          rows={4}
        />
        {(block.pillars || []).map((pillar, index) => (
          <Box
            key={`pillar-${index}`}
            p={4}
            borderWidth="1px"
            borderColor={nestedBorderColor}
            borderRadius="16px"
          >
            <Text fontWeight="700" mb={3} color={nestedHeadingColor}>
              {t("homepageEditor.fields.pillar", { index: index + 1 })}
            </Text>
            <VStack align="stretch" spacing={3}>
              <Field
                label={t("homepageEditor.fields.title")}
                value={pillar.title}
                onChange={(v) => update(`features.pillars.${index}.title`, v)}
              />
              <Field
                label={t("homepageEditor.fields.description")}
                value={pillar.text}
                onChange={(v) => update(`features.pillars.${index}.text`, v)}
                multiline
              />
              <Field
                label={t("homepageEditor.fields.points")}
                value={(pillar.points || []).join("\n")}
                onChange={(v) =>
                  update(
                    `features.pillars.${index}.points`,
                    v
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                  )
                }
                multiline
                rows={3}
              />
            </VStack>
          </Box>
        ))}
      </VStack>
    );
  }

  if (blockKey === "services") {
    return (
      <VStack align="stretch" spacing={4}>
        <Field
          label={t("homepageEditor.fields.badge")}
          value={block.badge}
          onChange={(v) => update("services.badge", v)}
        />
        <Field
          label={t("homepageEditor.fields.title")}
          value={block.title}
          onChange={(v) => update("services.title", v)}
        />
        <Field
          label={t("homepageEditor.fields.description")}
          value={block.text}
          onChange={(v) => update("services.text", v)}
          multiline
          rows={3}
        />
        {(block.items || []).map((item, index) => (
          <Box
            key={item.key || index}
            p={4}
            borderWidth="1px"
            borderColor={nestedBorderColor}
            borderRadius="16px"
          >
            <Text fontWeight="700" mb={3} color={nestedHeadingColor}>
              {t("homepageEditor.fields.service", { index: index + 1 })}
            </Text>
            <VStack align="stretch" spacing={3}>
              <Field
                label={t("homepageEditor.fields.title")}
                value={item.title}
                onChange={(v) => update(`services.items.${index}.title`, v)}
              />
              <Field
                label={t("homepageEditor.fields.description")}
                value={item.text}
                onChange={(v) => update(`services.items.${index}.text`, v)}
                multiline
              />
            </VStack>
          </Box>
        ))}
      </VStack>
    );
  }

  const simpleBlocks = {
    market: ["badge", "title", "text", "statsLabel", "openLabel"],
    collections: ["badge", "title", "text", "openLabel"],
    locations: ["title", "text", "fromLabel"],
    catalog: ["badge", "text"],
  };

  const fields = simpleBlocks[blockKey] || ["badge", "title", "text"];

  return (
    <VStack align="stretch" spacing={4}>
      {fields.map((fieldKey) => (
        <Field
          key={fieldKey}
          label={t(`homepageEditor.fields.${fieldKey}`, { defaultValue: fieldKey })}
          value={block[fieldKey]}
          onChange={(value) => update(`${blockKey}.${fieldKey}`, value)}
          multiline={fieldKey === "text" || fieldKey === "title"}
          rows={fieldKey === "text" ? 4 : 2}
        />
      ))}
    </VStack>
  );
};

export default function HomepageEditor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const subtitleColor = useColorModeValue("secondaryGray.600", "whiteAlpha.700");
  const accordionBg = useColorModeValue("gray.50", "navy.700");
  const accordionExpandedBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const accordionTextColor = useColorModeValue("secondaryGray.900", "white");
  const accordionMutedColor = useColorModeValue("secondaryGray.600", "whiteAlpha.700");
  const [content, setContent] = useState(() => mergeHomepageContent());
  const [catalogProperties, setCatalogProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const target = document.querySelector(`[data-homepage-block="${hash}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const [response, catalog] = await Promise.all([
          fetchHomepageContent(),
          fetchPublicCatalog(),
        ]);
        if (!ignore) {
          setContent(response.content);
          setCatalogProperties(catalog);
        }
      } catch {
        if (!ignore) {
          toast({
            title: t("homepageEditor.loadError"),
            status: "error",
            duration: 3000,
          });
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [t, toast]);

  const blockLabels = useMemo(
    () =>
      Object.fromEntries(
        HOMEPAGE_BLOCK_KEYS.map((key) => [key, t(`homepageEditor.blocks.${key}`)])
      ),
    [t]
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateHomepageContent(content);
      setContent(response.content);
      toast({ title: t("homepageEditor.saved"), status: "success", duration: 2500 });
    } catch {
      toast({ title: t("homepageEditor.saveError"), status: "error", duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" py={20}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Card>
      <Flex
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="lg">{t("homepageEditor.title")}</Heading>
          <Text color={subtitleColor} mt={2} maxW="760px">
            {t("homepageEditor.subtitle")}
          </Text>
        </Box>
        <HStack spacing={3} flexWrap="wrap">
          <Button variant="outline" onClick={() => navigate(getPublicSitePath())}>
            {t("navigation.goToSite")}
          </Button>
          <Button
            variant="brand"
            leftIcon={<IoIosArrowBack />}
            onClick={() => navigate("/admin-setting")}
          >
            {t("adminSettingsHub.back")}
          </Button>
        </HStack>
      </Flex>

      <Tabs variant="enclosed" colorScheme="brand" mb={6}>
        <TabList>
          <Tab>RU</Tab>
          <Tab>EN</Tab>
        </TabList>
        <TabPanels>
          {["ru", "en"].map((locale) => (
            <TabPanel key={locale} px={0}>
              <Accordion allowMultiple defaultIndex={[0]}>
                {HOMEPAGE_BLOCK_KEYS.map((blockKey) => (
                  <AccordionItem
                    key={`${locale}-${blockKey}`}
                    data-homepage-block={blockKey}
                    border="none"
                    mb={3}
                  >
                    <AccordionButton
                      borderRadius="16px"
                      bg={accordionBg}
                      color={accordionTextColor}
                      _hover={{ bg: accordionExpandedBg }}
                      _expanded={{ bg: accordionExpandedBg, color: accordionTextColor }}
                    >
                      <Box flex="1" textAlign="left" fontWeight="700">
                        {blockLabels[blockKey]}
                      </Box>
                      <HStack spacing={4} mr={3}>
                        <Text fontSize="sm" color={accordionMutedColor}>
                          {t("homepageEditor.visible")}
                        </Text>
                        <Switch
                          isChecked={content.visibility?.[blockKey] !== false}
                          onChange={(event) =>
                            setContent((prev) => ({
                              ...prev,
                              visibility: {
                                ...prev.visibility,
                                [blockKey]: event.target.checked,
                              },
                            }))
                          }
                        />
                      </HStack>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pt={4}>
                      <BlockFields
                        blockKey={blockKey}
                        locale={locale}
                        content={content}
                        onChange={setContent}
                        t={t}
                        catalogProperties={catalogProperties}
                      />
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Button colorScheme="brand" onClick={handleSave} isLoading={saving}>
        {t("homepageEditor.save")}
      </Button>
    </Card>
  );
}
