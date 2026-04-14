const db = require("../db");

const create = async ({ userId, balance = 0 }) => {
  const [wallet] = await db("wallets")
    .insert({
      user_id: userId,
      balance,
    })
    .returning(["id", "user_id", "balance", "created_at"]);

  return wallet;
};

const getById = async (id) => {
  return db("wallets")
    .select("id", "user_id", "balance", "created_at")
    .where({ id })
    .first();
};

const getByIdForUpdate = async (trx, id) => {
  return trx("wallets").where({ id }).forUpdate().first();
};

const getByUserId = async (userId) => {
  return db("wallets")
    .select("id", "user_id", "balance", "created_at")
    .where({ user_id: userId })
    .orderBy("id", "asc");
};

const incrementBalanceById = async (id, amount) => {
  const [wallet] = await db("wallets")
    .where({ id })
    .update({
      balance: db.raw("balance + ?", [amount]),
    })
    .returning(["id", "user_id", "balance", "created_at"]);

  return wallet;
};

const decrementBalance = async (trx, id, amount) => {
  return trx("wallets")
    .where({ id })
    .update({
      balance: trx.raw("balance - ?", [amount]),
    });
};

const incrementBalance = async (trx, id, amount) => {
  return trx("wallets")
    .where({ id })
    .update({
      balance: trx.raw("balance + ?", [amount]),
    });
};

const deleteById = async (id) => {
  const [wallet] = await db("wallets")
    .where({ id })
    .del()
    .returning(["id", "user_id", "balance", "created_at"]);

  return wallet;
};

module.exports = {
  create,
  getById,
  getByIdForUpdate,
  getByUserId,
  incrementBalanceById,
  decrementBalance,
  incrementBalance,
  deleteById,
};
