const { ForbiddenError, NotFoundError } = require("../lib/errors");
const walletsRepo = require("../repo/wallets");

const getOwnedWallet = async (walletId, userId) => {
  const wallet = await walletsRepo.getById(walletId);

  if (!wallet) {
    throw new NotFoundError("Wallet not found");
  }

  if (Number(wallet.user_id) !== Number(userId)) {
    throw new ForbiddenError("Forbidden");
  }

  return wallet;
};

const create = ({ userId }) =>
  walletsRepo.create({
    userId,
    balance: 0,
  });

const getByUserId = (userId) => walletsRepo.getByUserId(userId);

const getByIdForUser = (walletId, userId) => getOwnedWallet(walletId, userId);

const deposit = async (walletId, userId, amount) => {
  await getOwnedWallet(walletId, userId);
  return walletsRepo.incrementBalanceById(walletId, amount);
};

const deleteByIdForUser = async (walletId, userId) => {
  await getOwnedWallet(walletId, userId);
  return walletsRepo.deleteById(walletId);
};

module.exports = {
  create,
  getByUserId,
  getByIdForUser,
  deposit,
  deleteByIdForUser,
};
