const defaultUser = require("../../models/User/default-user");

module.exports = (req, res) => {
  res.status(200).json({
    user: defaultUser,
  });
};
