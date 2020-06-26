module.exports = {
  requireSignedIn: function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        errors: ["You are not signed in."],
      });
    }

    next();
  },
  requireSignedOut: function (req, res, next) {
    if (req.user) {
      return res.status(403).json({
        errors: ["You can't do this while you are signed in."],
      });
    }

    next();
  },
};
