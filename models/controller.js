const conn = require("./mysqlconfig.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

exports.getAll = function (table, callback) {
  var sql =
    "SELECT * FROM produit INNER JOIN categorie ON produit.id_categorie = categorie.id WHERE categorie.nom_categ = '" +
    table +
    "'";
  console.log(sql);
  conn.query(sql, function (error, rows) {
    if (error) {
      console.log(error);
    }
    callback(rows);
  });
};
exports.getOne = function (table, datas, callback) {
  var sql1 =
    "SELECT count(*) as nb FROM " +
    table +
    " WHERE mail = '" +
    datas.mail +
    "'";
  console.log(sql1);
  conn.query(sql1, function (error, rows) {
    if (error) {
      console.log(error);
    }
    callback(rows);
  });
};

exports.create = function (table, datas, callback) {
  const hash = bcrypt.hashSync(datas.password, salt);

  let sql =
    "INSERT INTO " +
    table +
    " VALUE(NULL,'" +
    datas.nom +
    "','" +
    datas.prenom +
    "' ,'" +
    datas.telephone +
    "','" +
    datas.mail +
    "','" +
    datas.pseudo +
    "' ,'" +
    hash +
    "' );";
  console.log(sql);
  conn.query(sql, function (error) {
    if (error) {
      console.log(error);
    }
    callback();
  });
};
exports.getUser = function (table, datas, callback) {
  console.log(datas);
  var sql =
    "SELECT * FROM " + table + " WHERE mail = " + "'" + datas.mail + "'";
  console.log(sql);
  conn.query(sql, function (error, rows) {
    console.log(rows);
    if (error) {
      console.log(error);
    }
    callback(rows);
  });
};
