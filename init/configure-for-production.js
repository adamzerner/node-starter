let enforce = require("express-sslify");
let helmet = require("helmet");
let compression = require("compression");

module.exports = (app) => {
  app.set("trust proxy", true);
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(helmet());
  app.use(compression());
};
