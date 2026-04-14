const express = require("express");
const router = express.Router();

const jwtCheck = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const transfersService = require("../services/transfers");

//kreiranje transfera
router.post(
  "/transfers",
  jwtCheck,
  validation.body({
    fromWalletId: validation.idParam,
    toWalletId: validation.idParam,
    amount: validation.amountBody,
  }),
  async (req, res, next) => {
    try {
      const { fromWalletId, toWalletId, amount } = req.body;

      const transfer = await transfersService.createTransfer({
        fromWalletId: fromWalletId,
        toWalletId: toWalletId,
        amount: amount,
        userId: req.user.id,
      });
      return res.status(201).json(transfer);
    } catch (err) {
      return next(err);
    }
  },
);

//izlistavanje transfera za ulogirane usere

router.get("/transfers", jwtCheck, async (req, res, next) => {
  try {
    const transfers = await transfersService.getByUserId(req.user.id);
    return res.status(200).json(transfers);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
