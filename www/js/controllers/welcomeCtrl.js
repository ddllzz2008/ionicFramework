/**
 * Created by ddllzz on 16/9/30.
 */
angular.module('welcomeCtrl', ['ngCordova'])
  .controller('welcomeCtrl',['$scope', '$state','$cordovaFile','$ionicLoading','$http',
    function ($scope, $state,$cordovaFile,$ionicLoading,$http) {

      $scope.$on('$ionicView.beforeEnter', function() {

      });

      $scope.$on('$ionicView.loaded', function() {
        readFile(staticWelcomeConfig,function (success) {
          $state.go("login");
        },$cordovaFile);
      });

      $scope.autoLogin=function () {

        loadingShow('',$ionicLoading);
        createAndWriteFile(staticWelcomeConfig,"true",$cordovaFile);
        readFile(dbplatformInfo,function (result) {
          try{
            if(result!=""&&result!=undefined){
              var postData = JSON.parse(result);
              $http.post(createService("api/account/login"),postData)
                .success(function(response)
                {
                  try{
                    if(response!=undefined&&response!=null){
                      if(response.Code=="100"){
                        createAndWriteFile(dbplatformInfo,JSON.stringify(postData),$cordovaFile);
                        var userinfo = JSON.stringify(response.Data);
                        currentUser = response.Data;
                        createAndWriteFile(dbUserInfo,userinfo,$cordovaFile);
                        $logicHttp.downloadBasicInfo(postData);
                        $state.go("app.tab.main");

                        //记录最后时间
                        var lastLoginDate = new Date();
                        createAndWriteFile(staticLastLoginTime,lastLoginDate.Format('yyyy/MM/dd HH:mm:ss'),$cordovaFile);

                      }else{
                        $state.go("login");
                      }
                    }else{
                      $state.go("login");
                    }
                  }catch(ex){
                    $state.go("login");
                  }finally{
                    hiddenLoading($ionicLoading);
                  }
                })
                .error(function (data) {
                  try{
                    $state.go("login");
                  }catch (ex){
                    $state.go("login");
                  }finally {
                    hiddenLoading($ionicLoading);
                  }
                });
            }else{
              hiddenLoading($ionicLoading);
              $state.go("login");
            }
          }catch(ex){
            hiddenLoading($ionicLoading);
            $state.go("login");
          }
        },$cordovaFile);
      };

    }]);
