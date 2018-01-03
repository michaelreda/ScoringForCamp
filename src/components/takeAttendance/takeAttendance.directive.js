(function () {

    'use strict';

    angular.module('app.takeAttendance')
        .directive('tmplTakeAttendance', directiveFunction)
        .controller('TakeAttendanceController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/takeAttendance/takeAttendance.html',
            scope: {
            },
            controller: 'TakeAttendanceController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['logger', '$scope','$http'];

    /* @ngInject */
    function ControllerFunction(logger, $scope,$http) {
        $scope.scanned_today = [];
        var beep_sound = new Audio('src/beep.mp3');
        $scope.onSuccess = function (ID) {
            console.log("success: " + ID);
            beep_sound.play();
            $http.post("http://localhost:5000/add_attendance",{ID:ID}).then(function (response) {
                console.log("response data:"+response.data);
                if(response.data == "error"){
                    return;
                }else if(response.data == "attendance already entered for today!"){
                    alert(response.data);
                    return;
                }
                $scope.scanned_today.push(response.data);
            });
            
        };
        $scope.onError = function (error) {
            //console.log("error: "+error);
        };
        $scope.onVideoError = function (error) {
            console.log(error);
        };

        activate();

        function activate() {
            logger.log('Activated Quick Start View');
        }
    }

})();
