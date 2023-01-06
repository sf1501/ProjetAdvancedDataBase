const express = require('express')
const cors = require("cors");

const app = express()
const port = 3000


app.use(cors());


app.get('/', function(req, res) {
    res.send('hello acceuil');
});

// requete pour recuperer tous les trains
app.get('/train/', function(req, res) {
  requete = `SELECT id_train name capacite id_voyage FROM train.db WHERE capacite>0`
  res.send(requete);

});
// requete pour recuperer train par id

app.get('/train/:idTrain', function(req, res) {
  trainId = req.params.idTrain
  requete = `SELECT id_train name capacite id_voyage FROM train.db WHERE id_train=${trainId}`

  res.send(requete);
});

// requete pour recuperer tous les stations

app.get('/station/',function(req,res){
  requete = `SELECT id_gare name nb_voie FROM gard.db WHERE nb_voie>0`
  res.send(requete);
});

// requete pour recuperer station par id

app.get('/station/:idStation', function(req, res) {
  stationId = req.params.idStation
  requete = `SELECT id_gare name nb_voie FROM gard.db WHERE id_gare=${stationId}`
  res.send(requete);
});

// requete pour recuperer tous les voyages

app.get('/voyage/',function(req,res){
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_depart>00:00`
  res.send(requete);
})

app.get('/voyage/:idVoyage', function(req, res) {
  parametre  = req.params
  voyageId = parametre.idVoyage
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE id_voyage=${voyageId}`
  res.send(requete);
});
app.get('/voyage/type/:type', function(req, res) {
  parametre  = req.params
  typeVoyage = parametre.type
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE type=${typeVoyage}`
  res.send(requete);
});

// requete pour recuperer tous les voyage qui part de la gare_depart souhaité
app.get('/voyage/gare_depart/:gare_depart', function(req, res) {
  parametre  = req.params
  gareD = parametre.gare_depart
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE gare_depart=${gareD}`
  res.send(requete);
});
// requete pour recuperer tous les voyage qui arrive  a la gare_arrivee souhaité

app.get('/voyage/gare_arrivee/:gare_arrivee', function(req, res) {
  parametre  = req.params
  gareA = parametre.gare_arrivee
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE gare_arrivee=${gareA}`
  res.send(requete);
});
// requete pour recuperer tous les voyage qui part a heure_depart souhaité

app.get('/voyage/heure_depart/:heure_depart', function(req, res) {
  parametre  = req.params
  heureD = parametre.heure_depart
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_depart=${heureD}`
  res.send(requete);
});

// requete pour recuperer tous les voyage qui arrive a l'heure_arrivee souhaité

app.get('/voyage/heure_arrivee/:heure_arrivee', function(req, res) {
  parametre  = req.params
  heureA = parametre.heure_arrivee
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_arrivee=${heureA}`
  res.send(requete);
});

// requete pour recuperer tous les voyages dans un intervale de temps donné
app.get('/voyage/heure_depart/:heure_depart/heure_arrivee/:heure_arrivee', function(req, res) {
  parametre  = req.params
  heureD = parametre.heure_depart
  heureA = parametre.heure_arrivee
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_depart > ${heureD} AND heure_arrivee < ${heureA} `
  res.send(requete);
});

// requete pour recuperer un voyage qui fait son départ d'une station donné
app.get('/station/:idStation/voyage/:idVoyage', function(req, res){
  parametre = req.params
  idVoyage = parametre.idVoyage
  idStation = parametre.idStation
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE gare_depart = ${idStation}`
  res.send(requete);
}); 

// requete pour recuperer tous les voyage qui arrive avec retard souhaité

app.get('/voyage/retard/:retard', function(req, res) {
  parametre  = req.params
  retarD = parametre.retard
  requete = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE retard=${retarD}`
  res.send(requete);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


const body = require('body-parser')
const { waitForDebugger } = require('inspector')
app.use(body())

var io = require('socket.io-client');
var json = require('json');
var socket = io.connect('http://localhost:8080', {reconnect: true});
 
socket.on('succeed', function(message, back) {
  console.log(message);
  console.log('succeed');
  back();
});
 
socket.on('rejected', function(message) {
  console.log(message);
  console.log('rejected');
});

//Add a connect listener
socket.on('connect', function () {
  socket.emit("test",'SELECT infos1 infos2 infos3 FROM db1.db JOIN db2.db db3.db ON db1id=db2id db2id=db3id WHERE condi1=1 AND condi2<1');
});

/*const
    io = require("socket.io-client"),
    socket = io("http://localhost:8080");

// envoi d'un message au serveur
socket.emit("test",'SELECT infos1 infos2 infos3 FROM db1.db JOIN db2.db db3.db ON db1id=db2id db2id=db3id WHERE condi1=1 AND condi2<1');

// réception d'un message envoyé par le serveur
socket.on("test", function(data) {
  console.log(data);
});

var net = require('net');
var client = new net.Socket();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })*/

/*function select(){
  client.connect(65432, '127.0.0.1', function() {
    console.log('Connected');
    client.write('SELECT infos1 infos2 infos3 FROM db1.db JOIN db2.db db3.db ON db1id=db2id db2id=db3id WHERE condi1=1 AND condi2<1');  });
}

function insert(){
  client.connect(65432, '127.0.0.1', function() {
    console.log('Connected');
    client.write('INSERT column1=values1 column2=values2 column3=values3 TO db2.db');
  });

  client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy(); // kill client after server's response
  });
}

function update() {
  client.connect(65432, '127.0.0.1', function() {
    console.log('Connected');
    client.write('UPDATE db2.db SET column1=value1 column2=value2 WHERE id=1');
  });
}

function toDelete(){
  client.connect(65432, '127.0.0.1', function() {
    console.log('Connected');
    client.write(' DELETE FROM db2.db WHERE column3=1');
  });
  client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy(); // kill client after server's response
  });
}*/

//setTimeout(update(), 5000);
//insert();
//update();
//toDelete();
/*setTimeout(client.on('data', function(data) {
  console.log('Received: ' + data);
  client.destroy(); // kill client after server's response
}), 5000);*/
