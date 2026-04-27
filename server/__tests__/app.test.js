process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../db/config", () => jest.fn());
jest.mock("../services/websocket", () => ({
  broadcast: jest.fn(),
  initWebSocket: jest.fn(),
}));

const { app, closeServer } = require("../index");
const apiRouter = require("../controllers/route");
const healthRouter = require("../controllers/health/_routes");
const userRouter = require("../controllers/user/_routes");
const contactRouter = require("../controllers/contact/_routes");
const propertyRouter = require("../controllers/property/_routes");
const requireDatabase = require("../middlewares/requireDatabase");

const getRouterStack = (router) => router?.stack || [];
const getAppRouterStack = (appInstance) =>
  appInstance?.router?.stack || appInstance?._router?.stack || [];

const layerMatchesPath = (layer, path) =>
  Array.isArray(layer?.matchers) &&
  layer.matchers.some((matcher) => {
    try {
      return Boolean(matcher(path));
    } catch {
      return false;
    }
  });

const hasMountedPrefix = (router, prefix) =>
  getRouterStack(router).some((layer) => layerMatchesPath(layer, `/${prefix}`));

const hasRoute = (router, method, path) =>
  getRouterStack(router).some(
    (layer) => layer.route?.path === path && layer.route?.methods?.[method] === true
  );

const getRouteHandler = (router, method, path) =>
  getRouterStack(router).find(
    (layer) => layer.route?.path === path && layer.route?.methods?.[method] === true
  )?.route?.stack?.[0]?.handle;

const createMockResponse = () => {
  const response = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };

  return response;
};

describe("server app shell", () => {
  afterAll(async () => {
    await closeServer();
  });

  it("registers the root route on the express app", () => {
    const rootLayer = getAppRouterStack(app).find(
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

  it("loads environment variables from server/.env", () => {
    expect(process.env.CLIENT_URL).toBeTruthy();
  });

  it("keeps liveness available when MongoDB is down", async () => {
    const handler = getRouteHandler(healthRouter, "get", "/live");
    const response = createMockResponse();

    await handler({}, response);

    expect(response.statusCode).toBe(200);
    expect(response.payload.status).toBe("live");
  });

  it("reports readiness as degraded when MongoDB is unavailable", async () => {
    const handler = getRouteHandler(healthRouter, "get", "/ready");
    const response = createMockResponse();

    await handler({}, response);

    expect(response.statusCode).toBe(503);
    expect(response.payload.status).toBe("degraded");
    expect(response.payload.database.ready).toBe(false);
  });

  it("returns 503 for database-backed API routes while MongoDB is unavailable", async () => {
    const response = createMockResponse();
    const next = jest.fn();

    await requireDatabase({}, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(503);
    expect(response.payload.code).toBe("DATABASE_UNAVAILABLE");
  });
});
