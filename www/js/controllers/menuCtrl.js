/**
 * Created by ddllzz on 16/8/31.
 */
angular.module('menuCtrl', ['ngCordova'])
  .controller('menuCtrl', function ($scope, $state,$ionicHistory,$ionicSideMenuDelegate,$ionicPopup,$cordovaFile,commonService) {
    $scope.dbUserInfo = {"user":"","synctime":""};

    /*生命周期*/
    $scope.$on('$ionicView.beforeEnter', function() {

      commonService.getCurrentUser(function (current) {
        try{
          $scope.dbUserInfo.user = current.Name;
        }catch(ex){

        }
      });

      readFile(staticLastUpdateTime,function (result) {
        try{
          $scope.dbUserInfo.synctime = currentUpdateTime;
        }catch(ex){

        }
      },$cordovaFile);
    });

    $scope.gotoPwd=function () {
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go("modifypwd");
    };

    $scope.backComment=function () {
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go("feedback");
    };

    $scope.aboutHelp=function () {
      $ionicSideMenuDelegate.toggleLeft(false);
      $state.go("about");
    };

    $scope.logout=function () {
      $ionicSideMenuDelegate.toggleLeft(false);
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache().then(function(){
        //do something
      });
      deleteFile(dbplatformInfo,$cordovaFile);
      deleteFile(dbUserInfo,$cordovaFile);
      deleteFile(dbStaticData,$cordovaFile);
      deleteFile(dbStaticDataTime,$cordovaFile);
      deleteFile(dbMyOrders,$cordovaFile);
      deleteFile(dbMyOrdersTime,$cordovaFile);
      deleteFile(dbMyFees,$cordovaFile);
      deleteFile(dbMyFeesTime,$cordovaFile);
      deleteFile(dbMyAudits,$cordovaFile);
      deleteFile(dbMyAuditsTime,$cordovaFile);
      deleteFile(dbMyDispatches,$cordovaFile);
      deleteFile(dbMyDriverReals,$cordovaFile);
      deleteFile(dbMyDriverRealsTime,$cordovaFile);
      deleteFile(dbMyVehicleReals,$cordovaFile);
      deleteFile(dbMyVehicleRealsTime,$cordovaFile);
      deleteFile(dbMyDispatchesTime,$cordovaFile);
      deleteFile(dbMyReturnComfirms,$cordovaFile);
      deleteFile(dbMyReturnComfirmsTime,$cordovaFile);
      deleteFile(dbMyTasks,$cordovaFile);
      deleteFile(dbMyTasksTime,$cordovaFile);
      deleteFile(dbMyReturnComfirms,$cordovaFile);
      deleteFile(dbMyReturnComfirms,$cordovaFile);
      $state.go('login');
    }

  });
