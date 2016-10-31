/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('returnauditCtrl',['ngCordova'])
  .factory('myreturnFactory',function ($http,$cordovaFile) {
    var myreturnFactory = {};

    myreturnFactory.loadAudits = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyReturnComfirmsTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyReturnApproves"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyReturnComfirms, JSON.stringify(audits.Data), $cordovaFile);
                  success(audits.Data);
                } else {
                  error(audits.Message);
                }
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
      }, function () {
        readFile(dbMyReturnComfirms, function (data) {
          try {
            if (data != undefined && data != null) {
              var orderDatas = JSON.parse(data);
              // var newsource = factory.filterSource(type,orderDatas);
              success(orderDatas);
            }
          } catch (ex) {
            error(errormessage);
          }
        }, $cordovaFile);
      },refreshmode);
    };

    //筛选数据
    myreturnFactory.filterSource = function (type,source) {
      var returnSource = new Array();
      switch(type){
        case 0:
          for(var i = 0;i<source.length;i++){
            if(source[i].ApplicationStatus==32){
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              var driverandcar = "";
              var drivers = "";
              var cars = "";
              for(var d=0;d<source[i].ApplyVehicleAndDriver.length;d++){
                driverandcar+=source[i].ApplyVehicleAndDriver[d].Key +" "+source[i].ApplyVehicleAndDriver[d].Value+"   ";
                drivers+=source[i].ApplyVehicleAndDriver[d].Value+"  ";
                cars+=source[i].ApplyVehicleAndDriver[d].Key+"  ";
              }
              source[i].driverandcar=driverandcar;
              source[i].drivers=drivers;
              source[i].cars=cars;
              returnSource.push(source[i]);
            }
          }
          break;
        case 1:
          for(var i = 0;i<source.length;i++){
            if(source[i].ApplicationStatus==33){
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              returnSource.push(source[i]);
            }
          }
          break;
      }
      return returnSource;
    };

    myreturnFactory.getDtail=function (id,success) {
      myreturnFactory.loadAudits(function (datas) {
        for(var i = 0;i<datas.length;i++) {
          if(datas[i].Id==id){
            var driverandcar = "";
            var drivers = "";
            var cars = "";
            for(var d=0;d<datas[i].ApplyVehicleAndDriver.length;d++){
              driverandcar+=datas[i].ApplyVehicleAndDriver[d].Key +" "+datas[i].ApplyVehicleAndDriver[d].Value+"   ";
              drivers+=datas[i].ApplyVehicleAndDriver[d].Value+"  ";
              cars+=datas[i].ApplyVehicleAndDriver[d].Key+"  ";
            }
            datas[i].driverandcar=driverandcar;
            datas[i].drivers=drivers;
            datas[i].cars=cars;
            success(datas[i]);
            break;
          }
        }
      },function (error) {

      });
    };

    myreturnFactory.saveRequest=function (model,success,error) {
      readFile(dbplatformInfo,function (data) {
        try {

          var platInfo = JSON.parse(data);
          var postData = {
            UserInfo:platInfo,
            ApplyCode:model.ApplyCode,
            DispatchId:model.Id,
            Return_Kilometers:model.Return_Kilometers,
            Instruction:model.Instruction,
            Remark:model.Remark
          }
          $http.post(createService("api/Order/VehicleReturnApprove"), postData)
            .success(function (result) {
              if (result.Code == "100") {
                success(result.Data);
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

    return myreturnFactory;

  })
  .controller('returnauditCtrl',['$scope','$state','$rootScope','$ionicSideMenuDelegate','$timeout', '$ionicLoading','$ionicPopup','myreturnFactory',
    function($scope, $state,$rootScope,$ionicSideMenuDelegate,$timeout,$ionicLoading,$ionicPopup,myreturnFactory) {

      $scope.items1 = new Array();
      $scope.items2 = new Array();
      $scope.itemscount0 = 0;
      $scope.itemscount1 = 0;
      // $scope.pagination = {
      //   pageSize:10,
      //   currentPage:1
      // };
      /*界面动态样式*/
      $scope.css_selected="colSelected";
      $scope.css_unselected="colUnSelected";
      $scope.css_animation="audit_seg_normal";

      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {
        $rootScope.viewColor = '#347aea';

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        myreturnFactory.loadAudits(function (audits) {
            $scope.items1 =  myreturnFactory.filterSource(0,audits);
            $scope.items2 =  myreturnFactory.filterSource(1,audits);
            $scope.itemscount0 = $scope.items1.length;
            $scope.itemscount1 = myreturnFactory.filterSource(1,audits).length;
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.beforeEnter',function () {
        if(isreturnRefresh){
          $scope.doRefresh();
          isreturnRefresh=false;
          return;
        }
      });

      /*事件*/
      $scope.doRefresh=function () {
        myreturnFactory.loadAudits(function (audits) {
            $scope.items1 =  myreturnFactory.filterSource(0,audits);
            $scope.items2 =  myreturnFactory.filterSource(1,audits);
            $scope.itemscount0 = $scope.items1.length;
            $scope.itemscount1 = myreturnFactory.filterSource(1,audits).length;
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
      $scope.segementChange=function (selectedIndex){
        switch(selectedIndex){
          case 0:
            $scope.css_selected="colSelected";
            $scope.css_unselected="colUnSelected";
            $scope.css_animation="audit_seg_normal";
            document.getElementById("returnaudit_content").style.display="block";
            document.getElementById("returnaudit_contentprocess").style.display="none";
            break;
          case 1:
            $scope.css_selected="colUnSelected";
            $scope.css_unselected="colSelected";
            $scope.css_animation="audit_seg_right";
            document.getElementById("returnaudit_content").style.display="none";
            document.getElementById("returnaudit_contentprocess").style.display="block";
            break;
        }
      };

      $scope.gotoComfirm=function (id) {
        $state.go("returncomfirm",{"id":id});
      };

      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }

    }]);
