/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('aboutCtrl',[])
  .controller('aboutCtrl',['$scope','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup',
    function($scope, $stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup) {

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
          if($scope.form.backkilometers==""){
            showMessage('请输入回厂里程数',$ionicPopup);
            return;
          }

          loadingShow('提交中...',$ionicLoading);


        }catch(ex){
          hiddenLoading($ionicLoading);
        }
      };
      /*跳转*/
      $scope.gotoComment=function () {
        if(isAndroid){
          window.location.href=urlforandroidComment;
        }else{
          window.location.href=urlforiosComment;
        }
      };

      $scope.gotoHelp=function () {
        var helpdiv = document.getElementById("helpWebview");
        helpdiv.style.display="block";
        helpdiv.style.height = (window.screen.availHeight - 49) +"px";
      };

      /*back*/
      $scope.goback=function () {
        var helpdiv = document.getElementById("helpWebview");
        if(helpdiv.style.display=="block"){
          helpdiv.style.display = "none";
          helpdiv.style.height = "0px";
        }else{
          $ionicHistory.goBack();
        }
      };
    }]);
