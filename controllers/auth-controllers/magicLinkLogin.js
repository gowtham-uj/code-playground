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

const magicLinkLogin = BigPromise(async (req, res, next) => {
  let { token } = req.body;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    where: {
      magicLinkToken: encryptedToken,
      magicLinkTokenExpiry: { [Op.gt]: Date.now() },
    },
  });
  if (!user) {
    // return new Error("the forgot password token is invalid or has been expired please try again")
    return next(
      new CustomError(
        {
          error: [
            {
              magicLoginLinkExpired:
                "the magic login link is invalid or has been expired please try again later .",
            },
          ],
        },
        "magicLoginLinkExpired"
      )
    );
  }

  // reset token fields
  user.magicLinkToken = null;
  user.magicLinkTokenExpiry = null;

  // save the user
  await user.save();

  // create a jwt token to for user who used the magic link and send the jwt token

  let jwtToken = "";

  jwtToken = await createJwtToken(
    {
      userId: user.userId,
      email: user.email,
    },
    {
      expiresIn: "1d",
    }
  );
  res.setHeader("Authorization", `Bearer ${jwtToken}`);

  res.json({
    success: true,
    msg: {
      magicSuccess: true,
      redirectTo: "/",
    },
  });
});

module.exports = magicLinkLogin;
