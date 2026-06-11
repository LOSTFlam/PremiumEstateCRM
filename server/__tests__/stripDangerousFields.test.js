const { stripDangerousFields } = require("../utils/stripDangerousFields");

describe("stripDangerousFields", () => {
  it("removes privileged fields from payloads", () => {
    const result = stripDangerousFields({
      firstName: "Ann",
      role: "superAdmin",
      deleted: true,
      password: "secret",
    });

    expect(result).toEqual({ firstName: "Ann" });
  });

  it("keeps password on auth routes when preservePassword is enabled", () => {
    const result = stripDangerousFields(
      { email: "a@b.com", password: "Secret123!", role: "admin" },
      { preservePassword: true }
    );

    expect(result).toEqual({ email: "a@b.com", password: "Secret123!" });
  });
});
