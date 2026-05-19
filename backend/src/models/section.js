// chương
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    static associate(models) {
      Section.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });

      Section.hasMany(models.Lesson, {
        foreignKey: "sectionId",
      });
    }
  }
  Section.init(
    {
      title: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Section",
      tableName: "sections",
    },
  );
  return Section;
};
