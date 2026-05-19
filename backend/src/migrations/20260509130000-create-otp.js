"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("otps", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,

        references: {
          model: "users",
          key: "id",
        },

        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM("register", "forgot_password"),
        allowNull: false,
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      isUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("otps");
  },
};
