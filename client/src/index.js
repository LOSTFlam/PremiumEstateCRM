import React, { Suspense, lazy, useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "components/ErrorBoundary";
import SEO from "components/SEO";
import GlobalAnimationStyles from "components/GlobalAnimationStyles";
import ScrollToTop from "components/ScrollToTop";
import CommandPalette from "components/CommandPalette";
import "assets/css/App.css";
import "assets/css/tailwind.css";
import "styles/premium-effects.css";
import "styles/premium-effects.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Box, ChakraProvider, Container, Spinner, Stack, Text } from "@chakra-ui/react";
import theme from "theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n/i18n.config";
import { AnimatePresence } from "framer-motion";
import PageTransition from "components/PageTransition";

const AuthLayout = lazy(() => import("./layouts/auth"));
const AdminLayout = lazy(() => import("layouts/admin"));
const UserLayout = lazy(() => import("layouts/user"));
const PublicCatalog = lazy(() => import("views/public/catalog"));
const ModernLandingPage = lazy(() => import("views/public/ModernLandingPage"));
const PropertyDetailPage = lazy(() => import("views/public/PropertyDetailPage"));
const PublicOfferView = lazy(() => import("views/public/catalog/View"));
const PublicOfferViewBySlug = lazy(() => import("views/public/catalog/ViewBySlug"));
const PublicCompareView = lazy(() => import("views/public/catalog/Compare"));
const FavoritesPage = lazy(() => import("views/public/FavoritesPage"));
const PropertyViewBySlug = lazy(() => import("views/admin/property/ViewBySlug"));
const SeoCollectionPage = lazy(() => import("views/public/catalog/SeoCollectionPage"));
const AnalyticsDashboard = lazy(() => import("views/admin/analytics/AnalyticsDashboard"));
const LeadKanban = lazy(() => import("views/admin/leads/LeadKanban"));
const SignUp = lazy(() => import("views/auth/signUp"));
const SignIn = lazy(() => import("views/auth/signIn"));

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? lazy(() =>
        import("@tanstack/react-query-devtools").then((module) => ({
          default: module.ReactQueryDevtools,
        })),
      )
    : null;

const ROUTER_FUTURE_FLAGS = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error("Failed to parse user from storage", error);
    return null;
  }
};

const resolveLocale = () => {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage?.getItem("i18nextLng");
  const fallback = stored || window.navigator?.language || "ru";
  return String(fallback).toLowerCase().startsWith("ru") ? "ru" : "en";
};

const RU_LEGACY_TEXT_REPLACEMENTS = [
  ["Track and manage your leads through the sales pipeline", "Отслеживайте лиды и ведите их по воронке продаж"],
  ["Export Selected Data as Excel", "Экспорт выбранного в таблицу Excel"],
  ["Export Selected Data as CSV", "Экспорт выбранного в таблицу CSV"],
  ["No properties with photos yet", "Объектов с фото пока нет"],
  ["Upload your first property photo", "Загрузите первую фотографию объекта"],
  ["Property Documents", "Документы объекта"],
  ["Property Photos", "Фото объектов"],
  ["Property All Photos", "Все фото объекта"],
  ["Property All Document", "Все документы объекта"],
  ["Print as PDF", "Печать в файл"],
  ["Search properties...", "Поиск объектов..."],
  ["Search leads...", "Поиск лидов..."],
  ["Lead Management", "Управление лидами"],
  ["All Status", "Все статусы"],
  ["Status updated", "Статус обновлен"],
  ["Error updating status", "Ошибка обновления статуса"],
  ["Note added", "Заметка добавлена"],
  ["Error adding note", "Ошибка добавления заметки"],
  ["No properties found", "Объекты не найдены"],
  ["No photos uploaded yet", "Фотографии пока не загружены"],
  ["Photo Preview", "Просмотр фото"],
  ["Upload Photos", "Загрузить фото"],
  ["Uploading...", "Загрузка..."],
  ["Set as primary", "Сделать основным"],
  ["Remove photo", "Удалить фото"],
  ["Manage Columns", "Настроить колонки"],
  ["Export as Excel", "Экспорт в таблицу Excel"],
  ["Export as CSV", "Экспорт в таблицу CSV"],
  ["Add New", "Добавить"],
  ["Add Note", "Добавить заметку"],
  ["No leads", "Лидов нет"],
  ["No property", "Объект не указан"],
  ["Anonymous", "Без имени"],
  ["Email Address", "Адрес эл. почты"],
  ["Non Primary Email", "Дополнительная эл. почта"],
  ["Call Notes", "Заметки по звонку"],
  ["Search...", "Поиск..."],
  ["Select Property", "Выбрать объект"],
  ["Select Contact", "Выбрать контакт"],
  ["Select Role", "Выбрать роль"],
  ["Select User", "Выбрать пользователя"],
  ["Select Lead", "Выбрать лид"],
  ["Select", "Выбрать"],
  ["Close", "Закрыть"],
  ["Email Template", "Шаблоны писем"],
  ["Emails", "Письма"],
  ["Email Id", "Эл. почта"],
  ["Email", "Эл. почта"],
  ["Primary", "Основное"],
  ["Notes", "Заметки"],
  ["Please Wait...", "Подождите..."],
  ["No Data Found", "Данные не найдены"],
  ["No Document Found", "Документы не найдены"],
  ["File Not Found", "Файл не найден"],
  ["Not Invoiced", "Не выставлен счет"],
  ["Not For Profit", "Некоммерческая"],
  ["None", "Нет"],
  ["Yes", "Да"],
  ["No", "Нет"],
];

