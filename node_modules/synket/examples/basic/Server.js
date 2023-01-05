const net = require('net');


var server = net.createServer(function(sock) {
	sock.setEncoding('utf8');

	//Receive data from client
	sock.on('data', function(data) {

		///Do something that takes time:		
		setTimeout(function() {
			//Send data back to the client
			sock.write('The client sent: ' + data);
		}, 3000);
	});

	
}).listen({path: './test.sock'});