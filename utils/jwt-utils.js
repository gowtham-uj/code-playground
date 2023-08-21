const jwt = require("jsonwebtoken");
const { BigPromiseNormal } = require("./BigPromise");

exports.createJwtToken = async (dataObj, cookieOptObj) => {
  const token = await jwt.sign(
    dataObj,
    process.env.JWT_SECRET_KEY,
    cookieOptObj
  );
  return token;
};

exports.verifyJwtToken = async (jwtToken) => {
  // return await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  let data = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  console.log(data);
  return data;
};
