var express = require("express");
var router = express.Router();
var connection = require ("../../db");
var methodOverride = require("method-override");
var app = express();

//Middlewares
app.use(methodOverride());

//import controllers
var events = require("./events");

router.get("/",getAllEvents);
router.get("/home",getHomeEvents);
router.get("/slider",getSliderEvents);
router.get("/user_events",getUserEvents);
router.get("/category/:id",getCategoryEvents);
router.get("/tuputopadre",getAndroidEvents);

router.route("/:id")
	.get(getById)
	.delete(deleteEvent);

module.exports = router;

function getAllEvents(req,res){
	events.getAllEvents()
		.then(function(eventos) {
			if(eventos) {
				res.send(eventos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getHomeEvents(req,res){
	events.getHomeEvents()
		.then(function(eventos) {
			if(eventos) {
				res.send(eventos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getSliderEvents(req,res){
	events.getSliderEvents()
		.then(function(eventos) {
			res.send(eventos);
		})
		.catch(function(err) {
			res.status(400).send(err);
		})
}

function getUserEvents(req,res){
	events.getUserEvents(req.user.user_id)
		.then(function(eventos) {
			if(eventos){
				res.send(eventos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getCategoryEvents(req,res){
	events.getCategoryEvents(req.params.id)
		.then(function(eventos) {
			if(eventos) {
				res.send(eventos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getById(req,res){
	events.getById(req.params.id)
		.then(function(evento) {
			if(evento) {
				res.send(evento);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function deleteEvent(req,res){
	console.log(req.body);
	events.deleteEvent(req.params.id)
		.then(function() {
			res.sendStatus(200);
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}

function getAndroidEvents(req,res){
	events.getAndroidEvents()
		.then(function(eventos) {
			if(eventos) {
				res.send(eventos);
			} else {
				res.sendStatus(404);
			}
		})
		.catch(function(err) {
			res.status(400).send(err);
		});
}