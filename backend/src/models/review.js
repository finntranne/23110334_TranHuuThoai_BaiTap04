"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Review thuộc Product
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
        targetKey: "id",
        as: "product",
      });

      // Review thuộc User
      Review.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
      });
    }
  }

  Review.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "reviews",
      timestamps: true,
      updatedAt: true,
    }
  );

  return Review;
};
