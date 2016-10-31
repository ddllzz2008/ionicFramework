/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('maincommentCtrl',[])
  .controller('maincommentCtrl',['$scope','$rootScope','$ionicHistory','$stateParams','$timeout', '$ionicLoading','$ionicPopup','mainprocessFactory',
    function($scope, $rootScope,$ionicHistory,$stateParams,$timeout,$ionicLoading,$ionicPopup,mainprocessFactory) {
      /*私有变量*/

      /*ui数据*/
      $scope.comment = {img1:"img/maincomment_gray@2x.png",img2:"img/maincomment_gray@2x.png",
                        img3:"img/maincomment_gray@2x.png",img4:"img/maincomment_gray@2x.png",
                        img5:"img/maincomment_gray@2x.png",text:"点击星星对他进行评价吧"};
      /*数据源*/
      $scope.form = {Remark:"",Evaluate:0,Driver_ID:0,ApplyCode:""};
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        var id = $stateParams.id;

        $scope.item = new Object();

        loadingShow('加载中...',$ionicLoading);

        mainprocessFactory.getDetail(id,function (model) {
          try{
            if(model!=null&&model!=undefined){
              if(model.DriverAndVehicles==null||model.DriverAndVehicles==undefined||model.DriverAndVehicles.length==0){
                showAutoHidden('获取司机数据失败',$ionicLoading);
              }else{
                $scope.form.Driver_ID = model.DriverAndVehicles[0].Key;
                $scope.form.ApplyCode=model.ApplyCode;
                $scope.item = model;
                hiddenLoading($ionicLoading);
              }
            }else{
              hiddenLoading($ionicLoading);
              showAutoHidden('获取行程数据失败',$ionicLoading);
            }
          }catch(ex){
            hiddenLoading($ionicLoading);
            showAutoHidden('数据错误',$ionicLoading);
          }
        },function () {
          hiddenLoading($ionicLoading);
          showAutoHidden('数据错误',$ionicLoading);
        });

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/
      $scope.changeComment=function (score) {
        switch(score){
          case 1:
            $scope.comment = {img1:"img/maincomment_yellow@2x.png",img2:"img/maincomment_gray@2x.png",
              img3:"img/maincomment_gray@2x.png",img4:"img/maincomment_gray@2x.png",
              img5:"img/maincomment_gray@2x.png",text:"非常不满意"};
            break;
          case 2:
            $scope.comment = {img1:"img/maincomment_yellow@2x.png",img2:"img/maincomment_yellow@2x.png",
              img3:"img/maincomment_gray@2x.png",img4:"img/maincomment_gray@2x.png",
              img5:"img/maincomment_gray@2x.png",text:"不满意"};
            break;
          case 3:
            $scope.comment = {img1:"img/maincomment_yellow@2x.png",img2:"img/maincomment_yellow@2x.png",
              img3:"img/maincomment_yellow@2x.png",img4:"img/maincomment_gray@2x.png",
              img5:"img/maincomment_gray@2x.png",text:"一般"};
            break;
          case 4:
            $scope.comment = {img1:"img/maincomment_yellow@2x.png",img2:"img/maincomment_yellow@2x.png",
              img3:"img/maincomment_yellow@2x.png",img4:"img/maincomment_yellow@2x.png",
              img5:"img/maincomment_gray@2x.png",text:"很满意"};
            break;
          case 5:
            $scope.comment = {img1:"img/maincomment_yellow@2x.png",img2:"img/maincomment_yellow@2x.png",
              img3:"img/maincomment_yellow@2x.png",img4:"img/maincomment_yellow@2x.png",
              img5:"img/maincomment_yellow@2x.png",text:"非常满意无可挑剔"};
            break;
        }
        $scope.form.Evaluate=score;
      }
      /*业务事件*/
      $scope.saveComment=function () {
        try{
          if($scope.form.Evaluate==0){
            showMessage('请对司机打个分吧',$ionicPopup);
            return;
          }
          loadingShow('提交中...',$ionicLoading);

          mainprocessFactory.commitComment($scope.form,function (result) {
            hiddenLoading($ionicLoading);
            $ionicHistory.clearCache();
            $ionicHistory.goBack();
          },function (ex) {
            showAutoHidden(ex,$ionicLoading);
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
