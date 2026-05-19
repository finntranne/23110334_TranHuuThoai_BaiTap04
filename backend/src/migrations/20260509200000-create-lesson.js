"use strict";
/** @type {import('sequelize-cli') .Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("lessons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "sections",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
      },
      lesson_type: {
        type: Sequelize.ENUM("video", "article", "quiz"),
      },
      video_url: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT,
      },
      duration: {
        type: Sequelize.INTEGER,
      },
      isPreview: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      orderIndex: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("lessons");
  },
};
