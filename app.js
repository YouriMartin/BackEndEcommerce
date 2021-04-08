const express = require("express");
const app = express();
const cors = require("cors");
const bdd = require("./models/controller.js");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);

var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "burger",
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "20m" });
}
function authenticateToken(req, res, next) {
  // const token = req.headers["x-access-token"];

  console.log("req header : ", req.headers);
  const token = req.headers["authorization"];
  console.log("token: ", token);
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.use(express.json());
app.use(function (req, res, next) {
  console.log("une requete a été effectué à", Date.now());
  next();
});

app.get("/burgers", function (req, res) {
  bdd.getAll("burger", function (burger) {
    res.json({ burger: burger });
  });
});
app.get("/boissons", function (req, res) {
  bdd.getAll("boisson", function (boissons) {
    res.json({ boissons: boissons });
  });
});
app.get("/accompagnements", function (req, res) {
  bdd.getAll("accompagnement", function (accompagnements) {
    res.json({ accompagnements: accompagnements });
  });
});
app.get("/menus", function (req, res) {
  bdd.getAll("_menus", function (menus) {
    res.json({ menus: menus });
  });
});
app.post("/inscription", function (req, res) {
  bdd.getOne("_utilisateur", req.body, function (ret) {
    console.log("retapp", ret);
    if (ret[0].nb > 0) {
      res.status(403).send({ message: "Failed! Email is already in use ! " });
    } else {
      bdd.create("_utilisateur", req.body, function (err, utilisateurs) {
        // console.log(utilisateurs)
        if (err) {
          res.status(500).send({ message: err });
        }
      });
    }
  });
});
app.post("/connexion", function (req, res) {
  bdd.getUser("_utilisateur", req.body, function (data) {
    // console.log(data);
    const isValidPass = bcrypt.compareSync(req.body.password, data[0].password);
    if (isValidPass == true) {
      const token = generateAccessToken({ mail: data[0].mail });
      // console.log(token);
      res.status(200).send(token);
    } else {
      res.send("mdp invalide");
    }
  });
});
app.listen(9000);

console.log("le serveur écoute sur le port 9000");
