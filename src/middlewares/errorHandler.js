function errorHandler(err, req, res, next) {
  if (err.code === "23505") {
    return res.status(409).json({ message: "Resource already exists" });
  }

  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
}

module.exports = errorHandler;
