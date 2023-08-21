const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { BigPromise } = require("../../utils/BigPromise");
const { db } = require("../../config/db");
const { Op } = require("sequelize");
const User = require("../../models/User");
const { createJwtToken } = require("../../utils/jwt-utils");
const { sendSingleMail } = require("../../utils/mail-jet.js");
const hashPassword = require("../../utils/hashPassword.js");
const CustomError = require("../../utils/CustomError.js");
const bcrypt = require("bcryptjs");

const resetPassword = BigPromise(async (req, res, next) => {
  let { token, password, conformPassword } = req.body;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      forgetPasswordToken: encryptedToken,
      forgetPasswordExpiry: { [Op.gt]: Date.now() },
    },
  });
  if (!user) {
    return next(
      new CustomError(
        {
          error: [
            {
              forgotPassLinkExpired:
                "the forgot password link is invalid or has been expired please try again later .",
            },
          ],
        },
        "forgotPassTokenExpired"
      )
    );
  }

  if (password !== conformPassword) {
    // res.json({
    //   success: false,
    //   msg: "both password and conform password should be same ",
    // });
    return next(
      new CustomError(
        {
          error: [
            {
              passAndConfPassMismatch:
                "Both password and conform password should be same .",
            },
          ],
        },
        "passAndConfPassMismatch"
      )
    );
  }

  console.log(user.dataValues.password);

  // user.password = await hashPassword(password);
  user.password = await bcrypt.hash(password, 10);

  // reset token fields
  user.forgetPasswordToken = null;
  user.forgetPasswordExpiry = null;

  // save the user
  await user.save({ logging: console.log });

  console.log(user.dataValues.password);

  console.log(user.dataValues);

  // redirect the user to login page

  res
    .status(200)
    .json({ success: true, msg: " your new password is " + password });
});

module.exports = resetPassword;
