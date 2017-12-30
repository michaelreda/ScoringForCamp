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
    ControllerFunction.$inject = ['logger','$scope','$stateParams','$http'];

    /* @ngInject */
    function ControllerFunction(logger,$scope,$stateParams,$http) {
        $scope.ID = $stateParams.ID; 

        $http.get("http://localhost:5000/get_transactions/3").then(function(response){
            console.log(response.data);
        });
    }

})();
