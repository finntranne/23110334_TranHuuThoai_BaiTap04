"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      // ProductImage thuộc Product
      ProductImage.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  ProductImage.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProductImage",
      tableName: "product_images",
      timestamps: false,
    }
  );

  return ProductImage;
};
