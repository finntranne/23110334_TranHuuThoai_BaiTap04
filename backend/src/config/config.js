require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "123456",
    "database": process.env.DB_NAME || "appdb",
    "host": process.env.DB_HOST || "127.0.0.1",
    "port": process.env.DB_PORT || 3306,
    "dialect": process.env.DB_DIALECT || "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 3306,
    "dialect": process.env.DB_DIALECT || "mysql"
  }
};
