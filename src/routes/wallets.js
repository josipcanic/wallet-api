const express = require("express");
const router = express.Router();

const jwtCheck = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const walletsService = require("../services/wallets");

router.post("/wallets", jwtCheck, async (req, res, next) => {
  try {
    const wallet = await walletsService.create({
      userId: req.user.id,
    });
    return res.status(201).json(wallet);
  } catch (err) {
    return next(err);
  }
});

router.get("/wallets", jwtCheck, async (req, res, next) => {
  try {
    const wallets = await walletsService.getByUserId(req.user.id);

    return res.status(200).json(wallets);
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/wallets/:id",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  async (req, res, next) => {
    try {
      const wallet = await walletsService.getByIdForUser(
        req.params.id,
        req.user.id,
      );
      return res.status(200).json(wallet);
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  "/wallets/:id/deposits",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  validation.body({ amount: validation.amountBody }),
  async (req, res, next) => {
    try {
      const updated = await walletsService.deposit(
        req.params.id,
        req.user.id,
        req.body.amount,
      );
      return res.status(200).json(updated);
    } catch (err) {
      return next(err);
    }
  },
);

router.delete(
  "/wallets/:id",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  async (req, res, next) => {
    try {
      const deleted = await walletsService.deleteByIdForUser(
        req.params.id,
        req.user.id,
      );
      return res.status(200).json(deleted);
    } catch (err) {
      return next(err);
    }
  },
);

module.exports = router;
