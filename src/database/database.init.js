const dbConfigdata = require("./database.config").dbConfigdata;

dbConfig =
  process.env.NODE_ENV === "dev" ? dbConfigdata.development : dbConfigdata.test;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

module.exports = {
  sequelize,
  Sequelize,
};