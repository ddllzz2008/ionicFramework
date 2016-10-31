/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('mainCtrl',['ngCordova'])
  .controller('mainCtrl',['$scope','$rootScope','$state','$ionicPopup','$ionicSideMenuDelegate','$timeout', '$ionicLoading','mainprocessFactory',
    function($scope, $rootScope,$state,$ionicPopup,$ionicSideMenuDelegate,$timeout,$ionicLoading,mainprocessFactory) {
    $scope.items = [];

    $scope.$on('$ionicView.loaded', function() {
      $rootScope.viewColor = '#347aea';

      console.log("loaded");

      $common_ionicLoading = $ionicLoading;

      loadingShow('数据加载中...',$ionicLoading);

      //初始化数据
      $scope.currentitems=new Array();

      $scope.currentTask={currentTime:"暂无行程",currentUseDate:"",currentUseTime:"",GetOnAddress:"",GetOffAddress:"",currentDriver:"",currentVichType:"",currentNumber:"",currentPhone:""};

      $scope.hadTask = false;

      mainprocessFactory.loadOrders(function (orders) {
        try{
          $scope.currentitems = mainprocessFactory.filterSource(2,orders);
          if($scope.currentitems!=null&&$scope.currentitems!=undefined&&$scope.currentitems.length>0){
            var UsageTime = $scope.currentitems[0].UsageTime.replaceAll('-','/');
            var useDate = new Date(UsageTime);
            var currentDate = new Date();
            if(useDate>currentDate){
              $scope.hadTask=true;
              var hours = useDate.GetDateDiff('h',currentDate);
              var minutes = (useDate.GetDateDiff('h',currentDate))%60;
              $scope.currentTask.currentTime = "距离出发还有"+hours+":"+minutes;

              $scope.currentTask.currentUseDate = useDate.Format('MM-dd');
              $scope.currentTask.currentUseTime = useDate.Format('HH:mm');

              $scope.currentTask.GetOnAddress=$scope.currentitems[0].GetOnAddress;
              $scope.currentTask.GetOffAddress=$scope.currentitems[0].GetOffAddress;

              $scope.currentTask.currentPhone = $scope.currentitems[0].ApplicantPhone;

              var cars = $scope.currentitems[0].DriverAndVehicles;
              if(cars!=null&&cars.length>0){
                $scope.currentTask.currentDriver = cars[0].Key;
                $scope.currentTask.currentNumber = cars[0].Value;
                $scope.currentTask.currentVichType=cars[0].Value2;
              }
            }
            else{
              $scope.hadTask=false;
            }
          }else{
            $scope.hadTask=false;
          }
        }catch(ex){
          hiddenLoading($ionicLoading);
        }
          hiddenLoading($ionicLoading);
        },
        function (error) {
          hiddenLoading($ionicLoading);
          showAutoHidden(error.toString(),$ionicLoading);
        });

    });

    $scope.$on('$ionicView.beforeEnter', function() {
      console.log("beforeEnter");
    });

    $scope.$on("stateChangeSuccess", function () {
      console.log("change");
    });

    $scope.$on('$ionicView.enter',function () {
      console.log("enter");
    });

    /*事件*/
      $scope.doRefresh=function () {
        mainprocessFactory.loadOrders(function (orders) {
            try{
              $scope.currentitems = mainprocessFactory.filterSource(2,orders);
              if($scope.currentitems!=null&&$scope.currentitems!=undefined&&$scope.currentitems.length>0){
                var UsageTime = $scope.currentitems[0].UsageTime.replaceAll('-','/');
                var useDate = new Date(UsageTime);
                var currentDate = new Date();
                // var currentDate = new Date('2016/07/01 12:00:00');
                if(useDate>=currentDate){
                  $scope.hadTask=true;
                  var hours = currentDate.GetDateDiff('h',useDate);
                  var minutes = (currentDate.GetDateDiff('h',useDate))%60;

                  $timeout(function() {
                    $scope.currentTask.currentTime = "距离出发还有"+hours+":"+minutes;

                    $scope.currentTask.currentUseDate = useDate.Format('MM-dd');
                    $scope.currentTask.currentUseTime = useDate.Format('HH:mm');

                    $scope.currentTask.GetOnAddress=$scope.currentitems[0].GetOnAddress;
                    $scope.currentTask.GetOffAddress=$scope.currentitems[0].GetOffAddress;

                    // $scope.currentTask.currentPhone = $scope.currentitems[0].ApplicantPhone;

                    var cars = $scope.currentitems[0].DriverAndVehicles;
                    if(cars!=null&&cars.length>0){
                      $scope.currentTask.currentDriver = cars[0].Key;
                      $scope.currentTask.currentNumber = cars[0].Value;
                      $scope.currentTask.currentPhone=cars[0].Value2;
                    }
                  });

                  $scope.hadTask=true;
                }
                else{
                  $scope.hadTask=false;
                }
              }else{
                $scope.hadTask=false;
              }
            }catch(ex){

            }
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
          },
          function (error) {
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          },true);
      };
    /*显示详细*/
    $scope.showDetail=function () {
      if(!$scope.hadTask){return;}
      var detail = document.getElementById("main_detail");
      var btn = document.getElementById("main_showbtn");
      var img = document.getElementById("main_showimg");
      var hidden = document.getElementById("main_hidden");
      var main_hidden= document.getElementById("main_scroll_hidden");
      if(this.isdetailshow){
        detail.style.height="0px";
        detail.style.display="none";
        btn.style.marginTop="0px";
        this.isdetailshow=false;
        img.setAttribute("src","img/main_more@2x.png");

        hidden.style.display="none";
        hidden.style.opacity="0";
        main_hidden.style.opacity="1";
        main_hidden.style.backgroundColor="#ffffff";
      }else{
        detail.style.height="140px";
        detail.style.display="block";
        btn.style.marginTop="135px";
        this.isdetailshow=true;
        img.setAttribute("src","img/main_moreup@2x.png");

        hidden.style.display="block";
        hidden.style.opacity="0.3";

        main_hidden.style.opacity="0.3";
        main_hidden.style.backgroundColor="#cccccc";
      }
    };

    /*跳转*/
    $scope.gotoRequest=function () {
      $state.go('app.tab.main.mainrequest');
    }

      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }

  }]);
