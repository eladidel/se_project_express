const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const { NOT_FOUND } = require("../utils/errors.js");

const handleAuthError = (res) => {
  res.status(NOT_FOUND).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;

  next();
};
