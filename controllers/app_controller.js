var express = require("express");
var router = express.Router();
var connection = require ("../db");
var async = require('async');
var crypto = require('crypto');
var request = require("request");
var config = require("../config.json");
var nodemailer = require("nodemailer");
var flash = require('express-flash');
var fs = require("fs");
var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'hqhfidg5a',
	api_key: '466377161181572',
	api_secret: 'mjw1kKc2YHo8cDFah0ymcm2w7sI'
});
var transport = nodemailer.createTransport({
	service: config.mailService,
	auth:{
		user: config.mailUser,
		pass: config.mailPass
	}
});

router.use('/', function(req, res, next){
	if(!req.user){
		return res.redirect("/#/login");
	}
	next();
});

router.get("/",function(req,res){
	if(req.app.locals){
		res.render("layout",{usuario:req.user, evento:req.app.locals});
	}else{
		res.render("layout",{usuario:req.user});
	}
});

//Crear un evento
router.post("/eventos", function(req,res){
	if(req.body.archivo.name != ''){
		/*var ruta = "public/imagenes/eventos/"+req.body.archivo.name;
		fs.rename(req.body.archivo.path, ruta, function(err){
			if(err) console.log(err);
		});*/
		cloudinary.uploader.upload(req.body.archivo.path, function(result) {
			guardar(result.url);
		}, { public_id: req.body.titulo } );
	}else{
		var route = "/public/imagenes/eventos/default.png";
		guardar(route);
	}

	function guardar(route){
		var evento={
			titulo:req.body.titulo,
			fecha_inicio:req.body.fecha_inicial,
			fecha_final:req.body.fecha_final,
			descripcion:req.body.descripcion,
			lugar:req.body.lugar,
			categoria:req.body.categoria,
			usuario:req.user.user_id,
			imagen:route
		};
		var notificacion = {
			titulo:req.body.titulo,
			fecha_inicio:req.body.fecha_inicial,
			fecha_final:req.body.fecha_final,
			descripcion:req.body.descripcion,
			lugar:req.body.lugar,
			categoria:req.body.categoria,
			usuario:req.user.user_id,
			imagen:route
		}
		switch(evento.categoria) {
			case '1': notificacion.categoria="extracurricular";
					break;
			case '2': notificacion.categoria="académico";
					break;
			case '3': notificacion.categoria="deportivo";
					break;
			case '4': notificacion.categoria="urgente";
					break;
		};
		req.app.locals=notificacion;
		connection.query("INSERT INTO eventos SET ?",evento,function(err){
			if(err) {
				console.log(err);
				req.flash('error',"No se pudo crear el evento");
				return res.redirect('/app/#/app');
			}
			req.flash('success','¡Evento creado!');
			return res.redirect('/app/#/app');
		});
	}
});

//Actualizar un evento por su ID
router.route("/eventos/:id")
	.put(function(req,res) {
		if(req.body.archivo.name != ''){
			/*var ruta = "public/imagenes/eventos/"+req.body.archivo.name;
			var route = "/public/imagenes/eventos/"+req.body.archivo.name;
			fs.rename(req.body.archivo.path, ruta, function(err){
				if(err) console.log(err);
			});*/
			cloudinary.uploader.upload(req.body.archivo.path, function(result) {
				actualizar(result.url);
			}, { public_id: req.body.titulo } );
		}else{
			var route = "";
			actualizar(route);
		}
		function actualizar(route){
			if(route!=="") {
				var evento={
					titulo:req.body.titulo,
					fecha_inicio:req.body.fecha_inicial,
					fecha_final:req.body.fecha_final,
					descripcion:req.body.descripcion,
					lugar:req.body.lugar,
					categoria:req.body.categoria,
					usuario:req.user.user_id,
					imagen:route
				};
			} else {
				var evento={
					titulo:req.body.titulo,
					fecha_inicio:req.body.fecha_inicial,
					fecha_final:req.body.fecha_final,
					descripcion:req.body.descripcion,
					lugar:req.body.lugar,
					categoria:req.body.categoria,
					usuario:req.user.user_id
				};
			}
			connection.query("UPDATE eventos SET ? WHERE evento_id=?",[evento,req.params.id],function(err){
				if(err) {
					console.log(err);
					req.flash('error',"No se pudo modificar el evento");
					return res.redirect('/app/#/app');
				}
				req.flash('success','¡Evento modificado!');
				return res.redirect('/app/#/app');
			});
		};
	});

