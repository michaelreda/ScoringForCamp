(function () {

    'use strict';

    angular.module('app.home')
        .directive('tmplHome', directiveFunction)
        .controller('HomeController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/home/home.html',
            scope: {
            },
            controller: 'HomeController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['logger','$scope','$window'];

    /* @ngInject */
    function ControllerFunction(logger,$scope,$window) {
        $scope.ID="3";
        console.log($window.outerHeight);
        $scope.window_width= $window.innerWidth;
        $scope.window_height= $window.outerWidth;
        activate();

        function activate() {
            logger.log('Activated Home View');
        }
    }

})();
