/**
 * Created by ddllzz on 16/8/30.
 */
/**
 * Created by ddllzz on 16/8/29.
 */

angular.module('mainchartdetailCtrl',[])
  .controller('mainchartdetailCtrl',['$scope','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup','myfeeFactory',
    function($scope, $stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup,myfeeFactory) {

      /*私有变量*/

      /*ui数据*/
      
      /*数据源*/
      $scope.items = new Array();
      $scope.startDate = "";
      $scope.endDate="";
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        try{
          $common_ionicLoading = $ionicLoading;

          loadingShow('数据加载中...',$ionicLoading);

          var applyTpe = $stateParams.id;
          var time = $stateParams.time;

          var lowDate = null;
          var currentDate = new Date();

          if(time==1){
            lowDate = currentDate.DateAdd('d',-7);
          }else if(time==2){
            lowDate = currentDate.DateAdd('m',-1);
          }else if(time==3){
            lowDate = currentDate.DateAdd('m',-3);
          }

          if(lowDate!=null){
            $scope.startDate = lowDate.Format('MM月dd日');
            $scope.endDate = currentDate.Format('MM月dd日');

            myfeeFactory.loadFees(function (fees) {
              try{
                $scope.items = myfeeFactory.filterSource(parseInt(applyTpe),parseInt(time),fees);
                hiddenLoading($ionicLoading);
              }catch(ex){
                hiddenLoading($ionicLoading);
              }
            });
          }
        }catch(ex){
          hiddenLoading($ionicLoading);
        }

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
