const { DataTypes } = require("sequelize");
const sequelize = require("../connect")(); 
const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  archive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
(async () => {
    try {
      await sequelize.sync({ alter: true }); // or { force: true } if you want to drop and re-create tables on each run (not recommended for production)
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('An error occurred while synchronizing the models:', error);
    }
  })();
module.exports = User;