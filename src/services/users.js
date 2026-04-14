const { checkPassword, hashPassword } = require("../auth/passwords");
const { signUserId } = require("../auth/jwt");
const {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} = require("../lib/errors");
const usersRepo = require("../repo/users");

const isUniqueViolation = (err) => err && err.code === "23505";

const register = async ({ username, password }) => {
  try {
    return await usersRepo.create({
      username,
      passwordHash: await hashPassword(password),
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ConflictError("Username already exists");
    }

    throw err;
  }
};

const login = async ({ username, password }) => {
  const user = await usersRepo.getByUsernameWithHash(username);

  if (!user || !(await checkPassword(user.password_hash, password))) {
    throw new UnauthorizedError("Wrong username or password");
  }

  return { jwtToken: signUserId(user.id) };
};

const list = () => usersRepo.getAll();

const getById = async (id) => {
  const user = await usersRepo.getById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

const updateById = async (id, { username, password }) => {
  try {
    const updatedUser = await usersRepo.updateById(id, {
      username,
      passwordHash: await hashPassword(password),
    });

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    return updatedUser;
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw new ConflictError("Username already exists");
    }

    throw err;
  }
};

const deleteById = async (id) => {
  const deletedUser = await usersRepo.deleteById(id);

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return deletedUser;
};

module.exports = {
  register,
  login,
  list,
  getById,
  updateById,
  deleteById,
};
