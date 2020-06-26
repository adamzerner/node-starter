module.exports = (req, res) => {
  req.session.destroy((err) => {
    res.status(200).clearCookie("sessionId").json({
      message: "Successfully logged out.",
    });
  });
};
