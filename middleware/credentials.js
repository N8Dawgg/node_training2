const allowedOrigins = require("../config/whiteList");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow_credentials", true);
  }
  next();
};

module.exports = credentials;
