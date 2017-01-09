var express = require("express");
var router = express.Router();
var connection = require ("../../db");

//Importar el controlador del chat
var chat = require("./chat");

router.get("/",getAllConversations);
router.get("/:id",getAllMessages);
router.post("/:id",addMessage);
router.put("/:id",readMessages);

module.exports = router;

//Obtiene las conversaciones por el ID del usuario loggeado
function getAllConversations(req,res){
	var usuarios = [];
	var query = "SELECT a.conversacion_id," +
				"b.user_id as user_1, b.nombres as nombres_1, b.apellidos as apellidos_1, b.foto_perfil as foto_1," +
				"c.user_id as user_2, c.nombres as nombres_2, c.apellidos as apellidos_2, c.foto_perfil as foto_2 " +
				"FROM conversaciones a " +
				"INNER JOIN usuarios b ON a.user_1_id=b.user_id " +
				"INNER JOIN usuarios c ON a.user_2_id=c.user_id " +
				"WHERE user_1_id=? OR user_2_id=? " +
				"GROUP BY a.conversacion_id ";
	connection.query(query,[req.user.user_id,req.user.user_id],
		function(err,conversaciones){
			if(err) res.sendStatus(404);
			for (var i = conversaciones.length - 1; i >= 0; i--) {
				if(conversaciones[i].user_1 === req.user.user_id){
					var usuario={
						conversacion_id:conversaciones[i].conversacion_id,
						user_id:conversaciones[i].user_2,
						nombres:conversaciones[i].nombres_2,
						apellidos:conversaciones[i].apellidos_2,
						foto_perfil:conversaciones[i].foto_2,
						no_leidos:conversaciones[i].no_leidos
					}
					usuarios.push(usuario);
				} else {
					var usuario={
						conversacion_id:conversaciones[i].conversacion_id,
						user_id:conversaciones[i].user_1,
						nombres:conversaciones[i].nombres_1,
						apellidos:conversaciones[i].apellidos_1,
						foto_perfil:conversaciones[i].foto_1,
						no_leidos:conversaciones[i].no_leidos
					}
					usuarios.push(usuario);
				}
			};

			res.send(usuarios);
		});
}

//Busca los mensajes por el ID de la conversación
function getAllMessages(req,res){
	chat.getAllMessages(req.params.id)
		.then(function(mensajes) {
			if(mensajes) {
				res.send(mensajes);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

//Añade un mensaje a la conversación por su ID
function addMessage(req,res){
	chat.addMessage(req.body,req.params.id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}

//Lee los mensajes por el ID de la conversación
function readMessages(req,res){
	chat.readMessages(req.params.id,req.body.user_id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}