const defaultUser = require("../../models/User/default-user");

module.exports = (req, res) => {
  if (req.user && req.user.email) {
    return res.status(200).json({
      user: {
        email: req.user.email,
        googleId: req.user.googleId,
        twitterId: req.user.twitterId,
        linkedinId: req.user.linkedinId,
        created: req.user.created,
        auth: req.user.auth,
        settings: req.user.settings,
      },
    });
  }

  res.status(200).json({
    user: defaultUser,
  });
};