function replaceLegacyRuText(value) {
  if (typeof value !== "string" || !value.trim()) return value;

  let nextValue = value;
  RU_LEGACY_TEXT_REPLACEMENTS.forEach(([from, to]) => {
    if (nextValue.includes(from)) {
      nextValue = nextValue.split(from).join(to);
    }
  });

  return nextValue;
}

function LegacyRuTextGuard() {
  useEffect(() => {
    if (resolveLocale() !== "ru" || typeof document === "undefined") return undefined;

    const replaceElementAttributes = (element) => {
      ["placeholder", "aria-label", "title"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        const replaced = replaceLegacyRuText(value);
        if (value && replaced !== value) {
          element.setAttribute(attribute, replaced);
        }
      });
    };

    const replaceTree = (rootNode) => {
      if (!rootNode?.isConnected && rootNode !== document.body) return;

      if (rootNode.nodeType === Node.TEXT_NODE) {
        const parentTag = rootNode.parentElement?.tagName;
        if (parentTag !== "SCRIPT" && parentTag !== "STYLE") {
          const replaced = replaceLegacyRuText(rootNode.textContent || "");
          if (replaced !== rootNode.textContent) {
            rootNode.textContent = replaced;
          }
        }
        return;
      }

      if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const tagName = node.tagName;
              return tagName === "SCRIPT" || tagName === "STYLE"
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT;
            }

            const parentTag = node.parentElement?.tagName;
            return parentTag === "SCRIPT" || parentTag === "STYLE"
              ? NodeFilter.FILTER_REJECT
              : NodeFilter.FILTER_ACCEPT;
          },
        },
      );

      replaceElementAttributes(rootNode);

      let currentNode = walker.nextNode();
      while (currentNode) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          const replaced = replaceLegacyRuText(currentNode.textContent || "");
          if (replaced !== currentNode.textContent) {
            currentNode.textContent = replaced;
          }
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
          replaceElementAttributes(currentNode);
        }
        currentNode = walker.nextNode();
      }
    };

    const pendingNodes = new Set();
    let frameId = 0;

    const flushPendingNodes = () => {
      frameId = 0;
      const nodes = Array.from(pendingNodes).filter(
        (node) =>
          !Array.from(pendingNodes).some(
            (candidate) =>
              candidate !== node &&
              candidate?.nodeType === Node.ELEMENT_NODE &&
              candidate.contains?.(node),
          ),
      );

      pendingNodes.clear();
      nodes.forEach((node) => replaceTree(node));
    };

    const scheduleReplacement = (node = document.body) => {
      pendingNodes.add(node);

      if (!frameId) {
        frameId = window.requestAnimationFrame(flushPendingNodes);
      }
    };

    scheduleReplacement();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          scheduleReplacement(mutation.target);
          return;
        }

        if (mutation.type === "attributes") {
          scheduleReplacement(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          scheduleReplacement(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}

function RouteFallback() {
  const locale = resolveLocale();
  return (
    <Box minH="100vh" bg="#e7e5e4" color="#111827" display="flex" alignItems="center">
      <Container maxW="md">
        <Stack spacing={4} align="center" textAlign="center">
          <Spinner size="xl" color="orange.400" thickness="4px" />
          <Text fontWeight="700">
            {locale === "ru" ? "Загружаем экран" : "Loading Premium Estate"}
          </Text>
          <Text color="gray.500">
            {locale === "ru"
              ? "Подготавливаем интерфейс и данные по объектам."
              : "Preparing the next screen and listing data."}
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = getStoredUser();
  const isAuthenticated = Boolean(token && user?.role);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <ModernLandingPage />
            }
          />
          <Route path="/offers" element={<PublicCatalog />} />
          <Route path="/offers/houses" element={<PublicCatalog forcedType="house" />} />
          <Route path="/offers/apartments" element={<PublicCatalog forcedType="apartment" />} />
          <Route path="/offers/plots" element={<PublicCatalog forcedType="land" />} />
          <Route path="/offers/commercial" element={<PublicCatalog forcedType="commercial" />} />
          <Route path="/property/:slug" element={<PropertyDetailPage />} />
          <Route path="/collections/:slug" element={<SeoCollectionPage />} />
          <Route path="/offers/compare" element={<PublicCompareView />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/compare" element={<Navigate to="/offers/compare" replace />} />
          <Route path="/offers/:id" element={<PublicOfferView />} />
          <Route path="/offers/slug/:slug" element={<PublicOfferViewBySlug />} />
          <Route path="/propertyView/:slug" element={<PropertyViewBySlug />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/*" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthLayout />} />

          {isAuthenticated ? (
            user?.role === "user" ? (
              <Route path="/*" element={<UserLayout />} />
            ) : user?.role === "superAdmin" ? (
              <>
                <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                <Route path="/admin/leads" element={<LeadKanban />} />
                <Route path="/*" element={<AdminLayout />} />
              </>
            ) : (
              <Route path="/*" element={<Navigate to="/" replace />} />
            )
          ) : (
            <Route path="/*" element={<Navigate to="/" replace />} />
          )}
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  const [commandOpen, setCommandOpen] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setCommandOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatedRoutes />
      <ScrollToTop />
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </Suspense>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SEO />
        <GlobalAnimationStyles />
        <style>{`
          html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100vw;
          }
          * {
            box-sizing: border-box;
          }
        `}</style>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router future={ROUTER_FUTURE_FLAGS}>
              <ChakraProvider theme={theme}>
                <ToastContainer />
                <LegacyRuTextGuard />
                <App />
                {ReactQueryDevtools ? (
                  <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                  </Suspense>
                ) : null}
              </ChakraProvider>
            </Router>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
);