//El administrador registra un correo y manda un mensaje al usuario para que se registre
router.route("/registrar")
	.post(function(req,res,next){
		async.waterfall([
			function(done){
				var query = "SELECT user_id,correo,tokenExpires,registryPasswordToken FROM usuarios WHERE correo=? LIMIT 1";
				connection.query(query,req.body.correo, function(err, usuario) {
					if(usuario[0]) {
						if(usuario[0].tokenExpires>Date.now()) {
							req.flash('error','Ya existe un usuario con este correo');
							done(true);
						} else {
							var tokenExpires = Date.now() + 32400000 //9 horas activo
							done(err,tokenExpires,usuario[0].registryPasswordToken,usuario[0].user_id);
						}
					} else {
						crypto.randomBytes(20,function(err,buf){
							var token = buf.toString('hex');
							done(err,0,token,0);
						});
					}
				});
			},
			function(tokenExpires,token,user_id,done){
				if(tokenExpires !== 0) {
					var user={
						correo:req.body.correo,
						registryPasswordToken:token,
						tokenExpires:tokenExpires
					}
					var query = "UPDATE usuarios SET ? WHERE user_id=?";
					connection.query(query,[user,user_id],function(err){
						done(err,user);
						//Enviamos al usuario como parametro 'token' de la siguiente funcion
					});
				} else {
					done(null,token);
				}
			},
			function(token,done){
				if(token.correo) {
					done(null,token.registryPasswordToken,token);
				} else {
					var tokenExpires = Date.now() + 32400000 //9 horas activo
					var user={
						correo:req.body.correo,
						registryPasswordToken:token,
						tokenExpires:tokenExpires
					}
					connection.query("INSERT INTO usuarios SET ?",user,function(err){
						done(err,token,user);
					});
				}
			},
			function(token,user,done){
				var mailOptions={
					to: user.correo,
					from: config.mailUser,
					subject: 'Registrarse al sistema',
					text: 'Para registrarte en la pagina deberas llenar el siguiente formulario \n\n' +
					'Haz clic en el siguiente link, o copia y pegalo en tu navegador para completar el proceso:\n\n' +
					'http://' + req.headers.host + '/signup/' + token + '\n\n' +
					'El link caducará dentro de 9 horas le recomendamos realizar el proceso dentro de este periodo de tiempo\n'+
					'Si tu no pediste esto, por favor ignora este correo.\n'
				}
				transport.sendMail(mailOptions,function(err,info){
					if(err)
						console.log(err);
					else{
						req.flash('info', 'Se ha enviado un correo a ' + user.correo + ' con instrucciones a seguir.');
						done(err, 'done');
					}
				});
			}
		],function (err,result){
			if(err) {
				console.log(err);
				res.redirect('/app/#/app');
				return;
			}
			res.redirect('/app/#/app');
		});
	});

router.put("/update_user",function(req,res) {
	if(req.body.archivo.name != ''){
		/*var ruta = "public/imagenes/profile/"+req.body.archivo.name;
		var route = "/public/imagenes/profile/"+req.body.archivo.name;
		fs.rename(req.body.archivo.path, ruta, function(err){
			if(err) console.log(err);
		});*/
		cloudinary.uploader.upload(req.body.archivo.path, function(result) {
			actualizar(result.url);
		}, { public_id: req.body.titulo } );
	}else{
		var route = "";
		actualizar(route);
	}
	function actualizar(route){
		if(route!=="") {
			var usuario = {
				nombres:req.body.nombres,
				apellidos:req.body.apellidos,
				foto_perfil:route
			};
		} else {
			var usuario = {
				nombres:req.body.nombres,
				apellidos:req.body.apellidos
			};
		}
		var query = "UPDATE usuarios SET ? WHERE user_id=?";
		connection.query(query,[usuario,req.user.user_id],function (err) {
			if (err) {
				console.log(err);
				req.flash('error',"No se pudo modificar el usuario");
				return res.redirect('/#/app/perfil');
			}
			req.flash('success','¡Usuario modificado!');
			return res.redirect('/#/app/perfil');
		});
	}
});

module.exports = router;