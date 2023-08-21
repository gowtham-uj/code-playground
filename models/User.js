const { Sequelize, DataTypes, Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sequelize = require("../config/db.js");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    // plainPass: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: true,
    //   },
    // },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    isAccConformed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    accConformToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accConformTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    magicLinkToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    magicLinkTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    forgetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgetPasswordExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    scopes: {
      withoutPassword: {
        attributes: { exclude: ["password"] },
      },
    },
  }
);

User.prototype.validatePassword = async (user, passwordStr) => {
  console.log(user.password);
  return bcrypt.compareSync(passwordStr, user.password);
};

User.prototype.getForgotPasswordToken = async (user) => {
  const forgotToken = await crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  user.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time of token
  user.forgetPasswordExpiry = new Date(Date.now() + 3600 * 1000 * 24);

  return forgotToken;
};

User.prototype.getConformAccountToken = async (user) => {
  const conformToken = await crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  user.accConformToken = crypto
    .createHash("sha256")
    .update(conformToken)
    .digest("hex");

  //time of token
  user.accConformTokenExpiry = new Date(Date.now() + 3600 * 1000 * 24);

  return conformToken;
};

User.prototype.getMagicLinkToken = async (user) => {
  const magicLinkToken = await crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  user.magicLinkToken = crypto
    .createHash("sha256")
    .update(magicLinkToken)
    .digest("hex");

  //time of token
  user.magicLinkTokenExpiry = new Date(Date.now() + 3600 * 1000 * 24);

  return magicLinkToken;
};

module.exports = User;

// use the scope at times where password is not needed when quering about user
// User.scope("withoutPassword").querymethods()
