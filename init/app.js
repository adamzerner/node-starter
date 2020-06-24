const dotEnv = require("dotenv");
const connectToDb = require("./connect-to-db");
const express = require("express");
const configureForProduction = require("./configure-for-production");

dotEnv.config();
connectToDb(() => {
  const app = express();

  if (app.get("env") === "production") {
    configureForProduction(app);
  }
});
