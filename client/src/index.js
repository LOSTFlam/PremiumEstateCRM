import React from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorBoundary from "components/ErrorBoundary";
import SEO from "components/SEO";
import "assets/css/App.css";
import "assets/css/tailwind.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AuthLayout from "./layouts/auth";
import AdminLayout from "layouts/admin";
import UserLayout from "layouts/user";
import PublicCatalog from "views/public/catalog";
import ModernLandingPage from "views/public/ModernLandingPage";
import PublicOfferView from "views/public/catalog/View";
import PublicOfferViewBySlug from "views/public/catalog/ViewBySlug";
import PublicCompareView from "views/public/catalog/Compare";
import FavoritesPage from "views/public/FavoritesPage";
import ComparePage from "views/public/ComparePage";
import PropertyViewBySlug from "views/admin/property/ViewBySlug";
import SeoCollectionPage from "views/public/catalog/SeoCollectionPage";
import SignUp from "views/auth/signUp";
import SignIn from "views/auth/signIn";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n/i18n.config";
import Alpine from 'alpinejs';

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.start();

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

function App() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const user = getStoredUser();
  const isAuthenticated = Boolean(token && user?.role);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/offers" replace />
          }
        />
        {/* New Modern Landing Page */}
        <Route path="/offers" element={<ModernLandingPage />} />
        <Route path="/offers/houses" element={<PublicCatalog forcedType="house" />} />
        <Route path="/offers/apartments" element={<PublicCatalog forcedType="apartment" />} />
        <Route path="/offers/plots" element={<PublicCatalog forcedType="land" />} />
        <Route path="/offers/commercial" element={<PublicCatalog forcedType="commercial" />} />
        <Route path="/collections/:slug" element={<SeoCollectionPage />} />
        <Route path="/offers/compare" element={<PublicCompareView />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/compare" element={<ComparePage />} />
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
            <Route path="/*" element={<AdminLayout />} />
          ) : (
            <Route path="/*" element={<AuthLayout />} />
          )
        ) : (
          <Route path="/*" element={<AuthLayout />} />
        )}
      </Routes>
    </>
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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Router>
              <ChakraProvider theme={theme}>
                <ToastContainer />
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
              </ChakraProvider>
            </Router>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);


