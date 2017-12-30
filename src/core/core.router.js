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

            .state('takeAttendance', {
                url: '/takeAttendance',
                template: '<tmpl-take-Attendance></tmpl-take-Attendance>'
            })

            .state('transactions', {
                url: '/transactions/:ID',
                template: '<tmpl-transactions></tmpl-transactions>'
            });
    }
})();
