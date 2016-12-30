var express = require("express");
var flash = require('express-flash');
var connection = require ("../db");
var request = require("request");
var fs=require("fs");
var async = require('async');
var bcrypt = require('bcryptjs');
var config = require("../config.json");
var router = express.Router();

router.get("/:token",function(req,res){
	connection.query("select * from usuarios where registryPasswordToken=? and tokenExpires > ?",
  	[req.params.token, Date.now()],function(err,user){
	    if (!user[0]) {
			req.flash('error','El link para registrarse es invalido o ha caducado.');
			return res.redirect('/');
		}
		res.render('signup',{usuario:req.user,token:req.params.token});
	});
});

router.post("/:token",function(req,res){
	//Copiar la imagen al servidor
	if(req.body.archivo.name != ''){
		var ruta = "public/imagenes/profile/"+req.body.archivo.name;
		var route = "/public/imagenes/profile/"+req.body.archivo.name;
		fs.rename(req.body.archivo.path, ruta, function(err){
			if(err) console.log(err);
		});
	}else{
		var route = "/public/imagenes/profile/default.jpeg";
	}
	var query = "SELECT user_id, correo " +
				"FROM usuarios WHERE registryPasswordToken=? AND tokenExpires > ?";
	connection.query(query,[req.params.token,Date.now()],function(err, user){
		if (!user[0]) {
			req.flash('error', 'El link para registrarse es invalido o ha caducado.');
			deferred.reject(err);
		}
		var usuario = {
			user_id: user[0].user_id,
			nombres:req.body.nombres,
			apellidos:req.body.apellidos,
			cargo:req.body.cargo,
			correo:user[0].correo,
			contraseña:req.body.password,
			foto_perfil:route,
			registryPasswordToken: null,
			tokenExpires: null,
			estado: 1
		};
		//Factor para encriptar
		usuario.contraseña=bcrypt.hashSync(req.body.password, 5);
		var queryUpdate = "UPDATE usuarios SET ? WHERE user_id=?";
		connection.query(queryUpdate,[usuario,usuario.user_id],function(err){
			if(err) {
				console.log(err);
				req.flash('error','El link para registrarse es invalido o ha caducado.');
				return res.redirect('/');
			}
			
			//Para insertar las conversaciones con los otros usuarios
			connection.query("SELECT user_id FROM usuarios WHERE user_id <> ? AND estado=1", usuario.user_id, 
				function(err,users){
					async.each(users,function(user,callback){
						connection.query("INSERT INTO conversaciones (user_1_id,user_2_id) VALUES (?,?)",[usuario.user_id,user.user_id],
							function(err,result){
								if(err) {
									console.log(err);
									req.flash('error','El link para registrarse es invalido o ha caducado.');
									return res.redirect('/');
								}
								callback();
							});
					}, function(err){
						if(err) {
							console.log(err);
							req.flash('error','El link para registrarse es invalido o ha caducado.');
							return res.redirect('/');
						}
						// return to main page with success message
						req.logIn(usuario, function(err){
							req.flash('success','¡Bienvenido(a) al sistema ' + usuario.nombres + '!');
							return res.redirect('/app/#/app');
						});
					});
				});
		});
	});
});

module.exports = router;