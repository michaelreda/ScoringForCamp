(function () {

    'use strict';

    angular.module('app.scan')
        .directive('tmplScan', directiveFunction)
        .controller('ScanController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/scan/scan.html',
            scope: {
            },
            controller: 'ScanController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['logger', '$scope', '$http','$document','$window','$mdToast'];

    /* @ngInject */
    function ControllerFunction(logger, $scope, $http,$document,$window,$mdToast) {
        $scope.scanned_today = [];
        $scope.QR_scanner_visible=true;
        $scope.start_turning=false;
        $scope.add_points="";
        var beep_sound = new Audio('src/beep.mp3');
        
        var turnTableisVisible=false;

        $scope.teams=[];
        $http.get($window.localStorage.getItem("base_url")+"/get_teams").then(function (response) {
            $scope.teams = response.data;
        });


        $scope.onSuccess = function (Type) {
            if(turnTableisVisible)
                return;
            console.log("success: " + Type);
            turnTableisVisible=true
            beep_sound.play();
            show_turnTable(Type);
            
        };
        $scope.onError = function (error) {
            //console.log("error: "+error);
        };
        $scope.onVideoError = function (error) {
            console.log(error);
        };

        

        function show_turnTable(Type) {
            $scope.start_turning=false;
            $scope.QR_scanner_visible=false;
           var turntable_options= {
                size: 520,
                textSpace: 20,
                values: [
                    {
                        id: 1,
                        name: '1',
                        bg: '#80ffc2',
                        fill: '#000'
                    }, {
                        id: 2, 
                        name: 'ha33',
                        bg: '#fdb672', 
                        fill: '#000' 
                    }, {
                        id: 3, 
                        name: '一等奖', 
                        bg: '#ff8986',
                        fill: '#000'
                    }, {
                        id: 4, 
                        name: '一等奖',
                        bg: '#ec81e1', 
                        fill: '#000' 
                    }, {
                        id: 5, 
                        name: '一等奖',
                        bg: '#FFEB3B', 
                        fill: '#000' 
                    }
                ]
            }

            

            for(var i=0;i<5;i++){
                switch(Type){
                    case 'silver': turntable_options.values[i].name=turntable_options.values[i].id=i+1;break;
                    case 'golden': turntable_options.values[i].name=turntable_options.values[i].id=i+6;break;
                    case 'platinum': turntable_options.values[i].name=turntable_options.values[i].id=i+11;break;
                }
            }

            var turntable = new Turntable(turntable_options);
            // console.log(turntable_options);
            // console.log(turntable);
            turntable.draw(document.getElementById('turntable'));

            $document.bind("keypress", function(event) {
                if(event.key != "Enter" || $scope.QR_scanner_visible == true)
                    return;
                console.log($scope.start_turning);    
                $scope.start_turning = !$scope.start_turning;
                   
                if($scope.start_turning){
                    $scope.start();
                }else{
                    $scope.stop();
                }
            });

            

            $scope.start = function () { turntable.start(); }
            $scope.stop = function () {
                var random_stop;
                switch(Type){
                    case 'silver': random_stop= Math.floor(Math.random()*5+1);break;
                    case 'golden': random_stop= Math.floor(Math.random()*5+6);break;
                    case 'platinum': random_stop= Math.floor(Math.random()*5+11);break;
                }
                console.log(random_stop);
                turntable.stop(random_stop, function (data) {
                    console.log(data); 
                    $scope.add_points= data.id;
                    
                });
            }

        }


        $scope.add_points_to_team = function(points,team_id){
            if(team_id == undefined || points == ""){
                $mdToast.show(
                    $mdToast.simple()
                      .textContent("points or team is missing")
                      .hideDelay(5000)
                  );
                  return;
            }

            $http.post($window.localStorage.getItem("base_url")+"/add_points",{"points":points,"team_id":team_id}).then(function (response) {
               // console.log(response.data);
                $mdToast.show(
                    $mdToast.simple()
                      .textContent(response.data)
                      .hideDelay(5000)
                  );
                if(response.date != "Error occurred try again!"){
                    $scope.add_points="";
                    $scope.QR_scanner_visible=true;
                    turnTableisVisible=false;
                    angular.element( document.querySelector( '#turntable' ) ).empty();
                }
               
            });
        }


         show_turnTable("platinum");
       



    }

})();
