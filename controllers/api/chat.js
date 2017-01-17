var express = require("express");
var connection = require ("../../db");
var Q = require('q');

//Obtener todos los mensajes
exports.getAllMessages=function(id){
	var deferred = Q.defer();
	var query = "SELECT remitente, mensaje, creacion, leido, nombres, apellidos, foto_perfil " +
				"FROM mensajes a INNER JOIN usuarios b ON a.remitente=b.user_id " +
				"WHERE a.conversacion_id=? ORDER BY mensaje_id DESC LIMIT 30;"
	connection.query(query, id, function(err,mensajes) {
			if (err) deferred.reject(err.name + ': ' + err.message);
			if (mensajes) {
				var messages = [];
				for (var i = mensajes.length - 1; i >= 0; i--) {
					messages.push(mensajes[i]);
				};
				deferred.resolve(messages);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};

//Postear un mensaje
exports.addMessage=function(form,conversacion_id){
	var deferred = Q.defer();
	console.log(form.creacion)
	var mensaje={
		remitente:form.remitente,
		mensaje:form.mensaje,
		conversacion_id:conversacion_id,
		leido: 1,
		creacion: form.creacion
	}

	connection.query("INSERT INTO mensajes SET ?",mensaje,function(err){
		if(err) deferred.reject(err.name + ': ' + err.message);

		deferred.resolve();	
	});

	return deferred.promise;
};

//Mensaje leido
exports.readMessages=function(conversacion_id,remitente){
	var deferred = Q.defer();
	var query = "UPDATE mensajes SET leido=0 WHERE conversacion_id=? AND leido=1 AND remitente=?";
	connection.query(query,[conversacion_id,remitente],
		function(err){
			if(err) deferred.reject(err.name + ': ' + err.message);

			deferred.resolve();
		});

	return deferred.promise;
};