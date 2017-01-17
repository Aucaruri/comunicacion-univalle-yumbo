var express = require("express");
var connection = require ("../../db");
var Q = require('q');

//Obtener todos los eventos
exports.getAllEvents=function(){
	var deferred = Q.defer();

	var query = "SELECT a.evento_id, a.titulo,a.imagen,a.fecha_inicio,a.fecha_final,"+
				"a.descripcion,a.lugar,a.categoria,b.nombre as nombre_categoria,a.estado "+
				"FROM eventos a INNER JOIN categorias b ON a.categoria=b.categoria_id "+
				"WHERE a.estado=1 ORDER BY a.fecha_inicio LIMIT 30";
	connection.query(query,
		function(err,eventos){
			if (err) deferred.reject(err.name + ': ' + err.message);
			if(eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_inicio.getYear()+1900;
						var mes = eventos[i].fecha_inicio.getMonth()+1;
						var dia = eventos[i].fecha_inicio.getDate();
						var hora = eventos[i].fecha_inicio.getHours();
						var minutos = eventos[i].fecha_inicio.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_final.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_final.getYear()+1900;
						var mes = eventos[i].fecha_final.getMonth()+1;
						var dia = eventos[i].fecha_final.getDate();
						var hora = eventos[i].fecha_final.getHours();
						var minutos = eventos[i].fecha_final.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				deferred.resolve(eventos);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};

exports.getHomeEvents=function(){
	var deferred = Q.defer();

	var query = "SELECT a.evento_id, a.titulo,a.imagen,a.fecha_inicio,a.fecha_final,"+
				"a.descripcion,a.lugar,a.categoria,b.nombre as nombre_categoria,a.estado "+
				"FROM eventos a INNER JOIN categorias b ON a.categoria=b.categoria_id "+
				"WHERE a.estado=1 AND a.categoria!=4 ORDER BY a.fecha_inicio LIMIT 30";
	connection.query(query,
		function(err,eventos){
			if (err) deferred.reject(err.name + ': ' + err.message);
			if(eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_inicio.getYear()+1900;
						var mes = eventos[i].fecha_inicio.getMonth()+1;
						var dia = eventos[i].fecha_inicio.getDate();
						var hora = eventos[i].fecha_inicio.getHours();
						var minutos = eventos[i].fecha_inicio.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_final.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_final.getYear()+1900;
						var mes = eventos[i].fecha_final.getMonth()+1;
						var dia = eventos[i].fecha_final.getDate();
						var hora = eventos[i].fecha_final.getHours();
						var minutos = eventos[i].fecha_final.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				deferred.resolve(eventos);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};

//Obtener los eventos para el slider
exports.getSliderEvents=function(){
	var deferred = Q.defer();

	connection.query("SELECT * FROM eventos where categoria=4 AND estado=1",
		function(err,eventos){
			if (err) deferred.reject(err.name + ': ' + err.message);
			if(eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_inicio.getYear()+1900;
						var mes = eventos[i].fecha_inicio.getMonth()+1;
						var dia = eventos[i].fecha_inicio.getDate();
						var hora = eventos[i].fecha_inicio.getHours();
						var minutos = eventos[i].fecha_inicio.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_final.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_final.getYear()+1900;
						var mes = eventos[i].fecha_final.getMonth()+1;
						var dia = eventos[i].fecha_final.getDate();
						var hora = eventos[i].fecha_final.getHours();
						var minutos = eventos[i].fecha_final.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				deferred.resolve(eventos);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};

//Obtener los eventos por categoria
exports.getCategoryEvents=function(id){
	var deferred = Q.defer();

	connection.query("SELECT * FROM eventos where categoria=? AND estado=1",id,
		function(err,eventos){
			if (err) deferred.reject(err.name + ': ' + err.message);
			if(eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_inicio.getYear()+1900;
						var mes = eventos[i].fecha_inicio.getMonth()+1;
						var dia = eventos[i].fecha_inicio.getDate();
						var hora = eventos[i].fecha_inicio.getHours();
						var minutos = eventos[i].fecha_inicio.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_final.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_final.getYear()+1900;
						var mes = eventos[i].fecha_final.getMonth()+1;
						var dia = eventos[i].fecha_final.getDate();
						var hora = eventos[i].fecha_final.getHours();
						var minutos = eventos[i].fecha_final.getMinutes();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						eventos[i].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
					}
				};
				deferred.resolve(eventos);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};

//Obtener un evento por su ID
exports.getById=function(id){
	var deferred = Q.defer();

	var query = "SELECT a.evento_id,a.titulo,a.imagen,a.fecha_inicio,a.fecha_final,"+
				"a.descripcion,a.lugar,a.categoria,b.nombre as nombre_categoria,a.estado,a.usuario "+
				"FROM eventos a INNER JOIN categorias b ON a.categoria=b.categoria_id "+
				"WHERE a.evento_id=? AND a.estado=1";
	connection.query(query,id,function(err, evento){
		if (err) deferred.reject(err.name + ': ' + err.message);
		if(evento[0]) {
			evento[0].categoria = evento[0].categoria.toString();
			if(evento[0].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
				var ano = evento[0].fecha_inicio.getYear()+1900;
				var mes = evento[0].fecha_inicio.getMonth()+1;
				var dia = evento[0].fecha_inicio.getDate();
				var hora = evento[0].fecha_inicio.getHours();
				var minutos = evento[0].fecha_inicio.getMinutes();
				if(mes<10){mes='0'+mes}
				if(dia<10){dia='0'+dia}
				if(hora<10){hora='0'+hora}
				if(minutos<10){minutos='0'+minutos}
				evento[0].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
			}
			if(evento[0].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
				var ano = evento[0].fecha_final.getYear()+1900;
				var mes = evento[0].fecha_final.getMonth()+1;
				var dia = evento[0].fecha_final.getDate();
				var hora = evento[0].fecha_final.getHours();
				var minutos = evento[0].fecha_final.getMinutes();
				if(mes<10){mes='0'+mes}
				if(dia<10){dia='0'+dia}
				if(hora<10){hora='0'+hora}
				if(minutos<10){minutos='0'+minutos}
				evento[0].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
			}
			
			deferred.resolve(evento[0]);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

//Obtener eventos 
exports.getUserEvents=function(id){
	var deferred = Q.defer();
	
	var query = "SELECT a.evento_id,a.titulo,a.fecha_inicio,a.fecha_final,"+
				"a.descripcion,a.lugar,a.categoria,a.imagen,b.nombre as nombre_categoria,a.estado " +
				"FROM eventos a INNER JOIN categorias b ON a.categoria=b.categoria_id "+
				"WHERE usuario=? AND a.estado=1";
	connection.query(query, id, function(err, eventos) {
		if (err) deferred.reject(err.name + ': ' + err.message);
		if(eventos) {
			for (var i = eventos.length - 1; i >= 0; i--) {
				if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
					var ano = eventos[i].fecha_inicio.getYear()+1900;
					var mes = eventos[i].fecha_inicio.getMonth()+1;
					var dia = eventos[i].fecha_inicio.getDate();
					var hora = eventos[i].fecha_inicio.getHours();
					var minutos = eventos[i].fecha_inicio.getMinutes();
					if(mes<10){mes='0'+mes}
					if(dia<10){dia='0'+dia}
					if(hora<10){hora='0'+hora}
					if(minutos<10){minutos='0'+minutos}
					eventos[i].fecha_inicio = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
				}
			};
			for (var i = eventos.length - 1; i >= 0; i--) {
				if(eventos[i].fecha_final.toString() !== '0000-00-00 00:00:00'){
					var ano = eventos[i].fecha_final.getYear()+1900;
					var mes = eventos[i].fecha_final.getMonth()+1;
					var dia = eventos[i].fecha_final.getDate();
					var hora = eventos[i].fecha_final.getHours();
					var minutos = eventos[i].fecha_final.getMinutes();
					if(mes<10){mes='0'+mes}
					if(dia<10){dia='0'+dia}
					if(hora<10){hora='0'+hora}
					if(minutos<10){minutos='0'+minutos}
					eventos[i].fecha_final = ano+'/'+mes+'/'+dia+' '+hora+':'+minutos;
				}
			};
			deferred.resolve(eventos);
		} else {
			deferred.resolve();
		}
	});	

	return deferred.promise;	
};

//Eliminar un evento
exports.deleteEvent=function(id){
	var deferred = Q.defer();

	connection.query("UPDATE eventos SET estado=0 WHERE evento_id=?",id,function (err) {
		if (err) deferred.reject(err.name + ': ' + err.message);
		deferred.resolve();
	});

	return deferred.promise;
};

exports.getAndroidEvents=function(){
	var deferred = Q.defer();

	var query = "SELECT evento_id, imagen, titulo, descripcion, fecha_inicio "+
				"FROM eventos "+
				"WHERE estado=1 ORDER BY fecha_inicio";
	connection.query(query,
		function(err,eventos){
			if (err) deferred.reject(err.name + ': ' + err.message);
			if(eventos) {
				for (var i = eventos.length - 1; i >= 0; i--) {
					if(eventos[i].fecha_inicio.toString() !== '0000-00-00 00:00:00'){
						var ano = eventos[i].fecha_inicio.getYear()+1900;
						var mes = eventos[i].fecha_inicio.getMonth()+1;
						var dia = eventos[i].fecha_inicio.getDate();
						var hora = eventos[i].fecha_inicio.getHours();
						var minutos = eventos[i].fecha_inicio.getMinutes();
						var segundos = eventos[i].fecha_inicio.getSeconds();
						if(mes<10){mes='0'+mes}
						if(dia<10){dia='0'+dia}
						if(hora<10){hora='0'+hora}
						if(minutos<10){minutos='0'+minutos}
						if(segundos<10){segundos='0'+segundos}
						eventos[i].fecha_inicio = ano+'-'+mes+'-'+dia+' '+hora+':'+minutos+':'+segundos;
					}
				};
				deferred.resolve(eventos);
			} else {
				deferred.resolve();
			}
		});

	return deferred.promise;
};