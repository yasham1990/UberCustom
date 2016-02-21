angular
  .module('myMap')
  .controller('pollsCtrl', function ($scope, $timeout, $mdSidenav, $log, $http, $compile) {
	  

    	

   
    	
    	// This function will load all the poll questions
    	
    	$http.get('/driver/RidesHistory').success(function(response){
    		$scope.rides=response;
    		console.log(response);
    	});
    
    	$http.get('/polls/:name').success(function(response){
    		console.log("Free load");
    		$scope.answer=response;
    		console.log(response);
    	});
    	
    	
    
    	// Polls Sidenav Function
    	$scope.polls = function(){
        	console.log("Confirmed into polls controller!");
    		$http.get('/polls').success(function(response){
    			window.location = '/pollsPageLoad';
    			//$scope.question=response;
        		//console.log(response);
        	});
        }
    	
    	
    	//This function will fetch poll details
    	$scope.polldetail = function(poll_Id){
    		console.log("in controller " + poll_Id);
    		$http.post('/pollDetails',{poll_Id:poll_Id, id:5}).success(function(response){
    			console.log(response);
    			$scope.pollResponses = response;
    		});
    	}
    	
    	
    	
    	//This function will display the form to add new poll response
    	$scope.pollResp = false;
    	$scope.pollResponse = function(){
        	console.log("Allowing to respond to this poll");
    		$http.get('/polls').success(function(response){
    			$scope.pollResp=true;
        		
        	});
        }
    	
    	
    		
    	//Load Distinct Poll Choices 
    	$scope.pollChoice = function(poll_Id){
    		$scope.pollResp=false;
    		console.log("in controller " + poll_Id);
        	console.log("Allowing to choose options");
        	$http.post('/pollAnswers',{poll_Id:poll_Id, id:5}).success(function(responses){
    			console.log(responses);
    			$scope.pollAnswers = responses;
    			$scope.pollResp=true;
    		});
        }
    	
    	
    	//Select Poll Opinion    	
$scope.responseSubmit = function(){
    		
    		console.log("in controller  "  + "and response " + $scope.pollAnswers.response) ;
        	console.log("Poll option selected");
        	$http.post('/pollAnswerSelect',{response:$scope.pollAnswers.response, id:5}).success(function(responses){
    			console.log(responses);
    			$scope.pollSelect = responses;
    			$scope.pollResp=false;
    			
    		});
        }
    	
    	
    	
    
    
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug("close LEFT is done");
        });

    };
  })
  
  
  
  
  
  