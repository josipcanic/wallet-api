const db = require("../db");
const create = async ({ username, passwordHash }) => {
  const [user] = await db("users")
    .insert({
      username,
      password_hash: passwordHash,
    })
    .returning(["id", "username"]);

  return user;
};

const getAll = async () => {
  return db("users").select("id", "username", "created_at");
};

const getById = async (userId) => {
  return db("users")
    .select("id", "username", "created_at")
    .where({ id: userId })
    .first();
};

const updateById = async (id, { username, passwordHash }) => {
  const [user] = await db("users")
    .where({ id })
    .update({
      username,
      password_hash: passwordHash,
    })
    .returning(["id", "username"]);

  return user;
};

const deleteById = async (id) => {
  const [user] = await db("users")
    .where({ id })
    .del()
    .returning(["id", "username"]);

  return user;
};

const getByUsernameWithHash = async (username) => {
  return db("users")
    .select("id", "username", "created_at", "password_hash")
    .where({ username })
    .first();
};

module.exports = {
  create,
  getAll,
  getById,
  getByUsernameWithHash,
  deleteById,
  updateById,
};
