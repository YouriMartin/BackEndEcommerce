const express = require("express");
const cors = require("cors");
const bdd = require("./models/controller.js");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
//const session = require("express-session");
const cookieParser = require("cookie-parser");
const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
//const fs = require('fs')

dotenv.config();

const app = express();
app.use(cookieParser());

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
// Création du diskStorage de multer, il permet de définir notre configuration d'upload
// /!\ Créez les dossiers de destination au cas où avant l'upload
//stockage image produit
var storageProduit = multer.diskStorage({
  // La limite en taille du fichier
  limits: {
    fileSize: 1000000, //1Mo
  },
  // La destination, ici ce sera à la racine dans le dossier img
 destination: function (req, file, cb) {
   cb(null, '../projetEcommerce/src/assets/produit')
  },
  // Gestion des erreurs
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Le fichier doit etre un JPG'))
    }
    cb(undefined, true)
  },
  // Fonction qui renomme l'image
  filename: function (req, file, cb) {
    // Genère un nom aléatoire et récupère l'ancienne extension
    cb(
      null,
      Math.random().toString(36).substring(7) +
        '.' +
        file.originalname.split('.')[1],
    )
  },
})

//stockage image menu 
var storageMenu = multer.diskStorage({
  limits: {
    fileSize: 1000000,
  },
 destination: function (req, file, cb) {
   cb(null, '../projetEcommerce/src/assets/menus')
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Le fichier doit etre un JPG'))
    }
    cb(undefined, true)
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Math.random().toString(36).substring(7) +
        '.' +
        file.originalname.split('.')[1],
    )
  },
})

// Création de l'objet multer
const upload = multer({
  storage: storageProduit,
})
const uploadMenu = multer({
  storage: storageMenu,
})

app.use(express.json());
app.use(function (req, res, next) {
  console.log("une requete a été effectué à", Date.now());
 
  next();
});

app.get("/burgers", function (req, res) {
  bdd.getProduct("burger", function (burger) {
    res.json({ burger: burger });
  });
});
app.get("/boissons", function (req, res) {
  bdd.getProduct("boisson", function (boissons) {
    res.json({ boissons: boissons });
  });
});
app.get("/accompagnements", function (req, res) {
  bdd.getProduct("accompagnement", function (accompagnements) {
    res.json({ accompagnements: accompagnements });
  });
});
app.get("/menus", function (req, res) {
  bdd.getAll("menu", function (menus) {
    res.json({ menus: menus });
  });
});
app.post("/menuparams", function (req, res) {
  bdd.getMenuParams(req.body, function (menuparams) {
    res.json({ menuparams: menuparams });
  });
});
//----------------------------------------------------------------------------
    // Formulaire inscription/connexion

app.post("/inscription", function (req, res) {
  bdd.getOne("utilisateur", req.body, function (ret) {
    console.log("retapp", ret);
    if (ret[0].nb > 0) {
      //res.status(403).send({ message: "Failed! Email is already in use ! " });
      res.send({ message: "E-mail déjà utilisé ! " });
    } else {
      bdd.create("utilisateur", req.body, function (err, utilisateurs) {
        // console.log(utilisateurs)
        if (err) {
          res.status(500).send({ message: err });
        }
      });
    }
  });
});

app.post("/connexion", function (req, res) {
  bdd.getUser("utilisateur", req.body, function (data) {
    console.log("data :", data);
    const isValidPass = bcrypt.compareSync(req.body.password, data[0].password);
    if (isValidPass) {
      console.log(data[0]);
      const token = generateAccessToken({
        mail: data[0].mail,
        nom: data[0].nom,
        prenom: data[0].prenom,
        telephone: data[0].telephone,
        mdp: data[0].password,
      });
      console.log("token", token);
      res.status(200).send(token);
    } else {
      res.send("mdp invalide");
    }
  });
});

//-----------------------------------------------------------------------------------
    // Formulaires ajout de données
    
    app.post('/addCateg', (req, res) => {    
      console.log(req.body)
        bdd.addCateg("categorie",req,function(categorie){
          res.json({ categorie: categorie });
    })
  });
 
  app.get("/id_product", function (req, res) {
    bdd.showId("categorie", function (categorie) {
    //  console.log(categorie)
      res.json({ categorie: categorie });
    });
  });


  app.post('/addProduit', upload.single('img'), async (req, res) => {
    try {
     if (req.file) {
        console.log(req.file)
        // Utilise la librairie sharp pour redimensionner en 200x100, et renvoi la miniature dans un autre fichier dans le dossier de destination choisi dans le diskStorage
        await sharp(req.file.path, { failOnError: false })
        .resize({ width: 300, height: 300 }) 
        .toFile( 
          path.resolve(req.file.destination + '/thumbnail', req.file.filename),
          )
          // Vous pouvez utiliser ces variables pour faire des insertions en base de données ou autre
         let filename = req.file.filename
        }
        res.send("succes")
      } catch (e) {
        res.status(400).send(e)
      }
  bdd.addProduit("produit",req,function(){
 //   console.log("req.body : ",req.body)
  })
})

app.post('/addMenu',uploadMenu.single('img'), (req, res) => {    
  try {
      res.send("succes")
    } catch (e) {
      res.status(400).send(e)
    }
bdd.addMenu("menu",req,function(){
//   console.log("req.body : ",req.body)
})
})

app.listen(9000);
console.log("le serveur écoute sur le port 9000");
