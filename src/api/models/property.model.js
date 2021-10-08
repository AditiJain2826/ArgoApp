module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    "Property",
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
    }
  );
  return Property;
};

