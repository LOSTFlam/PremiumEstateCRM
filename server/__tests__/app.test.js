process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../db/config", () => jest.fn());
jest.mock("../services/websocket", () => ({
  broadcast: jest.fn(),
  initWebSocket: jest.fn(),
}));

const { app, server } = require("../index");
const apiRouter = require("../controllers/route");
const userRouter = require("../controllers/user/_routes");
const contactRouter = require("../controllers/contact/_routes");
const propertyRouter = require("../controllers/property/_routes");

const getRouterStack = (router) => router?.stack || [];

const hasMountedPrefix = (router, prefix) =>
  getRouterStack(router).some((layer) => layer.regexp?.test(`/${prefix}`));

const hasRoute = (router, method, path) =>
  getRouterStack(router).some(
    (layer) => layer.route?.path === path && layer.route?.methods?.[method] === true
  );

describe("server app shell", () => {
  afterAll((done) => {
    if (server?.close) {
      server.close(done);
      return;
    }

    done();
  });

  it("registers the root route on the express app", () => {
    const rootLayer = getRouterStack(app._router).find(
      (layer) => layer.route?.path === "/" && layer.route?.methods?.get
    );

    expect(rootLayer).toBeDefined();
  });

  it("keeps contact and property routers mounted under /api", () => {
    expect(hasMountedPrefix(apiRouter, "contact")).toBe(true);
    expect(hasMountedPrefix(apiRouter, "property")).toBe(true);
    expect(hasRoute(contactRouter, "get", "/")).toBe(true);
    expect(hasRoute(propertyRouter, "get", "/")).toBe(true);
  });

  it("keeps the user auth route mounted", () => {
    expect(hasMountedPrefix(apiRouter, "user")).toBe(true);
    expect(hasRoute(userRouter, "post", "/login")).toBe(true);
  });
});
