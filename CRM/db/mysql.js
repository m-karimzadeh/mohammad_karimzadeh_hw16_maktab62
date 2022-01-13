const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : ''
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }

//   console.log('connected as id ' + connection.threadId);
// });

pool  = mysql.createPool({
  // connectionLimit : 1000,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'maktab'
});



module.exports = pool;