/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('myrequestsendserviceCtrl',[])
  .controller('myrequestsendserviceCtrl',['$scope','$rootScope','$ionicHistory','$timeout', '$ionicLoading',
    function($scope, $rootScope,$ionicHistory,$timeout,$ionicLoading) {
      /*私有变量*/

      /*ui数据*/
      /*数据源*/
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/

      /*业务事件*/

      /*跳转*/
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
