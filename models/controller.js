const conn = require("./mysqlconfig.js");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

exports.getProduct = function (table, callback) {
  var sql =
    "SELECT produit.id AS id_produit , produit.nom_produit, produit.photo_produit, produit.prix_produit, produit.description_produit, categorie.nom_categ FROM produit INNER JOIN categorie ON produit.id_categorie = categorie.id WHERE categorie.nom_categ = '" +
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
exports.getAll = function (table, callback) {
  var sql = "SELECT * FROM " + table;
  console.log(sql);
  conn.query(sql, function (error, rows) {
    if (error) {
      console.log(error);
    }
    callback(rows);
  });
};
exports.getMenuParams = function (datas, callback) {
  console.log(datas);
  var sql =
    "SELECT nom_categ FROM categorie INNER JOIN parametres_menu ON categorie.id = parametres_menu.id_categorie WHERE parametres_menu.id_menu = " +
    datas.id +
    " ORDER BY parametres_menu.sequence";
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
  // console.log(datas);
  var sql =
    "SELECT * FROM " + table + " WHERE mail = " + "'" + datas.mail + "'";
  console.log(sql);
  conn.query(sql, function (error, rows) {
    //console.log("rows : ",rows);
    if (error) {
      console.log(error);
    }
    callback(rows);
  });
};


exports.addCateg = function (table,datas,callback){
  let sql = 
  "INSERT INTO "+
   table + 
   " VALUE(NULL,'" +
    datas.body.nom +
    "' );";
   console.log(sql);
    conn.query(sql, function (error) {
      if (error) {
        console.log(error);
      }
      callback();
    });
};

exports.showId = function(table,callback){
  let sql = "SELECT id,nom_categ FROM " + table;
  console.log(sql);
    conn.query(sql, function (error,rows) {
      if (error) {
        console.log(error);
      }
      callback(rows);
    });
}

exports.addProduit = function (table,datas,callback){
 // console.log("datas : ",datas.body)
//  console.log("file : ",datas.file )
  let sql = 
  "INSERT INTO "+
   table + 
   " VALUE(NULL,'" +
    datas.body.nom +
    "','" +
    datas.file.filename +
    "','" +
    datas.body.prix + 
    "','" +
    datas.body.description +
    "','" +
    datas.body.selected +
    "' );";
    console.log(sql);
    conn.query(sql, function (error) {
      if (error) {
        console.log(error);
      }
      callback();
    });
}

exports.addMenu = function (table,datas,callback){
//  console.log("data", datas.body)
  let sql = 
  "INSERT INTO "+
   table + 
   " VALUE(NULL,'" +
    datas.body.nom +
    "','" +
    datas.file.filename +
    "','" +
    datas.body.prix + 
    "' );";
    console.log(sql);
    conn.query(sql, function (error) {
      if (error) {
        console.log(error);
      }
      callback();
    });
}