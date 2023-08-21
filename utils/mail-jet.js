const { mjInstance } = require("../config/mail-jet.js");

async function sendSingleMail(msgObj) {
  const request = await mjInstance.post("send", { version: "v3.1" }).request({
    Messages: [msgObj],
  });
  return request;
}

module.exports = {
  sendSingleMail,
};
