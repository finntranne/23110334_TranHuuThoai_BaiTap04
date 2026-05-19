"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const basename = path.basename(__filename);

const db = {};

// ======================
// SEQUELIZE CONNECTION
// ======================

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect:
      process.env.DB_DIALECT || "mysql",

    logging: false,
  }
);

// ======================
// LOAD MODELS
// ======================

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      !file.endsWith(".test.js")
    );
  })

  .forEach((file) => {
    const model = require(
      path.join(__dirname, file)
    )(
      sequelize,
      Sequelize.DataTypes
    );

    db[model.name] = model;
  });

// ======================
// ASSOCIATIONS
// ======================

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ======================
// EXPORTS
// ======================

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;