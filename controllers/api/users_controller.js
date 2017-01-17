var express = require("express");
var router = express.Router();
var connection = require ("../../db");
var methodOverride = require("method-override");
var app = express();

//Middlewares
app.use(methodOverride());

//import controllers
var users = require("./users");

router.get("/",getAllUsers);
router.get("/current",getCurrentUser);

router.route("/:id")
	.get(getById)
	.put(updateUser)
	.delete(deleteUser);

module.exports = router;

function getAllUsers(req,res){
	users.getAllUsers()
		.then(function(usuarios) {
			if(usuarios) {
				res.send(usuarios);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getCurrentUser(req,res){
	if(req.user) {
		users.getById(req.user.user_id)
			.then(function(usuario) {
				if(usuario) {
					res.send(usuario);
				} else {
					res.sendStatus(404);
				}
			})
			.catch(function(err) {
				res.status(400).send(err);
			});
	} else {
		res.sendStatus(404);
	}
}

function getById(req,res){
	users.getById(req.params.id)
		.then(function (user) {
			if(user) {
				res.send(user);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function (err) {
			res.status(400).send(err);
		});
}

function updateUser(req,res){
	users.updateUser(req.params.id,req.body)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}

function deleteUser(req,res){
	users.deleteUser(req.params.id)
		.then(function () {
			res.sendStatus(200);
		})
		.catch(function (err) {
			res.status(400).send(err);
		});
}

