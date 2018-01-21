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



        var turntable = new Turntable({
            values: [
              {
                id: 1, //奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
                name: '一等奖', //奖品名称
                img: {
                  src: 'images/kas.png', //奖品图片路径
                  width: 50, //奖品图片宽度，请根据实际情况去设置，避免太大
                  height: 50, //奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
                },
                bg: '#ccc', //该奖品的在转盘中的扇形背景颜色
                fill: '#000' //奖品名称的文字颜色
              },{
                id: 2, //奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
                name: 'ha33', //奖品名称
                img: {
                  src: 'images/kas.png', //奖品图片路径
                  width: 50, //奖品图片宽度，请根据实际情况去设置，避免太大
                  height: 50, //奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
                },
                bg: '#cca', //该奖品的在转盘中的扇形背景颜色
                fill: '#000' //奖品名称的文字颜色
              },{
                id: 3, //奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
                name: '一等奖', //奖品名称
                img: {
                  src: 'images/kas.png', //奖品图片路径
                  width: 50, //奖品图片宽度，请根据实际情况去设置，避免太大
                  height: 50, //奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
                },
                bg: '#ccf', //该奖品的在转盘中的扇形背景颜色
                fill: '#000' //奖品名称的文字颜色
              },{
                id: 4, //奖品id，可以重复（比如：谢谢参与就可以有n个，中奖后会随即选择一个转动到该位置
                name: '一等奖', //奖品名称
                img: {
                  src: 'images/kas.png', //奖品图片路径
                  width: 50, //奖品图片宽度，请根据实际情况去设置，避免太大
                  height: 50, //奖品图片高度，请根据实际情况去设置，避免太大，与宽度等比率缩放
                },
                bg: '#ccd', //该奖品的在转盘中的扇形背景颜色
                fill: '#000' //奖品名称的文字颜色
              }
            ]
          });
          turntable.draw(document.getElementById('container'));
          $scope.start =function(){ turntable.start();}
          $scope.stop= function(){
              turntable.stop(2, function(data) {
            console.log(data); //对应在values里面的礼品对象
          });
        }

    }

})();
