const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = {
  STATUS: 500,
  MESSAGE: "An error has occurred on the server.",
};
const CONFLICT_ERROR = 409;
const FORBIDDEN = 403;

module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT_ERROR,
  FORBIDDEN,
};
