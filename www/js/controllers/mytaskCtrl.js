/**
 * Created by ddllzz on 16/8/30.
 */
/**
 * Created by ddllzz on 16/8/29.
 */
function datapickerObject() {
  var day;
  var istoday;
  var currentmonth;
  var datestring;
  var htmlcontent;
}

angular.module('mytaskCtrl',['ngCordova'])
  .factory('mytaskFactory',function ($http,$cordovaFile) {
    var mytaskFactory = {};

    mytaskFactory.loadTasks = function (success, error,refreshmode) {

      checkRefreshTime($cordovaFile, dbMyTasksTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyTasks"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyTasks, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbMyTasks, function (data) {
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
    mytaskFactory.filterSource = function (time,source) {
      try{
        var returnSource = new Array();
        for(var i = 0;i<source.length;i++){
          if(source[i].UsageTime!=undefined && source[i].UsageTime!=""){

            source[i].index = i;
            var datestart = new Date(source[i].UsageTime.replaceAll('-','/'));
            var dateend = new Date(source[i].ReturnTime.replaceAll('-','/'));
            if(datestart.Format('yyyy/MM/dd')==time){
              if(source[i].ApplicationStatus==26||source[i].ApplicationStatus==28||source[i].ApplicationStatus==29||source[i].ApplicationStatus==30
              ||source[i].ApplicationStatus==31||source[i].ApplicationStatus==32||source[i].ApplicationStatus==33
                ||source[i].ApplicationStatus==34||source[i].ApplicationStatus==35||source[i].ApplicationStatus==36||source[i].ApplicationStatus==37)
              {
                if(source[i].ApplyCode.indexOf("ZY")==0){
                  source[i].rangeimage = "img/audit_in.png";
                }else{
                  source[i].rangeimage = "img/audit_out.png";
                }
                if(source[i].ApplicationStatus==26||source[i].ApplicationStatus==28){
                  source[i].statusText = "确认";
                  source[i].status = 1;
                }else if(source[i].ApplicationStatus==30){
                  source[i].statusText = "结束";
                  source[i].status = 3;
                }
                else if(source[i].ApplicationStatus==31){
                  source[i].statusText = "交车";
                  source[i].status = 4;
                }else if(source[i].ApplicationStatus==32){
                  source[i].statusText = "已结束";
                  source[i].status = 5;
                }else if(source[i].ApplicationStatus==29){
                  source[i].statusText = "出发";
                  source[i].status = 2;
                }
                else if(source[i].ApplicationStatus>=33){
                  source[i].statusText = "已完成";
                  source[i].status = 0;
                }

                source[i].start = datestart.Format('MM-dd HH:mm');
                source[i].end = dateend.Format('MM-dd HH:mm');

                returnSource.push(source[i]);
              }
            }
          }
        }
        return returnSource;
      }catch(ex){
        return new Array();
      }
    };

    //更改任务状态
    mytaskFactory.changeTaskStatus=function (model,success,error) {
      readFile(dbplatformInfo,function (data) {
        try {

          var platInfo = JSON.parse(data);
          var postData = {
            UserInfo:platInfo,
            ApplyCode:model.ApplyCode,
            Driver_ID:model.Driver_ID,
            Service_Type:model.Service_Type,
            Remark:model.Remark
          }
          $http.post(createService("api/Order/DriverServiceStatus"), postData)
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

    mytaskFactory.getDetail=function (code,success,error) {
      mytaskFactory.loadTasks(function (result) {
        try{
          var source = null;
          for(var i=0;i<result.length;i++){
            if(result[i].ApplyCode==code){
              if(result[i].ApplicationStatus==26||result[i].ApplicationStatus==28||result[i].ApplicationStatus==29||result[i].ApplicationStatus==30
                ||result[i].ApplicationStatus==31||result[i].ApplicationStatus==32||source[i].ApplicationStatus==33
                ||source[i].ApplicationStatus==34||source[i].ApplicationStatus==35||source[i].ApplicationStatus==36||source[i].ApplicationStatus==37) {
                if (result[i].ApplyCode.indexOf("ZY") == 0) {
                  result[i].rangeimage = "img/audit_in.png";
                } else {
                  result[i].rangeimage = "img/audit_out.png";
                }
                if (result[i].ApplicationStatus == 26 || result[i].ApplicationStatus == 28) {
                  result[i].statusText = "确认";
                  result[i].status = 1;
                } else if (result[i].ApplicationStatus == 30) {
                  result[i].statusText = "结束";
                  result[i].status = 3;
                }
                else if (result[i].ApplicationStatus == 31) {
                  result[i].statusText = "交车";
                  result[i].status = 4;
                } else if (result[i].ApplicationStatus == 32) {
                  result[i].statusText = "已结束";
                  result[i].status = 5;
                } else if (result[i].ApplicationStatus == 29) {
                  result[i].statusText = "出发";
                  result[i].status = 2;
                }else if(source[i].ApplicationStatus>=33){
                  source[i].statusText = "已完成";
                  source[i].status = 0;
                }

                // result[i].start = datestart.Format('MM-dd HH:mm');
                // result[i].end = dateend.Format('MM-dd HH:mm');
              }
              source = result[i];
              break;
            }
          }
          if(success){
            if(source==null){
              error();
            }else{
              success(source);
            }
          }
        }catch(ex){
          error();
        }
      },function (er) {
        error();
      });
    }

    return mytaskFactory;

  })
  .controller('mytaskCtrl',['$scope','$state','$rootScope','$ionicScrollDelegate','$timeout', '$ionicLoading','$ionicPopup','mytaskFactory',
    function($scope, $state,$rootScope,$ionicScrollDelegate,$timeout,$ionicLoading,$ionicPopup,mytaskFactory) {

      /*私有变量*/
      $scope.isdateOpen = 0;
      $scope.txtremark="";
      /*ui数据*/
      $scope.datesource1 = new Array(7);
      $scope.datesource2 = new Array(7);
      $scope.datesource3 = new Array(7);
      $scope.datesource4 = new Array(7);
      $scope.datesource5 = new Array(7);
      $scope.datesource6 = new Array(7);
      $scope.currentMonthString= (new Date()).Format('yyyy年MM月');
      $scope.currentMonth= (new Date());
      $scope.selectedLastDate="taskdate-"+(new Date()).Format('yyyy-MM-dd');
      $scope.selectedDate = (new Date()).Format('yyyy/MM/dd');

      /*数据源*/
      $scope.items=new Array();

      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {
        console.log('enter loaded');
        //初始化日期
        initDate(new Date());
        //初始化数据
        $common_ionicLoading = $ionicLoading;

        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        mytaskFactory.loadTasks(function (tasks) {
            var date = new Date();
            $scope.items =  mytaskFactory.filterSource(date.Format('yyyy/MM/dd'),tasks);
            // $scope.items =  mytaskFactory.filterSource('2016/08/31',tasks);
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });

      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';
        //alert();
        if(istaskRefresh){
          $scope.doRefresh();
          istaskRefresh=false;
          return;
        }

      });

      $scope.$on("stateChangeSuccess", function () {

      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/
      $scope.doRefresh=function () {
        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        mytaskFactory.loadTasks(function (tasks) {
            $scope.items =  mytaskFactory.filterSource($scope.selectedDate,tasks);
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
          },
          function (error) {
            $scope.$broadcast('scroll.refreshComplete');
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          },true);
      };
      //构造日期数据
      function initDate(_date) {
        try{

          var days_of_month = new Array(31, 28+is_leap(_date.getFullYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

          var currentDate = new Date();
          // var startDate = new Date(_date.DatePart('y')+"-"+_date.DatePart('m')+"-01");
          var startDate = new Date(_date.DatePart('y'),_date.DatePart('m')-1,1);
          var week = startDate.getDay();
          var month = startDate.getMonth(); //获取月份，返回值是0(一月)到11(十二月)之间的一个整数。
          //var endDate = new Date(_date.DatePart('y')+"-"+_date.DatePart('m')+"-"+days_of_month[month]);
          var endDate = new Date(_date.DatePart('y'),_date.DatePart('m')-1,days_of_month[month]);
          //var rows=Math.ceil((days_of_month[month] + week) / 7);
          var rows= 6;
          var date_of_month = _date.getDate(); //获取日期，返回值是1~31之间的一个整数

          var date_str;

          $scope.datesource1 = new Array();
          $scope.datesource2 = new Array();
          $scope.datesource3 = new Array();
          $scope.datesource4 = new Array();
          $scope.datesource5 = new Array();
          $scope.datesource6 = new Array();

          var returnDate;
          var dateObject;
          //打印表格第一行（有星期标志）
          for (i = 0; i < rows; i++) { //表格的行

            for (k = 0; k < 7; k++) { //表格每行的单元格

              dateObject = new datapickerObject();

              idx = i * 7 + k; //单元格自然序列号
              date_str = idx - week; //计算日期
              //过滤无效日期（小于等于零的、大于月总天数的
              if(date_str < 0){
                //上月
                returnDate = startDate.DateAdd('d',date_str);
                dateObject.day =returnDate.DatePart('d');
                dateObject.istoday=false;
                dateObject.currentmonth=false;
                dateObject.datestring = returnDate.Format('yyyy/MM/dd');
                if($scope.selectedDate==dateObject.datestring){
                  dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #cccccc;border-radius: 15px;\"><label style='color:#999999'>"+dateObject.day+"</label></div>";
                }else{
                  dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #ffffff;border-radius: 15px;\"><label style='color:#999999'>"+dateObject.day+"</label></div>";
                }
                if(i==0){
                  $scope.datesource1.push(dateObject);
                }else if(i==1){
                  $scope.datesource2.push(dateObject);
                }
                else if(i==2){
                  $scope.datesource3.push(dateObject);
                }
                else if(i==3){
                  $scope.datesource4.push(dateObject);
                }
                else if(i==4){
                  $scope.datesource5.push(dateObject);
                }
                else if(i==5) {
                  $scope.datesource6.push(dateObject);
                }
              }
              else if(date_str >= days_of_month[month]){
                //下月
                returnDate = endDate.DateAdd('d',date_str-days_of_month[month]+1);
                dateObject.day =returnDate.DatePart('d');
                dateObject.istoday=false;
                dateObject.currentmonth=false;
                dateObject.datestring = returnDate.Format('yyyy/MM/dd');
                if($scope.selectedDate==dateObject.datestring){
                  dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #cccccc;border-radius: 15px;\"><label style='color:#999999'>"+dateObject.day+"</label></div>";
                }else{
                  dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #ffffff;border-radius: 15px;\"><label style='color:#999999'>"+dateObject.day+"</label></div>";
                }
                if(i==0){
                  $scope.datesource1.push(dateObject);
                }else if(i==1){
                  $scope.datesource2.push(dateObject);
                }
                else if(i==2){
                  $scope.datesource3.push(dateObject);
                }
                else if(i==3){
                  $scope.datesource4.push(dateObject);
                }
                else if(i==4){
                  $scope.datesource5.push(dateObject);
                }
                else if(i==5) {
                  $scope.datesource6.push(dateObject);
                }
              }
              else{
                //本月
                returnDate = startDate.DateAdd('d',date_str);
                dateObject.day =returnDate.DatePart('d');
                dateObject.currentmonth=true;
                dateObject.datestring = returnDate.Format('yyyy/MM/dd');
                //打印日期：今天底色为红
                if (date_str+1 == date_of_month && (month==currentDate.getMonth())) {
                  dateObject.istoday=true;
                  dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #35bcf8;border-radius: 15px;\"><label style='color: #ffffff'>今</label></div>";
                } else {
                  dateObject.istoday=false;
                  if($scope.selectedDate==dateObject.datestring){
                    dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #cccccc;border-radius: 15px;\"><label style='color:#333333'>"+dateObject.day+"</label></div>";
                  }else{
                    dateObject.htmlcontent = "<div id='taskdate-"+dateObject.datestring+"' style=\"height:30px;width: 30px;margin:auto auto;background-color: #ffffff;border-radius: 15px;\"><label style='color:#333333'>"+dateObject.day+"</label></div>";
                  }
                }
                if(i==0){
                  $scope.datesource1.push(dateObject);
                }else if(i==1){
                  $scope.datesource2.push(dateObject);
                }
                else if(i==2){
                  $scope.datesource3.push(dateObject);
                }
                else if(i==3){
                  $scope.datesource4.push(dateObject);
                }
                else if(i==4){
                  $scope.datesource5.push(dateObject);
                }
                else if(i==5) {
                  $scope.datesource6.push(dateObject);
                }
              }
            }
          }

          $scope.currentMonth = _date;
          $scope.currentMonthString = $scope.currentMonth.Format('yyyy年MM月');

        }catch(ex){
          showmessage(ex);
        }
      }
      //日期控件下拉
      $scope.showDate=function () {
        var row1 = angular.element(document.getElementById("date1"));
        var row2 = angular.element(document.getElementById("date2"));
        var row3 = angular.element(document.getElementById("date3"));
        var row4 = angular.element(document.getElementById("date4"));
        var row5 = angular.element(document.getElementById("date5"));
        var row6 = angular.element(document.getElementById("date6"));
        var oper = angular.element(document.getElementById("mytask_date_oper"));
        if($scope.isdateOpen==0){//收起状态,需要展开
          row2.css('height','auto');
          row3.css('height','auto');
          row4.css('height','auto');
          row5.css('height','auto');
          row6.css('height','auto');
          row2.css('opacity','1');
          row3.css('opacity','1');
          row4.css('opacity','1');
          row5.css('opacity','1');
          row6.css('opacity','1');
          oper.attr('src','img/mytask_date_hidden@2x.png');
          $scope.isdateOpen=1;
        }else{//展开状态,需要收起
          row2.css('height','0px');
          row3.css('height','0px');
          row4.css('height','0px');
          row5.css('height','0px');
          row6.css('height','0px');
          row2.css('opacity','0');
          row3.css('opacity','0');
          row4.css('opacity','0');
          row5.css('opacity','0');
          row6.css('opacity','0');
          oper.attr('src','img/mytask_date_show@2x.png');
          $scope.isdateOpen=0;
        }
        $ionicScrollDelegate.$getByHandle('scrollmytask').resize();
      }

      /*业务事件*/
      $scope.changeDate=function (selectedDate) {
        var lastDom = angular.element(document.getElementById($scope.selectedLastDate));
        var currentId = "taskdate-"+selectedDate;
        var currentDom = angular.element(document.getElementById(currentId));

        var currentDate = "taskdate-" + (new Date()).Format('yyyy/MM/dd');

        if(lastDom!=null&&lastDom!=undefined){
          if($scope.selectedLastDate!=currentDate){
            lastDom.css('background-color','#ffffff');
          }
        }
        if(currentDom!=null&&currentDom!=undefined){
          if(currentId!=currentDate){
            currentDom.css('background-color','#cccccc');
          }
        }

        $scope.selectedLastDate = currentId;
        $scope.selectedDate = selectedDate;

        //初始化数据
        loadingShow('数据加载中...',$ionicLoading);
        mytaskFactory.loadTasks(function (tasks) {
            $scope.items =  mytaskFactory.filterSource(selectedDate,tasks);
            hiddenLoading($ionicLoading);
          },
          function (error) {
            hiddenLoading($ionicLoading);
            showAutoHidden(error.toString(),$ionicLoading);
          });
      };

      $scope.nextMonth=function () {
        try {
          var newDate = $scope.currentMonth.DateAdd('m',1);
          initDate(newDate);

        }catch (ex){
          console.log(ex);
        }
      };

      $scope.lastMonth=function () {
        try {
          newDate = $scope.currentMonth.DateAdd('m',-1);
          initDate(newDate);

        }catch (ex){
          console.log(ex);
        }
      };

      $scope.showtaskdetail=function (_index) {
        var detailrow = angular.element(document.getElementById("detailrow_"+_index));
        var detailimg =angular.element(document.getElementById("detailimg_"+_index));
        if(detailrow!=null&&detailrow!=undefined){
          if(detailrow.css('height')=='0px'){
            // detailrow.css('display','block');
            detailrow.css('height','auto');
            detailrow.css('border-width','1px');
            // detailrow.css('opacity','1');
            detailimg.attr('src','img/mytask_date_hidden@2x.png')
          }else{
            // detailrow.css('display','none');
            detailrow.css('height','0px');
            detailrow.css('border-width','0px');
            // detailrow.css('opacity','0');
            detailimg.attr('src','img/mytask_date_show@2x.png')
          }
        }

        $ionicScrollDelegate.$getByHandle('scrollmytask').resize();
      }

      $scope.changeStatus=function (source) {

        if(source.status==2 || source.status == 3){
          $state.go('mytaskmap',{"id":source.ApplyCode});
          return;
        }
        if(source.status==5){
          return;
        }

        //初始化数据
        loadingShow('提交中...',$ionicLoading);
        var model = new Object();
        model.ApplyCode = source.ApplyCode;
        model.Driver_ID = currentUser.Id;
        model.Service_Type=source.status;
        mytaskFactory.changeTaskStatus(model,function (result) {
          if(result){
            showAutoHidden('成功',$ionicLoading);
            $scope.doRefresh();
          }
        },function (error) {
          hiddenLoading($ionicLoading);
          showAutoHidden(error,$ionicLoading);
        });

        return;

        // 自定义弹窗
        var myPopup = $ionicPopup.show({
          template: '<input id="mytask_remark_input" type="text">',
          title: '备注',
          subTitle: '',
          scope: $scope,
          buttons: [
            { text: '关闭' },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                var dom = document.getElementById("mytask_remark_input");
                if(dom){
                  return dom.value;
                }else{
                  return "";
                }
              }
            },
          ]
        });

        myPopup.then(function(res) {
          if(res!=undefined){
            model.Remark=res;
          }else{
            return;
          }

        });
      }

      /*待开发*/
      $scope.navfix=function () {
        showDevelop($ionicPopup);
      };

      $scope.navmaintain=function () {
        showDevelop($ionicPopup);
      };

      $scope.navwash=function () {
        showDevelop($ionicPopup);
      };

      $scope.navoil=function () {
        showDevelop($ionicPopup);
      };

      $scope.gotoMessage=function () {
        showDevelop($ionicPopup);
      }

    }]);
