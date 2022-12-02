const express = require('express')
const app = express()
const port = 3000



app.get('/', function(req, res) {
    res.send('hello acceuil');
});

app.get('/train/', function(req, res) {
  idTrain = req.params

  res.send('hello station '+idTrain);
});

app.get('/train/:idTrain', function(req, res) {
  trainId = req.params.idTrain
  requette = `SELECT id_train name capacite id_voyage FROM train.db WHERE id_train=${trainId}`

  res.send('hello station '+idTrain);
});




app.get('/station/:idStation', function(req, res) {
  stationId = req.params.idStation
  requette = `SELECT id_gare name nb_voie FROM gard.db WHERE id_gare=${stationId}`
  res.send(requette);
});

app.get('/station/',function(req,res){

})


app.get('/voyage/:id', function(req, res) {
  parametre  = res.params
  voyageId = parametre.id
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE id_voyage=${voyageId}`
  res.send(requette);
});
app.get('/voyage/:type', function(req, res) {
  parametre  = res.params
  typeVoyage = parametre.type
  requette = `SELECT id_voyage type gare_depart gare_arrivee heure_depart heure_arrivee retard FROM voyage.db WHERE type=${typeVoyage}`
  res.send(requette);
});

app.get('/voyage/:gare_depart', function(req, res) {
  res.send(requette);
});
app.get('/voyage/:gare_arrivee', function(req, res) {
  res.send(requette);
});
app.get('/voyage/:heure_depart', function(req, res) {
  res.send(requette);
});
app.get('/voyage/:heure_arrivee', function(req, res) {
  res.send(requette);
});
app.get('/voyage/:retard', function(req, res) {
  res.send(requette);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
