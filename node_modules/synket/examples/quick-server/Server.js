module.exports = class {
	doSomething(socket, args) {
		setTimeout(function() {
			setTimeout(function() {
				socket.write('doSomething called with ' + args[0] + ' and ' + args[1]);
			}, 3000);
		});
	}
}