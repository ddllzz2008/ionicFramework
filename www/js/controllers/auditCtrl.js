  /**
 * Created by ddllzz on 16/8/29.
 */
angular.module('auditCtrl',['ngCordova'])
  .factory('myauditFactory',function ($http,$cordovaFile) {
    var myauditFactory = {};

    myauditFactory.loadAudits = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyAuditsTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyApproves"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyAudits, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbMyAudits, function (data) {
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
    myauditFactory.filterSource = function (type,source) {
      var returnSource = new Array();
      switch(type){
        case 0:
          for(var i = 0;i<source.length;i++){
            if(source[i].ApplicationStatus==21){

              // source[i].index = i;
              // source[i].title = "您的订单正在审批中,请耐心等待";
              // source[i].commentvisible = "true";
              // source[i].detailArray = source[i].Auditors;
              // source[i].rowvisible="false";
              // source[i].statevisible="true";

              // if(source[i].ApplicationStatus==21){
              //   source[i].stateimage = "img/mainprocess_auditing@2x.png";
              // }
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
            if(source[i].ApplicationStatus==22||source[i].ApplicationStatus==23||source[i].ApplicationStatus==24
              ||source[i].ApplicationStatus==25){

              // source[i].index = i;
              // source[i].title = "您的订单正在派车中,请耐心等待";
              // source[i].commentvisible = "true";
              // source[i].detailArray = source[i].Dispatchers;
              // source[i].rowvisible="true";
              // source[i].statevisible="false";

              if(source[i].ApplicationStatus==22||source[i].ApplicationStatus==24){
                source[i].stateimage = "img/mainprocess_comfirm@2x.png";
              }
              if(source[i].ApplicationStatus==23||source[i].ApplicationStatus==25){
                source[i].stateimage = "img/mainprocess_reject@2x.png";
              }
              // if(source[i].ApplicationStatus==27){
              //   source[i].stateimage = "img/audit_reject@2x.png";
              // }
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
      }
      return returnSource;
    };

    //更改任务状态
    myauditFactory.changeAuditStatus=function (model,success,error) {
      readFile(dbplatformInfo,function (data) {
        try {

          var platInfo = JSON.parse(data);
          var postData = {
            UserInfo:platInfo,
            ApplyCode:model.ApplyCode,
            Instruction:model.Instruction,
            Type:model.Type,
            Remark:model.Remark
          }
          $http.post(createService("api/Order/VehicleApprove"), postData)
            .success(function (result) {
              if (result.Code == "100") {
                success(true);
              } else {
                error(result.Message);
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
      },$cordovaFile);
    }

    return myauditFactory;

  })
  .controller('auditCtrl',['$scope','$rootScope', '$timeout','$ionicPopup', '$ionicLoading','myauditFactory',
    function($scope, $rootScope,$timeout, $ionicPopup,$ionicLoading,myauditFactory) {
    $scope.items1 = new Array();
      $scope.items2 = new Array();
    $scope.itemscount0 = 0;
    $scope.itemscount1 = 0;
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

      myauditFactory.loadAudits(function (audits) {
          $scope.items1 =  myauditFactory.filterSource(0,audits);
          $scope.itemscount0 = $scope.items1.length;
          $scope.itemscount1 = myauditFactory.filterSource(1,audits).length;
          hiddenLoading($ionicLoading);
        },
        function (error) {
          hiddenLoading($ionicLoading);
          showAutoHidden(error.toString(),$ionicLoading);
        });

    });

    $scope.$on("stateChangeSuccess", function () {
      $scope.loadMore();
    });

    $scope.$on('$ionicView.enter',function () {

    });

    /*事件*/
      $scope.doRefresh=function () {
        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        myauditFactory.loadAudits(function (audits) {
            $scope.items1 =  myauditFactory.filterSource(0,audits);
            $scope.items2 =  myauditFactory.filterSource(1,audits);
            $scope.itemscount0 = $scope.items1.length;
            $scope.itemscount1 = $scope.items2.length;
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
    /*切换列表*/
    $scope.segementChange=function (selectedIndex){
      switch(selectedIndex){
        case 0:
          $scope.css_selected="colSelected";
          $scope.css_unselected="colUnSelected";
          $scope.css_animation="audit_seg_normal";
          document.getElementById("auditcontent").style.display="block";
          document.getElementById("auditcontentprocess").style.display="none";
          break;
        case 1:
          $scope.css_selected="colUnSelected";
          $scope.css_unselected="colSelected";
          $scope.css_animation="audit_seg_right";
          document.getElementById("auditcontent").style.display="none";
          document.getElementById("auditcontentprocess").style.display="block";
          break;
      }

      $common_ionicLoading = $ionicLoading;

      loadingShow('数据加载中...',$ionicLoading);
      //初始化数据

      myauditFactory.loadAudits(function (audits) {
        if(selectedIndex==0){
          $scope.items1 =  myauditFactory.filterSource(selectedIndex,audits);
        }else{
          $scope.items2 =  myauditFactory.filterSource(selectedIndex,audits);
        }
          hiddenLoading($ionicLoading);
        },
        function (error) {
          hiddenLoading($ionicLoading);
          showAutoHidden(error.toString(),$ionicLoading);
        });
    };

    $scope.changeStatus=function (source,type) {
      try {

        if(type==1){//同意
          var model = new Object();
          //初始化数据
          loadingShow('提交中...',$ionicLoading);
          model.ApplyCode = source.ApplyCode;
          model.Instruction=type;
          if(source.ApplicationStatus==21){
            model.Type = 1;
          }else if(source.ApplicationStatus==22){
            model.Type = 2;
          }
          myauditFactory.changeAuditStatus(model,function (result) {
            if(result){
              $scope.doRefresh();
            }
          },function (error) {
            hiddenLoading($ionicLoading);
          });
        }else if(type==2){
// 自定义弹窗
          var myPopup = $ionicPopup.show({
            template: '<input id="myaudit_remark_input" type="text">',
            title: '驳回原因',
            subTitle: '',
            scope: $scope,
            buttons: [
              { text: '关闭' },
              {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function(e) {
                  var dom = document.getElementById("myaudit_remark_input");
                  if(dom){
                    return dom.value;
                  }else{
                    return "";
                  }
                }
              },
            ]
          });
          var model = new Object();
          myPopup.then(function(res) {
            if(res!=undefined){
              model.Remark=res;
            }else{
              return;
            }
            //初始化数据
            loadingShow('提交中...',$ionicLoading);
            model.ApplyCode = source.ApplyCode;
            model.Instruction=type;
            if(source.ApplicationStatus==21){
              model.Type = 1;
            }else if(source.ApplicationStatus==22){
              model.Type = 2;
            }
            myauditFactory.changeAuditStatus(model,function (result) {
              if(result){
                $scope.doRefresh();
              }
            },function (error) {
              hiddenLoading($ionicLoading);
            });
          });
        }

      } catch (ex) {
        showAutoHidden('操作异常',$ionicLoading);
        hiddenLoading($ionicLoading);
      }
    }

      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }

  }]);
