import React, { Suspense, lazy } from "react";
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

function RouteFallback() {
  return (
    <Box minH="100vh" bg="#e7e5e4" color="#111827" display="flex" alignItems="center">
      <Container maxW="md">
        <Stack spacing={4} align="center" textAlign="center">
          <Spinner size="xl" color="orange.400" thickness="4px" />
          <Text fontWeight="700">Loading Premium Estate</Text>
          <Text color="gray.500">Preparing the next screen and listing data.</Text>
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
