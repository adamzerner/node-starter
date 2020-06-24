const dotEnv = require("dotenv");
const connectToDb = require("./connect-to-db");
const express = require("express");
const configureForProduction = require("./configure-for-production");
const initializeModels = require("../models");
const initializePassport = require("../passport");
const addMiddleware = require("./add-middleware");

dotEnv.config();
connectToDb(() => {
  const app = express();

  if (app.get("env") === "production") {
    configureForProduction(app);
  }

  initializeModels();
  initializePassport(app);
  addMiddleware(app);
  app.use(require("../routes"));
  app.listen(process.env.PORT);
});
