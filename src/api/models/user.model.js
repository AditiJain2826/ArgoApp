module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id:{
      type: DataTypes.STRING,
      primaryKey: true
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return User;
};
