const dbConfigdata = require('../../config/db.config').dbConfigdata

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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Organization = require("./organization.model.js")(sequelize, Sequelize);
db.Property = require("./property.model.js")(sequelize, Sequelize);
db.Region = require("./region.model.js")(sequelize, Sequelize);
db.Field = require("./field.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Crop = require("./crop.model.js")(sequelize, Sequelize);
db.CropCycle = require("./cropcycle.model.js")(sequelize, Sequelize);

db.User.hasMany(db.Organization, { as:"user", onDelete: "CASCADE" });
db.Organization.hasMany(db.Property, { onDelete: "CASCADE" });
db.Property.belongsTo(db.Organization);
db.Region.hasOne(db.Region, { as: "parentRegion", onDelete: "CASCADE" });
db.Property.hasMany(db.Region, { onDelete: "CASCADE" });
db.Region.belongsTo(db.Property);
db.Field.belongsTo(db.Region, { onDelete: "CASCADE" });
db.Region.hasMany(db.Field, { onDelete: "CASCADE" });
db.Crop.hasMany(db.CropCycle, { as: "crop", onDelete: "CASCADE" });
db.Field.hasOne(db.CropCycle, { as: "field", onDelete: "CASCADE" });
// db.CropCycle.belongsTo(db.Field);

module.exports = db;
