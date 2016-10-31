/**
 * Created by ddllzz on 16/8/30.
 */
function VehicleTypes() {
  var key1;
  var value1;
  var key1visible;
  var key2;
  var value2;
  var key2visible;
}

angular.module('mainrequestCtrl',['ngCordova'])
  .factory('mainrequestFactory',function ($http,$cordovaFile) {
    var mainrequestFactory = {};

    mainrequestFactory.initStaticInfo = function (success, error) {

      checkRefreshTime($cordovaFile, dbStaticDataTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/BasicInfo/StaticData"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbStaticData, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbStaticData, function (data) {
          try {
            if (data != undefined && data != null) {
              var orderDatas = JSON.parse(data);
              success(orderDatas);
            }
          } catch (ex) {
            error(errormessage);
          }
        }, $cordovaFile);
      });
    };
    //筛选数据
    mainrequestFactory.filterSource = function (type,source) {
      try{
        var returnSource = new Array();
        switch(type){
          case 0://部门列表
            break;
          case 1://乘车人
            returnSource = source.DepartmentMembers;
            break;
          case 2://乘车人数
            for(var i=1;i<=10;i++){
              if(i==1){
                returnSource.push({number:i});
              }else{
                returnSource.push({number:i});
              }
            }
            break;
          case 3://用车原因
            returnSource = source.UseReasons;
            break;
          case 4://用车类型
            var types;
            for(var i=0;i<source.VehicleTypes.length;i+=2){
              types = new VehicleTypes();
              types.key1 = source.VehicleTypes[i].Key;
              types.value1 = source.VehicleTypes[i].Value;
              types.key1visible = "false";
              if(i+1<source.VehicleTypes.length){
                types.key2 = source.VehicleTypes[i+1].Key;
                types.value2 = source.VehicleTypes[i+1].Value;
                types.key2visible = "false";
              }else{
                types.key2visible = "true";
              }
              returnSource.push(types);
            }
            break;
          case 5://所有车型
            returnSource = source.VehicleTypes;
            break;
          case 6://所有车辆
            returnSource = source.Vehicles;
            break;
          case 7://所有用车
            returnSource = source.Drivers;
            break;
          case 8://所有费用标准
            returnSource = source.EpenseStandards;
            break;
          case 9://网点
            returnSource = source.SecurityDepmtStations;
            break;
          case 10://折扣率
            for(var i=0;i<=10;i++){
              if(i==1){
                returnSource.push({number:i.toString()});
              }else{
                returnSource.push({number:i.toString()});
              }
            }
            break;
          case 11://租赁公司
            returnSource = source.CompanyVehicleTypes;
            break;
          case 12://应急保障
            var types;
            for(var i=0;i<source.SecurityDepartmentVehicleTypes.length;i+=2){
              types = new VehicleTypes();
              types.key1 = source.SecurityDepartmentVehicleTypes[i].Key;
              types.value1 = source.SecurityDepartmentVehicleTypes[i].Value;
              types.key1visible = "false";
              if(i+1<source.SecurityDepartmentVehicleTypes.length){
                types.key2 = source.SecurityDepartmentVehicleTypes[i+1].Key;
                types.value2 = source.SecurityDepartmentVehicleTypes[i+1].Value;
                types.key2visible = "false";
              }else{
                types.key2visible = "true";
              }
              returnSource.push(types);
            }
            break;
        }
        return returnSource;
      }catch(ex){
        return new Array();
      }
    };

    mainrequestFactory.saveRequest=function (postData,success,error) {
      $http.post(createService("api/Order/VehicleApply"), postData)
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

    return mainrequestFactory;

  })
  .controller('mainrequestCtrl',['$scope','$state','$rootScope','$ionicPopup','$ionicPopover','$ionicHistory','$timeout', '$ionicLoading','mainrequestFactory','commonService',
    function($scope, $state,$rootScope,$ionicPopup,$ionicPopover,$ionicHistory,$timeout,$ionicLoading,mainrequestFactory,commonService) {

      $scope.popover = $ionicPopover.fromTemplateUrl('select-company.html', {
        scope: $scope
      });
      $ionicPopover.fromTemplateUrl('select-company.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      /*私有变量*/
      var vehicletypeList = new Array();

      var postSavedata={
        ApplyType: null,
        DepartmentId:null,
        DepartmentId: null,
        UserInfo: null,
        GetonAddresses:null,
        GetoffAddresses:null,
        ApplicationVehicles:null,
        VehicleApplication:null
      }
      /*ui数据*/
      $scope.departmentselect="";
      $scope.nameselect="";
      $scope.numberselect="";
      $scope.reasonselect="";

      /*业务属性*/
      $scope.platInfo=null;
      $scope.departmentList = new Array();
      $scope.namementList = new Array();
      $scope.applicantmentList = new Array();
      $scope.reasonList = new Array();
      $scope.companytypeList = new Array();
      $scope.companyItems = new Array();
      $scope.companyList = new Array();

      $scope.crapplytype=103;
      $scope.myreason="";
      $scope.mydepartment="";
      $scope.mynamement=0;
      $scope.myapplicantment=1;
      $scope.crphone={text:""};
      $scope.crstartdate="";
      $scope.crstarttime="";
      $scope.crstart="";
      $scope.crenddate="";
      $scope.crendtime="";
      $scope.crend="";
      $scope.crduration=0;
      $scope.address = {on:"",off:""};
      $scope.crmark={text:""};
      $scope.vehiclesTypes=[];
      $scope.selectedCompany = 0;

      function vehiclestype() {
        var VehicleTypeid;
        var Quantity;
      }

      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';
        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);
        //初始化数据

        mainrequestFactory.initStaticInfo(function (datas) {
            try{

              commonService.getPlatInfo(function (platinfo) {
                $scope.platInfo=platinfo;
              });

              commonService.getCurrentUser(function (user) {
                $scope.departmentList.push({DepartmentId:user.DepartmentId,DepartmentName:user.DepartmentName});
                $scope.mydepartment = user.DepartmentId;
                $scope.departmentselect = user.DepartmentName;

                if(user.Type==2){
                  document.getElementById("mainrequest_seg2").style.display="none";
                }
              });

              $scope.namementList =  mainrequestFactory.filterSource(1,datas);
              if($scope.namementList!=undefined&&$scope.namementList.length>0){
                $scope.mynamement = $scope.namementList[0].UserId;
                $scope.crphone = {text:$scope.namementList[0].MobilePhone};

                $scope.nameselect = $scope.namementList[0].Name;
              }

              $scope.applicantmentList =  mainrequestFactory.filterSource(2,datas);
              if($scope.applicantmentList!=undefined&&$scope.applicantmentList.length>0){
                $scope.myapplicantment = $scope.applicantmentList[0].number;

                $scope.numberselect = $scope.applicantmentList[0].number.toString();
              }

              $scope.reasonList =  mainrequestFactory.filterSource(3,datas);
              if($scope.reasonList!=undefined&&$scope.reasonList.length>0){
                $scope.myreason = $scope.reasonList[0].Key;

                $scope.reasonselect = $scope.reasonList[0].Value;
              }
              vehicletypeList = mainrequestFactory.filterSource(4,datas);
              $scope.vehicletypeList = vehicletypeList;
              companytypeList = mainrequestFactory.filterSource(12,datas);

              //租赁公司
              $scope.companyList = mainrequestFactory.filterSource(11,datas);
              var clist = new Array();
              for (var i =0;i<$scope.companyList.length;i++){
                if(clist[$scope.companyList[i].OrgId]!=null&&clist[$scope.companyList[i].OrgId]!=undefined){
                  continue;
                }else{
                  clist[$scope.companyList[i].OrgId] = $scope.companyList[i].CompanyName;
                  $scope.companyItems.push({OrgId:$scope.companyList[i].OrgId,CompanyName:$scope.companyList[i].CompanyName});
                }
              }
            }catch(ex){

            }
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });
      });

      $scope.$on("stateChangeSuccess", function () {
      });

      $scope.$on('$ionicView.enter',function () {
        var mainrequest_carheaders = document.getElementsByClassName("mainrequest_carheader");
        var mainrequest_carbottoms = document.getElementsByClassName("mainrequest_carbottom");
        for(var i=0;i<mainrequest_carheaders.length;i++){
          mainrequest_carheaders[i].style.height = mainrequest_carheaders[i].clientWidth * 3 /4+"px";
        }
        for(var i=0;i<mainrequest_carbottoms.length;i++){
          mainrequest_carbottoms[i].style.height = mainrequest_carbottoms[i].clientWidth * 1 /4+"px";
          mainrequest_carbottoms[i].style.lineHeight = mainrequest_carbottoms[i].clientWidth * 1 /4+"px";
        }
      });

      /*构造*/

      /*交互事件*/
      /*切换列表*/
      $scope.segementChange=function (selectedIndex,$event){
        var mainrequest_seg =angular.element(document.getElementById("mainrequest_seg"));
        var mainrequest_seg1 =angular.element(document.getElementById("mainrequest_seg1"));
        var mainrequest_seg2 =angular.element(document.getElementById("mainrequest_seg2"));
        var mainrequest_seg3 =angular.element(document.getElementById("mainrequest_seg3"));
        switch(selectedIndex){
          case 0:
            mainrequest_seg.attr('class','mainrequest_seg left');
            mainrequest_seg1.attr('class','col col-33 colSelected');
            mainrequest_seg2.attr('class','col col-33 colUnSelected');
            mainrequest_seg3.attr('class','col col-33 colUnSelected');
            $scope.crapplytype=103;
            $scope.vehicletypeList = vehicletypeList;
            break;
          case 1:
            mainrequest_seg.attr('class','mainrequest_seg middle');
            mainrequest_seg1.attr('class','col col-33 colUnSelected');
            mainrequest_seg2.attr('class','col col-33 colSelected');
            mainrequest_seg3.attr('class','col col-33 colUnSelected');
            $scope.crapplytype=100;
            $scope.vehicletypeList = companytypeList;
            break;
          case 2:
            $scope.popover.show($event);
            return;
            mainrequest_seg.attr('class','mainrequest_seg right');
            mainrequest_seg1.attr('class','col col-33 colUnSelected');
            mainrequest_seg2.attr('class','col col-33 colUnSelected');
            mainrequest_seg3.attr('class','col col-33 colSelected');
            $scope.crapplytype=101;
            break;
        }
      }
      /*选择租赁公司*/
      $scope.chooseCompany=function (orgid) {
        var mainrequest_seg =angular.element(document.getElementById("mainrequest_seg"));
        var mainrequest_seg1 =angular.element(document.getElementById("mainrequest_seg1"));
        var mainrequest_seg2 =angular.element(document.getElementById("mainrequest_seg2"));
        var mainrequest_seg3 =angular.element(document.getElementById("mainrequest_seg3"));
        $scope.popover.hide();
        mainrequest_seg.attr('class','mainrequest_seg right');
        mainrequest_seg1.attr('class','col col-33 colUnSelected');
        mainrequest_seg2.attr('class','col col-33 colUnSelected');
        mainrequest_seg3.attr('class','col col-33 colSelected');

        $scope.crapplytype=101;

        $scope.selectedCompany = orgid;

        $scope.vehicletypeList = new Array();

        var typeList = new Array();
        for(var i=0;i<$scope.companyList.length;i++){
          if($scope.companyList[i].OrgId==orgid){
            typeList.push($scope.companyList[i]);
          }
        }

        for(var i=0;i<typeList.length;i+=2){
          types = new VehicleTypes();
          types.key1 = typeList[i].VehicleTypeId;
          types.value1 = typeList[i].VehicleName;
          types.key1visible = "false";
          if(i+1<typeList.length){
            types.key2 = typeList[i+1].VehicleTypeId;
            types.value2 = typeList[i+1].VehicleName;
            types.key2visible = "false";
          }else{
            types.key2visible = "true";
          }
          $scope.vehicletypeList.push(types);
        }
      }

      $scope.departmentChanged=function (deparment) {

      }

      //用车姓名选择
      $scope.nameChanged=function (name) {
        for(var i=0;i<$scope.namementList.length;i++){
          if($scope.namementList[i].Name==name){
            $scope.crphone = {text:$scope.namementList[i].MobilePhone};
            $scope.mynamement = $scope.namementList[i].UserId;
            break;
          }
        }
      }

      $scope.numberChanged=function (number) {
        $scope.myapplicantment=parseInt(number);
      }

      $scope.reasonChanged=function (reason) {
        for(var i=0;i<$scope.reasonList.length;i++){
          if($scope.reasonList[i].Value==reason){
            $scope.myreason = $scope.reasonList[i].Key;
            break;
          }
        }
      }

      //日期控件下拉
      $scope.selectDate=function (type) {
        // document.addEventListener("deviceready", function () {
        //   $cordovaDatePicker.show(optionsDate).then(function(date){
        //     //alert(date);
        //     $cordovaDatePicker.show(optionsTime).then(function(date){
        //       //alert(date);
        //     });
        //   });
        // }, false);
        var options = {
          date: new Date(),
          mode: 'datetime',
          doneButtonLabel:'确定',
          cancelButtonLabel:'关闭',
          locale:'zh_cn'
        };

        function onSuccess(date) {
          if(type==0){
            $scope.crstartdate=date.Format('MM-dd');
            $scope.crstarttime=date.Format('HH:mm');
            $scope.crstart = date.Format('yyyy-MM-dd HH:mm:ss');
          }else{
            $scope.crenddate=date.Format('MM-dd');
            $scope.crendtime=date.Format('HH:mm');
            $scope.crend = date.Format('yyyy-MM-dd HH:mm:ss');
          }
          if($scope.crstart!=""&&$scope.crend!=""){
            var startDate = new Date($scope.crstart.replaceAll('-','/'));
            var endDate = new Date($scope.crend.replaceAll('-','/'));
            if(startDate>endDate){
              showMessage('结束时间不能小于开始时间',$ionicPopup);
              $scope.crenddate="";
              $scope.crendtime="";
              $scope.crend="";
            }else{
              $scope.crduration = startDate.GetDateDiff('h',endDate);
            }
          }
          $scope.$apply();//需要手动刷新
        }

        function onError(error) { // Android only
          //alert('Error: ' + error);
        }

        datePicker.show(options, onSuccess, onError);
      }

      $scope.addcar =function (index) {
        try{
          var vtypenumber = angular.element(document.getElementById("mainrequest_vehicletypes_"+index));
          var current = vtypenumber.html();
          var currentnumber = parseInt(current);
          currentnumber++;
          vtypenumber.html(currentnumber);

          if($scope.vehiclesTypes!=null&&$scope.vehiclesTypes.length>0){
            var contains = false;
            for (var i=0;i<$scope.vehiclesTypes.length;i++){
              if($scope.vehiclesTypes[i].VehicleTypeid==parseInt(index)){
                $scope.vehiclesTypes[i].Quantity=currentnumber;
                contains =true;
                break;
              }
            }
            if(!contains){
              $scope.vehiclesTypes.push({VehicleTypeid:parseInt(index),Quantity:currentnumber});
            }
          }else{
            $scope.vehiclesTypes = new Array();
            $scope.vehiclesTypes.push({VehicleTypeid:parseInt(index),Quantity:currentnumber});
          }

        }catch(ex){

        }
      }
      $scope.releasecar =function (index) {
        try{
          var vtypenumber = angular.element(document.getElementById("mainrequest_vehicletypes_"+index));
          var current = vtypenumber.html();
          var currentnumber = parseInt(current);
          if(currentnumber>0){
            currentnumber--;
            vtypenumber.html(currentnumber);

            if($scope.vehiclesTypes!=null&&$scope.vehiclesTypes.length>0){
              var contains = false;
              for (var i=0;i<$scope.vehiclesTypes.length;i++){
                if($scope.vehiclesTypes[i].VehicleTypeid==parseInt(index)){
                  $scope.vehiclesTypes[i].Quantity=currentnumber;
                  contains =true;
                  break;
                }
              }
              if(!contains){
                $scope.vehiclesTypes.push({VehicleTypeid:parseInt(index),Quantity:currentnumber});
              }
            }else{
              $scope.vehiclesTypes = new Array();
              $scope.vehiclesTypes.push({VehicleTypeid:parseInt(index),Quantity:currentnumber});
            }

          }
        }catch(ex){

        }
      }
      /*业务事件*/
      $scope.saveRequest = function () {
        try{
          if($scope.crphone.text==""){
            showMessage('您忘记填电话了',$ionicPopup);
            return;
          }
          if($scope.crstart==""){
            showMessage('您忘记填开始时间了',$ionicPopup);
            return;
          }
          if($scope.crend==""){
            showMessage('您忘记填结束时间了',$ionicPopup);
            return;
          }
          if($scope.address.on==""){
            showMessage('您忘记填上车地点了',$ionicPopup);
            return;
          }
          if($scope.address.off==""){
            showMessage('您忘记填下车地点了',$ionicPopup);
            return;
          }
          if($scope.vehiclesTypes!=null&&$scope.vehiclesTypes.length>0){
            var count = false;
            for (var i=0;i<$scope.vehiclesTypes.length;i++){
              if($scope.vehiclesTypes[i].Quantity>0){
                count = true;
                break;
              }
            }
            if(!count){
              showMessage('您还没选择车型',$ionicPopup);
              return;
            }
          }else{
            showMessage('您还没选择车型',$ionicPopup);
            return;
          }
          loadingShow('提交中...',$ionicLoading);
          postSavedata.DepartmentId=$scope.mydepartment;
          // postSavedata.DepartmentId=1;
          postSavedata.ApplyType = $scope.crapplytype;
          postSavedata.UserInfo = $scope.platInfo;
          postSavedata.GetonAddresses=[{Address:$scope.address.on}];
          postSavedata.GetoffAddresses=[{Address:$scope.address.off}];
          postSavedata.VehicleApplication = new Object();
          postSavedata.VehicleApplication.UserId = $scope.mynamement;
          postSavedata.VehicleApplication.CcId = $scope.selectedCompany;
          postSavedata.VehicleApplication.ApplicantPhone = $scope.crphone.text;
          postSavedata.VehicleApplication.PassengersNumber = $scope.myapplicantment;
          postSavedata.VehicleApplication.UsageTime = $scope.crstart;
          postSavedata.VehicleApplication.Duration = $scope.crduration;
          postSavedata.VehicleApplication.ReturnTime = $scope.crend;
          postSavedata.VehicleApplication.Applicant = $scope.nameselect;
          postSavedata.VehicleApplication.Reason = $scope.myreason;
          postSavedata.VehicleApplication.Reason = $scope.myreason;
          postSavedata.VehicleApplication.Remarks = $scope.crmark.text;
          postSavedata.VehicleApplication.OrgId = currentUser.OrgId;
          postSavedata.ApplicationVehicles=$scope.vehiclesTypes;

          mainrequestFactory.saveRequest(postSavedata,function (result) {
            showMessage('提交申请成功',$ionicPopup);
            hiddenLoading($ionicLoading);
            $state.go("app.tab.main");
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
        $ionicHistory.clearCache();
        $ionicHistory.goBack();
      };
    }]);
