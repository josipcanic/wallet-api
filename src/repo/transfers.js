const db = require("../db");

const create = async (trx, { fromWalletId, toWalletId, amount }) => {
  const [transfer] = await trx("transfers")
    .insert({
      from_wallet_id: fromWalletId,
      to_wallet_id: toWalletId,
      amount,
    })
    .returning([
      "id",
      "from_wallet_id",
      "to_wallet_id",
      "amount",
      "created_at",
    ]);

  return transfer;
};

const getByUserId = async (userId) => {
  return db("transfers")
    .join("wallets as fw", "fw.id", "transfers.from_wallet_id")
    .join("wallets as tw", "tw.id", "transfers.to_wallet_id")
    .where((qb) => {
      qb.where("fw.user_id", userId).orWhere("tw.user_id", userId);
    })
    .select(
      "transfers.id",
      "transfers.from_wallet_id",
      "transfers.to_wallet_id",
      "transfers.amount",
      "transfers.created_at",
    )
    .orderBy("transfers.created_at", "desc");
};

module.exports = {
  create,
  getByUserId,
};
