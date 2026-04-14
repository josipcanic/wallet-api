const { expect } = require("chai");
const jwt = require("jsonwebtoken");

describe("Users routes", function () {
  const register = ({ username, password }) => {
    return global.api.post("/users/register").send({ username, password });
  };

  const login = ({ username, password }) => {
    return global.api.post("/users/login").send({ username, password });
  };

  const registerAndLogin = async ({ username, password }) => {
    const reg = await register({ username, password }).expect(201);
    const user = reg.body;

    const log = await login({ username, password }).expect(200);
    const token = log.body.jwtToken;

    expect(token).to.be.a("string");
    expect(user).to.be.an("object");
    expect(user.id).to.be.a("number");
    expect(user.username).to.equal(username);

    return { user, token };
  };

  describe("POST /users/register", function () {
    it("should register a user", async function () {
      const resp = await register({
        username: "alice",
        password: "password123",
      }).expect(201);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.be.a("number");
      expect(resp.body.username).to.equal("alice");
    });

    it("should return 400 if validation fails (missing password)", async function () {
      const resp = await global.api
        .post("/users/register")
        .send({ username: "alice" })
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
      expect(resp.body.details.some((d) => d.path === "password")).to.equal(
        true,
      );
    });

    it("should return 400 if validation fails (short username)", async function () {
      const resp = await global.api
        .post("/users/register")
        .send({ username: "ab", password: "password123" })
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });

    it("should return 409 when registering duplicate username", async function () {
      await register({ username: "dupuser", password: "password123" }).expect(
        201,
      );

      const resp = await register({
        username: "dupuser",
        password: "password123",
      }).expect(409);
      expect(resp.body.message).to.equal("Username already exists");
    });
  });

  describe("POST /users/login", function () {
    it("should login and return jwtToken", async function () {
      await register({ username: "bob", password: "password123" }).expect(201);

      const resp = await login({
        username: "bob",
        password: "password123",
      }).expect(200);

      expect(resp.body).to.be.an("object");
      expect(resp.body.jwtToken).to.be.a("string");
    });

    it("should return 401 if user does not exist", async function () {
      const resp = await login({
        username: "missing",
        password: "password123",
      }).expect(401);
      expect(resp.body.message).to.equal("Wrong username or password");
    });

    it("should return 401 if password is wrong", async function () {
      await register({ username: "charlie", password: "password123" }).expect(
        201,
      );

      const resp = await login({
        username: "charlie",
        password: "wrongpassword123",
      }).expect(401);
      expect(resp.body.message).to.equal("Wrong username or password");
    });

    it("should return 400 if validation fails", async function () {
      const resp = await global.api.post("/users/login").send({}).expect(400);
      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });
  });

  describe("GET /users", function () {
    it("should return 401 without Authorization header", async function () {
      const resp = await global.api.get("/users").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should return list of users when authorized", async function () {
      await register({ username: "user1", password: "password123" }).expect(
        201,
      );
      await register({ username: "user2", password: "password123" }).expect(
        201,
      );

      const { token } = await registerAndLogin({
        username: "user3",
        password: "password123",
      });

      const resp = await global.api
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body).to.be.an("array");
      expect(resp.body[0]).to.have.property("id");
      expect(resp.body[0]).to.have.property("username");
      expect(resp.body[0]).to.have.property("created_at");
    });
  });

  describe("GET /users/:id", function () {
    it("should return 401 without token", async function () {
      const resp = await global.api.get("/users/1").expect(401);
      expect(resp.body.message).to.equal("Missing Authorization header!");
    });

    it("should fetch a user by id when authorized", async function () {
      const reg = await register({
        username: "dave",
        password: "password123",
      }).expect(201);
      const created = reg.body;

      const { token } = await registerAndLogin({
        username: "viewer",
        password: "password123",
      });

      const resp = await global.api
        .get(`/users/${created.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body).to.be.an("object");
      expect(resp.body.id).to.equal(created.id);
      expect(resp.body.username).to.equal("dave");
      expect(resp.body).to.have.property("created_at");
    });

    it("should return 404 for non-existing user", async function () {
      const { token } = await registerAndLogin({
        username: "viewer2",
        password: "password123",
      });

      const resp = await global.api
        .get("/users/999999")
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(resp.body.message).to.equal("User not found");
    });

    it("should return 400 if id param is invalid", async function () {
      const { token } = await registerAndLogin({
        username: "viewer3",
        password: "password123",
      });

      const resp = await global.api
        .get("/users/abc")
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });
  });

  describe("PUT /users/:id", function () {
    it("should return 401 without token", async function () {
      await global.api
        .put("/users/1")
        .send({ username: "x", password: "password123" })
        .expect(401);
    });

    it("should return 403 when trying to update other user", async function () {
      const { token: t1 } = await registerAndLogin({
        username: "owner",
        password: "password123",
      });
      const { user: u2 } = await registerAndLogin({
        username: "other",
        password: "password123",
      });

      const resp = await global.api
        .put(`/users/${u2.id}`)
        .set("Authorization", `Bearer ${t1}`)
        .send({ username: "hacked", password: "password123" })
        .expect(403);

      expect(resp.body.message).to.equal(
        "Forbidden: you can only modify your own account",
      );
    });

    it("should update own user", async function () {
      const { user, token } = await registerAndLogin({
        username: "editme",
        password: "password123",
      });

      const resp = await global.api
        .put(`/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "edited", password: "newpassword123" })
        .expect(200);

      expect(resp.body.id).to.equal(user.id);
      expect(resp.body.username).to.equal("edited");
    });

    it("should return 404 when updating non-existing user (self token matches id)", async function () {
      const ghostId = 9999;
      const ghostToken = jwt.sign({ id: ghostId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const resp = await global.api
        .put(`/users/${ghostId}`)
        .set("Authorization", `Bearer ${ghostToken}`)
        .send({ username: "ghost", password: "password123" })
        .expect(404);

      expect(resp.body.message).to.equal("User not found");
    });

    it("should return 400 when validation fails", async function () {
      const { user, token } = await registerAndLogin({
        username: "valedit",
        password: "password123",
      });

      const resp = await global.api
        .put(`/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "ab", password: "short" })
        .expect(400);

      expect(resp.body.message).to.equal("Validation error");
      expect(resp.body.details).to.be.an("array");
    });
  });

  describe("DELETE /users/:id", function () {
    it("should return 401 without token", async function () {
      await global.api.delete("/users/1").expect(401);
    });

    it("should return 403 when trying to delete other user", async function () {
      const { token: t1 } = await registerAndLogin({
        username: "deleter",
        password: "password123",
      });
      const { user: u2 } = await registerAndLogin({
        username: "victim",
        password: "password123",
      });

      const resp = await global.api
        .delete(`/users/${u2.id}`)
        .set("Authorization", `Bearer ${t1}`)
        .expect(403);

      expect(resp.body.message).to.equal(
        "Forbidden: you can only modify your own account",
      );
    });

    it("should delete own user", async function () {
      const { user, token } = await registerAndLogin({
        username: "todelete",
        password: "password123",
      });

      const resp = await global.api
        .delete(`/users/${user.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(resp.body.id).to.equal(user.id);
      expect(resp.body.username).to.equal("todelete");
    });

    it("should return 404 when deleting non-existing user (self token matches id)", async function () {
      const ghostId = 9999;
      const ghostToken = jwt.sign({ id: ghostId }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const resp = await global.api
        .delete(`/users/${ghostId}`)
        .set("Authorization", `Bearer ${ghostToken}`)
        .expect(404);

      expect(resp.body.message).to.equal("User not found");
    });
  });
});
