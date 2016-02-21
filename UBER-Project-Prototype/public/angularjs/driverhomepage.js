var tabsapp = angular.module('TabsApp', ['ngRoute','xeditable']);
tabsapp.controller('TabsCtrl', function ($scope,$http) {
	
	$scope.initDriverHomePage = function () {
		$http({
			method : "GET",
			url : '/getDriverHomePageDetails',             //gets only details
			output : {
			}
		}).success(function(output) {
				if (output.statusCode === 200) {
					if(output.Tab ==="nothing") {
						$scope.nothing_for_now_tab1 = true;
    					$scope.nothing_for_now_tab2 = true;
    					$scope.nothing_for_now_tab3 = true;
    					$scope.currentTab = 'one.tpl.html';
					}
					else {
						$scope.name = output.Name;					
						$scope.address = output.Address;
						$scope.contact = output.Phone;
						$scope.timenow = output.Date;
						if(output.Tab === "requested") {
							$scope.currentTab = 'one.tpl.html';
							$scope.nothing_for_now_tab1 = false;
    						$scope.nothing_for_now_tab2 = true;
    						$scope.nothing_for_now_tab3 = true;
						}
						else if(output.Tab === "cancelled") {
							$scope.currentTab = 'three.tpl.html';
							$scope.nothing_for_now_tab1 = true;
    						$scope.nothing_for_now_tab2 = true;
    						$scope.nothing_for_now_tab3 = false;
						}
						else if(output.Tab === "completed") {
							$scope.currentTab = 'two.tpl.html';
							$scope.nothing_for_now_tab1 = true;
    						$scope.nothing_for_now_tab2 = false;
    						$scope.nothing_for_now_tab3 = true;
						}
					}
				}
			}).error(function(error) {
					
			});
	};
	

    $scope.tabs = [{
            title: 'Upcoming Ride',
            url: 'one.tpl.html'
        }, {
            title: 'Ongoing or Recently Completed Ride',
            url: 'two.tpl.html'
        }, {
            title: 'Cancelled Ride',
            url: 'three.tpl.html'
    }];
    
    //$scope.currentTab = 'one.tpl.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }
    
    $scope.isActiveTab = function(tabUrl) {
        return tabUrl == $scope.currentTab;
    }
});

tabsapp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	 
	  $routeProvider
	  .when('/driver/viewProfile',{
	  	   
	      templateUrl: '/partials/ViewDriverProfile.ejs',
	      controller: 'DriverController'
	    })
	    .when('/driver/editProfile',{
	  	   
	      templateUrl: '/partials/EditDriverProfile.ejs',
	      controller: 'DriverController'
	    })
	    .when('/',{
	  	   
	      templateUrl: '/partials/DriverHomepage.ejs',
	      controller: 'TabsCtrl'
	    })
	    .otherwise({ redirectTo: "/" });
	  
	    }]);


tabsapp.run(function(editableOptions) {
	  editableOptions.theme = 'bs3';
});  


	tabsapp.controller('DriverController', function($scope,$http) {
		$scope.init = function () {
			$http({
				method : "GET",
				url : '/driver/getProfilePageDetails',             //gets only details
				data : {
				}
			}).success(function(data) {
					if (data.statusCode === 200) {
						$scope.driver = {
								FirstName: data.firstname,
								LastName: data.lastname,
								Email: data.email,
								Contact: data.contact,
								Address: data.address,
								City: data.city,
								State: data.state,
								ZipCode: data.zipcode,
								LicenseID: data.licenseid,
								CarDetails: data.cardetails,
								Password: data.password,
								Rating:data.rating
						};
					}
				}).error(function(error) {
						
				});
		};

		
		$scope.saveChangesToDB = function() {
	    	$http({
				method : "POST",
				url : '/driver/updateProfile',
				data : {
					"FirstName" : $scope.driver.FirstName,
					"LastName" : $scope.driver.LastName,
					"Email" : $scope.driver.Email,
					"Contact" : $scope.driver.Contact,
					"Address" : $scope.driver.Address,
					"City" : $scope.driver.City,
					"CarDetails" : $scope.driver.CarDetails,
					"LicenseID" : $scope.driver.LicenseID,
					"State" : $scope.driver.State,
					"ZipCode" : $scope.driver.ZipCode,
					"Password" : $scope.driver.Password,
				}
			}).success(function(data) {
					//checking the response data for statusCode
					if (data.statusCode === 200) {
						alert("Changes Saved Successfully");
						//window.location.assign("/driver/viewProfile");
					}
				}).error(function(error) {
						
				});
		};
		
		$scope.loadDriverPageForView = function() {
					    window.location.assign("/driver/viewProfile");		// calls ViewDriverProfile.ejs
		};
		
		$scope.loadDriverPageForEdit = function() {
	    			    window.location.assign("/driver/editProfile");		// calls editableform.ejs
		};
		  
	});

