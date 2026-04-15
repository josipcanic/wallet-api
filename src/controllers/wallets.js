const walletsService = require("../services/wallets");

const create = async (req, res, next) => {
  try {
    const wallet = await walletsService.create({
      userId: req.user.id,
    });
    return res.status(201).json(wallet);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const wallets = await walletsService.getByUserId(req.user.id);
    return res.status(200).json(wallets);
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const wallet = await walletsService.getByIdForUser(
      req.params.id,
      req.user.id,
    );
    return res.status(200).json(wallet);
  } catch (err) {
    return next(err);
  }
};

const deposit = async (req, res, next) => {
  try {
    const updatedWallet = await walletsService.deposit(
      req.params.id,
      req.user.id,
      req.body.amount,
    );
    return res.status(200).json(updatedWallet);
  } catch (err) {
    return next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const deletedWallet = await walletsService.deleteByIdForUser(
      req.params.id,
      req.user.id,
    );
    return res.status(200).json(deletedWallet);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  list,
  getById,
  deposit,
  deleteById,
};
