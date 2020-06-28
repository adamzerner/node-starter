module.exports = (req, res) => {
  Object.assign(req.user, req.body.user);

  try {
    const savedUser = req.user.save();

    res.status(200).json({
      status: "Successful",
      user: {
        email: savedUser.email,
        googleId: savedUser.googleId,
        twitterId: savedUser.twitterId,
        linkedinId: savedUser.linkedinId,
        created: savedUser.created,
        auth: savedUser.auth,
        settings: savedUser.settings,
      },
    });
  } catch (e) {
    res.status(500).json({
      errors: ["Internal server error."],
    });
  }
};
