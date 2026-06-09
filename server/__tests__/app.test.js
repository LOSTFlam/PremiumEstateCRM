process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

jest.mock("../db/config", () => jest.fn());
jest.mock("../services/websocket", () => ({
  broadcast: jest.fn(),
  initWebSocket: jest.fn(),
}));

const request = require("supertest");
const { app, server } = require("../index");

describe("server app shell", () => {
  afterAll((done) => {
    if (server?.close) {
      server.close(done);
      return;
    }
    done();
  });

  it("responds to GET / with welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Welcome");
  });

  it("responds to GET /api/health/status", async () => {
    const res = await request(app).get("/api/health/status");
    expect(res.status).toBe(200);
    expect(["ok", "degraded"]).toContain(res.body.status);
  });

  it("returns 404 for unknown API routes", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.status).toBe(404);
  });
});
