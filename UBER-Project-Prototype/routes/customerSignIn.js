var mysql = require('mysql');
var pool=require('./mysqlpool');
var connection=pool.getConnection(function(err,connection){});
var bcrypt = require('bcrypt-nodejs');

exports.login=function(req,res)
{	console.log("Inside Customer Login");
	var email, password;
	email=req.param("email");
	password=req.param("password");
	console.log(email+" "+password);
	var sql_query="SELECT Customer_ID,C_Password FROM customer WHERE C_Email=" + connection.escape(email);
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
		else if(bcrypt.compareSync(password,rows[0].C_Password)) {
    			req.session.username= rows[0].Customer_ID;
    			console.log('session '+req.session.username);
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


exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};	

exports.deleteAccount = function(req,res)
{
	var ID=req.session.username;
	var sql_query="DELETE FROM ride_history WHERE Customer_ID="+connection.escape(ID);
	console.log(sql_query);
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		var sql_query1="DELETE FROM customer WHERE Customer_ID="+connection.escape(ID);
		connection.query(sql_query1,function(err,rows)
		{
					//req.session.destroy();
					if(err){
						throw err;
					}
					var sql_query2="SELECT * FROM customer WHERE Customer_ID="+connection.escape(ID);
					connection.query(sql_query2,function(err,rows)
							{
										if(err){
											throw err;
										}
										if(rows.length === 0){
											res.redirect('/');
										}
							});
		});
		connection.on('error', function(err) {      
	  	  connection.release();
	        res.json({"code" : 100, "status" : "Error in connection database"});
	        return;    
		});
	});
};	


exports.rendermaps = function(req,res)
{
		
		res.render('maps');
};