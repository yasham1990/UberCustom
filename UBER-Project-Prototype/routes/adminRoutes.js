var mysql = require('mysql');
var ejs= require('ejs');
var pool = mysql.createPool({
	connectionLimit:100,
	host:'localhost',
	user: 'root',
	password: 'admin',
	database: 'UBER',
	debug: false
});
/**
 * Displaying Customer List
 */
exports.admCustomerList = function (req,res) {
	var data = [];
	var cid;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Customer_ID,C_Firstname,C_Email from customer",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	for(i=0;i<rows.length;i++) {
        			var str = (rows[i].Customer_ID).toString();
        			if(str.length === 9)
        				cid = str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6,9);
        			else
        				cid = str;
        		    var json_responses = {"statusCode" : 200,
            			"customerID": cid,
            			"firstname" : rows[i].C_Firstname,
            			"email": rows[i].C_Email};
        		data.push(json_responses);
        		
        	}
    

			res.render("admListCustomers",{listCustomer:data});
			
        });
	});
};
/**
 * Displaying Driver List
 */
exports.admDriverList = function (req,res) {
	var data = [];
	var did;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Driver_ID,D_Firstname,D_Email from driver",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	for(i=0;i<rows.length;i++) {
        		var str = (rows[i].Driver_ID).toString();
    			if(str.length === 9)
    				did = str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6,9);
    			else
    				did = str;
        		var json_responses = {"statusCode" : 200,
            			"driverID": did,
            			"firstname" : rows[i].D_Firstname,
            			"email": rows[i].D_Email};
        		data.push(json_responses);
        		
        	}
    

			res.render("admListDrivers",{listDriver:data});
			
        });
	});
};
/**
 * Displaying Search Bill
 */
exports.admSearchBill = function (req,res) {
	ejs.renderFile('./views/admSearchBill.ejs',{bill:" ",message:" "}, function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Displaying Search Driver
 */
exports.admReviewDriver = function (req,res) {
	ejs.renderFile('./views/admReviewDriver.ejs',{driver:" ",message:" "}, function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Displaying Search Customer
 */
exports.admReviewCustomer = function (req,res) {
	ejs.renderFile('./views/admReviewCustomer.ejs',{customer:" ",message:" "}, function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};

/**
 * Displaying Graph Front page
 */
exports.admGraphPg = function (req,res) {
	ejs.renderFile('./views/FrontPageAdmin.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};

/**
 * Displaying again admin page from Graph
 */
exports.admGraphBack = function (req,res) {
	ejs.renderFile('./views/adminHP.ejs', function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Displaying Revenue per day
 */
exports.admRevenuePDay = function (req,res) {
	ejs.renderFile('./views/admDayRevenue.ejs',{locRSum: " ", locAmount:[],message:" "}, function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * Displaying Revenue per location
 */
exports.admRevenuePLoc = function (req,res) {
	ejs.renderFile('./views/admLocRevenue.ejs',{message:" ",locRSum: " ", locAmount:[]}, function(err, result) {

		if (!err) {
			res.end(result);
		}

		else { 
			res.end('An error occurred');
			console.log(err);
		}
	});
};
/**
 * function Revenue per day
 */
exports.dayRevenueFunc = function (req,res) {
	var data = [];
	var enteredDay = req.param("dayRevenue");	
	console.log("enterred day:"+ enteredDay);
	pool.getConnection(function(err,connection){
		
		 if (err) {
	          connection.release();
	          res.json({"statusCode" : 100, "status" : "Error in connection database"});
	          return;
	        }  
	        connection.query("select Ride_ID,Source_Add, Destination_Add,R_Amount " +
	        		" from ride_history " +
	        		" where R_Drop like '"+ enteredDay + "%' " +
	        		" and R_Status=1 ",function(err,rows) {
	        	if(err) {
	        		throw err;
	        	}
	        	if(rows.length ===0) {

	    		connection.release();
	    		json_responses = {"statusCode" : 300};
	    		res.render("admDayRevenue",{message:"No revenue for this day",locRSum: " ", locAmount:[]});
	    	}
	        	else{
	        		var locRSum =0;
	        		for(i=0;i<rows.length;i++) {
	            		var json_responses = {"statusCode" : 200,
	                			"rideID": rows[i].Ride_ID,
	                			"source" : rows[i].Source_Add,
	                			"destination": rows[i].Destination_Add,
	                			"amount":rows[i].R_Amount
	                			};
	            		var locRSum = locRSum + rows[i].R_Amount;
	            		
	            		
	            	            		data.push(json_responses);
	    

	        		}
	        	    
	        		
	        		        				res.render("admDayRevenue",{message:" ",locRSum:locRSum,locAmount:data});
	        
	        		        				
	        	}
	        });
	      
		});
	};



/**
 * function Revenue per location
 */
exports.locRevenueFunc = function (req,res) {
	var data = [];
	var enteredLoc = req.param("locRevenue");	
	console.log("enterred location:"+ enteredLoc);
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Ride_ID,Source_Add, Destination_Add,R_Amount " +
        		" from ride_history " +
        		" where Destination_Add like '"+ enteredLoc + "%' " +
        		" and R_Status=1 ",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	if(rows.length ===0) {

    		connection.release();
    		json_responses = {"statusCode" : 300};
    		res.render("admLocRevenue",{message:"No revenue for this location",locRSum: " ", locAmount:[]});
    	}
        	else{
        		var locRSum =0;
        		for(i=0;i<rows.length;i++) {
            		var json_responses = {"statusCode" : 200,
                			"rideID": rows[i].Ride_ID,
                			"source" : rows[i].Source_Add,
                			"destination": rows[i].Destination_Add,
                			"amount":rows[i].R_Amount
                			};
            		var locRSum = locRSum + rows[i].R_Amount;
            		
            		
            	            		data.push(json_responses);
    

        		}
        	    
        		
        		        				res.render("admLocRevenue",{message:" ",locRSum:locRSum,locAmount:data});
        
        		        				
        	}
        });
      
	});
};
/**
 * function search Driver
 */
exports.searchDriverFunc = function (req,res) {
	var data = [];
	var enteredId = req.param("searchDriver");	
	console.log("enterred driver id:"+ enteredId);
	//var driver=require('driver');
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select * from driver where Driver_ID = '"+ enteredId + "'",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	if(rows.length ===0) {

        		connection.release();
        		json_responses = {"statusCode" : 300};
        		res.render("admReviewDriver",{driver:json_responses,message:"No match Found "});
        	}
        	else{
        	//for(i=0;i<rows.length;i++) {
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
        		//data.push(json_responses);
        		
        	//}
        	}

			res.render("admReviewDriver",{driver:json_responses,message:" "});
			
        });
	});
};
/**
 * function search Customer
 */
exports.searchCustomerFunc = function (req,res) {
	var data = [];
	var enteredId = req.param("searchCustomer");	
	console.log("enterred customer id:"+ enteredId);
	//var driver=require('driver');
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select * from customer where Customer_ID = '"+ enteredId + "'",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	if(rows.length ===0) {

        		connection.release();
        		json_responses = {"statusCode" : 300};
        		res.render("admReviewCustomer",{customer:json_responses,message:"No match Found "});
        	}
        	else{
        	//for(i=0;i<rows.length;i++) {
        		var json_responses = {"statusCode" : 200,
            			"firstname" : rows[0].C_Firstname,
            			"lastname" : rows[0].C_Lastname,
            			"address" : rows[0].C_Address,
            			"city" : rows[0].C_City,
            			"state" : rows[0].C_State,
            			"zipcode" : rows[0].C_ZipCode,
            			"contact": rows[0].C_Phone,
            			"email": rows[0].C_Email,
            			"cardnumber" : rows[0].C_Credit_Card_No,
            			"cardcvv" : rows[0].C_Credit_Card_CVV,
            			"cardexpiry" : rows[0].C_Credit_Card_EXP,
            			"cardzip" : rows[0].C_Credit_Card_ZIP,
            			"password" : rows[0].C_Password,
            			"rating": rows[0].C_Avg_Rating,
            	};
        		//data.push(json_responses);
        		
        	//}
        	}

			res.render("admReviewCustomer",{customer:json_responses,message:" "});
			
        });
	});
};

