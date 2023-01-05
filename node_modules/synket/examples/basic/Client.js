const Synket = require('../../src/Synket.js');

//start the socket
var connection = new Synket({path: './test.sock'});

/*
//Alternatively use a URL and port:

var connection = new Synket({url: 'http://example.org', port: 4564});
*/

//send a message, will not return until data is written to the socket by the host
var result = connection.send('doSomething');

console.log(result);