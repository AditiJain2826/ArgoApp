module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    "Organization",
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
    }
  );
  return Organization;
};