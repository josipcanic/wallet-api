const { expect } = require("chai");

describe("Transfers routes", function () {
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

  const depositIntoWallet = (token, walletId, amount) =>
    global.api
      .post(`/wallets/${walletId}/deposits`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount });

  const createTransfer = (token, body) =>
    global.api
      .post("/transfers")
      .set("Authorization", `Bearer ${token}`)
      .send(body);

  describe("POST /transfers", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.post("/transfers").send({}).expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should return 400 for validation error (missing body fields)", async function () {
      const { token } = await registerAndLogin({
        username: "trvaluser",
        password: "password123",
      });

      const resp = await createTransfer(token, {}).expect(400);
      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });

    it("should return 400 when transferring to same wallet (route-level check)", async function () {
      const { token } = await registerAndLogin({
        username: "samewalletuser",
        password: "password123",
      });

      const w = await createWallet(token).expect(201);

      const resp = await createTransfer(token, {
        fromWalletId: w.body.id,
        toWalletId: w.body.id,
        amount: 10,
      }).expect(400);

      expect(resp.body.message).to.equal("Cannot transfer to same wallet");
    });

    it("should return 404 if from wallet not found", async function () {
      const { token } = await registerAndLogin({
        username: "nofrom",
        password: "password123",
      });

      const toW = await createWallet(token).expect(201);

      const resp = await createTransfer(token, {
        fromWalletId: 999999,
        toWalletId: toW.body.id,
        amount: 5,
      }).expect(404);

      expect(resp.body.message).to.equal("From wallet not found");
    });

    it("should return 403 if from wallet is not owned by user", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "ownerA",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "ownerB",
        password: "password123",
      });

      const fromW = await createWallet(tokenA).expect(201);
      const toW = await createWallet(tokenB).expect(201);

      await depositIntoWallet(tokenA, fromW.body.id, 100).expect(200);

      const resp = await createTransfer(tokenB, {
        fromWalletId: fromW.body.id,
        toWalletId: toW.body.id,
        amount: 10,
      }).expect(403);

      expect(resp.body.message).to.equal("Forbidden");
    });

    it("should return 404 if to wallet not found", async function () {
      const { token } = await registerAndLogin({
        username: "notouser",
        password: "password123",
      });

      const fromW = await createWallet(token).expect(201);
      await depositIntoWallet(token, fromW.body.id, 50).expect(200);

      const resp = await createTransfer(token, {
        fromWalletId: fromW.body.id,
        toWalletId: 999999,
        amount: 10,
      }).expect(404);

      expect(resp.body.message).to.equal("To wallet not found");
    });

    it("should return 400 if insufficient funds", async function () {
      const { token } = await registerAndLogin({
        username: "pooruser",
        password: "password123",
      });

      const fromW = await createWallet(token).expect(201);
      const toW = await createWallet(token).expect(201);

      const resp = await createTransfer(token, {
        fromWalletId: fromW.body.id,
        toWalletId: toW.body.id,
        amount: 10,
      }).expect(400);

      expect(resp.body.message).to.equal("Insufficient funds");
    });

    it("should create a transfer and update balances", async function () {
      const { token } = await registerAndLogin({
        username: "richuser",
        password: "password123",
      });

      const fromW = await createWallet(token).expect(201);
      const toW = await createWallet(token).expect(201);

      await depositIntoWallet(token, fromW.body.id, 100).expect(200);
      await depositIntoWallet(token, toW.body.id, 10).expect(200);

      const resp = await createTransfer(token, {
        fromWalletId: fromW.body.id,
        toWalletId: toW.body.id,
        amount: 25.5,
      }).expect(201);

      expect(resp.body).to.be.an("object");
      expect(resp.body).to.have.property("id");
      expect(resp.body.from_wallet_id).to.equal(fromW.body.id);
      expect(resp.body.to_wallet_id).to.equal(toW.body.id);

      expect(Number(resp.body.amount)).to.equal(25.5);
      expect(resp.body).to.have.property("created_at");

      const fromAfter = await global.api
        .get(`/wallets/${fromW.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const toAfter = await global.api
        .get(`/wallets/${toW.body.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Number(fromAfter.body.balance)).to.equal(74.5); // 100 - 25.5
      expect(Number(toAfter.body.balance)).to.equal(35.5); // 10 + 25.5
    });
  });

  describe("GET /transfers", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.get("/transfers").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should list transfers involving logged user wallets (incoming or outgoing)", async function () {
      const { token: tokenA } = await registerAndLogin({
        username: "listA",
        password: "password123",
      });
      const { token: tokenB } = await registerAndLogin({
        username: "listB",
        password: "password123",
      });

      const a1 = await createWallet(tokenA).expect(201);
      const a2 = await createWallet(tokenA).expect(201);

      const b1 = await createWallet(tokenB).expect(201);

      await depositIntoWallet(tokenA, a1.body.id, 100).expect(200);

      await createTransfer(tokenA, {
        fromWalletId: a1.body.id,
        toWalletId: a2.body.id,
        amount: 10,
      }).expect(201);

      await createTransfer(tokenA, {
        fromWalletId: a1.body.id,
        toWalletId: b1.body.id,
        amount: 5,
      }).expect(201);

      await depositIntoWallet(tokenB, b1.body.id, 50).expect(200);

      await createTransfer(tokenB, {
        fromWalletId: b1.body.id,
        toWalletId: a2.body.id,
        amount: 7,
      }).expect(201);

      const listA = await global.api
        .get("/transfers")
        .set("Authorization", `Bearer ${tokenA}`)
        .expect(200);

      expect(listA.body).to.be.an("array");
      expect(listA.body.length).to.equal(3);

      const listB = await global.api
        .get("/transfers")
        .set("Authorization", `Bearer ${tokenB}`)
        .expect(200);

      expect(listB.body).to.be.an("array");
      expect(listB.body.length).to.equal(2);

      // shape check
      const t = listA.body[0];
      expect(t).to.have.property("id");
      expect(t).to.have.property("from_wallet_id");
      expect(t).to.have.property("to_wallet_id");
      expect(t).to.have.property("amount");
      expect(t).to.have.property("created_at");
    });
  });
});
