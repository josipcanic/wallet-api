const supertest = require("supertest");
const db = require("../src/db");
const app = require("../src/app");

global.api = supertest(app);

module.exports = {
  mochaHooks: {
    beforeEach: async function () {
      await db.raw(
        'TRUNCATE TABLE "transfers", "wallets", "users" RESTART IDENTITY CASCADE;',
      );
    },

    afterAll: async function () {
      await db.destroy();
    },
  },
};
