import React, { Suspense, lazy, useEffect } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "components/ErrorBoundary";
import SEO from "components/SEO";
import GlobalAnimationStyles from "components/GlobalAnimationStyles";
import "assets/css/App.css";
import "assets/css/tailwind.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Box, ChakraProvider, Container, Spinner, Stack, Text } from "@chakra-ui/react";
import theme from "theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n/i18n.config";

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

    const applyReplacements = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode();

      while (currentNode) {
        const parentTag = currentNode.parentElement?.tagName;
        if (parentTag !== "SCRIPT" && parentTag !== "STYLE") {
          const replaced = replaceLegacyRuText(currentNode.textContent || "");
          if (replaced !== currentNode.textContent) {
            currentNode.textContent = replaced;
          }
        }
        currentNode = walker.nextNode();
      }

      document.querySelectorAll("*").forEach((element) => {
        ["placeholder", "aria-label", "title"].forEach((attribute) => {
          const value = element.getAttribute(attribute);
          const replaced = replaceLegacyRuText(value);
          if (value && replaced !== value) {
            element.setAttribute(attribute, replaced);
          }
        });
      });
    };

    const rafId = window.requestAnimationFrame(applyReplacements);
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(applyReplacements);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    return () => {
      window.cancelAnimationFrame(rafId);
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

function App() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = getStoredUser();
  const isAuthenticated = Boolean(token && user?.role);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
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
    </Suspense>
  );
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.render(
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
            <Router>
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
  document.getElementById("root"),
);
