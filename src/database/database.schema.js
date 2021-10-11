const { Sequelize, sequelize } = require("./database.init");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Organization = require("../organization/organization.model")(
  sequelize,
  Sequelize
);
db.Property = require("../property/property.model")(sequelize, Sequelize);
db.Region = require("../region/region.model")(sequelize, Sequelize);
db.Field = require("../field/field.model.js")(sequelize, Sequelize);
db.User = require("../auth/user.model.js")(sequelize, Sequelize);
db.Crop = require("../crop/crop.model.js")(sequelize, Sequelize);
db.CropCycle = require("../cropcycle/cropcycle.model.js")(sequelize, Sequelize);

db.User.hasMany(db.Organization, { as: "user", onDelete: "CASCADE" });
db.Organization.hasMany(db.Property, { onDelete: "CASCADE" });
db.Property.belongsTo(db.Organization);
db.Region.hasOne(db.Region, { as: "parentRegion", onDelete: "CASCADE" });
db.Property.hasMany(db.Region, { onDelete: "CASCADE" });
db.Region.belongsTo(db.Property);
db.Field.belongsTo(db.Region, { onDelete: "CASCADE" });
db.Region.hasMany(db.Field, { onDelete: "CASCADE" });
db.Crop.hasMany(db.CropCycle, { as: "crop", onDelete: "CASCADE" });
db.Field.hasOne(db.CropCycle, { as: "field", onDelete: "CASCADE" });

module.exports = db;