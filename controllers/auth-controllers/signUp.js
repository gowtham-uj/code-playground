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
const { validate } = require("deep-email-validator");

const signUp = BigPromise(async (req, res, next) => {
  const signupInputData = req.matchedData;

  // let emailValidation;

  // if (signupInputData.email === "test1@gmail.com") {
  //   emailValidation = {
  //     valid: true,
  //   };
  // } else {
  //   emailValidation = await validate(signupInputData.email);
  // }

  // console.log(emailValidation);

  // if (emailValidation.valid === false) {
  //   return next(
  //     new CustomError(
  //       {
  //         error: [
  //           {
  //             inValidEmail: "please enter a valid email address .",
  //           },
  //         ],
  //       },
  //       "InValidEmail"
  //     )
  //   );
  // }

  const userRecordObj = {
    name: signupInputData.name,
    email: signupInputData.email,
    password: await hashPassword(signupInputData.password),
    // password: signupInputData.password,
    userId: uuidv4(),
  };

  let isThereAlreadyAUser = await User.findOne({
    where: {
      email: signupInputData.email,
    },
  });

  if (isThereAlreadyAUser) {
    return next(
      new CustomError(
        {
          error: [
            {
              userAlreadyPresent:
                "there is already a user account registered with the given email id , please go to login page and login to continue .",
            },
          ],
        },
        "userAlreadyPresent"
      )
    );
  }

  let createdUser = await User.scope("withoutPassword").create(userRecordObj);

  // create conform account token

  let conformToken = await createdUser.getConformAccountToken(createdUser);

  await createdUser.save();

  let conformAccToken = `https://auth-system-h5dp.herokuapp.com/conform-account?token=${conformToken}`;

  const mailRes = await sendSingleMail({
    From: {
      Email: "ugoutham49@Gmail.com",
      Name: "gowtham uj",
    },
    To: [
      {
        Email: signupInputData.email,
        Name: signupInputData.name,
      },
    ],
    Subject: "Conform Account - code playground - A gowtham Uj's Project",
    HTMLPart: `Conform your Account using this <a href="${conformAccToken}">conform account link</a>`,
  });

  res.status(200).json({ success: true, msg: { userCreated: true } });
});

module.exports = signUp;
