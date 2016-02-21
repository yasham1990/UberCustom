var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit:100,
	host:'localhost',
	user: 'root',
	password: 'shilpa',
	database: 'UBER',
	debug: false
});

exports.renderEditProfilePage = function (req,res) {
	res.render("EditDriverProfile");
};

exports.renderViewProfile = function (req,res) {
	res.render("ViewDriverProfile");
};

exports.getProfileDetails = function (req,res) {
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select * from driver where Driver_ID = ?",[req.session.username],function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	var json_responses = {"statusCode" : 200,
        			"firstname" : rows[0].D_Firstname,
        			"lastname" : rows[0].D_Lastname,
        			"address" : rows[0].D_Address,
        			"city" : rows[0].D_City,
        			"state" : rows[0].D_State,
        			"zipcode" : rows[0].D_ZipCode,
        			"contact": rows[0].D_Phone,
        			"email": rows[0].D_Email,
        			"licenseid" : rows[0].D_LicenseID,
        			"cardetails" : rows[0].D_CarDetails,
        			"password" : rows[0].D_Password,
        			"rating": rows[0].D_Avg_Rating
        	};
        	console.log(json_responses);
			res.send(json_responses);
        });
	});
};

exports.updateDriverProfile = function (req,res) {
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 
        // TO-DO : Add password also as a editable field, D_Credit_Card_EXP=?,D_Credit_Card_ZIP=?
        connection.query("update driver set D_Firstname=?,D_Lastname=?,D_Address=?,D_City=?,D_State=?,D_ZipCode=?,D_Phone=?," +
        		"D_Email=?,D_LicenseID=?,D_CarDetails=?,D_Password=?" +
        		"where Driver_ID = ?",
        		[req.param("FirstName"),req.param("LastName"),req.param("Address"),req.param("City"),req.param("State"),req.param("ZipCode"),
        		 req.param("Contact"),req.param("Email"),req.param("LicenseID"),req.param("CarDetails"),req.param("Password"),req.session.username],
        		function(err,rows) {
        			
        	if(err) {                              
        				throw err;
        			}
        			var json_responses = {"statusCode" : 200};
        			res.send(json_responses);
        });
	});
};
/*exports.getDriverHomePageDetails = function (req,res) {
	console.log("I am here atleast");
	req.session.driverid = 1;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 
        // TO-DO : Add password also as a editable field, D_Credit_Card_EXP=?,D_Credit_Card_ZIP=?
        connection.query("select Source_Add,R_Pickup from ride_history where Driver_ID = ? and R_Status=0 ",[req.session.driverid],function(err,inforows) {
        	if(err) {                              
        				throw err;
        			}
        	if(inforows.length !== 0) { // there is ONE upcoming requested ride
        		connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=0)",[req.session.driverid],function(err,rows) {
            		var json_responses = {"statusCode" : 200,"Name": rows[0].C_Firstname,"Phone": rows[0].C_Phone,"Address": inforows[0].Source_Add, "Date": inforows[0].R_Pickup, "Tab":"requested"};
            		console.log(json_responses);
        			res.send(json_responses);
            	});
        	}
        	else { // checking for cancelled ride
        		connection.query("select Source_Add,R_Pickup from ride_history where Driver_ID = ? and R_Status=2 ",[req.session.driverid],function(err,cancelrows) {
        			if(cancelrows.length !== 0) {
        				connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=2)",[req.session.driverid],function(err,canrows) {
        					var json_responses = {"statusCode" : 200,"Name": canrows[0].C_Firstname,"Phone": canrows[0].C_Phone,"Address": cancelrows[0].Source_Add, "Date": cancelrows[0].R_Pickup, "Tab":"cancelled"};
        					connection.query("update ride_history set R_Status=3 where Driver_ID=? and R_Status=2",[req.session.driverid],function(err,rows) {
        					});
        					res.send(json_responses);
        				});
        			}
        			else { // checking for completed ride
        				connection.query("select Source_Add,R_Pickup from ride_history where Driver_ID = ? and R_Status=1 order by R_Pickup DESC ",[req.session.driverid],function(err,comprows) {
        					if(comprows.length!==0) {
        						connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=1 order by R_Pickup DESC)",[req.session.driverid],function(err,comrows) {
        							var json_responses = {"statusCode" : 200,"Name": comrows[0].C_Firstname,"Phone": comrows[0].C_Phone,"Address": comprows[0].Source_Add, "Date": comprows[0].R_Pickup, "Tab":"completed"};
        							res.send(json_responses);
        						});
        					}
        					else { // nothing assigned for the driver
        						var json_responses = {"statusCode" : 200,"Tab":"nothing"};
        						res.send(json_responses);
        					}
        				});
        			}
        			
        		});
        	}
        });
	});
};
*/



exports.getDriverHomePageDetails = function (req,res) {
	req.session.driverid = 1;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 
        // TO-DO : Add password also as a editable field, D_Credit_Card_EXP=?,D_Credit_Card_ZIP=?
        connection.query("select Source_Add,R_Pickup from ride_history where Driver_ID = ? and R_Status=0 ",[req.session.driverid],function(err,inforows) {
        	if(err) {                              
        				throw err;
        			}
        	if(inforows.length !== 0) { // there is ONE upcoming requested ride
        		connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=0)",[req.session.driverid],function(err,rows) {
            		var json_responses = {"statusCode" : 200,"Name": rows[0].C_Firstname,"Phone": rows[0].C_Phone,"Address": inforows[0].Source_Add, "Date": inforows[0].R_Pickup, "Tab":"requested"};
            		console.log(json_responses);
        			res.send(json_responses);
            	});
        	}
        	else { // checking for cancelled ride
        		connection.query("select Source_Add,R_Pickup,R_Status from ride_history where Driver_ID = ? order by R_Pickup DESC",[req.session.driverid],function(err,cancelcomprows) {
        			if(cancelcomprows.length !== 0) {
        				if(cancelcomprows[0].R_Status === 2) { // cancelled ride to be displayed first
        					connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=2 order by R_Pickup DESC limit 1)",[req.session.driverid],function(err,canrows) {
    							var json_responses = {"statusCode" : 200,"Name": canrows[0].C_Firstname,"Phone": canrows[0].C_Phone,"Address": cancelcomprows[0].Source_Add, "Date": cancelcomprows[0].R_Pickup, "Tab":"cancelled"};
    							res.send(json_responses);
    						});
        				}
        				else { // completed ride to be displayed first
        					connection.query("select C_Firstname,C_Phone from customer where Customer_ID = (select Customer_ID from ride_history where Driver_ID=? and R_Status=1 order by R_Pickup DESC limit 1)",[req.session.driverid],function(err,comrows) {
    							var json_responses = {"statusCode" : 200,"Name": comrows[0].C_Firstname,"Phone": comrows[0].C_Phone,"Address": cancelcomprows[0].Source_Add, "Date": cancelcomprows[0].R_Pickup, "Tab":"completed"};
    							res.send(json_responses);
    						});
        				}
        			}
        			else {
        				// nothing assigned for the driver
						var json_responses = {"statusCode" : 200,"Tab":"nothing"};
						res.send(json_responses);
        			}
        		});
        	}
        });
	});
};
