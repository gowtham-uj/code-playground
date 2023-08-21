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

const getMagicLink = BigPromise(async (req, res, next) => {
  let { email } = req.body;

  let emailValidation = await validate(email);

  if (emailValidation.valid === false) {
    return next(
      new CustomError(
        {
          error: [
            {
              inValidEmail: "please enter a valid email address .",
            },
          ],
        },
        "InValidEmail"
      )
    );
  }

  let user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    return next(
      new CustomError(
        {
          error: [
            {
              userNotFound:
                "we could not find ur email in our registered users list , please register with your account .",
            },
          ],
        },
        "userNotFound"
      )
    );
  }

  let magicLinkToken = await user.getMagicLinkToken(user);
  await user.save();

  let resetLink = `https://auth-system-h5dp.herokuapp.com/magic-login?token=${magicLinkToken}`;

  const mailRes = await sendSingleMail({
    From: {
      Email: "ugoutham49@Gmail.com",
      Name: "hr helper",
    },
    To: [
      {
        Email: "gowthamujjineni@gmail.com",
        Name: "gowtham",
      },
    ],
    Subject: "magic login - hr helper",
    HTMLPart: `reset your password using this <a href="${resetLink}">magic link login</a>`,
  });
  res.json({ success: true });
});

module.exports = getMagicLink;
