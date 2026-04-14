const jwt = require("jsonwebtoken");

const signUserId = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5h" });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  signUserId,
  verifyToken,
};
