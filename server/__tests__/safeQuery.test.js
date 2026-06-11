const { pickAllowedQuery, pickAllowedBody } = require("../utils/safeQuery");

describe("safeQuery utilities", () => {
  it("keeps only allowlisted query fields", () => {
    const result = pickAllowedQuery(
      { role: "user", deleted: "true", password: "x" },
      ["role", "firstName"],
    );
    expect(result).toEqual({ role: "user" });
  });

  it("rejects operator-style keys", () => {
    const result = pickAllowedQuery({ "$ne": "admin", role: "user" }, ["role", "$ne"]);
    expect(result).toEqual({ role: "user" });
  });

  it("picks allowlisted body fields", () => {
    const result = pickAllowedBody(
      { firstName: "Ann", role: "superAdmin", password: "secret" },
      ["firstName", "lastName"],
    );
    expect(result).toEqual({ firstName: "Ann" });
  });
});
