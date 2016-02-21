var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit:100,
	host:'localhost',
	user: 'root',
	password: 'root',
	database: 'uber',
	debug: false
});

exports.renderEditProfilePage = function (req,res) {
	res.render("EditCustomerProfile");
};

exports.renderViewProfile = function (req,res) {
	res.render("ViewCustomerProfile");
};

exports.renderCustomBookPage = function (req,res) {
	res.render("custombook");
};

exports.customBookConfirm = function (req,res) {
	
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
			res.send(json_responses);
	});
};

exports.getProfileDetails = function (req,res) {
	
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select * from customer where Customer_ID = ?",[req.session.username],function(err,rows) {
        	if(err) {
        		throw err;
        	}
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
			res.send(json_responses);
        });
	});
};

exports.updateCustomerProfile = function (req,res) {
	
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        } 
        // TO-DO : Add password also as a editable field, C_Credit_Card_EXP=?,C_Credit_Card_ZIP=?
        connection.query("update customer set C_Firstname=?,C_Lastname=?,C_Address=?,C_City=?,C_State=?,C_ZipCode=?,C_Phone=?," +
        		"C_Email=?,C_Credit_Card_No=?,C_Credit_Card_CVV=?,C_Credit_Card_EXP=?,C_Credit_Card_ZIP=?,C_Password=?" +
        		"where Customer_ID = ?",
        		[req.param("FirstName"),req.param("LastName"),req.param("Address"),req.param("City"),req.param("State"),req.param("ZipCode"),
        		 req.param("Contact"),req.param("Email"),req.param("CardNumber"),req.param("CardCVV"),req.param("CardEXP"),req.param("CardZIP"),req.param("CardPWD"),req.session.username],
        		function(err,rows) {
        			
        	if(err) {                              
        				throw err;
        			}
        			var json_responses = {"statusCode" : 200};
        			res.send(json_responses);
        });
	});
};
