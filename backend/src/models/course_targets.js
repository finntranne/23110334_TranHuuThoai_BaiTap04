// đối tượng tham gia
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CourseTarget extends Model {
    static associate(models) {
      CourseTarget.belongsTo(models.Course, {
        foreignKey: "courseId",
        targetKey: "id",
      });
    }
  }
  CourseTarget.init(
    {
      content: DataTypes.STRING,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CourseTarget",
      tableName: "course_targets",
    },
  );
  return CourseTarget;
};
