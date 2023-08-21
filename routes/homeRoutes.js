const router = require("express").Router();
const {
  signUpUserValidationRules,
  validate,
} = require("../validations/authDataValidators.js");

const signUp = require("../controllers/auth-controllers/signUp.js");
const login = require("../controllers/auth-controllers/login.js");
const getForgetPassResetLink = require("../controllers/auth-controllers/getForgotPass.js");
const resetPassword = require("../controllers/auth-controllers/resetPassword.js");
const conformAccount = require("../controllers/auth-controllers/conformAccount.js");
const getMagicLink = require("../controllers/auth-controllers/getMagicLink.js");
const magicLinkLogin = require("../controllers/auth-controllers/magicLinkLogin.js");
const getAllUsers = require("../controllers/auth-controllers/getAllUsers.js");
const delAllUsers = require("../controllers/auth-controllers/delAllUsers.js");

const { authInfoExtraction } = require("../middlewares/authentication.js");

// duplicate dashboard temp
router.route("dashboard").get((req, res, next) => {
  res.json({ success: true, msg: "navigated to dashboard" });
});

router.route("/signup").post(signUpUserValidationRules(), validate, signUp);

router.route("/login").post(login);
// router.route("/getallusers").get(getAllUsers);

// gfpl - get forgot password link
router.route("/gfpl").post(getForgetPassResetLink);

// router.route("/gml").post(getMagicLink);

router.route("/mg-login").post(magicLinkLogin);

router.route("/password-reset").post(resetPassword);
// router.route("/password-reset").post(mockResetPassword);

router.route("/conform-account").post(conformAccount);

// router.route("/dau").get(delAllUsers);

module.exports = router;
