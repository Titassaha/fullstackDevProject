// database.js

const { Sequelize } = require('sequelize');

// Replace with your actual database credentials
const sequelize = new Sequelize('userdb', 'admin', 'awsrds2024', {
  host: 'database1.cxmsmuuig1fh.ap-south-1.rds.amazonaws.com',
  dialect: 'mysql'
});

module.exports = sequelize;
// var mysql = require('mysql');

// var connection = mysql.createConnection({
//   host     : 'database-1.cxmsmuuig1fh.ap-south-1.rds.amazonaws.com',
//   user     : 'admin',
//   password : 'awsrds2024',
//   port     : '3306'
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }

//   console.log('Connected to database.');
// });

// connection.end();