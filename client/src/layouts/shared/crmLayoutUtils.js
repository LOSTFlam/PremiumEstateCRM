import React from "react";
import { Route } from "react-router-dom";
import i18next from "i18next";
import { getBrandLabel, translateRouteLabel } from "i18n/crmDictionary";

const activePath = () => window?.location?.href || "";

const matchesRoute = (route) => {
  const routePath = route?.path ? String(route.path).replace("/:id", "") : "";
  return Boolean(routePath) && activePath().indexOf(routePath) !== -1;
};

const walkRoutes = (routes = [], resolver) => {
  for (const route of routes) {
    if (route?.collapse || route?.category) {
      const nestedResult = walkRoutes(route?.items || [], resolver);
      if (nestedResult !== undefined && nestedResult !== false) {
        return nestedResult;
      }
      continue;
    }

    const resolved = resolver(route);
    if (resolved !== undefined && resolved !== false) {
      return resolved;
    }
  }

  return undefined;
};

export const getActiveCrmRoute = (routes = []) =>
  walkRoutes(routes, (route) => (matchesRoute(route) ? route : undefined)) || false;

export const getActiveCrmRouteLabel = (routes = []) => {
  const activeRoute = getActiveCrmRoute(routes);

  if (!activeRoute) {
    return getBrandLabel(i18next.language);
  }

  return translateRouteLabel(activeRoute, {
    t: i18next.t.bind(i18next),
    language: i18next.language,
  });
};

export const getActiveCrmNavbarValue = (routes = [], key) =>
  walkRoutes(routes, (route) => (matchesRoute(route) ? route?.[key] : undefined)) ||
  false;

export const renderCrmRoutes = (routes = [], shouldRender = () => true) =>
  routes.map((route, index) => {
    if (route?.collapse || route?.category) {
      return renderCrmRoutes(route?.items || [], shouldRender);
    }

    if (!shouldRender(route)) {
      return null;
    }

    return (
      <Route
        path={route?.path}
        element={route ? <route.component /> : null}
        key={`${route?.path || route?.name || "route"}-${index}`}
      />
    );
  });
