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

const login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  let user = await User.findOne({
    where: {
      email,
    },
  });

  // console.log(user);
  if (!user) {
    return next(
      new CustomError(
        {
          error: [
            {
              invalidInput: "incorrect login credentials",
            },
          ],
        },
        "incorrectInput"
      )
    );
  }

  // console.log(userCreds.password === "12345");

  let isPasswordValid = await user.validatePassword(user, password);

  let isConformedAccount = !!user.isAccConformed;

  // console.log(isPasswordValid);
  if (!isPasswordValid) {
    return next(
      new CustomError(
        {
          error: [
            {
              invalidInput: "incorrect login credentials",
            },
          ],
        },
        "incorrectInput"
      )
    );
  }

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

  // conditionally do something if the user account is not conformed.
  if (!user.isAccConformed) {
  }

  res.status(200).json({
    success: true,
    msg: {
      name: user.name,
      email: user.email,
      userId: user.userId,
      isConformedAccount,
      jwtToken: jwtToken,
    },
  });
});

module.exports = login;
