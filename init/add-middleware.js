let bodyParser = require("body-parser");
let cors = require("cors");
let mongoSanitize = require("express-mongo-sanitize");

const CORS_OPTIONS = {
  origin:
    process.env.NODE_ENV === "development"
      ? ["http://localhost:8080"]
      : ["https://vuestarter.netlify.app"],
  credentials: true,
};

module.exports = (app) => {
  app.use(bodyParser.json({ limit: "500mb" }));
  app.use(cors(CORS_OPTIONS));
  app.use(mongoSanitize());
};
