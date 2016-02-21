var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit:100,
	host:'localhost',
	user: 'root',
	password: 'shilpa',
	database: 'UBER',
	debug: false
});

exports.renderRidesPerAreaGraph = function (req,res) {
	res.render("RidesPerArea");
};

exports.getRidesPerAreaStatistics = function (req,res) {
	var labels = [];
	var data = [];
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Destination_Add ,sum(IF(R_Status=1,1,0)) AS 'RidesInLocation' from ride_history GROUP BY Destination_Add",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (var i=0;i<rows.length;i++) {
        		labels.push(rows[i].Destination_Add);
        		data.push(rows[i].RidesInLocation);
        	}	
        	var json_responses = {"statusCode" : 200,
        			"Destinations":labels,
        			"TotalRides":data
        	};
			res.send(json_responses);
        });
	});
};

exports.renderRevenuePerDayGraph = function (req,res) {
	res.render("RevenuePerDay");
};

exports.getRevenuePerDayStatistics = function (req,res) {
	var labels = [];
	var data = [];
	
	var date = req.param("userdate");
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Ride_ID, R_Amount from ride_history where R_Drop like '%"+date+"%' and R_Status=1",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (var i=0;i<rows.length;i++) {
        		labels.push(rows[i].Ride_ID);
        		data.push(rows[i].R_Amount);
        	}	
        	var json_responses = {"statusCode" : 200,
        			"RideID":labels,
        			"R_Amount":data
        	};
        	//console.log(json_responses);
			res.send(json_responses);
        });
	});
};





exports.renderRevenuePerAreaGraph = function (req,res) {
	res.render("RevenuePerArea");
};


exports.getRevenuePerAreaStatistics = function (req,res) {
	var labels = [];
	var data = [];
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Destination_Add, SUM(R_Amount) as 'Revenue' from ride_history where R_Status=1 group by Destination_Add",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (var i=0;i<rows.length;i++) {
        		labels.push(rows[i].Destination_Add);
        		data.push(rows[i].Revenue);
        	}	
        	var json_responses = {"statusCode" : 200,
        			"Destinations":labels,
        			"TotalRevenue":data
        	};
        	//console.log(json_responses);
			res.send(json_responses);
        });
	});
};



exports.renderRidesPerDriverGraph = function (req,res) {
	res.render("RidesPerDriver");
};

exports.getRidesPerDriverStatistics = function (req,res) {
	
	var labels = [];
	var subArr = [];
	var mainArr = [];
	var dataArr = [];
	var json_responses = {};
	var i,j,k;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Destination_Add from ride_history GROUP BY Destination_Add",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (i=0;i<rows.length;i++) {
        		labels.push(rows[i].Destination_Add);
        	}
        	connection.query("select Driver_ID,Destination_Add ,sum(IF(R_Status=1,1,0)) AS 'RidesInLocation' from ride_history GROUP BY Driver_ID,Destination_Add",function(err,drivers) {
        		if(drivers.length !== 0) {
        			subArr = [{"Dest":drivers[0].Destination_Add,"Rides":drivers[0].RidesInLocation}];
        			for(i=1;i<drivers.length;i++) {
            			if(drivers[i].Driver_ID === drivers[i-1].Driver_ID) {
            				subArr.push({"Dest":drivers[i].Destination_Add,"Rides":drivers[i].RidesInLocation});
            			}
            			else {
            				mainArr.push(subArr);
            				subArr = [{"Dest":drivers[i].Destination_Add,"Rides":drivers[i].RidesInLocation}];
            			}
            		}
        			mainArr.push(subArr);
        		}
        		
        		for(i=0;i<mainArr.length;i++) {
        		 var data = [];
				    for (var ctr=0;ctr<labels.length;ctr++) {
        				data[ctr] = 0;
        	    	}
        			for(k=0;k<mainArr[i].length;k++) {
        				for (j=0;j<labels.length;j++) {
        					if(mainArr[i][k].Dest === labels[j]) {
        						data[j] = mainArr[i][k].Rides;
        					}	
        				}
        			}
        			dataArr.push(data);
        		}
        		//console.log(mainArr);
        		//console.log(dataArr);
        		json_responses = {"statusCode" : 200,
            			"Destinations":labels,
            			"TotalRides": dataArr
            	};
    			//console.log(json_responses);
    			res.send(json_responses);
        		
        	});
        });
	});
};

