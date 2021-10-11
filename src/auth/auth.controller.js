exports.pass = async (req, res, next) => {
  res.status(200).send(`Welcome ${req.user.username}`);
};

exports.failed = async (req, res, next) => {
  res.status(500).send("Failed to login");
};

exports.logout = async (req, res, next) => {
  req.session = null;
  req.logout();
  res.redirect("/");
};

exports.home = async (req, res, next) => {
  res.status(200).send(`Welcome!`);
};

exports.callbackRedirect = async (req, res, next) => {
  res.redirect("/pass");
};
