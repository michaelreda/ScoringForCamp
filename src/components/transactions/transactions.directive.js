(function () {

    'use strict';

    angular.module('app.transactions')
        .directive('tmplTransactions', directiveFunction)
        .controller('TransactionsController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'components/transactions/transactions.html',
            scope: {
            },
            controller: 'TransactionsController',
            controllerAs: 'vm'
        };

        return directive;
    }


    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['logger','$scope','$stateParams'];

    /* @ngInject */
    function ControllerFunction(logger,$scope,$stateParams) {
        $scope.ID = $stateParams.ID; 
    }

})();
