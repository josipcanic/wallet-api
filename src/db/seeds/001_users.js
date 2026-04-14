const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

exports.seed = async function (knex) {
  // obriši postojeće korisnike
  await knex("users").del();

  const passwordHash = await bcrypt.hash("testpassword", SALT_ROUNDS);

  await knex("users").insert([
    {
      id: 1,
      username: "testuser",
      password_hash: passwordHash,
    },
    {
      id: 2,
      username: "otheruser",
      password_hash: passwordHash,
    },
  ]);
};
