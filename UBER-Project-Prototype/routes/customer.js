var ejs = require("ejs");
var mysql = require('./mysql');
var app = require('../app');
var bcrypt = require('bcrypt-nodejs');
//var pool=require('./mysqlpool');
//var session = require('client-sessions');

exports.customerSignUpForm = function(req, res){
	var newCustomer= " INSERT INTO uber.Customer (`C_Firstname`, `C_Lastname`, `C_Address`, `C_City`, `C_State`, `C_ZipCode`, `C_Phone`, `C_Email`, `C_Password`) VALUES ('"+req.param("C_Firstname")+"', '" + req.param("C_Lastname") +"' , '" + req.param("C_Address") +"' , '" + req.param("C_City") +"', '" + req.param("C_State") +"' , '" + req.param("C_ZipCode") +"'  , '" + req.param("C_Phone") +"' , '" + req.param("C_Email") +"' , '" + bcrypt.hashSync(req.param("C_Password"),null,null) +"');";
		
	
	
	console.log("Query is:"+newCustomer);

	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		} else {
		
			res.redirect('/');
			
		}

	},newCustomer);

	};

//Loading Existing Rides  for the Customer
exports.customerHistory = function(req,res){
		console.log("I will load History page");
		res.render('customerRidesHistory');

}

//Customer Billing and Ride History

exports.customerRideHistory = function(req, res){
	
	var Customer_ID = req.session.username;
	//Customer_ID = "3";
	console.log(Customer_ID);
	var customerBillHistory =  " select * from UBER.Ride_History natural join UBER.Driver natural join UBER.Customer where Customer_ID = '"+Customer_ID+"'; ";
		
		console.log("Query is:"+customerBillHistory);

		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			} else {
			
				console.log("sending result back to the controller");
				console.log(results);
				res.send(results);

			}

		},customerBillHistory);

		};