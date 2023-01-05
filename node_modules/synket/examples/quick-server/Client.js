const Synket = require('../../src/Synket.js');

//start the socket
var connection = new Synket({path: './test.sock'});

/*
//Alternatively use a URL and port:

var connection = new Synket({url: 'http://example.org', port: 4564});
*/


//Start the server stored in Server.js this will pause execution until the server is up
connection.startServer('./Server.js');

//The server is up at this point so we can just send messages immediately:

//This will call the `doSomething` function in the server module
// and  pass it the ['foo', 'bar'] array as it's second argument
var result = connection.send('doSomething', ['foo', 'bar']);

console.log(result);