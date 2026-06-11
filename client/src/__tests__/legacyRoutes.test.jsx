/* eslint-disable import/named */
import React, { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("components/PageTransition", () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock("views/public/ModernLandingPage", () => ({
  default: () => <div>Landing Screen</div>,
}));

vi.mock("views/auth/signIn", () => ({
  default: () => <div>Sign In Screen</div>,
}));

vi.mock("layouts/admin", () => ({
  default: () => <div>Admin Layout</div>,
}));

vi.mock("layouts/user", () => ({
  default: () => <div>User Layout</div>,
}));

const { AnimatedRoutes, RouteFallback } = await import("../index");

const renderRoutes = (path) =>
  render(
    <Suspense fallback={<RouteFallback />}>
      <MemoryRouter initialEntries={[path]}>
        <AnimatedRoutes />
      </MemoryRouter>
    </Suspense>
  );

describe("AnimatedRoutes", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("renders the public landing page for anonymous root visits", async () => {
    renderRoutes("/");

    expect(await screen.findByText("Landing Screen")).toBeInTheDocument();
  });

  it("renders the sign-in view for anonymous auth routes", async () => {
    renderRoutes("/auth/sign-in");

    expect(await screen.findByText("Sign In Screen")).toBeInTheDocument();
  });

  it("routes authenticated admins into the admin shell", async () => {
    localStorage.setItem("user", JSON.stringify({ role: "superAdmin" }));

    renderRoutes("/dashboard");

    expect(await screen.findByText("Admin Layout")).toBeInTheDocument();
  });
});
