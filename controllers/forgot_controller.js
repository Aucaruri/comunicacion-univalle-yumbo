var express = require("express");
var router = express.Router();
var connection = require ("../db");
var async = require('async');
var crypto = require('crypto');
var config = require("../config.json");
var nodemailer = require("nodemailer");
var flash = require('express-flash');
var transport = nodemailer.createTransport({
	service: config.mailService,
	auth:{
		user:config.mailUser,
		pass: config.mailPass
	}
});

router.post('/',function(req, res, next){
	async.waterfall([
		function(done){
			crypto.randomBytes(20,function(err,buf){
				var token = buf.toString('hex');
				done(err,token);
			});
		},
		function(token,done){
			connection.query("select * from usuarios where correo=? limit 1",req.body.email, function(err, user){
				if (!user[0]) {
					req.flash('error', 'No existe una cuenta con ese correo.');
					return res.redirect('/forgot');
				}
				user[0].registryPasswordToken = token;
				user[0].tokenExpires = Date.now() + 7200000; // 2 horas activo
				connection.query("update usuarios set registryPasswordToken=?, tokenExpires=? where user_id=?",
				[user[0].registryPasswordToken,user[0].tokenExpires,user[0].user_id],
				function(err){
					done(err, token, user);
				});
			});
		},
		function(token, user, done){
			var mailOptions={
				to: user[0].correo,
				from: config.mailUser,
				subject: 'Cambiar contraseña',
				text: 'Estas recibiendo este correo porque tu (o alguien más) ha pedido cambiar la contraseña de tu cuenta.\n\n' +
				'Haz clic en el siguiente link, o copia y pegalo en tu navegador para completar el proceso:\n\n' +
				'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				'El link caducará dentro de 2 horas le recomendamos realizar el proceso dentro de este periodo de tiempo\n'+
				'Si tu no pediste esto, por favor ignora este correo y tu contraseña se mantendrá sin cambios.\n'
			}
			transport.sendMail(mailOptions,function(err,info){
				if(err)
					console.log(err);
				else{
					req.flash('info', 'Se ha enviado un correo a ' + user[0].correo + ' con instrucciones a seguir.');
					done(err, 'done');
				}
			});
		}
	],function(err){
		if(err) return next(err);
		res.redirect('/#/forgot');
	});
});

module.exports=router;