const express = require("express");
const router = express.Router();

const jwtCheck = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const walletsController = require("../controllers/wallets");

router.post("/wallets", jwtCheck, walletsController.create);

router.get("/wallets", jwtCheck, walletsController.list);

router.get(
  "/wallets/:id",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  walletsController.getById,
);

router.post(
  "/wallets/:id/deposits",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  validation.body({ amount: validation.amountBody }),
  walletsController.deposit,
);

router.delete(
  "/wallets/:id",
  jwtCheck,
  validation.params({ id: validation.idParam }),
  walletsController.deleteById,
);

module.exports = router;
