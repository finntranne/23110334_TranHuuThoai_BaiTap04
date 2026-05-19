"use strict";
/** @type {import('sequelize-cli') .Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      courseId: {
        type: Sequelize.INTEGER,
        references: {
          model: "courses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
      },
      orderIndex: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("sections");
  },
};
