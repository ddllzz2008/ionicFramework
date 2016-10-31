/**
 * Created by ddllzz on 16/8/30.
 */
/**
 * Created by ddllzz on 16/8/29.
 */

angular.module('mainprocessCtrl',['ngCordova'])
  .factory('mainprocessFactory',function ($http,$cordovaFile) {
    var factory = {};

    factory.loadOrders = function (success,error,refreshmode) {

      checkRefreshTime($cordovaFile,dbMyOrdersTime,function () {
        readFile(dbplatformInfo,function (data) {
          try{

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyOrders"),postData)
              .success(function (orders) {
                if(orders.Code=="100"){
                  createAndWriteFile(dbMyOrders,JSON.stringify(orders.Data),$cordovaFile);
                  //var newsource = factory.filterSource(type,orders.Data);
                  success(orders.Data);
                }else{
                  error(orders.Message);
                }
              })
              .error(function (data) {
                error(errormessage);
                createAndWriteFile(errorInfo,data.toString(),$cordovaFile);
              });

          }catch(ex){
            error(errormessage);
            createAndWriteFile(errorInfo,ex.toString(),$cordovaFile);
          }
        },$cordovaFile);
      },function () {
        readFile(dbMyOrders,function (data) {
          try{
            if(data!=undefined&&data!=null){
              var orderDatas = JSON.parse(data);
              // var newsource = factory.filterSource(type,orderDatas);
              success(orderDatas);
            }else{
              error('');
            }
          }catch(ex){
            error(errormessage);
          }
        },$cordovaFile);
      },refreshmode);
    };

    //筛选数据
    factory.filterSource = function (type,source) {
      var returnSource = new Array();
      switch(type){
        case 0:
          for(var i = 0;i<source.length;i++){
            // if(source[i].ApplicationStatus==21||source[i].ApplicationStatus==22||source[i].ApplicationStatus==23||source[i].ApplicationStatus==25){
            if(source[i].ApplicationStatus==21){
              source[i].index = i;
              source[i].title = "您的订单正在审批中,请耐心等待";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].Auditors;
              source[i].rowvisible="false";

              if(source[i].ApplicationStatus==21){
                source[i].stateimage = "img/mainprocess_auditing@2x.png";
              }
              // if(source[i].ApplicationStatus==22){
              //   source[i].stateimage = "img/mainprocess_auditing@2x.png";
              // }
              // if(source[i].ApplicationStatus==23){
              //   source[i].stateimage = "img/audit_reject@2x.png";
              // }
              // if(source[i].ApplicationStatus==25){
              //   source[i].stateimage = "img/audit_reject@2x.png";
              // }
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              returnSource.push(source[i]);
            }
          }
          break;
        case 1:
          for(var i = 0;i<source.length;i++){
            // if(source[i].ApplicationStatus==24||source[i].ApplicationStatus==26||source[i].ApplicationStatus==27
            // ||source[i].ApplicationStatus==28||source[i].ApplicationStatus==29){
            if(source[i].ApplicationStatus==22||source[i].ApplicationStatus==24||source[i].ApplicationStatus==26){
              source[i].index = i;
              source[i].title = "您的订单正在派车中,请耐心等待";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].Dispatchers;
              source[i].rowvisible="false";

              if(source[i].ApplicationStatus==22){
                source[i].stateimage = "img/mainprocess_comfirm@2x.png";
              }
              if(source[i].ApplicationStatus==24){
                source[i].stateimage = "img/mainprocess_comfirm@2x.png";
              }
              if(source[i].ApplicationStatus==26){
                source[i].stateimage = "img/mainprocess_caring@2x.png";
              }
              // if(source[i].ApplicationStatus==28){
              //   source[i].stateimage = "img/mainprocess_changed@2x.png";
              // }
              // if(source[i].ApplicationStatus==29){
              //   source[i].stateimage = "img/mainprocess_comfirm@2x.png";
              // }
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              returnSource.push(source[i]);
            }
          }
          break;
        case 2:
          for(var i = 0;i<source.length;i++){
            if(source[i].ApplicationStatus==30){

              source[i].index = i;
              source[i].title = "您的订单正在服务中,祝您一路顺风";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";

              if(source[i].ApplicationStatus==30){
                source[i].stateimage = "img/mainprocess_service@2x.png";
              }
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              returnSource.push(source[i]);
            }
          }
          break;
        case 3:
          for(var i = 0;i<source.length;i++){
            // if(source[i].ApplicationStatus==31||source[i].ApplicationStatus==32||source[i].ApplicationStatus==33||source[i].ApplicationStatus==34
            // ||source[i].ApplicationStatus==36||source[i].ApplicationStatus==37){
            if(source[i].ApplicationStatus==36||source[i].ApplicationStatus==37){
              source[i].index = i;
              source[i].title = "您的订单已完成,感谢用车!";
              source[i].detailArray = null;
              source[i].rowvisible="true";

              // if(source[i].ApplicationStatus==31){
              //   source[i].stateimage = "img/mainprocess_completed@2x.png";
              //   source[i].commentvisible = "false";
              // }
              // if(source[i].ApplicationStatus==32){
              //   source[i].stateimage = "img/mainprocess_completed@2x.png";
              //   source[i].commentvisible = "false";
              // }
              // if(source[i].ApplicationStatus==33){
              //   source[i].stateimage = "img/mainprocess_completed@2x.png";
              //   source[i].commentvisible = "false";
              // }
              // if(source[i].ApplicationStatus==34){
              //   source[i].stateimage = "img/mainprocess_cancel@2x.png";
              //   source[i].commentvisible = "false";
              // }
              if(source[i].ApplicationStatus==36){
                source[i].stateimage = "img/mainprocess_have@2x.png";
                source[i].commentvisible = "false";
              }
              if(source[i].ApplicationStatus==37){
                source[i].stateimage = "img/mainprocess_havenot@2x.png";
                source[i].commentvisible = "false";
              }
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              returnSource.push(source[i]);
            }
          }
          break;
        case 4:
          for(var i = 0;i<source.length;i++){
            // if(source[i].ApplicationStatus==21||source[i].ApplicationStatus==22||source[i].ApplicationStatus==23||source[i].ApplicationStatus==25){
            if(source[i].ApplicationStatus==21){
              source[i].index = i;
              source[i].title = "您的订单正在审批中,请耐心等待";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].Auditors;
              source[i].rowvisible="false";

              if(source[i].ApplicationStatus==21){
                source[i].stateimage = "img/mainprocess_auditing@2x.png";
              }
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==23||source[i].ApplicationStatus==25){
              source[i].index = i;
              source[i].title = "您的订单正在审批中,请耐心等待";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].Auditors;
              source[i].rowvisible="false";

              source[i].stateimage = "img/audit_reject@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==22||source[i].ApplicationStatus==24||source[i].ApplicationStatus==26){
              source[i].index = i;
              source[i].title = "您的订单正在派车中,请耐心等待";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].Dispatchers;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_caring@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==27){

              source[i].index = i;
              source[i].title = "您的订单正在派车中,祝您一路顺风";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";

              source[i].stateimage = "img/audit_reject@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==28){

              source[i].index = i;
              source[i].title = "您的订单正在派车中,祝您一路顺风";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";

              source[i].stateimage = "img/mainprocess_changed@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==29){

              source[i].index = i;
              source[i].title = "您的订单正在派车中,祝您一路顺风";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";

              source[i].stateimage = "img/mainprocess_comfirm@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==30){

              source[i].index = i;
              source[i].title = "您的订单正在服务中,祝您一路顺风";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_service@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==31||source[i].ApplicationStatus==32||source[i].ApplicationStatus==33||source[i].ApplicationStatus==35){

              source[i].index = i;
              source[i].title = "您的订单已完成,感谢用车";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_completed@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==34){

              source[i].index = i;
              source[i].title = "您的订单已完成,感谢用车";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_cancel@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==36){

              source[i].index = i;
              source[i].title = "您的订单已完成,感谢用车";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_have@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplicationStatus==37){

              source[i].index = i;
              source[i].title = "您的订单已完成,感谢用车";
              source[i].commentvisible = "true";
              source[i].detailArray = source[i].DriverAndVehicles;
              source[i].rowvisible="false";
              source[i].stateimage = "img/mainprocess_havenot@2x.png";
              returnSource.push(source[i]);
            }
            if(source[i].ApplyCode.indexOf("ZY")==0){
              source[i].rangeimage = "img/audit_in.png";
            }else{
              source[i].rangeimage = "img/audit_out.png";
            }
          }
          break;
      }
      return returnSource;
    };

    factory.getDetail = function (id,success,error) {
      factory.loadOrders(function (datas) {
        for(var i = 0;i<datas.length;i++) {
          if(datas[i].Id==id){
            success(datas[i]);
            return;
          }
        }
        error("");
      },function (ex) {
        error();
      });
    };

    factory.commitComment = function (model,success,error) {
      readFile(dbplatformInfo,function (data) {
        try {

          var platInfo = JSON.parse(data);
          var postData = {
            UserInfo:platInfo,
            ApplyCode:model.ApplyCode,
            Driver_ID:model.Driver_ID,
            Evaluate:model.Evaluate,
            Remark:model.Remark
          }
          $http.post(createService("api/Order/DriverEvaluate"), postData)
            .success(function (result) {
              if (result.Code == "100") {
                success();
              } else {
                error(result.Message);
              }
            })
            .error(function (data) {
              error(errormessage);
            });

        } catch (ex) {
          error(errormessage);
          createAndWriteFile(errorInfo, ex.toString(), $cordovaFile);
        }
      },$cordovaFile);
    };

    return factory;
  })
  .controller('mainprocessCtrl',['$scope','$state','$rootScope','$ionicHistory','$ionicSideMenuDelegate','$ionicScrollDelegate','$timeout', '$ionicLoading','$ionicPopup','mainprocessFactory',
    function($scope, $state,$rootScope,$ionicHistory,$ionicSideMenuDelegate,$ionicScrollDelegate,$timeout,$ionicLoading,$ionicPopup,mainprocessFactory) {

      /*数据源*/
      $scope.items=new Array();
      $scope.totalItems = new Array();
      $scope.itemscount0=0;
      $scope.itemscount1=0;
      $scope.itemscount2=0;
      $scope.itemscount3=0;
      $scope.itemscount4=0;
      $scope.itemselected = 0 ;
      /*私有变量*/

      /*ui数据*/

      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);

        //初始化数据
        $scope.items=new Array();

        mainprocessFactory.loadOrders(function (orders) {
            $scope.items =  mainprocessFactory.filterSource(0,orders);
            $scope.itemscount0 = $scope.items.length;
            $scope.itemscount1 = mainprocessFactory.filterSource(1,orders).length;
            $scope.itemscount2 = mainprocessFactory.filterSource(2,orders).length;
            $scope.itemscount3 = mainprocessFactory.filterSource(3,orders).length;
            $scope.itemscount4 = mainprocessFactory.filterSource(4,orders).length;
          hiddenLoading($ionicLoading);
        },
        function (error) {
          hiddenLoading($ionicLoading);
          showAutoHidden(error.toString(),$ionicLoading);
        });

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
      $scope.doRefresh=function () {
        loadingShow('数据加载中...',$ionicLoading);

        mainprocessFactory.loadOrders(function (orders) {
            try{
              $scope.items =  mainprocessFactory.filterSource($scope.itemselected,orders);
              $scope.itemscount0 = mainprocessFactory.filterSource(0,orders).length;
              $scope.itemscount1 = mainprocessFactory.filterSource(1,orders).length;
              $scope.itemscount2 = mainprocessFactory.filterSource(2,orders).length;
              $scope.itemscount3 = mainprocessFactory.filterSource(3,orders).length;
              $scope.itemscount4 = mainprocessFactory.filterSource(4,orders).length;
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
      /*切换列表*/
      $scope.mainprocess_segementChange=function (selectedIndex){

        var mainprocess_header_img1 =angular.element(document.getElementById("mainprocess_header_img1"));
        var mainprocess_header_img2 =angular.element(document.getElementById("mainprocess_header_img2"));
        var mainprocess_header_img3 =angular.element(document.getElementById("mainprocess_header_img3"));
        var mainprocess_header_img4 =angular.element(document.getElementById("mainprocess_header_img4"));
        var mainprocess_header_img5 =angular.element(document.getElementById("mainprocess_header_img5"));

        var mainprocess_header_title1 =angular.element(document.getElementById("mainprocess_header_title1"));
        var mainprocess_header_title2 =angular.element(document.getElementById("mainprocess_header_title2"));
        var mainprocess_header_title3 =angular.element(document.getElementById("mainprocess_header_title3"));
        var mainprocess_header_title4 =angular.element(document.getElementById("mainprocess_header_title4"));
        var mainprocess_header_title5 =angular.element(document.getElementById("mainprocess_header_title5"));

        switch(selectedIndex){
          case 0:
            mainprocess_header_img1.attr('src','img/mainprocess_audit_blue@2x.png');
            mainprocess_header_img2.attr('src','img/mainprocess_caring_gray@2x.png');
            mainprocess_header_img3.attr('src','img/mainprocess_service_gray@2x.png');
            mainprocess_header_img4.attr('src','img/mainprocess_complete_gray@2x.png');
            mainprocess_header_img5.attr('src','img/mainprocess_all_gray@2x.png');

            mainprocess_header_title1.attr('class','selected');
            mainprocess_header_title2.attr('class','normal');
            mainprocess_header_title3.attr('class','normal');
            mainprocess_header_title4.attr('class','normal');
            mainprocess_header_title5.attr('class','normal');
            break;
          case 1:
            mainprocess_header_img1.attr('src','img/mainprocess_audit_gray@2x.png');
            mainprocess_header_img2.attr('src','img/mainprocess_caring_blue@2x.png');
            mainprocess_header_img3.attr('src','img/mainprocess_service_gray@2x.png');
            mainprocess_header_img4.attr('src','img/mainprocess_complete_gray@2x.png');
            mainprocess_header_img5.attr('src','img/mainprocess_all_gray@2x.png');

            mainprocess_header_title1.attr('class','normal');
            mainprocess_header_title2.attr('class','selected');
            mainprocess_header_title3.attr('class','normal');
            mainprocess_header_title4.attr('class','normal');
            mainprocess_header_title5.attr('class','normal');
            break;
          case 2:
            mainprocess_header_img1.attr('src','img/mainprocess_audit_gray@2x.png');
            mainprocess_header_img2.attr('src','img/mainprocess_caring_gray@2x.png');
            mainprocess_header_img3.attr('src','img/mainprocess_service_blue@2x.png');
            mainprocess_header_img4.attr('src','img/mainprocess_complete_gray@2x.png');
            mainprocess_header_img5.attr('src','img/mainprocess_all_gray@2x.png');

            mainprocess_header_title1.attr('class','normal');
            mainprocess_header_title2.attr('class','normal');
            mainprocess_header_title3.attr('class','selected');
            mainprocess_header_title4.attr('class','normal');
            mainprocess_header_title5.attr('class','normal');
            break;
          case 3:
            mainprocess_header_img1.attr('src','img/mainprocess_audit_gray@2x.png');
            mainprocess_header_img2.attr('src','img/mainprocess_caring_gray@2x.png');
            mainprocess_header_img3.attr('src','img/mainprocess_service_gray@2x.png');
            mainprocess_header_img4.attr('src','img/mainprocess_complete_blue@2x.png');
            mainprocess_header_img5.attr('src','img/mainprocess_all_gray@2x.png');

            mainprocess_header_title1.attr('class','normal');
            mainprocess_header_title2.attr('class','normal');
            mainprocess_header_title3.attr('class','normal');
            mainprocess_header_title4.attr('class','selected');
            mainprocess_header_title5.attr('class','normal');
            break;
          case 4:
            mainprocess_header_img1.attr('src','img/mainprocess_audit_gray@2x.png');
            mainprocess_header_img2.attr('src','img/mainprocess_caring_gray@2x.png');
            mainprocess_header_img3.attr('src','img/mainprocess_service_gray@2x.png');
            mainprocess_header_img4.attr('src','img/mainprocess_complete_gray@2x.png');
            mainprocess_header_img5.attr('src','img/mainprocess_all_blue@2x.png');

            mainprocess_header_title1.attr('class','normal');
            mainprocess_header_title2.attr('class','normal');
            mainprocess_header_title3.attr('class','normal');
            mainprocess_header_title4.attr('class','normal');
            mainprocess_header_title5.attr('class','selected');
            break;
        }
        $scope.itemselected = selectedIndex;

        loadingShow('数据加载中...',$ionicLoading);
        mainprocessFactory.loadOrders(function (orders) {
            $scope.items =  mainprocessFactory.filterSource(selectedIndex,orders);
            hiddenLoading($ionicLoading);
            $ionicScrollDelegate.$getByHandle('scrollmainprocess').resize();
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      };

      $scope.showtaskdetail=function (_index) {
        var detailrow = angular.element(document.getElementById("mainprocess_detailrow_"+_index));
        var detailimg =angular.element(document.getElementById("mainprocess_detailimg_"+_index));
        if(detailrow!=null&&detailrow!=undefined){
          if(detailrow.css('height')=='0px'){
            // detailrow.css('display','block');
            detailrow.css('height','auto');
            // detailrow.css('opacity','1');
            detailimg.attr('src','img/mytask_date_hidden@2x.png')
          }else{
            // detailrow.css('display','none');
            detailrow.css('height','0px');
            // detailrow.css('opacity','0');
            detailimg.attr('src','img/mytask_date_show@2x.png')
          }
        }
        $ionicScrollDelegate.$getByHandle('scrollmainprocess').resize();
      }
      //构造日期数据

      //日期控件下拉

      /*业务事件*/
      $scope.callphone = function (phone) {
        window.open('tel:' + phone);
      }
      /*跳转*/
      $scope.gotocomment=function (id) {
        $state.go("maincomment",{"id":id});
      }
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
