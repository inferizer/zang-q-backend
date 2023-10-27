exports.register = async (req, res, next) => {
  try {
    res.status(200).json({ message: "vendor register", accessToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    res.status(200).json({ message: "vendor login", accessToken });
  } catch (err) {
    next(err);
  }
};
