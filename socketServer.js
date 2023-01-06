const express = require("express");

const app = express();
const port = 3000;

const body = require("body-parser");
const { waitForDebugger } = require("inspector");
app.use(body());

var io = require("socket.io-client");
var json = require("json");
var socket = io.connect("http://localhost:8080", { reconnect: true });

socket.on("succeed", function (message, back) {
  console.log(message);
  console.log("succeed");
  back();
});

socket.on("rejected", function (message) {
  console.log(message);
  console.log("rejected");
});

//Add a connect listener
socket.on("connect", function () {
  socket.emit(
    "test",
    "SELECT infos1 infos2 infos3 FROM db1.db JOIN db2.db db3.db ON db1id=db2id db2id=db3id WHERE condi1=1 AND condi2<1"
  );
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
