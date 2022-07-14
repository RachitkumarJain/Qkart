const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");


const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: expires,
    type: type
  };

  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (user) => {
  const expiresTime = Math.floor(Date.now() / 1000) + config.jwt.accessExpirationMinutes * 60;
  const token = generateToken(user._id, expiresTime, tokenTypes.ACCESS, config.jwt.secret);
  return {
    "access": {
      token: token,
      expires: new Date(expiresTime * 1000)
    }
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
};
