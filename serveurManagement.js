const express = require('express')
const app = express()
const port = 3000



app.get('/', function(req, res) {
    res.send('hello acceuil');
});

// requette pour recuperer tous les trains
app.get('/train/', function(req, res) {
  requette = `SELECT id_train name capacite id_voyage FROM train.db WHERE capacite>0`
  res.send(requette);

});
// requette pour recuperer train par id

app.get('/train/:idTrain', function(req, res) {
  trainId = req.params.idTrain
  requette = `SELECT id_train name capacite id_voyage FROM train.db WHERE id_train=${trainId}`

  res.send(requette);
});

// requette pour recuperer tous les stations

app.get('/station/',function(req,res){
  requette = `SELECT id_gare name nb_voie FROM gard.db WHERE nb_voie>0`
});

// requette pour recuperer station par id

app.get('/station/:idStation', function(req, res) {
  stationId = req.params.idStation
  requette = `SELECT id_gare name nb_voie FROM gard.db WHERE id_gare=${stationId}`
  res.send(requette);
});

// requette pour recuperer tous les voyages

app.get('/voyage/',function(req,res){
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_depart>00:00`
})

app.get('/voyage/:id', function(req, res) {
  parametre  = res.params
  voyageId = parametre.id
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE id_voyage=${voyageId}`
  res.send(requette);
});
app.get('/voyage/type/:type', function(req, res) {
  parametre  = res.params
  typeVoyage = parametre.type
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE type=${typeVoyage}`
  res.send(requette);
});

// requette pour recuperer tous les voyage qui part de la gare_depart souhaité
app.get('/voyage/gare_depart/:gare_depart', function(req, res) {
  parametre  = res.params
  gareD = parametre.gare_depart
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE gare_depart=${gareD}`
  res.send(requette);
});
// requette pour recuperer tous les voyage qui arrive  a la gare_arrivee souhaité

app.get('/voyage/gare_arrivee/:gare_arrivee', function(req, res) {
  parametre  = res.params
  gareA = parametre.gare_arrivee
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE gare_arrivee=${gareA}`
  res.send(requette);
});
// requette pour recuperer tous les voyage qui part a heure_depart souhaité

app.get('/voyage/heure_depart/:heure_depart', function(req, res) {
  parametre  = res.params
  heureD = parametre.heure_depart
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_depart=${heureD}`
  res.send(requette);
});

// requette pour recuperer tous les voyage qui arrive a l'heure_arrivee souhaité

app.get('/voyage/heure_arrivee/:heure_arrivee', function(req, res) {
  parametre  = res.params
  heureA = parametre.heure_arrivee
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE heure_arrivee=${heureA}`
  res.send(requette);
});
// requette pour recuperer tous les voyage qui arrive avec retard souhaité

app.get('/voyage/retard/:retard', function(req, res) {
  parametre  = res.params
  retarD = parametre.retard
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE retard=${retarD}`
  res.send(requette);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
