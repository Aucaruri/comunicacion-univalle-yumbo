var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : 'localhost',
  user            : 'intranet_user',
  password        : 'UnivalleYumbo2016',
  database        : 'intranet'
});

pool.getConnection(function(err,connection){
	if(!err){
		console.log("connected!");
	}else{
		console.log(err);
		console.log('NO SE HA PODIDO CONECTAR CON LA BASE DE DATOS ASEGURESE DE QUE ESTE ACTIVA');
	}
});

module.exports = pool;