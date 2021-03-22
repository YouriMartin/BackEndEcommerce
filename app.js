const express = require("express");
const app = express();
const cors = require("cors");
const bdd = require("./models/controller.js")

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


app.use(express.json());
app.use(function (req, res, next) {
    console.log("une requete a été effectué à", Date.now());
    next();
});

app.get("/burgers", function (req, res) {
    bdd.getAll("_burger", function (burger) {
        res.json({ burger: burger })
    })
})
app.get("/boissons", function (req, res) {
    bdd.getAll("_boissons", function (boissons) {
        res.json({ boissons: boissons })
    })
})
app.listen(9000);

console.log("le serveur écoute sur le port 9000");