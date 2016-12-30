var express = require("express");
var router = express.Router();
var connection = require ("../db");
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
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

router.get('/:token',function(req, res){
	connection.query("select * from usuarios where registryPasswordToken=? and tokenExpires > ?",
		[req.params.token, Date.now()],function(err,user){
			if (!user[0]) {
				req.flash('error','El link para cambiar la contraseña es invalido o ha caducado.');
				return res.redirect('/#/forgot');
			}
			res.render('reset',{usuario:req.user,token:req.params.token});
	});
});

router.post('/:token',function(req, res){
	async.waterfall([
		function(done){
			var querySelect = "select * from usuarios where registryPasswordToken=? and tokenExpires > ?";
			connection.query(querySelect,[req.params.token,Date.now()],function(err, user){
				if (!user[0]) {
					req.flash('error', 'El link para cambiar la contraseña es invalido o ha caducado.');
					return res.redirect('/#/forgot');
				}
				user[0].contraseña = req.body.password;
				user[0].registryPasswordToken = null;
				user[0].tokenExpires = null;
				
				user[0].contraseña=bcrypt.hashSync(req.body.password, 5);

				connection.query("update usuarios set ? where user_id=?",[user[0],user[0].user_id],function(err){
					req.logIn(user[0], function(err){
						done(err, user);
					});
				});
			});
		},
		function(user, done){
			var mailOptions = {
				to: user[0].correo,
				from: config.mailUser,
				subject: 'Tu contraseña ha sido cambiada',
				text: 'Hola,\n\n' +
				'Esta es una confirmación de que la contraseña para tu cuenta ' + user[0].correo + ' fue cambiada hace poco.\n'
			};
			transport.sendMail(mailOptions, function(err) {
				req.flash('success', '¡Exito! Tu contraseña se ha cambiado.');
				done(err);
			});
		}
	],function(err){
		res.redirect('/#/home');
	});
});

module.exports = router;