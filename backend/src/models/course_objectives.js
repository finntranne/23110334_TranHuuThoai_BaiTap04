// mục tiêu khóa học
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseObjective extends Model {
    static associate(models) {
      CourseObjective.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });
    }
  }
  CourseObjective.init(
    {
      content: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CourseObjective",
      tableName: "course_objectives",
    },
  );
  return CourseObjective;
};
