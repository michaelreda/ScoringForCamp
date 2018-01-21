(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                template: '<tmpl-home></tmpl-home>'
            })

            .state('scan', {
                url: '/scan',
                template: '<tmpl-scan></tmpl-scan>'
            })

            .state('transactions', {
                url: '/transactions/:ID',
                template: '<tmpl-transactions></tmpl-transactions>'
            });
    }
})();
