module.exports = function(server) {
	var io = require("socket.io").listen(server);
	var connections = [];

	io.sockets.on("connection",function(socket){
		//Connect
		connections.push(socket);
		console.log('Connected: %s sockets connected', connections.length);
		//Disconnect
		socket.on('disconnect',function(data){
			connections.splice(connections.indexOf(socket), 1);
			console.log('Disconnected: %s sockets connected', connections.length);
		});

		socket.on("send message", function(mensaje){
			socket.broadcast.in(mensaje.receptor).emit('new message', mensaje);
		});

		socket.on("new user", function(usuario) {
			var room = usuario.user_id.toString();
			if(io.sockets.adapter.rooms[room]) {
				delete io.sockets.adapter.rooms[room];
			}
			socket.join(room);
		});

		socket.on("new event", function(evento){
			socket.broadcast.emit("new event", evento);
		});
	});
}