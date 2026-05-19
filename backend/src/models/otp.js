"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {
      // OTP thuộc User
      OTP.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }
  }
  OTP.init(
    {
      code: DataTypes.STRING,
      expiresAt: DataTypes.DATE,
      isUsed: DataTypes.BOOLEAN,
      type: DataTypes.ENUM("register", "forgot_password"),
      userId: DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "OTP",
      tableName: "otps",
      timestamps: false,
    },
  );
  return OTP;
};
