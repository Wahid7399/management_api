const { Sequelize } = require("sequelize");
module.exports = () => {
  const sequelize = new Sequelize("test", "root", "", {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Unable to connect to database", error);
    });
  return sequelize;
};