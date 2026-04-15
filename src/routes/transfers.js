const express = require("express");
const router = express.Router();

const jwtCheck = require("../middlewares/auth");
const validation = require("../middlewares/validation");
const transfersController = require("../controllers/transfers");

//kreiranje transfera
router.post(
  "/transfers",
  jwtCheck,
  validation.body({
    fromWalletId: validation.idParam,
    toWalletId: validation.idParam,
    amount: validation.amountBody,
  }),
  transfersController.create,
);

//izlistavanje transfera za ulogirane usere

router.get("/transfers", jwtCheck, transfersController.list);

module.exports = router;
