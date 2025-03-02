// // User.js

const { DataTypes } = require('sequelize');
const sequelize = require('./Database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

const FileMapping = sequelize.define('FileMapping', {
  randomcode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
});

module.exports = {User, FileMapping};