/**
 * function search bill
 */
exports.searchBillFunc = function (req,res) {
	var data = [];
	var enteredId = req.param("searchBill");	
	console.log("enterred bill id:"+ enteredId);
	//var driver=require('driver');
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 

        connection.query("select * from ride_history where Ride_ID = '"+ enteredId + "'and R_Status=1",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	if(rows.length ===0) {

        		connection.release();
        		json_responses = {"statusCode" : 300};
        		res.render("admSearchBill",{bill:" ", message:" No match found"});
        	}
        	else{
        	
var customerId = rows[0].Customer_ID;
var driverId = rows[0].Driver_ID;
var customerFirst;
var driverFirst;
var res;
        		connection.query("select C_Firstname,C_Lastname from customer where Customer_ID = ?",[customerId],function(err,custname) {
        			customerFirst = custname[0].C_Firstname + " " + custname[0].C_Lastname;
        			console.log("customername:"+ customerFirst);
        			connection.query("select D_Firstname,D_Lastname from driver where Driver_ID = ?",[driverId],function(err,drivname) {
        			driverFirst = drivname[0].D_Firstname + " " + drivname[0].D_Lastname;
        			console.log("customername:"+ driverFirst);
        			var str = (rows[0].Ride_ID).toString();
        			if(str.length === 9) {
        				res = str.substring(0,3)+"-"+str.substring(3,6)+"-"+str.substring(6,9);
        			}
        			else {
        				res = str;
        			}
        			
               		var json_responses = {"statusCode" : 200,
                			"rideId" : res,
                			"distance" : rows[0].R_Distance,
                			"amount" : rows[0].R_Amount,
                			"source" : rows[0].Source_Add,
                			"destination" : rows[0].Destination_Add,
                			"pickup" : rows[0].R_Pickup,
                			"drop" : rows[0].R_Drop,
                			"customer" : customerFirst,
                			"driver": driverFirst,
                			"dRating": rows[0].D_Rating,
                			"cRating" : rows[0].C_Rating
          
                	};
               		res.render("admSearchBill",{bill:json_responses,message:"Match found"});
        		});
        	
        		});
            	
        		
       
        	}
        	
		
			
        });
	});
};

exports.adminLogout = function (req,res) {
	res.render('index');
};
