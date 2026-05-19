// Lý do nên học
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseReason extends Model {
    static associate(models) {
      CourseReason.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });
    }
  }
  CourseReason.init(
    {
      content: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CourseReason",
      tableName: "course_reasons",
    },
  );
  return CourseReason;
};
