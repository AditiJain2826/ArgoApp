module.exports = (sequelize, DataTypes) => {
  const CropCycle = sequelize.define("CropCycle", {
    startmonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isInt: true,
      max: 12,
      min: 1,
    },
    endmonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isInt: true,
      max: 12,
      min: 1,
    },
    startyear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isInt: true,
      max: 9999,
      min: 1960,
    },
    endyear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      isInt: true,
      max: 9999,
      min: 1960,
    },
  });
  return CropCycle;
};
