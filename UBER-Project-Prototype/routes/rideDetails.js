var mysql=require('mysql');
var pool = require("./mysqlpool");

var ejs = require("ejs");
var connection=pool.getConnection(function(err,connection){});


exports.insertRide=function(req,res){
		
	var Source_Add,Destination_Add,Customer_ID,Driver_ID,R_Distance,R_Status;
	var post={Source_Add:req.param("Source_Add"),Destination_Add:req.param("Destination_Add"),
			"Customer_ID":req.session.username,"Driver_ID":req.param("Driver_ID"),"R_Distance":req.param("R_Distance"),"R_Status":req.param("R_Status")};
	var sql_query='Insert into ride_history set?';
	var sql_query2="select * from ride_history where Customer_ID = "+connection.escape(req.session.username)+' and Driver_ID = '+
	connection.escape(req.param("Driver_ID"))+' and R_Status = '+connection.escape(req.param("R_Status"));
	var json_response;
	connection.query(sql_query,post,function(err,rows)
	{
		if(err){
			throw err;
		
		}
		else{
				console.log(sql_query2);
				connection.query(sql_query2,function(err,rows){
				if(err){
					throw err;
				}
				if(rows.length != 0){
				console.log('Value '+rows[0].Ride_ID);
				json_response={"statusCode":200,"Ride_ID":rows[0].Ride_ID};
				res.send(json_response);
				}				
			});		
			
		}
	});
	
};

exports.cancelRide=function(req,res){
	var Customer_ID,Driver_ID,R_Status,Ride_ID;
	R_Status=req.param("R_Status");
	Driver_ID=req.param("Driver_ID");
	Customer_ID=req.session.username;
	Ride_ID=req.param("Ride_ID");
	//var sql_query='update ride_history set R_Status = '+connection.escape(R_Status)+' where Customer_ID = '+connection.escape(Customer_ID)+' and Driver_ID = '+connection.escape(Driver_ID);
	var sql_query='update ride_history set R_Status = '+connection.escape(R_Status)+' where Ride_ID = '+connection.escape(Ride_ID);
	var json_response;
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		if(rows.length != 0){
			json_response={"statusCode":200};
		}
		else{
			json_response={"statusCode":401};
		}
	});
	
};


exports.updateRide=function(req,res){
	var Customer_ID,Driver_ID,R_Status,R_Amount,Ride_ID;
	R_Status=req.param("R_Status");
	Driver_ID=req.param("Driver_ID");
	Customer_ID=req.session.username;
	R_Amount=req.param("R_Amount");
	Ride_ID=req.param("Ride_ID");
	//var sql_query='update ride_history set R_Status = '+connection.escape(R_Status)+', R_Amount = '+connection.escape(R_Amount)+' where Customer_ID = '+connection.escape(Customer_ID)+' and Driver_ID = '+connection.escape(Driver_ID);
	var sql_query='update ride_history set R_Status = '+connection.escape(R_Status)+', R_Amount = '+connection.escape(R_Amount)+' where Ride_ID = '+connection.escape(Ride_ID);
	var json_response;
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		if(rows.length != 0){
			json_response={"statusCode":200};
		}
		else{
			json_response={"statusCode":401};
		}
	});
	
};