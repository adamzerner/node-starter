const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

module.exports = (app) => {
  const CORS_OPTIONS = {
    origin:
      process.env.NODE_ENV === "development"
        ? ["http://localhost:8080"]
        : ["https://vuestarter.netlify.app"],
    credentials: true,
  };

  app.use(
    bodyParser.json({
      limit: "500mb",
      verify: (req, res, buf) => {
        if (req.originalUrl.startsWith("/user/checkout-webhook")) {
          req.rawBody = buf.toString();
        }
      },
    })
  );
  app.use(cors(CORS_OPTIONS));
  app.use(mongoSanitize());
};
