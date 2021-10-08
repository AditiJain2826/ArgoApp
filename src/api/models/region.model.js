module.exports = (sequelize, DataTypes) => {
  const Region = sequelize.define(
    "Region",
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      }
    }
  );
  return Region;
};

