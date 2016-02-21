var app = angular.module('myApp', []);
		app.controller('adminFunctions', function($scope,$route, $location, $routeParams) {
		//	alert($location.url());
			//alert("Hello");
			$scope.adminAllCustomers = function() {
							window.location = "/admCustomerList";
			}
			$scope.adminAllDrivers = function() {
				window.location = "/admDriverList";
}
			$scope.adminSearchBill = function() {
				window.location = "/admSearchBill";
}
			$scope.adminGraphs = function() {
				window.location = "/admGraphs";
}
			$scope.adminRevenueDay = function() {
				window.location = "/admRevenuePDay";
}
			$scope.adminRevenueLocation = function() {
				//debugger
				window.location = "/admRevenuePLoc";
}
			$scope.adminReviewDriver = function() {
				window.location = "/admReviewDriver";
}
			$scope.adminReviewCustomer = function() {
				window.location = "/admReviewCustomer";
		}
			

		
		});
		
	/*	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			 alert('Hi');
			  $routeProvider
			    .when('/admLocRevenue',{
			    	//alert('Hi');
			      templateUrl: '/partials/admLocRevenue.ejs',
			      controller: 'adminFunctions'
			    })
			   
			    
			  
			    }]);*/
