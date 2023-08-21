const { isArray } = require("lodash/array");

const errorLogger = (err, req, res, next) => {
  // console.log("from error logger...");
  // console.log("\x1b[36m%s\x1b[0m", err); //cyan
  return next(err); // calling next middleware
};

const errorResponder = (err, req, res, next) => {
  res.header("Content-Type", "application/json");
  if (err.isCustomError === true) {
    res.status(200).send(err.message);
  }
  console.log("\x1b[36m%s\x1b[0m", err);
  res.status(200).json({
    success: false,
    areErrors: false,
    errorType: "unKnown",
    msg: "something went wrong, please try again later",
  });
};

const invalidPathHandler = (req, res, next) => {
  res.json({ success: false, msg: "invalid path" });
};

module.exports = { errorLogger, errorResponder, invalidPathHandler };
