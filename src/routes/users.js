const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation");
const jwtCheck = require("../middlewares/auth");
const authorizeSelf = require("../middlewares/authorizeSelf");
const usersController = require("../controllers/users");

router.post(
  "/users/login",
  validation.body({
    username: validation.usernameBody,
    password: validation.passwordBody,
  }),
  usersController.login,
);

router.post(
  "/users/register",
  validation.body({
    username: validation.usernameBody,
    password: validation.passwordBody,
  }),
  usersController.register,
);

router.get("/users", jwtCheck, usersController.list);

router.get(
  "/users/:id",
  jwtCheck,
  validation.params({
    id: validation.idParam,
  }),
  usersController.getById,
);

router.put(
  "/users/:id",
  jwtCheck,
  authorizeSelf,
  validation.params({ id: validation.idParam }),
  validation.body({
    username: validation.usernameBody,
    password: validation.passwordBody,
  }),
  usersController.updateById,
);

router.delete(
  "/users/:id",
  jwtCheck,
  authorizeSelf,
  validation.params({
    id: validation.idParam,
  }),
  usersController.deleteById,
);

module.exports = router;
