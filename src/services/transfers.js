const db = require("../db");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../lib/errors");
const transfersRepo = require("../repo/transfers");
const walletsRepo = require("../repo/wallets");

const createTransfer = async ({ fromWalletId, toWalletId, amount, userId }) => {
  if (Number(fromWalletId) === Number(toWalletId)) {
    throw new BadRequestError("Cannot transfer to same wallet");
  }

  return db.transaction(async (trx) => {
    const fromWallet = await walletsRepo.getByIdForUpdate(trx, fromWalletId);
    if (!fromWallet) {
      throw new NotFoundError("From wallet not found");
    }

    if (Number(fromWallet.user_id) !== Number(userId)) {
      throw new ForbiddenError("Forbidden");
    }

    const toWallet = await walletsRepo.getByIdForUpdate(trx, toWalletId);
    if (!toWallet) {
      throw new NotFoundError("To wallet not found");
    }

    if (Number(fromWallet.balance) < Number(amount)) {
      throw new BadRequestError("Insufficient funds");
    }

    await walletsRepo.decrementBalance(trx, fromWalletId, amount);
    await walletsRepo.incrementBalance(trx, toWalletId, amount);

    return transfersRepo.create(trx, {
      fromWalletId,
      toWalletId,
      amount,
    });
  });
};

module.exports = {
  createTransfer,
  getByUserId: transfersRepo.getByUserId,
};
