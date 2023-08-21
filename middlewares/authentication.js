const { BigPromise } = require("../utils/BigPromise");
const { bearerTokenExt, verifyJwtToken } = require("../utils/jwt-utils");

exports.authInfoExtraction = BigPromise(async (req, res, next) => {
  let token = req.headers["authorization"]
    ? req.headers["authorization"].replace("Bearer ", "")
    : false;
  if (!token) {
    throw new Error("please login to continue");
  }

  let extractedData = await verifyJwtToken(token);
  req.authData = {
    isAuthenticated: true,
    ...extractedData,
  };
  next();
});
