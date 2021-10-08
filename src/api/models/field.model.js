module.exports = (sequelize, DataTypes) => {
  const Field = sequelize.define(
    "Field",
    {
      name: {
        type: DataTypes.STRING,
        unique: true
      },
      size:  {
        type: DataTypes.STRING,
        allowNull: false
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }
  );
  return Field;
};
