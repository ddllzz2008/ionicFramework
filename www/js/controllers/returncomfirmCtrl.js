/**
 * Created by ddllzz on 16/8/30.
 */
/**
 * Created by ddllzz on 16/8/29.
 */

angular.module('returncomfirmCtrl',[])
  .controller('returncomfirmCtrl',['$scope','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup','myreturnFactory',
    function($scope, $stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup,myreturnFactory) {

      /*私有变量*/
      /*ui数据*/
      /*数据源*/
      $scope.item = new Object();

      $scope.form = {backkilometers:"",remark:""};
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        try{
          var id = $stateParams.id;
          myreturnFactory.getDtail(parseInt(id),function (item) {
            $scope.item = item;
          })
        }catch(ex){

        }

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/

      /*业务事件*/
      $scope.saveReturn=function () {
        try{
          if($scope.form.backkilometers==""){
            showMessage('请输入回厂里程数',$ionicPopup);
            return;
          }

          loadingShow('提交中...',$ionicLoading);

          var model = $scope.item;
          model.Return_Kilometers = $scope.form.backkilometers;
          model.Instruction = 1;
          model.Remark = $scope.form.remark;

          myreturnFactory.saveRequest(model,function (result) {
            isreturnRefresh = true;
            hiddenLoading($ionicLoading);
            $ionicHistory.goBack();
          },function (error) {
            hiddenLoading($ionicLoading);
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
