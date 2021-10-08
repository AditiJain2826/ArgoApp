module.exports = (sequelize, DataTypes) => {
    const Crop = sequelize.define(
      "Crop",
      {
        name: {
          type: DataTypes.STRING,
          unique: true
        },
      }
    );
    return Crop;
  };