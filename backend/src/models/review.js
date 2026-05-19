"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });

      Review.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }
  }
  Review.init(
    {
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
    },
  );
  return Review;
};
