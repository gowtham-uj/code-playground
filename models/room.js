const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = require("../config/db.js");

class Room extends Model {}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    roomId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    users: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue("users"));
      },
      set(value) {
        return this.setDataValue("users", JSON.stringify(value));
      },
    },
    codeChanges: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    codeOutput: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue("codeOutput"));
      },
      set(value) {
        return this.setDataValue("codeOutput", JSON.stringify(value));
      },
    },
    roomLanguage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Room",
  }
);

module.exports = Room;
