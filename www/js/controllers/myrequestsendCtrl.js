/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('myrequestsendCtrl',[])
  .controller('myrequestsendCtrl',['$scope','$state','$stateParams','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup','mydispatchesFactory','mainrequestFactory','commonService',
    function($scope, $state,$stateParams,$rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup,mydispatchesFactory,mainrequestFactory,commonService) {
      /*私有变量*/
      var postSavedata={
        ApplyCode: null,
        Instruction:null,//1.调度,2.驳回,3.改派,4.撤单
        Remark: null,
        VehicleApplicationDispatch:[{
          AvId:"",//申请单号
          VehicleId:0,//车辆ID
          EsId:0,//费用标准
          Discount:0,//折扣率
          DriverId:0,//司机ID
        }]
      }
      var applicationVehiclesModel = new Object();
      /*ui数据*/
      $scope.platInfo=null;
      $scope.typeselect="";
      $scope.carselect="";
      $scope.driverselect="";
      $scope.feeselect="";
      $scope.stationselect="";
      $scope.rateselect="";
      $scope.crmark={text:""};
      /*数据源*/
      $scope.typeselectList=new Array();
      $scope.carselectList = new Array();
      $scope.driverselectList = new Array();
      $scope.feeselectList = new Array();
      $scope.stationselectList = new Array();
      $scope.rateselectList = new Array();

      $scope.item = new Object();
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

        postSavedata.ApplicationVehicles = new Array();

        var id = $stateParams.id;
        var type = $stateParams.type;
        mydispatchesFactory.getDetail(parseInt(id),function (model) {
          try{
            $scope.item = model;

            mainrequestFactory.initStaticInfo(function (datas) {

              commonService.getPlatInfo(function (platinfo) {
                $scope.platInfo=platinfo;
              });

              $scope.typeselectList =  mainrequestFactory.filterSource(5,datas);
              if($scope.typeselectList!=undefined&&$scope.typeselectList.length>0){
                $scope.typeselect = $scope.typeselectList[0].Value;
              }

              $scope.carselectList =  mainrequestFactory.filterSource(6,datas);
              if($scope.carselectList!=undefined&&$scope.carselectList.length>0){
                $scope.carselect = $scope.carselectList[0].Value;
                applicationVehiclesModel.VehicleId=$scope.carselectList[0].Key;
              }

              $scope.driverselectList =  mainrequestFactory.filterSource(7,datas);
              if($scope.driverselectList!=undefined&&$scope.driverselectList.length>0){
                $scope.driverselect = $scope.driverselectList[0].Value;
                applicationVehiclesModel.DriverId=$scope.driverselectList[0].Key;
              }

              $scope.feeselectList = mainrequestFactory.filterSource(8,datas);
              if($scope.feeselectList!=undefined&&$scope.feeselectList.length>0){
                $scope.feeselect = $scope.feeselectList[0].Value;
                applicationVehiclesModel.EsId=$scope.feeselectList[0].Key;
              }

              $scope.stationselectList = mainrequestFactory.filterSource(9,datas);
              if($scope.stationselectList!=undefined&&$scope.stationselectList.length>0){
                $scope.stationselect = $scope.stationselectList[0].Name;
              }

              $scope.rateselectList = mainrequestFactory.filterSource(10,datas);
              if($scope.rateselectList!=undefined&&$scope.rateselectList.length>0){
                if(type=="0"){
                  $scope.rateselect = $scope.rateselectList[0].number;
                  applicationVehiclesModel.Discount=parseInt($scope.rateselectList[0].number);
                }else{
                  $scope.rateselect = $scope.rateselectList[0].number;
                  applicationVehiclesModel.Discount=parseInt($scope.rateselectList[0].number);
                }
              }

            },function (error) {
              showAutoHidden('系统错误',$ionicLoading);
            });

          }catch(ex){
            showAutoHidden('系统错误',$ionicLoading);
          }
        },function (error) {
          showAutoHidden(error,$ionicLoading);
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
      $scope.typeChanged=function (type) {
        // for(var i=0;i<$scope.typeselectList.length;i++){
        //   if($scope.typeselectList[i].Value==type){
        //
        //     break;
        //   }
        // }
      };
      $scope.stationChanged=function (type) {

      };
      $scope.carChanged=function (type) {
        for(var i=0;i<$scope.carselectList.length;i++){
          if($scope.carselectList[i].Value==type){
            postSavedata.ApplicationVehicles.VehicleId=$scope.carselectList[i].Key;
            break;
          }
        }
      };
      $scope.driverChanged=function (type) {
        for(var i=0;i<$scope.driverselectList.length;i++){
          if($scope.driverselectList[i].Value==type){
            postSavedata.ApplicationVehicles.DriverId=$scope.driverselectList[i].Key;
            break;
          }
        }
      };
      $scope.feeChanged=function (type) {
        for(var i=0;i<$scope.feeselectList.length;i++){
          if($scope.feeselectList[i].Value==type){
            postSavedata.ApplicationVehicles.EsId=$scope.feeselectList[i].Key;
            break;
          }
        }
      };
      $scope.discountChanged=function (type) {
        for(var i=0;i<$scope.rateselectList.length;i++){
          if($scope.rateselectList[i].Value==type){
            postSavedata.ApplicationVehicles.Discount=parseInt($scope.rateselectList[i].number);
            break;
          }
        }
      };
      /*业务事件*/
      $scope.saveRequest = function () {
        try{
          loadingShow('提交中...',$ionicLoading);
          // postSavedata.DepartmentId=$scope.mydepartment;
          postSavedata.UserInfo = $scope.platInfo;
          postSavedata.ApplyCode = $scope.item.ApplyCode;
          postSavedata.Instruction = 1;
          postSavedata.Remark = $scope.crmark.text;

          if(postSavedata.ApplicationVehicles){
            postSavedata.ApplicationVehicles = new Array();
          }
          applicationVehiclesModel.AvId=$scope.item.ApplyCode;
          postSavedata.ApplicationVehicles.push(applicationVehiclesModel);

          mydispatchesFactory.saveRequest(postSavedata,function (result) {
            showMessage('调度成功',$ionicPopup);
            hiddenLoading($ionicLoading);
            isdispatcherRefresh = true;
            $ionicHistory.clearCache();
            $ionicHistory.goBack();
          },function (error) {
            hiddenLoading($ionicLoading);
            showMessage(error,$ionicPopup);
          });
        }catch(ex){
          hiddenLoading($ionicLoading);
          showAutoHidden('操作异常',$ionicLoading);
        }
      }
      /*跳转*/
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
