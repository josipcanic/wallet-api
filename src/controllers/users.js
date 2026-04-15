const usersService = require("../services/users");

const login = async (req, res, next) => {
  try {
    const token = await usersService.login(req.body);
    return res.status(200).json(token);
  } catch (err) {
    return next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const user = await usersService.register(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const users = await usersService.list();
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await usersService.getById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const updateById = async (req, res, next) => {
  try {
    const updatedUser = await usersService.updateById(req.params.id, req.body);
    return res.status(200).json(updatedUser);
  } catch (err) {
    return next(err);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const deletedUser = await usersService.deleteById(req.params.id);
    return res.status(200).json(deletedUser);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  register,
  list,
  getById,
  updateById,
  deleteById,
};
