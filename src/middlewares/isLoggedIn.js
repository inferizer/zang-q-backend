exports.isLoggedIn = async (req, res, next) => {
  req.user ? next() : res.sendStatus(400);
};
