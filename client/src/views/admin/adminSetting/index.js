import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Flex, Input, InputGroup, InputLeftElement, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { FaCreativeCommonsBy, FaWpforms } from "react-icons/fa";
import { FiExternalLink, FiSearch, FiSliders } from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { TbExchange, TbTableColumn } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { GrValidate } from "react-icons/gr";
import { VscFileSubmodule } from "react-icons/vsc";
import { IoIosSwitch } from "react-icons/io";
import AdminSettingCard from "components/admin/AdminSettingCard";
import { getPublicSitePath } from "utils/authPaths";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const headingColor = useColorModeValue("secondaryGray.900", "white");
  const mutedColor = useColorModeValue("secondaryGray.600", "whiteAlpha.700");

  const cards = useMemo(
    () => [
      {
        id: "users",
        path: "/user",
        icon: HiUsers,
        title: t("navigation.users"),
        description: t("adminSettingsHub.cards.users"),
      },
      {
        id: "storefront",
        path: "/storefront-filters",
        icon: FiSliders,
        title: t("navigation.storefrontFilters"),
        description: t("adminSettingsHub.cards.storefrontFilters"),
      },
      {
        id: "roles",
        path: "/role",
        icon: FaCreativeCommonsBy,
        title: t("navigation.roles"),
        description: t("adminSettingsHub.cards.roles"),
      },
      {
        id: "images",
        path: "/change-images",
        icon: TbExchange,
        title: t("navigation.changeImages"),
        description: t("adminSettingsHub.cards.changeImages"),
      },
      {
        id: "customFields",
        path: "/custom-Fields",
        icon: FaWpforms,
        title: t("navigation.customFields"),
        description: t("adminSettingsHub.cards.customFields"),
      },
      {
        id: "validations",
        path: "/validations",
        icon: GrValidate,
        title: t("navigation.validations"),
        description: t("adminSettingsHub.cards.validations"),
      },
      {
        id: "tableFields",
        path: "/table-field",
        icon: TbTableColumn,
        title: t("navigation.tableFields"),
        description: t("adminSettingsHub.cards.tableFields"),
      },
      {
        id: "modules",
        path: "/module",
        icon: VscFileSubmodule,
        title: t("navigation.modules"),
        description: t("adminSettingsHub.cards.modules"),
      },
      {
        id: "activeModules",
        path: "/active-deactive-module",
        icon: IoIosSwitch,
        title: t("navigation.activeModules"),
        description: t("adminSettingsHub.cards.activeModules"),
      },
    ],
    [t]
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCards = normalizedQuery
    ? cards.filter((card) => {
        const haystack = `${card.title} ${card.description}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : cards;

  return (
    <Flex direction="column" gap="20px">
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap="16px"
      >
        <Flex direction="column" gap="6px" flex="1">
          <Text color={headingColor} fontSize={{ base: "2xl", md: "3xl" }} fontWeight="800">
            {t("adminSettingsHub.title")}
          </Text>
          <Text color={mutedColor} fontSize="md" maxW="720px">
            {t("adminSettingsHub.subtitle")}
          </Text>
        </Flex>
        <Button
          leftIcon={<FiExternalLink />}
          variant="outline"
          colorScheme="brand"
          alignSelf={{ base: "stretch", md: "flex-start" }}
          onClick={() => navigate(getPublicSitePath())}
        >
          {t("adminSettingsHub.goToSite")}
        </Button>
      </Flex>

      <InputGroup maxW={{ base: "100%", md: "420px" }}>
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray" />
        </InputLeftElement>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("adminSettingsHub.searchPlaceholder")}
          borderRadius="16px"
        />
      </InputGroup>

      {filteredCards.length === 0 ? (
        <Text color={mutedColor} fontSize="sm">
          {t("adminSettingsHub.emptySearch")}
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap="20px">
          {filteredCards.map((card) => (
            <AdminSettingCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              onClick={() => navigate(card.path)}
            />
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
};

export default Index;
