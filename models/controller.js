const conn = require("./mysqlconfig.js");
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

exports.getAll = function (table, callback) {
    var sql = "SELECT * FROM " + table;
    conn.query(sql, function (error, rows) {
        if (error) {
            console.log(error);
        }
        callback(rows);
    });
}