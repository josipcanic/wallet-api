const express = require("express");
const router = express.Router();
const validation = require("../middlewares/validation");
const jwtCheck = require("../middlewares/auth");
const usersService = require("../services/users");
const authorizeSelf = require("../middlewares/authorizeSelf");

router.post(
  "/users/login",
  validation.body({
    username: validation.usernameBody,
    password: validation.passwordBody,
  }),
  async (req, res, next) => {
    try {
      const token = await usersService.login(req.body);
      return res.status(200).json(token);
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  "/users/register",
  validation.body({
    username: validation.usernameBody,
    password: validation.passwordBody,
  }),
  async (req, res, next) => {
    try {
      const user = await usersService.register(req.body);
      return res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
  },
);

router.get("/users", jwtCheck, async (req, res, next) => {
  try {
    const users = await usersService.list();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/users/:id",
  jwtCheck,
  validation.params({
    id: validation.idParam,
  }),
  async (req, res, next) => {
    try {
      const user = await usersService.getById(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
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
  async (req, res, next) => {
    try {
      const updatedUser = await usersService.updateById(
        req.params.id,
        req.body,
      );
      return res.status(200).json(updatedUser);
    } catch (err) {
      return next(err);
    }
  },
);

router.delete(
  "/users/:id",
  jwtCheck,
  authorizeSelf,
  validation.params({
    id: validation.idParam,
  }),
  async (req, res, next) => {
    try {
      const deletedUser = await usersService.deleteById(req.params.id);
      return res.status(200).json(deletedUser);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
