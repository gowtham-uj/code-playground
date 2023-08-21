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

const conformAccount = BigPromise(async (req, res, next) => {
  let { token } = req.body;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      accConformToken: encryptedToken,
      accConformTokenExpiry: { [Op.gt]: Date.now() },
    },
  });
  if (!user) {
    return next(
      new CustomError(
        {
          error: [
            {
              accConfLinkExpired:
                "the account conformation link is invalid or has been expired please try again later .",
            },
          ],
        },
        "accConfLinkExpired"
      )
    );
  }

  // set is account conformed field to true
  user.isAccConformed = true;

  // reset the account conform token to undefined

  user.accConformToken = null;

  user.accConformTokenExpiry = null;

  // save the user
  await user.save();

  // redirect the user to login page

  res.status(200).json({
    success: true,
    msg: "your account is conformed, please login to continue",
  });
});

module.exports = conformAccount;
