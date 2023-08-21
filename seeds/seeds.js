const db = require("../config/db.js");
const User = require("../models/User.js");
const { v4: uuidv4 } = require("uuid");

async function devKickStart() {
  const user = await User.create({
    name: "gowtham",
    email: "test1@gmail.com",
    password: "$2a$10$GJb7rMVuT2KaxfDty8MLQeIit.nvF99AYPTfRAyrZvRDPn88os5AS",
    userId: "9f70c318-ce31-4dbc-9320-f442abfce83c",
    isAccConformed: false,
    accConformToken:
      "bbc2d37238bec2ea49f963657a9d2ddd671b50e17cafc2b9590f28adce508c56",
    accConformTokenExpiry: "2022-09-25T05:56:10.277Z",
    magicLinkToken: null,
    magicLinkTokenExpiry: null,
    forgetPasswordToken: null,
    forgetPasswordExpiry: null,
  });
}

module.exports = {
  devKickStart,
};