exports.renderRidesPerCustomerGraph = function (req,res) {
	res.render("RidesPerCustomer");
};

exports.getRidesPerCustomerStatistics = function (req,res) {
	
	var labels = [];
	var subArr = [];
	var mainArr = [];
	var dataArr = [];
	var json_responses = {};
	var i,j,k;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Destination_Add from ride_history GROUP BY Destination_Add",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (i=0;i<rows.length;i++) {
        		labels.push(rows[i].Destination_Add);
        	}
        	connection.query("select Customer_ID,Destination_Add ,sum(IF(R_Status=1,1,0)) AS 'RidesInLocation' from ride_history GROUP BY Customer_ID,Destination_Add",function(err,customers) {
        		if(customers.length !== 0) {
        			subArr = [{"Dest":customers[0].Destination_Add,"Rides":customers[0].RidesInLocation}];
        			for(i=1;i<customers.length;i++) {
            			if(customers[i].Driver_ID === customers[i-1].Driver_ID) {
            				subArr.push({"Dest":customers[i].Destination_Add,"Rides":customers[i].RidesInLocation});
            			}
            			else {
            				mainArr.push(subArr);
            				subArr = [{"Dest":customers[i].Destination_Add,"Rides":customers[i].RidesInLocation}];
            			}
            		}
        			mainArr.push(subArr);
        		}
        		
        		for(i=0;i<mainArr.length;i++) {
        		 var data = [];
				    for (var ctr=0;ctr<labels.length;ctr++) {
        				data[ctr] = 0;
        	    	}
        			for(k=0;k<mainArr[i].length;k++) {
        				for (j=0;j<labels.length;j++) {
        					if(mainArr[i][k].Dest === labels[j]) {
        						data[j] = mainArr[i][k].Rides;
        					}	
        				}
        			}
        			dataArr.push(data);
        		}
        		//console.log(mainArr);
        		//console.log(dataArr);
        		json_responses = {"statusCode" : 200,
            			"Destinations":labels,
            			"TotalRides": dataArr
            	};
    			console.log(json_responses);
    			res.send(json_responses);
        		
        	});
        });
	});
};





/*exports.getRidesPerDriverStatistics = function (req,res) {
	console.log("I am here in getRidesPerDriverStats");
	var data =[];
	var labels = [];
	var data_arr= {};
	var json_responses = {};
	var i,ctr;
	pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"statusCode" : 100, "status" : "Error in connection database"});
          return;
        }  
        connection.query("select Destination_Add from ride_history GROUP BY Destination_Add",function(err,rows) {
        	if(err) {
        		throw err;
        	}
        	
        	for (i=0;i<rows.length;i++) {
        		labels.push(rows[i].Destination_Add);
        	}
        	connection.query("select Driver_ID from driver",function(err,drivers) {
        		if(err) {
        			throw err;
        		}	
        		    for (i=0; i<drivers.length; i++) {
        		    	
            				for (var q=0; q<labels.length;q++) {
                				data[q] = 0;
                			}
            				data_arr[drivers[i].Driver_ID] = data;
            				ctr = i;
            				connection.query("select Driver_ID,Destination_Add,sum(IF(R_Status=1,1,0)) AS 'RidesInLocation' from ride_history where Driver_ID=? GROUP BY Destination_Add",[drivers[i].Driver_ID],function(err,locstats) {	
            				for (var k=0;k<locstats.length;k++) {
            					for (var j=0; j<labels.length;j++) {
            						if(locstats[k].Destination_Add === labels[j]) {
            							data_arr[drivers[ctr].Driver_ID][j] = locstats[k].RidesInLocation; 
            							break;
            						}
            					}
            				}
            				ctr ++;
            				//data_arr[i]=data;
            				console.log("-->",data_arr);
                			json_responses = {"statusCode" : 200,
                        			"Destinations":labels,
                        			"TotalRides":data_arr
                        	};
                			console.log(json_responses);
                			res.send(json_responses);
            			});
        		    }
        	});
        });
	});
};*/