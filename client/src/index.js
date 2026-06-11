import React, { Suspense, lazy, useEffect, useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "components/ErrorBoundary";
import SEO from "components/SEO";
import GlobalAnimationStyles from "components/GlobalAnimationStyles";
import ScrollToTop from "components/ScrollToTop";
import CommandPalette from "components/CommandPalette";
import "assets/css/App.css";
import "assets/css/tailwind.css";
import "styles/design-tokens.css";
import "styles/premium-effects.css";
import "styles/responsive.css";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Box, ChakraProvider, Container, Spinner, Stack, Text } from "@chakra-ui/react";
import theme from "theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n/i18n.config";
import { initExchangeRate } from "services/exchangeRate";
import { ThemeProvider } from "./providers/ThemeProvider";
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
const SeoCollectionPage = lazy(() => import("views/public/catalog/SeoCollectionPage"));
const AnalyticsDashboard = lazy(() => import("views/admin/analytics/AnalyticsDashboard"));
const LeadKanban = lazy(() => import("views/admin/leads/LeadKanban"));
const SignUp = lazy(() => import("views/auth/signUp"));
const SignIn = lazy(() => import("views/auth/signIn"));
const AboutPage = lazy(() => import("views/public/pages/AboutPage"));
const ServicesPage = lazy(() => import("views/public/pages/ServicesPage"));
const HowItWorksPage = lazy(() => import("views/public/pages/HowItWorksPage"));
const ContactsPage = lazy(() => import("views/public/pages/ContactsPage"));
const FaqPage = lazy(() => import("views/public/pages/FaqPage"));
const TestimonialsPage = lazy(() => import("views/public/pages/TestimonialsPage"));
const BlogPage = lazy(() => import("views/public/pages/BlogPage"));
const BlogArticlePage = lazy(() => import("views/public/pages/BlogArticlePage"));
const PrivacyPage = lazy(() => import("views/public/pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("views/public/pages/NotFoundPage"));
const ThankYouPage = lazy(() => import("views/public/pages/ThankYouPage"));

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      }))
    )
  : null;

import { getStoredUser, isAuthenticatedUser } from "utils/authStorage";
import { restoreAuthSession } from "utils/authSession";
import { setUser, clearUser } from "./redux/slices/localSlice";

const resolveLocale = () => {
  if (typeof window === "undefined") return "ru";
  const stored = window.localStorage?.getItem("i18nextLng");
  const fallback = stored || document.documentElement?.lang || window.navigator?.language || "ru";
  return String(fallback).toLowerCase().startsWith("ru") ? "ru" : "en";
};

const RU_LEGACY_TEXT_REPLACEMENTS = [
  [
    "Track and manage your leads through the sales pipeline",
    "Отслеживайте лиды и ведите их по воронке продаж",
  ],
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

// Optimized text replacement function with caching and early exit
const ruTextCache = new Map();

function replaceLegacyRuText(value) {
  if (typeof value !== "string" || !value.trim()) return value;

  // Check if we already computed this value
  if (ruTextCache.has(value)) {
    return ruTextCache.get(value);
  }

  let nextValue = value;
  // Early exit if value doesn't contain any of the common phrases
  const containsReplacableText = RU_LEGACY_TEXT_REPLACEMENTS.some(([from]) => value.includes(from));

  if (containsReplacableText) {
    RU_LEGACY_TEXT_REPLACEMENTS.forEach(([from, to]) => {
      if (nextValue.includes(from)) {
        nextValue = nextValue.split(from).join(to);
      }
    });
  }

  // Cache the result to avoid recomputation
  ruTextCache.set(value, nextValue);

  // Limit cache size to prevent memory issues
  if (ruTextCache.size > 500) {
    // Reduced cache size
    const firstKey = ruTextCache.keys().next().value;
    ruTextCache.delete(firstKey);
  }

  return nextValue;
}

function LegacyRuTextGuard() {
  useEffect(() => {
    if (resolveLocale() !== "ru" || typeof document === "undefined") return undefined;

    // Cache the replacements to avoid repeated iterations
    const replaceElementAttributes = (element) => {
      ["placeholder", "aria-label", "title"].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && typeof value === "string") {
          const replaced = replaceLegacyRuText(value);
          if (replaced !== value) {
            element.setAttribute(attribute, replaced);
          }
        }
      });
    };

    const replaceTree = (rootNode) => {
      if (!rootNode?.isConnected && rootNode !== document.body) return;

      if (rootNode.nodeType === Node.TEXT_NODE) {
        const parentTag = rootNode.parentElement?.tagName;
        if (parentTag !== "SCRIPT" && parentTag !== "STYLE") {
          const textContent = rootNode.textContent || "";
          if (textContent && typeof textContent === "string") {
            const replaced = replaceLegacyRuText(textContent);
            if (replaced !== rootNode.textContent) {
              rootNode.textContent = replaced;
            }
          }
        }
        return;
      }

      if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      // Optimize the tree walker to process fewer nodes
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
        }
      );

      replaceElementAttributes(rootNode);

      let currentNode = walker.nextNode();
      // Limit the number of nodes processed to prevent long-running operations
      let processedCount = 0;
      const MAX_NODES_TO_PROCESS = 200; // Reduced limit to improve performance

      while (currentNode && processedCount < MAX_NODES_TO_PROCESS) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          const textContent = currentNode.textContent || "";
          if (textContent && typeof textContent === "string") {
            const replaced = replaceLegacyRuText(textContent);
            if (replaced !== currentNode.textContent) {
              currentNode.textContent = replaced;
            }
          }
        } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
          replaceElementAttributes(currentNode);
        }
        currentNode = walker.nextNode();
        processedCount++;
      }
    };

    const pendingNodes = new Set();
    let frameId = 0;

    // Debounce function to prevent too frequent execution
    let lastExecutionTime = 0;
    const MIN_EXECUTION_INTERVAL = 100; // ms

    const flushPendingNodes = () => {
      const now = Date.now();
      if (now - lastExecutionTime < MIN_EXECUTION_INTERVAL) {
        // Schedule for later if executed too recently
        frameId = window.requestAnimationFrame(flushPendingNodes);
        return;
      }

      lastExecutionTime = now;
      frameId = 0;

      // Limit the number of pending nodes to process
      const nodesToProcess = Array.from(pendingNodes).slice(0, 50); // Only process first 50 nodes

      const nodes = nodesToProcess.filter(
        (node) =>
          !nodesToProcess.some(
            (candidate) =>
              candidate !== node &&
              candidate?.nodeType === Node.ELEMENT_NODE &&
              candidate.contains?.(node)
          )
      );

      pendingNodes.clear();
      nodes.forEach((node) => replaceTree(node));
    };

    const scheduleReplacement = (node = document.body) => {
      if (!node) return;

      // Only add to pending if we have space
      if (pendingNodes.size < 100) {
        // Limit pending nodes
        pendingNodes.add(node);
      }

      if (!frameId) {
        frameId = window.requestAnimationFrame(flushPendingNodes);
      }
    };

    scheduleReplacement();

    // Throttle the observer to reduce performance impact
    let observerTimeout = null;

    const throttledObserver = (mutations) => {
      // Clear any pending timeout
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }

      // Use a timeout to batch mutations and reduce frequency
      observerTimeout = setTimeout(() => {
        // Limit the number of mutations processed
        const limitedMutations = mutations.slice(0, 30); // Only process first 30 mutations

        limitedMutations.forEach((mutation) => {
          if (mutation.type === "characterData") {
            scheduleReplacement(mutation.target);
            return;
          }

          if (mutation.type === "attributes") {
            scheduleReplacement(mutation.target);
            return;
          }

          // Limit added nodes
          const limitedAddedNodes = Array.from(mutation.addedNodes).slice(0, 10);
          limitedAddedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
              scheduleReplacement(node);
            }
          });
        });
      }, 16); // ~60fps
    };

    const observer = new MutationObserver(throttledObserver);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    // Cleanup function
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (observerTimeout) {
        clearTimeout(observerTimeout);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}

