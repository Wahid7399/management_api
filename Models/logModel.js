
const { DataTypes } = require('sequelize');
const sequelize = require('../connect')();

const Log = sequelize.define('Log', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Assuming your User model is named 'User' and the table name in the database is 'Users'
      key: 'id',
    },
  },
  LoginStatus: {
    type: DataTypes.ENUM('Login', 'Logout'),
    allowNull: false,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: false,
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

module.exports = Log;
