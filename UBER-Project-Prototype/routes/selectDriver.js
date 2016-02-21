var mysql=require('mysql');
var pool = require("./mysqlpool");

var ejs = require("ejs");
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017";
var connection=pool.getConnection(function(err,connection){});
var video=[],items;




exports.selectDriver=function(req,res){
	
	var json_response=sqlDriver(req.session.username,function(err,json_response){
		res.send(json_response);
		console.log('Last call');
		}.bind(this));
	
};


function sqlDriver(session,callback)
{	
	var DriverID=[], Firstname=[], Lastname=[], D_Address, D_City, D_State, D_ZipCode, DriverPhone=[], 
	D_Email, D_LicenseID, CarDetails=[], D_Password, DriverRating=[], D_Status; 
	var sql_query="SELECT * FROM driver WHERE D_Status=1 ORDER BY RAND() LIMIT 5 ";
	
	connection.query(sql_query,function(err,rows)
	{
		if(err){
			throw err;
		}
		if(rows.length == 0){
			json_response={"statusCode":401};
			res.send(json_response);
		}
		else{
				console.log(rows);
				items=rows.length;
				for(var i=0;i<rows.length;i++)
				{
					Firstname[i]=rows[i].D_Firstname;
					Lastname[i]=rows[i].D_Lastname;
					DriverID[i]=rows[i].Driver_ID;
					DriverPhone[i]=rows[i].D_Phone;
					CarDetails[i]=rows[i].D_CarDetails;
					DriverRating[i]=rows[i].D_Avg_Rating;	
					
				}
				json_response = {"statusCode":200,"D_Lastname":Lastname,"D_Firstname":Firstname,"Driver_ID":DriverID,"D_Phone":DriverPhone,"D_CarDetails":CarDetails,"D_Avg_Rating":DriverRating,"Video":[]};
				getVideo(json_response,callback);
			}
		
		}.bind(this));
	}
	
	function getVideo(json_response,callback){
		
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at: ' + mongoURL);
			var coll = mongo.collection('video');
			var templist=[];
			coll.find({Driver_ID:{$in:json_response.Driver_ID}}).toArray(function(err, user){
				for(var i=0;i<user.length;i++)
					json_response.Video[i]=user[i].url;
				console.log('Am returning');
				callback(null,json_response);
				
			});
		});

	}
					
					