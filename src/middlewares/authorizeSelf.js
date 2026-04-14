function authorizeSelf(req, res, next) {
  const tokenUserId = Number(req.user.id);
  const paramUserId = Number(req.params.id);

  if (tokenUserId !== paramUserId) {
    return res.status(403).json({
      message: "Forbidden: you can only modify your own account",
    });
  }

  next();
}

module.exports = authorizeSelf;
