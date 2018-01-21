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
    ControllerFunction.$inject = ['logger', '$scope', '$window', '$http','$location','$mdToast'];

    /* @ngInject */
    function ControllerFunction(logger, $scope, $window, $http,$location, $mdToast) {
        // $scope.ID="3";
        // console.log($window.outerHeight);
        // $scope.window_width= $window.innerWidth;
        // $scope.window_height= $window.outerWidth;
        // activate();
        $window.localStorage.setItem("base_url", new $window.URL($location.absUrl()).origin);

        if ($location.absUrl().includes("localhost")) {
            $window.localStorage.setItem("base_url", "http://localhost:5000");
        }

        $scope.items = [];
        $scope.teams = [];
        $scope.processing=true;

        $http.get($window.localStorage.getItem("base_url")+"/get_items").then(function (response) {
            $scope.items = response.data;
            $scope.processing=false;
        });
        get_teams();
        function get_teams(){
            $http.get($window.localStorage.getItem("base_url")+"/get_teams").then(function (response) {
                $scope.teams = response.data;
                $scope.processing=false;
            });
         }

        $scope.team_own_this_item= function(item_id,team){
            for(var i=0;i<team.items.length;i++){
                if(team.items[i].item==item_id)
                    return true;
            }
            return false;
        }

        $scope.buy_item= function(item,team_id){
            $scope.processing=true;
            $http.post($window.localStorage.getItem("base_url")+"/add_item",{item:item,team_id:team_id}).then(function (response) {
                console.log(response.data);
                get_teams();
                $mdToast.show(
                    $mdToast.simple()
                      .textContent(response.data)
                      .hideDelay(5000)
                  );
                  return;
            });
        }

    }

})();
