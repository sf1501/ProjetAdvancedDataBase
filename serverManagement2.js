var net = require('net');
var childProcess = require('child_process');


var client = new net.Socket();
client.connect(65432, '127.0.0.1', function() {
    console.log('Connected');
})


client.on('data', function(data) {
    console.log('Received: ' + data);
   // client.destroy(); // kill client after server's response
});

function request(requete){
    var result = childProcess.execSync('node', [__dirname + '/send.js', 'send', JSON.stringify({args: [this.socket, 
        requete
       ]})]);
    console.log(result.stdout);
}



function select(){
    client.write('SELECT infos1 infos2 infos3 FROM voyage.db JOIN train.db gare.db ON depart=id_train id_train=id_gare WHERE condi1=1 OR condi2=1 OR condi3=1');
}

function insert(){
    client.write('INSERT id_voyage=5 nom_voyage=lol type=1 depart=1 arrive=1 voie=9 id_train=2 TO voyage.db');
}

function update() {
    client.write('UPDATE voyage.db SET column1=value1 column2=value2 WHERE id=1');
}

function toDelete(){
    client.write(' DELETE FROM voyage.db WHERE column3=1');
}

//setTimeout(update(), 5000);
//select();
request('SELECT id_voyage FROM voyage.db WHERE depart>=1');
//setTimeout(() => { select(),console.log("lol"); }, 50);
//setTimeout(() => { select(); }, 2000);
//select();
//insert();
//update();
//toDelete();
setTimeout(() => { client.destroy(); }, 2000);