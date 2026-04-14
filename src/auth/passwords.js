const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

const checkPassword = (hashedPassword, plainPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

module.exports = {
  hashPassword,
  checkPassword,
};
