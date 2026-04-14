const { expect } = require("chai");

describe("Health", function () {
  it("GET /health returns ok:true", async function () {
    const resp = await global.api.get("/health").expect(200);
    expect(resp.body).to.deep.equal({ ok: true });
  });
});
