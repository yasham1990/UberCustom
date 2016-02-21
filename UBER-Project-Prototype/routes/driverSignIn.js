var mysql = require('mysql');
var pool=require('./mysqlpool');
var connection=pool.getConnection(function(err,connection){});
var Driver_Id;
var bcrypt = require('bcrypt-nodejs');

exports.login=function(req,res)
{	console.log("Inside Customer Login");
	var email, password;
	email=req.param("email");
	password=req.param("password");
	console.log(email+" "+password);
	var sql_query="SELECT Driver_ID,D_Password FROM driver WHERE D_Email=" + connection.escape(email);
	//console.log(sql_query);
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		if(rows.length === 0){
        		json_responses = {"statusCode" : 401};
    			res.send(json_responses);
        		//console.log ("invalid email id");
		}
		else if(bcrypt.compareSync(password,rows[0].D_Password)) {
    			req.session.username = rows[0].Driver_ID;
    			json_responses = {"statusCode" : 200};
    			res.send(json_responses);
    			//console.log ("valid");	
		}
		else {
			json_responses = {"statusCode" : 302};
			res.send(json_responses);
			//console.log("invalid password");
		}
	});
	connection.on('error', function(err) {      
  	  connection.release();
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;    
  });
};

exports.renderHomepage = function(req,res)
{
		
		res.render('DriverHP');
};

exports.logout = function(req,res)
{
		req.session.destroy();
		res.redirect('/');
};