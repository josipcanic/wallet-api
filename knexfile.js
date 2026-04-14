require("dotenv-safe").config();

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || "wallet",
      password: process.env.DB_PASSWORD || "wallet",
      database: process.env.DB_NAME || "wallet_db",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },

  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || "wallet",
      password: process.env.DB_PASSWORD || "wallet",
      database: process.env.DB_TEST_NAME || "wallet_test_db",
    },
    migrations: {
      directory: "./src/db/migrations",
    },
    seeds: {
      directory: "./src/db/seeds",
    },
  },
};
