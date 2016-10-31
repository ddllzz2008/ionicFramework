/**
 * Created by ddllzz on 16/8/30.
 */
angular.module('myrequestwaitCtrl',['ngCordova'])
  .factory('mydispatchesFactory',function ($http,$cordovaFile) {
    var mydispatchesFactory = {};

    mydispatchesFactory.loadDispatches = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyDispatchesTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyDispatches"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyDispatches, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbMyDispatches, function (data) {
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
    mydispatchesFactory.filterSource = function (type,source) {
      var returnSource = new Array();
      switch(type){
        case 0:
          for(var i = 0;i<source.length;i++){
            if(source[i].ApplicationStatus==22||source[i].ApplicationStatus==24){

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
            if(source[i].ApplicationStatus==26||source[i].ApplicationStatus==27){
              if(source[i].ApplicationStatus==26){
                source[i].stateimage = "img/audit_pass@2x.png";
              }
              if(source[i].ApplicationStatus==27){
                source[i].stateimage = "img/mainprocess_reject@2x.png";
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
      }
      return returnSource;
    };

    mydispatchesFactory.getDetail=function (id,success,error) {
      mydispatchesFactory.loadDispatches(function (datas) {
        var hasData = false;
        for(var i=0;i<datas.length;i++){
          if(datas[i].Id==id){
            var vetypes="";
            for(var v=0;v<datas[i].ApplyVehicleTypes.length;v++){
              vetypes+=datas[i].ApplyVehicleTypes[v].Key+" "+datas[i].ApplyVehicleTypes[v].Value+"辆  ";
            }
            datas[i].vetypes = vetypes;
            if(datas[i].ApplyCode.indexOf("ZY")==0){
              datas[i].rangeimage = "img/audit_in.png";
            }else{
              datas[i].rangeimage = "img/audit_out.png";
            }
            if(datas[i].ApplyCode.indexOf("BZ")==0){
              datas[i].stationvibile = "false";
            }else{
              datas[i].stationvibile = "true";
            }
            hasData=true;
            success(datas[i]);
            break;
          }
        }
        if(!hasData){
          error('系统错误');
        }
      },function (error) {
        error('获取数据失败');
      });
    };

    mydispatchesFactory.saveRequest=function (postData,success,error) {
      $http.post(createService("api/Order/VehicleDispatch"), postData)
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
    };

    return mydispatchesFactory;

  })
  .controller('myrequestwaitCtrl',['$scope','$state','$rootScope','$timeout','$ionicHistory', '$ionicLoading','$ionicPopup','mydispatchesFactory','commonService',
    function($scope, $state,$rootScope,$timeout,$ionicHistory,$ionicLoading,$ionicPopup,mydispatchesFactory,commonService) {
      /*私有变量*/
      $scope.platInfo=null;
      $scope.auditcontentVisible = "false";
      $scope.auditcontentprocessVisible = "true";
      /*ui数据*/
      $scope.css_selected="colSelected";
      $scope.css_unselected="colUnSelected";
      $scope.css_animation="audit_seg_normal";
      /*数据源*/
      $scope.items1 = new Array();
      $scope.items2 = new Array();
      $scope.itemscount0 = 0;
      $scope.itemscount1 = 0;
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        $common_ionicLoading = $ionicLoading;

        if(isdispatcherRefresh){
          $scope.doRefresh();
          isdispatcherRefresh=false;
          return;
        }

        loadingShow('数据加载中...',$ionicLoading);

        //初始化数据
        commonService.getPlatInfo(function (platinfo) {
          $scope.platInfo = platinfo;
        });

        mydispatchesFactory.loadDispatches(function (audits) {
            $scope.items1 =  mydispatchesFactory.filterSource(0,audits);
            $scope.itemscount0 = $scope.items1.length;
            $scope.itemscount1 = mydispatchesFactory.filterSource(1,audits).length;
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/
      $scope.doRefresh=function () {
        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        mydispatchesFactory.loadDispatches(function (audits) {
            $timeout(function(){
              $scope.items1 =  mydispatchesFactory.filterSource(0,audits);
              $scope.items2 =  mydispatchesFactory.filterSource(1,audits);
              $scope.itemscount0 = $scope.items1.length;
              $scope.itemscount1 = $scope.items2.length;
            });
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
            // $scope.auditcontentVisible = "false";
            // $scope.auditcontentprocessVisible = "true";
            document.getElementById("myrequestwaitcontent").style.display="block";
            document.getElementById("myrequestwaitprocess").style.display="none";
            break;
          case 1:
            $scope.css_selected="colUnSelected";
            $scope.css_unselected="colSelected";
            $scope.css_animation="audit_seg_right";
            // $scope.auditcontentVisible = "true";
            // $scope.auditcontentprocessVisible = "false";
            document.getElementById("myrequestwaitcontent").style.display="none";
            document.getElementById("myrequestwaitprocess").style.display="block";
            break;
        }

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        mydispatchesFactory.loadDispatches(function (audits) {
            if(selectedIndex==0){
              $scope.items1 =  mydispatchesFactory.filterSource(selectedIndex,audits);
            }else{
              $scope.items2 =  mydispatchesFactory.filterSource(selectedIndex,audits);
            }
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      };

      /*业务事件*/
      $scope.changeDispatchStatus=function (item,type) {
        try{

          //初始化数据
          loadingShow('提交中...',$ionicLoading);
          var postSavedata = new Object();
          postSavedata.ApplicationVehicles = new Array();
          postSavedata.UserInfo = $scope.platInfo;
          postSavedata.ApplyCode = item.ApplyCode;
          postSavedata.Instruction = type;
          postSavedata.Remark = remark;
          postSavedata.ApplicationVehicles.push({AvId:item.ApplyCode});

          mydispatchesFactory.saveRequest(postSavedata,function (result) {
            showMessage('已成功驳回',$ionicPopup);
            hiddenLoading($ionicLoading);
            $scope.doRefresh();
          },function (error) {
            hiddenLoading($ionicLoading);
            showMessage(error,$ionicPopup);
          });

          return;

          // 自定义弹窗
          var myPopup = $ionicPopup.show({
            template: '<input id="mydispatchwait_remark_input" type="text">',
            title: '备注',
            subTitle: '',
            scope: $scope,
            buttons: [
              { text: '关闭' },
              {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                  var dom = document.getElementById("mydispatchwait_remark_input");
                  if(dom){
                    return dom.value;
                  }else{
                    return "";
                  }
                }
              },
            ]
          });
          var remark="";
          myPopup.then(function(res) {
            try{
              if(res!=undefined){
                remark=res;
              }else{
                return;
              }
            }catch(ex){

            }
            //document.getElementById("mydispatchwait_remark_input").value="";
          });

        }catch(ex){
          hiddenLoading($ionicLoading);
          showAutoHidden('操作异常',$ionicLoading);
        }
      };
      /*跳转*/
      $scope.gotoSend=function (id,type) {
        $state.go("myrequestsend",{"id":id,"type":type.toString()});
      };
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
