require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DATABASE_DEV_USER,
    "password": process.env.DATABASE_DEV_PASSWORD,
    "database": process.env.DATABASE_DEV_NAME,
    "host": process.env.DATABASE_DEV_HOST,
    "dialect": process.env.DATABASE_DEV_DIALECT
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
