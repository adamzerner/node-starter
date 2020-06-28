const enforce = require("express-sslify");
const helmet = require("helmet");
const compression = require("compression");

module.exports = (app) => {
  app.set("trust proxy", true);
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(helmet());
  app.use(compression());
};
