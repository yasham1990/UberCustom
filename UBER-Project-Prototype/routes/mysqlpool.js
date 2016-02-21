var ejs=require('ejs');
var mysql=require('mysql');

exports.getConnection=function(req,res){
var pool  = mysql.createPool({
	  connectionLimit : 100,
	  host: "localhost",
		user: "root",
		password: "root",
		database:"uber"
	});
return pool;
};

	

