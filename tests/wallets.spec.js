const { expect } = require("chai");

describe("Wallets routes", function () {
  const register = ({ username, password }) =>
    global.api.post("/users/register").send({ username, password });

  const login = ({ username, password }) =>
    global.api.post("/users/login").send({ username, password });

  const registerAndLogin = async ({ username, password }) => {
    const reg = await register({ username, password }).expect(201);
    const user = reg.body;

    const log = await login({ username, password }).expect(200);
    const token = log.body.jwtToken;

    expect(user).to.have.property("id");
    expect(token).to.be.a("string");

    return { user, token };
  };

  const createWallet = (token) =>
    global.api.post("/wallets").set("Authorization", `Bearer ${token}`);

  describe("POST /wallets", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.post("/wallets").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should create a wallet for logged user", async function () {
      const { token } = await registerAndLogin({
        username: "walletuser",
        password: "password123",
      });

      const resp = await createWallet(token).expect(201);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.be.a("number");

      // repo često vraća user_id, balance, created_at (ovisno kako si napravio returning)
      // ne pretpostavljam 100% shape, ali provjeravam glavne stvari
      expect(resp.body).to.have.property("balance");
    });

    it("should allow a user to create multiple wallets", async function () {
      const { token } = await registerAndLogin({
        username: "multiwallet",
        password: "password123",
      });

      const w1 = await createWallet(token).expect(201);
      const w2 = await createWallet(token).expect(201);

      expect(w1.body.id).to.not.equal(w2.body.id);
    });
  });

  describe("GET /wallets", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.get("/wallets").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should list only wallets of logged user", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "userA",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "userB",
        password: "password123",
      });

      // userA creates 2 wallets
      await createWallet(tokenA).expect(201);
      await createWallet(tokenA).expect(201);

      // userB creates 1 wallet
      await createWallet(tokenB).expect(201);

      const respA = await global.api
        .get("/wallets")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      const respB = await global.api
        .get("/wallets")
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(200);

      expect(respA.body).to.be.an("array");
      expect(respB.body).to.be.an("array");

      expect(respA.body.length).to.equal(2);
      expect(respB.body.length).to.equal(1);
    });
  });

  describe("GET /wallets/:id", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.get("/wallets/1").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should return 400 for invalid id param", async function () {
      const { token } = await registerAndLogin({
        username: "paramuser",
        password: "password123",
      });

      const resp = await global.api
        .get("/wallets/abc")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });

    it("should return 404 if wallet not found", async function () {
      const { token } = await registerAndLogin({
        username: "nofound",
        password: "password123",
      });

      const resp = await global.api
        .get("/wallets/999999")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(resp.body.message).to.equal("Wallet not found");
    });

    it("should return 403 when accessing someone else's wallet", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "ownerWallet",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "otherWallet",
        password: "password123",
      });

      const created = await createWallet(tokenA).expect(201);
      const walletId = created.body.id;

      const resp = await global.api
        .get(`/wallets/${walletId}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(403);

      expect(resp.body.message).to.equal("Forbidden");
    });

    it("should fetch own wallet", async function () {
      const { token } = await registerAndLogin({
        username: "mywallet",
        password: "password123",
      });

      const created = await createWallet(token).expect(201);
      const walletId = created.body.id;

      const resp = await global.api
        .get(`/wallets/${walletId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.equal(walletId);
    });
  });

  describe("POST /wallets/:id/deposits", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api
        .post("/wallets/1/deposits")
        .send({ amount: 10 })
        .expect(401);

      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should return 400 for invalid id param", async function () {
      const { token } = await registerAndLogin({
        username: "badid",
        password: "password123",
      });

      const resp = await global.api
        .post("/wallets/abc/deposits")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 10 })
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
    });

    it("should return 400 for invalid deposit amount", async function () {
      const { token } = await registerAndLogin({
        username: "badbal",
        password: "password123",
      });

      const created = await createWallet(token).expect(201);

      const resp = await global.api
        .post(`/wallets/${created.body.id}/deposits`)
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: -10 })
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });

    it("should return 404 if wallet not found", async function () {
      const { token } = await registerAndLogin({
        username: "upnofound",
        password: "password123",
      });

      const resp = await global.api
        .post("/wallets/999999/deposits")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 10 })
        .expect(404);

      expect(resp.body.message).to.equal("Wallet not found");
    });

    it("should return 403 when depositing into someone else's wallet", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "upOwner",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "upOther",
        password: "password123",
      });

      const created = await createWallet(tokenA).expect(201);

      const resp = await global.api
        .post(`/wallets/${created.body.id}/deposits`)
        .set("Authorization", `Bearer ${tokenB}`)
        .send({ amount: 50 })
        .expect(403);

      expect(resp.body.message).to.equal("Forbidden");
    });

    it("should deposit into own wallet", async function () {
      const { token } = await registerAndLogin({
        username: "upMine",
        password: "password123",
      });

      const created = await createWallet(token).expect(201);

      const resp = await global.api
        .post(`/wallets/${created.body.id}/deposits`)
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 123.45 })
        .expect(200);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.equal(created.body.id);
      expect(Number(resp.body.balance)).to.equal(123.45);
    });
  });

  describe("DELETE /wallets/:id", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.delete("/wallets/1").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should return 400 for invalid id param", async function () {
      const { token } = await registerAndLogin({
        username: "delbadid",
        password: "password123",
      });

      const resp = await global.api
        .delete("/wallets/abc")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
    });

    it("should return 404 if wallet not found", async function () {
      const { token } = await registerAndLogin({
        username: "delnofound",
        password: "password123",
      });

      const resp = await global.api
        .delete("/wallets/999999")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(resp.body.message).to.equal("Wallet not found");
    });

    it("should return 403 when deleting someone else's wallet", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "delOwner",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "delOther",
        password: "password123",
      });

      const created = await createWallet(tokenA).expect(201);

      const resp = await global.api
        .delete(`/wallets/${created.body.id}`)
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(403);

      expect(resp.body.message).to.equal("Forbidden");
    });

    it("should delete own wallet", async function () {
      const { token } = await registerAndLogin({
        username: "delMine",
        password: "password123",
      });

      const created = await createWallet(token).expect(201);

      const resp = await global.api
        .delete(`/wallets/${created.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.equal(created.body.id);
    });
  });
});
