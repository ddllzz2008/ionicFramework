/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('feedbackCtrl',[])
  .factory('feedbackFactory',function ($http,$ionicPopup,$state,$ionicLoading,$cordovaFile) {

    var factory = {};

    factory.sendFeedback=function (content,success,error) {
      readFile(dbplatformInfo, function (data) {
        try {

          var postData = JSON.parse(data);

          var sendData = new Object();
          sendData.UserInfo = postData;
          sendData.Content = content;

          $http.post(createService("api/Order/UserFeedback"), sendData)
            .success(function (audits) {
                success(audits.Message);
            })
            .error(function (data) {
              error(errormessage);
              createAndWriteFile(errorInfo, data.toString(), $cordovaFile);
            });

        } catch (ex) {
          error(errormessage);
          createAndWriteFile(errorInfo, ex.toString(), $cordovaFile);
        }
      }, $cordovaFile);
    };

    return factory;

  })
  .controller('feedbackCtrl',['$scope','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup','feedbackFactory',
    function($scope, $stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup,feedbackFactory) {

      /*私有变量*/
      /*ui数据*/
      $scope.form = {remark:""};
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
      $scope.saveFeedback=function () {
        try{
          if($scope.form.remark==""){
            showMessage('请写点什么吧',$ionicPopup);
            return;
          }

          loadingShow('提交中...',$ionicLoading);

          feedbackFactory.sendFeedback($scope.form.remark,function (result) {
            try{
              showAutoHidden(result,$ionicLoading);
              $ionicHistory.clearCache();
              $ionicHistory.goBack();
            }catch(ex){
              hiddenLoading($ionicLoading);
              showAutoHidden(errornetwork,$ionicLoading);
            }
          },function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error,$ionicLoading);
          });

        }catch(ex){
          hiddenLoading($ionicLoading);
        }
      };
      /*跳转*/
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
