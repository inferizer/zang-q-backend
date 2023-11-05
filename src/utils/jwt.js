const jwt = require("jsonwebtoken");

function createToken(payload) {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY || "qwertyuiop",
    {
      expiresIn: process.env.JWT_EXPIRE || "15D",
    }
  );
  return accessToken;
}

module.exports = createToken;