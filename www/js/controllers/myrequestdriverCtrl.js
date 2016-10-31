/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('myrequestdriverCtrl',[])
  .controller('myrequestdriverCtrl',['$scope','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','myrequestFactory',
    function($scope, $stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,myrequestFactory) {
      /*私有变量*/

      /*ui数据*/
      $scope.headercss = {css1:"colSelected",css2:"colUnSelected",css3:"colUnSelected",position:"left"};
      /*数据源*/
      $scope.items = new Array();
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        var type = parseInt($stateParams.type);

        changeContentCSS(type);

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        myrequestFactory.loadDrivers(function (drivers) {
            $timeout(function() {
              $scope.items = myrequestFactory.filterDrivers(type,drivers);
            });
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/
      function changeContentCSS(selectedIndex) {
        var mainrequest_seg =angular.element(document.getElementById("myrequestdriver_seg"));
        var mainrequest_seg1 =angular.element(document.getElementById("myrequestdriver_seg1"));
        var mainrequest_seg2 =angular.element(document.getElementById("myrequestdriver_seg2"));
        var mainrequest_seg3 =angular.element(document.getElementById("myrequestdriver_seg3"));
        switch(selectedIndex){
          case 0:
            $scope.headercss = {css1:"colSelected",css2:"colUnSelected",css3:"colUnSelected",position:"left"};
            break;
          case 1:
            $scope.headercss = {css1:"colUnSelected",css2:"colSelected",css3:"colUnSelected",position:"middle"};
            break;
          case 2:
            $scope.headercss = {css1:"colUnSelected",css2:"colUnSelected",css3:"colSelected",position:"right"};
            break;
        }
      }
      /*切换列表*/
      $scope.segementChange=function (selectedIndex){
        changeContentCSS(selectedIndex);

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        myrequestFactory.loadDrivers(function (drivers) {
            $timeout(function() {
              $scope.items = myrequestFactory.filterDrivers(selectedIndex,drivers);
            });
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });
      };
      /*业务事件*/
      $scope.doRefresh=function () {
        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        myrequestFactory.loadDrivers(function (drivers) {
            $timeout(function() {
              $scope.items = myrequestFactory.filterDrivers(selectedIndex,drivers);
            });
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
          },
          function (error) {
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          },true);
      };
      /*跳转*/
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
