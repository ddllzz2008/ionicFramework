/**
 * Created by ddllzz on 16/9/21.
 */
angular.module('tabCtrl', ['ngCordova'])
  .controller('tabCtrl', function ($scope,$cordovaFile,commonService) {

    $scope.item = {tab0visible:false,tab1visible:true,tab2visible:true,tab3visible:true,tab4visible:true};

    $scope.$on('$ionicView.beforeEnter', function() {

      // if(isDebugMode){
      //   $scope.item.tab1visible=false;
      //   $scope.item.tab2visible=false;
      //   $scope.item.tab3visible=false;
      //   $scope.item.tab4visible=false;
      //   return;
      // }

      commonService.getCurrentUser(function (userinfo) {
        try {
          if(userinfo!=undefined&&userinfo!=null){
            if(userinfo.IsDriver==1){
              $scope.item.tab0visible=true;
              $scope.item.tab1visible=true;
              $scope.item.tab2visible=true;
              $scope.item.tab3visible=false;
              $scope.item.tab4visible=true;
            }
            if(userinfo.IsAuditor==1){
              $scope.item.tab0visible=false;
              $scope.item.tab1visible=false;
              $scope.item.tab2visible=true;
              $scope.item.tab3visible=true;
              $scope.item.tab4visible=true;
            }
            if(userinfo.IsDispatcher==1){
              $scope.item.tab0visible=false;
              $scope.item.tab1visible=true;
              $scope.item.tab2visible=true;
              $scope.item.tab3visible=true;
              $scope.item.tab4visible=false;
            }
            if(userinfo.IsSuperAdmin==1){
              $scope.item.tab0visible=false;
              $scope.item.tab1visible=false;
              $scope.item.tab2visible=true;
              $scope.item.tab3visible=false;
              $scope.item.tab4visible=false;
            }
            if(userinfo.IsDriver==0&&userinfo.IsAuditor==0&&userinfo.IsDispatcher==0&&userinfo.IsSuperAdmin==0){
              $scope.item.tab0visible=false;
              $scope.item.tab1visible=true;
              $scope.item.tab2visible=true;
              $scope.item.tab3visible=true;
              $scope.item.tab4visible=true;
            }
          }
        }catch(ex){

        }
      });
    });

    $scope.$on('$ionicView.enter',function () {

    });

  });
