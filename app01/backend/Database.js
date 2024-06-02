// database.js

const { Sequelize } = require('sequelize');

// Replace with your actual database credentials
const sequelize = new Sequelize('userdb', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
