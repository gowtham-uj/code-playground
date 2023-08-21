const { body, validationResult, matchedData } = require("express-validator");
const { BigPromise, BigPromiseNormal } = require("../utils/BigPromise");

const signUpUserValidationRules = () => {
  return [
    body("name").isLength({ min: 5 }),
    // username must be an email
    body("email").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }),
    body("conformPassword").isLength({ min: 5 }),
  ];
};

const validate = BigPromise((req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  // console.log(extractedErrors);
  // next(new Error(extractedErrors));
  res.json({ success: false, msg: { errors: extractedErrors } });
});

module.exports = {
  signUpUserValidationRules,
  validate,
};
