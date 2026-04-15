const transfersService = require("../services/transfers");

const create = async (req, res, next) => {
  try {
    const { fromWalletId, toWalletId, amount } = req.body;

    const transfer = await transfersService.createTransfer({
      fromWalletId,
      toWalletId,
      amount,
      userId: req.user.id,
    });

    return res.status(201).json(transfer);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const transfers = await transfersService.getByUserId(req.user.id);
    return res.status(200).json(transfers);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  create,
  list,
};
