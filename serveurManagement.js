const express = require('express')
const app = express()
const port = 3000



app.get('/', function(req, res) {
    res.send('hello acceuil');
});

app.get('/train/', function(req, res) {
  res.send('hello train');
});

app.get('/station/', function(req, res) {
  res.send('hello station');
});


app.get('/voyage/', function(req, res) {
  res.send('hello voyage');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
