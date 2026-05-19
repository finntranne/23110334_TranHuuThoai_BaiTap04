"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("courses", "type", {
      type: Sequelize.ENUM("zoom", "video"),
      defaultValue: "video",
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "rating", {
      type: Sequelize.DECIMAL(2, 1),
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "reviewCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "lessonCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    await queryInterface.addColumn("courses", "startDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("courses", "schedule", {
      type: Sequelize.STRING,
      allowNull: true,
      comment: "VD: T3, T5 · 19h - 21h",
    });
    await queryInterface.addColumn("courses", "isFeatured", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("courses", "originalPrice", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: "Giá gốc trước khi giảm",
    });
  },

  async down(queryInterface, Sequelize) {
    const cols = [
      "type", "category", "rating", "reviewCount",
      "lessonCount", "startDate", "schedule", "isFeatured", "originalPrice",
    ];
    for (const col of cols) {
      await queryInterface.removeColumn("courses", col);
    }
  },
};