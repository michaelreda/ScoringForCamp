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
    ControllerFunction.$inject = ['logger','$scope'];

    /* @ngInject */
    function ControllerFunction(logger,$scope) {

        $scope.onSuccess = function(data) {
            console.log("success: " +data);
        };
        $scope.onError = function(error) {
            console.log("error: "+error);
        };
        $scope.onVideoError = function(error) {
            console.log(error);
        };

        activate();

        function activate() {
            logger.log('Activated Quick Start View');
        }
    }

})();
