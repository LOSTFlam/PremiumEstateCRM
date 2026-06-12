import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useCabinetTheme } from "views/cabinet/useCabinetTheme";

const READ_KEY = "cabinet_notifications_read";

const readIds = () => {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const persistReadIds = (ids) => {
  localStorage.setItem(READ_KEY, JSON.stringify(ids));
};

export default function CabinetNotificationsCenter({
  inquiryCount = 0,
  favoriteCount = 0,
  savedSearchCount = 0,
  priceAlertsEnabled = false,
}) {
  const { t } = useTranslation();
  const theme = useCabinetTheme();
  const [filter, setFilter] = useState("all");
  const [readSet, setReadSet] = useState(() => new Set(readIds()));

  const items = useMemo(() => {
    const list = [];

    if (savedSearchCount > 0) {
      list.push({
        id: "search-match",
        type: "info",
        title: t("cabinet.notificationsCenter.searchMatchTitle"),
        text: t("cabinet.notificationsCenter.searchMatchText", { count: savedSearchCount }),
        href: "/cabinet/searches",
        important: true,
      });
    }

    if (favoriteCount > 0 && priceAlertsEnabled) {
      list.push({
        id: "price-drop",
        type: "warning",
        title: t("cabinet.notificationsCenter.priceDropTitle"),
        text: t("cabinet.notificationsCenter.priceDropText"),
        href: "/cabinet/saved",
        important: true,
      });
    }

    if (inquiryCount > 0) {
      list.push({
        id: "inquiry-update",
        type: "success",
        title: t("cabinet.notificationsCenter.inquiryTitle"),
        text: t("cabinet.notificationsCenter.inquiryText", { count: inquiryCount }),
        href: "/cabinet/inquiries",
        important: false,
      });
    }

    list.push({
      id: "welcome-tip",
      type: "info",
      title: t("cabinet.notificationsCenter.tipTitle"),
      text: t("cabinet.notificationsCenter.tipText"),
      href: "/offers",
      important: false,
    });

    return list;
  }, [favoriteCount, inquiryCount, priceAlertsEnabled, savedSearchCount, t]);

  const filtered = useMemo(() => {
    if (filter === "unread") {
      return items.filter((item) => !readSet.has(item.id));
    }
    if (filter === "important") {
      return items.filter((item) => item.important);
    }
    return items;
  }, [filter, items, readSet]);

  const unreadCount = items.filter((item) => !readSet.has(item.id)).length;

  const markAllRead = () => {
    const next = new Set(items.map((item) => item.id));
    setReadSet(next);
    persistReadIds(Array.from(next));
  };

  const markRead = (id) => {
    const next = new Set(readSet);
    next.add(id);
    setReadSet(next);
    persistReadIds(Array.from(next));
  };

  return (
    <Menu placement="bottom-end" isLazy>
      <Box position="relative" display="inline-flex">
        <MenuButton
          as={IconButton}
          aria-label={t("cabinet.notificationsCenter.title")}
          icon={<FiBell />}
          variant="ghost"
          color={theme.navInactive}
          borderRadius="full"
        />
        {unreadCount > 0 ? (
          <Badge
            position="absolute"
            top="2px"
            right="2px"
            borderRadius="full"
            colorScheme="red"
            fontSize="10px"
            minW="16px"
            pointerEvents="none"
          >
            {unreadCount}
          </Badge>
        ) : null}
      </Box>
      <MenuList minW="320px" maxW="360px" p={2}>
        <HStack justify="space-between" px={2} py={1}>
          <Text fontWeight="700">{t("cabinet.notificationsCenter.title")}</Text>
          <Button size="xs" variant="ghost" onClick={markAllRead}>
            {t("cabinet.notificationsCenter.markAll")}
          </Button>
        </HStack>
        <HStack px={2} pb={2} spacing={2} flexWrap="wrap">
          {[
            { key: "all", label: t("cabinet.notificationsCenter.filterAll") },
            { key: "unread", label: t("cabinet.notificationsCenter.filterUnread") },
            { key: "important", label: t("cabinet.notificationsCenter.filterImportant") },
          ].map((item) => (
            <Button
              key={item.key}
              size="xs"
              variant={filter === item.key ? "solid" : "outline"}
              colorScheme="gold"
              onClick={() => setFilter(item.key)}
            >
              {item.label}
            </Button>
          ))}
        </HStack>
        <MenuDivider />
        <Stack spacing={1} maxH="320px" overflowY="auto">
          {filtered.length ? (
            filtered.map((item) => (
              <MenuItem
                key={item.id}
                as={RouterLink}
                to={item.href}
                onClick={() => markRead(item.id)}
                borderRadius="12px"
                bg={readSet.has(item.id) ? "transparent" : "gold.50"}
                _dark={{ bg: readSet.has(item.id) ? "transparent" : "whiteAlpha.100" }}
              >
                <Box>
                  <HStack spacing={2} mb={1}>
                    <Icon as={FiBell} boxSize={3} />
                    <Text fontWeight="600" fontSize="sm">
                      {item.title}
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color={theme.muted} noOfLines={2}>
                    {item.text}
                  </Text>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box px={3} py={4}>
              <Text fontSize="sm" color={theme.muted}>
                {t("cabinet.notificationsCenter.empty")}
              </Text>
            </Box>
          )}
        </Stack>
      </MenuList>
    </Menu>
  );
}
