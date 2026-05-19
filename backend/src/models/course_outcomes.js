// kết quả khóa học
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseOutcome extends Model {
    static associate(models) {
      CourseOutcome.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });
    }
  }
  CourseOutcome.init(
    {
      content: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CourseOutcome",
      tableName: "course_outcomes",
    },
  );
  return CourseOutcome;
};
