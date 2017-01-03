var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 100,
  host            : 'us-cdbr-iron-east-04.cleardb.net',
  user            : 'b4a8e75b0262bc',
  password        : 'e634cd34',
  database        : 'heroku_4c031bea5b16253'
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