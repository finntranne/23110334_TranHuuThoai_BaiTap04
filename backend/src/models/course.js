"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.hasMany(models.Section,         { foreignKey: "courseId" });
      Course.hasMany(models.CourseReason,    { foreignKey: "courseId" });
      Course.hasMany(models.CourseObjective, { foreignKey: "courseId" });
      Course.hasMany(models.CourseOutcome,   { foreignKey: "courseId" });
      Course.hasMany(models.CourseTarget,    { foreignKey: "courseId" });
      Course.hasMany(models.Review,          { foreignKey: "courseId" });
    }
  }

  Course.init(
    {
      title:         DataTypes.STRING,
      description:   DataTypes.STRING,
      price:         DataTypes.DECIMAL(10, 2),
      originalPrice: DataTypes.DECIMAL(10, 2),
      slug:          DataTypes.STRING,
      thumbnail:     DataTypes.STRING,
      status:        DataTypes.ENUM("draft", "published", "archived"),
      // --- Các cột mới cho filter ---
      type:          DataTypes.ENUM("zoom", "video"),
      category:      DataTypes.STRING,      // "C++", "Python", "Web", ...
      rating:        DataTypes.DECIMAL(2, 1),
      reviewCount:   DataTypes.INTEGER,
      lessonCount:   DataTypes.INTEGER,
      startDate:     DataTypes.DATE,
      schedule:      DataTypes.STRING,
      isFeatured:    DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Course",
      tableName: "courses",
    }
  );

  return Course;
};