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
});