export function RouteFallback() {
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

export function AnimatedRoutes() {
  const location = useLocation();
  const user = getStoredUser();
  const isAuthenticated = isAuthenticatedUser();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === "user" ? "/cabinet" : "/dashboard"} replace />
              ) : (
                <ModernLandingPage />
              )
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/compare" element={<Navigate to="/offers/compare" replace />} />
          <Route path="/offers/:id" element={<PublicOfferView />} />
          <Route path="/offers/slug/:slug" element={<PublicOfferViewBySlug />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route
            path="/auth/*"
            element={
              isAuthenticated ? (
                <Navigate to={user?.role === "user" ? "/cabinet" : "/dashboard"} replace />
              ) : (
                <AuthLayout />
              )
            }
          />

          {isAuthenticated ? (
            user?.role === "user" ? (
              <Route path="/*" element={<UserLayout />} />
            ) : ["superAdmin", "admin", "manager", "teamleader", "executive", "telecaller"].includes(
                user?.role
              ) ? (
              <>
                {user?.role === "superAdmin" ? (
                  <>
                    <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
                    <Route path="/admin/leads" element={<LeadKanban />} />
                  </>
                ) : null}
                <Route path="/*" element={<AdminLayout />} />
              </>
            ) : (
              <Route path="/*" element={<Navigate to="/" replace />} />
            )
          ) : (
            <Route path="*" element={<NotFoundPage />} />
          )}
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

export function LegacyApplicationShell() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initExchangeRate();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      const restoredUser = await restoreAuthSession();

      if (cancelled) return;

      if (restoredUser) {
        store.dispatch(setUser(restoredUser));
      } else if (!getStoredUser()) {
        store.dispatch(clearUser());
      }

      setAuthReady(true);
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

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
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        {authReady ? <AnimatedRoutes /> : <RouteFallback />}
        <ScrollToTop />
        <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
      </Suspense>
    </BrowserRouter>
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

export function LegacyAppProviders({ children }) {
  return (
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
            <ThemeProvider>
              <ChakraProvider theme={theme}>
                <ToastContainer />
                <Toaster position="bottom-right" richColors closeButton duration={5000} />
                <LegacyRuTextGuard />
                {children}
                {ReactQueryDevtools ? (
                  <Suspense fallback={null}>
                    <ReactQueryDevtools initialIsOpen={false} />
                  </Suspense>
                ) : null}
              </ChakraProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default function LegacyApp() {
  return (
    <React.StrictMode>
      <LegacyAppProviders>
        <LegacyApplicationShell />
      </LegacyAppProviders>
    </React.StrictMode>
  );
}

import { createRoot } from "react-dom/client";

export function mountLegacyApp(container = document.getElementById("root")) {
  if (!container) {
    return null;
  }

  const root = createRoot(container);
  root.render(<LegacyApp />);
  return root;
}

mountLegacyApp();
