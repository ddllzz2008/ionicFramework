/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('myrequestCtrl',[])
  .factory('myrequestFactory',function ($http,$cordovaFile) {
    var myrequestFactory = {};

    myrequestFactory.loadDrivers = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyDriverRealsTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/DriverRealtimeStatus"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyDriverReals, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbMyDriverReals, function (data) {
          try {
            if (data != undefined && data != null) {
              var orderDatas = JSON.parse(data);
              success(orderDatas);
            }
          } catch (ex) {
            error(errormessage);
          }
        }, $cordovaFile);
      },refreshmode);
    };

    //筛选数据
    myrequestFactory.filterDrivers = function (type,source) {
      try {
        var returnSource = new Array();
        for (var i = 0; i < source.length; i++) {
          switch (type) {
            case 0://待命
              if (source[i].Driver_Status == 60) {
                returnSource.push(source[i]);
              }
              break;
            case 1://空闲
              if (source[i].Driver_Status == 61) {
                returnSource.push(source[i]);
              }
              break;
            case 2://运行
              if (source[i].Driver_Status == 62) {
                returnSource.push(source[i]);
              }
              break;
          }
        }
        return returnSource;
      }
      catch(ex) {
        return new Array();
      }
    };

    myrequestFactory.loadVehicle = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyVehicleRealsTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/VehicleRealtimeStatus"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyVehicleReals, JSON.stringify(audits.Data), $cordovaFile);
                  var returnSource = new Array();
                  for (var i = 0; i < audits.Data.length; i++) {
                    if(audits.Data[i].Vehicle_Status==50||audits.Data[i].Vehicle_Status==51||audits.Data[i].Vehicle_Status==52){
                      returnSource.push(audits.Data[i]);
                    }
                  }
                  success(returnSource);
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
        readFile(dbMyVehicleReals, function (data) {
          try {
            if (data != undefined && data != null) {
              var orderDatas = JSON.parse(data);
              success(orderDatas);
            }
          } catch (ex) {
            error(errormessage);
          }
        }, $cordovaFile);
      },refreshmode);
    };

    //筛选数据
    myrequestFactory.filterVehicle = function (type,source) {
      try {
        var returnSource = new Array();
        for (var i = 0; i < source.length; i++) {
          switch (type) {
            case 0://待命
              if (source[i].Vehicle_Status == 50) {
                returnSource.push(source[i]);
              }
              break;
            case 1://空闲
              if (source[i].Vehicle_Status == 51) {
                returnSource.push(source[i]);
              }
              break;
            case 2://运行
              if (source[i].Vehicle_Status == 52) {
                returnSource.push(source[i]);
              }
              break;
          }
        }
        return returnSource;
      }
      catch(ex) {
        return new Array();
      }
    };

    return myrequestFactory;

  })
  .controller('myrequestCtrl',['$scope','$state','$rootScope','$timeout', '$ionicLoading','$ionicPopup','mydispatchesFactory','myrequestFactory','commonService','$logicHttp',
    function($scope, $state,$rootScope,$timeout,$ionicLoading,$ionicPopup,mydispatchesFactory,myrequestFactory,commonService,$logicHttp) {

      /*业务数据*/
      $scope.numberfordispatchers = 0;
      $scope.drivers={total:0,wait:0,free:0,run:0,rate:"0%"};
      $scope.vehicles={total:0,wait:0,free:0,run:0,rage:"0%"};
      /*生命周期*/
      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        commonService.getPlatInfo(function (result) {
          try{
            var postData = JSON.parse(result);
            $logicHttp.downloadBasicInfo(postData);
          }catch(ex){

          }
        });

        mydispatchesFactory.loadDispatches(function (audits) {
            try{
              $scope.numberfordispatchers =  mydispatchesFactory.filterSource(0,audits).length;
            }catch(ex) {

            }
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

        myrequestFactory.loadDrivers(function (drivers) {
            $timeout(function() {
              var total = drivers.length;
              var wait = myrequestFactory.filterDrivers(0,drivers);
              var free = myrequestFactory.filterDrivers(1,drivers);
              var run = myrequestFactory.filterDrivers(2,drivers);
              var rate = total==0?"0%":(run.length/total).toFixed(2)*100+"%";
              $scope.drivers={total:total,wait:wait.length,free:free.length,run:run.length,rate:rate};
            });
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

        myrequestFactory.loadVehicle(function (vehicles) {
          $timeout(function() {
            var total = vehicles.length;
            var wait = myrequestFactory.filterDrivers(0,vehicles);
            var free = myrequestFactory.filterDrivers(1,vehicles);
            var run = myrequestFactory.filterDrivers(2,vehicles);
            var rate = total==0?"0%":(run.length/total).toFixed(2)*100+"%";
            $scope.vehicles={total:total,wait:wait.length,free:free.length,run:run.length,rate:rate};
          });
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });
      });

      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {
        //设置宽高相等
        var header_circle = document.getElementById("myrequest_circle");
        if(header_circle!=null&&header_circle!=undefined){
          header_circle.style.width = header_circle.clientHeight+"px";

          var myrequest_title = document.getElementById("myrequest_title");
          if(myrequest_title!=null&&myrequest_title!=undefined){
            myrequest_title.style.top = (header_circle.clientHeight + header_circle.offsetTop + 20) +"px";
          }
        }

        var myrequest_content = document.getElementsByClassName("myrequest_content");

        var myreqeuest_bottom1 = document.getElementById("myreqeuest_bottom1");
        if(myreqeuest_bottom1!=null&&myreqeuest_bottom1!=undefined){
          myreqeuest_bottom1.style.width = myreqeuest_bottom1.clientHeight+"px";
          myreqeuest_bottom1.style.marginLeft = (myrequest_content[0].clientWidth - myreqeuest_bottom1.clientHeight)/2 + "px";
          myreqeuest_bottom1.style.marginTop = (myrequest_content[0].clientHeight - myreqeuest_bottom1.clientHeight)/2 - 12 + "px";
        }
        var myreqeuest_bottom2 = document.getElementById("myreqeuest_bottom2");
        if(myreqeuest_bottom2!=null&&myreqeuest_bottom2!=undefined){
          myreqeuest_bottom2.style.width = myreqeuest_bottom2.clientHeight+"px";
          myreqeuest_bottom2.style.marginLeft = (myrequest_content[0].clientWidth - myreqeuest_bottom2.clientHeight)/2 + "px";
          myreqeuest_bottom2.style.marginTop = (myrequest_content[0].clientHeight - myreqeuest_bottom2.clientHeight)/2 - 12 + "px";
        }

      });
      /*事件*/
      $scope.gotoDrivers=function (type) {
        $state.go("myrequestdriver",{"type":type});
      }
      $scope.gotoVhicles=function (type) {
        $state.go("myrequestcar",{"type":type});
      }

      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }
      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }

    }]);
