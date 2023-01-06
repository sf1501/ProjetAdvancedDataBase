const net = require('net');

class Operations{
    send(socket, data) {
        socket.write(data);
        socket.on('data', function(data) {
            console.log(new Buffer.from(data).toString());
            process.exit();
        })
        
    }

}

var ops = new Operations();

if (process.argv[3]) {
	var args =  JSON.parse(process.argv[3]).args;
}
else args = [];

ops[process.argv[2]].apply(ops, args);