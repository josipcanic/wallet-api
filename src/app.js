const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const errorHandler = require("./middlewares/errorHandler");
const usersRouter = require("./routes/users");
const walletsRouter = require("./routes/wallets");
const transfersRouter = require("./routes/transfers");

const app = express();

app.use(express.json());

const swaggerDoc = YAML.load(path.join(__dirname, "routes.yaml"));

app.get("/", (req, res) => {
  res.json({ message: "Wallet API is running" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(usersRouter);
app.use(walletsRouter);
app.use(transfersRouter);

app.use(errorHandler);

module.exports = app;
