var express = require("express");
var connection = require ("../../db");
var jwt = require('jsonwebtoken');
var Q = require('q');

var config = require('../../config.json');

exports.getAllUsers=function(){
	var deferred = Q.defer();

	var query = "SELECT user_id, nombres, apellidos, cargo, correo, foto_perfil, estado " +
				"FROM usuarios";
	connection.query(query, function(err,usuarios){
		if(err) deferred.reject(err.name + ":" + err.message);
		if(usuarios) {
			for (var i = usuarios.length - 1; i >= 0; i--) {
				if(usuarios[i].nombres == null){
					usuarios.splice(usuarios.indexOf(usuarios[i]), 1);
				}
			};
			deferred.resolve(usuarios);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

//Get a user with a specified ID
exports.getById=function(id){
	var deferred = Q.defer();

	var query = "SELECT user_id, nombres, apellidos, cargo, correo, foto_perfil " +
				"FROM usuarios WHERE user_id=? LIMIT 1";
	connection.query(query, id, function(err, usuario){
		if(err) deferred.reject(err.name + ": " + err.message);

		if(usuario[0]) {
			deferred.resolve(usuario[0]);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

//Actualizar un usuario por su ID
exports.updateUser=function(id,user) {
	var deferred = Q.defer();

	connection.query("UPDATE usuarios set ? WHERE user_id=?",[user,id],function(err) {
		if(err) deferred.reject(err.name + ":" + err.message);
		deferred.resolve();
	});

	return deferred.promise;
}

//Eliminar un usuario
exports.deleteUser=function(id){
	var deferred = Q.defer();

	connection.query("UPDATE usuarios set estado=0 WHERE user_id=?",id,function (err) {
		if (err) deferred.reject(err.name + ': ' + err.message);
		deferred.resolve();
	});

	return deferred.promise;
};