var express = require("express");
var path = require('path');
var logger = require("morgan");
var jwt = require('jsonwebtoken');
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressJwt = require('express-jwt');
var session = require("express-session");
var connection = require ("./db");
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var flash = require('express-flash');
var formidable = require("express-formidable");
var methodOverride = require("method-override");
var nodemailer = require ("nodemailer");
var config = require("./config.json");
var request = require('request');
var transport = nodemailer.createTransport({
			service: config.mailService,
			auth:{
				user:config.mailUser,
				pass: config.mailPass
			}
		});

passport.use(new LocalStrategy(function(username, password, done) {
	connection.query("select * from usuarios where correo=? AND estado=1 limit 1",username, function(err, user){
		if (err) return done(err);
		if (!user[0]) return done(null, false, {message:'Usuario incorreto.'});
		if(bcrypt.compareSync(password,user[0].contraseña)) {
			return done(null, user);
		} else {
			return done(null, false, {message:'Contraseña incorreta.'});
		}
	});
}));

passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(id, done){
  connection.query("select * from usuarios where user_id=? limit 1",id.user_id,function(err, user){
	done(err, user[0]);
  });
});

var app=express();
var server = require("http").createServer(app);
var realtime = require("./realtime");
realtime(server);

app.set('port', process.env.PORT || 8080);
app.set("view engine","jade");
app.use("/public",express.static('public'));
app.use('/datetimepicker', express.static(path.join(__dirname,'node_modules/angular-moment-picker-master/src')));
app.use('/ng-dialog', express.static(path.join(__dirname,'node_modules/ng-dialog')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(formidable.parse({keepExtensions:true}));

//En inicio se renderiza la página del layout
app.get("/",function(req,res){
	res.render("layout",{usuario:req.user});
});

//Se usa passport para poder hacer el login
//Despues de hacer el login la variable req.user queda llena con la info del usuario
app.post("/login", function(req,res,next){
	passport.authenticate('local',function(err,user,info){
		if(err) return next(err);
		if(!user){
			req.flash('error',"Usuario o contraseña incorrectos");
			return res.redirect("/#/login");
		}
		req.logIn(user[0], function(err){
			if(err) return next(err);
			//Crea un token de autenticación
			req.session.token = jwt.sign({sub: user[0].user_id},config.secret);
			return res.redirect("/app/#/app");
		});
	})(req,res,next);
});

//Cierra la sesion y manda al usuario a inicio
app.get('/logout',function(req, res){
	delete req.session.token;
	req.logout();
	res.redirect('/');
});

// usar el JWT auth para asegurar el api
/*app.use('/api', expressJwt({ secret: config.secret })
	.unless({path: ['/api/events', '/api/events/:id', '/api/events/slider']}),
	function(req, res, next) {
		console.log('token del express');
		console.log(req.headers);
		next();
	});*/

// Hacer el JWT token disponible para angular
app.get('/protected/token', function (req, res) {
    res.send(req.session.token);
});

app.use("/app",require("./controllers/app_controller"));
app.use("/forgot",require("./controllers/forgot_controller"));
app.use("/reset",require("./controllers/reset_controller"));
app.use("/signup",require("./controllers/signup_controller"));
app.use("/api/users",require("./controllers/api/users_controller"));
app.use("/api/events",require("./controllers/api/events_controller"));
app.use("/api/messages",require("./controllers/api/chat_controller"));

//puerto de ejecución, si se cambia hay que cambiar el config.json
server.listen(app.get('port'),function(){
	console.log('Express server listening on port ' + app.get('port'));
});