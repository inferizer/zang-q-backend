exports.register = async (req, res, next) => {
  try {
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};
