/**
 * Created by ddllzz on 16/8/29.
 */
angular.module('modifypwdCtrl', [])
  .controller('modifypwdCtrl',['$scope','$rootScope', '$ionicHistory','$ionicPopup', '$timeout', '$state',  '$ionicLoading','loginFactory',
    function ($scope, $rootScope,$ionicHistory,$ionicPopup, $timeout, $state, $ionicLoading,loginFactory) {
      $scope.css_btncode="btncodeenable";

      $scope.form = {oldpassword:"",newpassword:"",repassword:""};

      /*生命周期*/
      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';
      });

      $scope.savePassword=function (){
        if($scope.form.oldpassword.trimSpace()==""){
          showMessage('请输入旧密码',$ionicPopup);
          return;
        }
        if($scope.form.newpassword.trimSpace()==""){
          showMessage('请输入新密码',$ionicPopup);
          return;
        }
        if($scope.form.repassword.trimSpace()!=$scope.form.newpassword.trimSpace()){
          showMessage('重复输入密码不一致',$ionicPopup);
          return;
        }
        var re =new RegExp("^[0-9A-Za-z]{6,20}$");
        var result=  re.test($scope.form.newpassword);
        if(result){
          // loadingShow('提交中...',$ionicLoading);
          // loginFactory.modifyPwd($scope.form.oldpassword.trimSpace(),$scope.form.newpassword.trimSpace(),function (result) {
          //   //hiddenLoading($ionicLoading);
          //   showAutoHidden('修改密码成功',$ionicLoading);
          //   $scope.form = {oldpassword:"",newpassword:"",repassword:""};
          //   $ionicHistory.goBack();
          // },function (error) {
          //   //hiddenLoading($ionicLoading);
          //   showMessage(error,$ionicPopup);
          // });
        }else{
         showMessage('密码需要包含字母、数字且长度为6~20位',$ionicPopup);
        }
      };

      /*back*/
      $scope.goback=function () {
        $scope.form = {oldpassword:"",newpassword:"",repassword:""};
        $ionicHistory.goBack();
      };

    }]);
