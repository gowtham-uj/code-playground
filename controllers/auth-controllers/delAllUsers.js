const { BigPromise } = require("../../utils/BigPromise");
const { db } = require("../../config/db");
const User = require("../../models/User");

const delAllUsers = async (req, res, next) => {
  await User.truncate();
  return res.json(await User.findAll());
};

module.exports = delAllUsers;
