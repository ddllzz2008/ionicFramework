/**
 * Created by ddllzz on 16/8/30.
 */

angular.module('mainchartCtrl',['ngCordova'])
  .factory('myfeeFactory',function ($http,$cordovaFile) {
    var myfeeFactory = {};

    myfeeFactory.loadFees = function (success, error) {

      checkRefreshTime($cordovaFile, dbMyFeesTime, function () {
        readFile(dbplatformInfo, function (data) {
          try {

            var postData = JSON.parse(data);
            $http.post(createService("api/Order/MyFee"), postData)
              .success(function (audits) {
                if (audits.Code == "100") {
                  createAndWriteFile(dbMyFees, JSON.stringify(audits.Data), $cordovaFile);
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
        readFile(dbMyFees, function (data) {
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
    myfeeFactory.filterSource = function (apply,type,source) {

      var returnSource = new Array();

      try{

        var lowDate = null;
        var currentDate = new Date();

        switch(type){
          case 1://最近一周
            lowDate = currentDate.DateAdd('d',-7);
            break;
          case 2://最近一月
            lowDate = currentDate.DateAdd('m',-1);
            break;
          case 3://最近三月
            lowDate = currentDate.DateAdd('m',-3);
            break;
        }

        if(lowDate!=null){
          var orderdatestr;
          var orderdate;
          for(var i=0;i<source.length;i++){
            orderdatestr = source[i].Begin_Time.replaceAll('-','/');
            orderdate = new Date(orderdatestr);
            if(orderdate>lowDate){
              if(source[i].ApplyCode.indexOf("ZY")==0){
                source[i].rangeimage = "img/audit_in.png";
              }else{
                source[i].rangeimage = "img/audit_out.png";
              }
              if(apply==-1){
                returnSource.push(source[i]);
              }
              else{
                if(source[i].ApplyType==apply){
                  returnSource.push(source[i]);
                }
              }
            }
          }
        }

      }catch(ex){

      }

      return returnSource;
    }

    return myfeeFactory;

  })
  .controller('mainchartCtrl',['$scope','$state','$rootScope','$ionicHistory','$timeout', '$ionicLoading','$ionicPopup','myfeeFactory',
    function($scope,$state, $rootScope,$ionicHistory,$timeout,$ionicLoading,$ionicPopup,myfeeFactory) {

      /*私有变量*/
      var mainchart = null;
      var type1count = 0;
      var type2count = 0;
      var type3count = 0;
      /*ui数据*/
      $scope.currentID = 103;
      $scope.currentTime = 3;
      /*数据源*/
      $scope.currentSelect = {currentTitle:"保留车辆",totalAmount:0,currentAmount:0,currentPercent:"0%"};
      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {
        console.log("loaded");
      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        $common_ionicLoading = $ionicLoading;

        loadingShow('数据加载中...',$ionicLoading);

        type1count = 0;
        type2count = 0;
        type3count = 0;

        myfeeFactory.loadFees(function (fees) {

          try{
            var totalamount = 0;
            for(var i=0;i<fees.length;i++){
              if(fees[i].ApplyType==103){
                type1count = type1count+fees[i].Expenses+fees[i].Vehicle_Application_Fee;
              }else if(fees[i].ApplyType==100){
                type2count = type2count+fees[i].Expenses+fees[i].Vehicle_Application_Fee;
              }else if(fees[i].ApplyType==101){
                type3count = type3count+fees[i].Expenses+fees[i].Vehicle_Application_Fee;
              }
            }
            totalamount=type1count+type2count+type3count;
            $scope.currentSelect.totalAmount = totalamount.toFixed(2);
            $scope.currentSelect.currentAmount = type1count.toFixed(2);
            $scope.currentSelect.currentPercent = totalamount==0?"0%":((type1count/totalamount)*100).toFixed(2)+"%";

            if(mainchart!=null){
              mainchart.series[0].setData([{name: '保留车辆', y: type1count, id:103,sliced: true, selected: true},
                {name: '应急保障', y: type2count, id:100},
                {name: '社会租赁', y: type3count, id:101}]);
              //mainchart.redraw();
            }

            hiddenLoading($ionicLoading);
          }catch(ex){
            hiddenLoading($ionicLoading);
          }

        },function (error) {
          hiddenLoading($ionicLoading);
        });

      });

      $scope.$on("stateChangeSuccess", function () {
        console.log("change");
      });

      $scope.$on('$ionicView.enter',function () {
        console.log("enter");
        mainchart = $('#mainchart_chart').highcharts({
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: true
          },
          title: {
            text: ''
          },
          tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: false,
              events: {
                click: function(e) {
                  try{
                    $scope.currentID = e.point.id;
                    $scope.currentSelect.currentTitle = dicApplyType[e.point.id];
                    $scope.currentSelect.currentAmount = e.point.y.toFixed(2);
                    $scope.currentSelect.currentPercent = ((e.point.y/$scope.currentSelect.totalAmount)*100).toFixed(2)+"%";
                    $scope.$apply();
                  }catch(ex){

                  }
                }
              },
            }
          },
          series: [{
            type: 'pie',
            name: '',
            data: [{name: '保留车辆', y: type1count, id:103,sliced: true, selected: true},
              {name: '应急保障', y: type2count, id:100},
              {name: '社会租赁', y: type3count, id:101}]
          }]
        }).highcharts();
      });

      /*构造*/

      /*交互事件*/
      $scope.changeDate=function (_index) {
        var m1 = angular.element(document.getElementById("mainchart_label1"));
        var m2 = angular.element(document.getElementById("mainchart_label2"));
        var m3 = angular.element(document.getElementById("mainchart_label3"));
        var mainchart_border = angular.element(document.getElementById("mainchart_border"));
        switch(_index){
          case 1:
            m1.attr('class','right selected');
            m2.attr('class','right normal');
            m3.attr('class','right normal');
            mainchart_border.attr('class','div_border left');
            break;
          case 2:
            m1.attr('class','right normal');
            m2.attr('class','right selected');
            m3.attr('class','right normal');
            mainchart_border.attr('class','div_border middle');
            break;
          case 3:
            m1.attr('class','right normal');
            m2.attr('class','right normal');
            m3.attr('class','right selected');
            mainchart_border.attr('class','div_border right');
            break;
        }

        $scope.currentTime = _index;
        $scope.currentID = 103;

        loadingShow('数据加载中...',$ionicLoading);

        type1count = 0;
        type2count = 0;
        type3count = 0;

        myfeeFactory.loadFees(function (fees) {

          try{
            var newsource = myfeeFactory.filterSource(-1,_index,fees);

            var totalamount = 0;
            for(var i=0;i<newsource.length;i++){
              if(newsource[i].ApplyType==103){
                type1count = type1count+newsource[i].Expenses+newsource[i].Vehicle_Application_Fee;
                totalamount+=type1count;
              }else if(newsource[i].ApplyType==100){
                type2count = type2count+newsource[i].Expenses+newsource[i].Vehicle_Application_Fee;
                totalamount+=type2count;
              }else if(newsource[i].ApplyType==101){
                type3count = type3count+newsource[i].Expenses+newsource[i].Vehicle_Application_Fee;
                totalamount+=type3count;
              }
            }

            $scope.currentSelect.totalAmount = totalamount.toFixed(2);
            $scope.currentSelect.currentAmount = type1count.toFixed(2);
            $scope.currentSelect.currentPercent = totalamount==0?"0%":((type1count/totalamount)*100).toFixed(2)+"%";

            if(mainchart!=null){
              mainchart.series[0].setData([{name: '保留车辆', y: type1count, id:103,sliced: true, selected: true},
                {name: '应急保障', y: type2count, id:100},
                {name: '社会租赁', y: type3count, id:101}]);
            }
            hiddenLoading($ionicLoading);
          }catch(ex){
            hiddenLoading($ionicLoading);
          }

        },function (error) {
          hiddenLoading($ionicLoading);
        });

      }
      /*业务事件*/

      /*跳转*/
      $scope.gotoDetail=function (type) {

        if($scope.currentSelect.currentAmount==0){}

        if(type==0){
          $state.go("mainchartdetail",{"id":$scope.currentID,"time":$scope.currentTime});
        }else{
          $state.go("mainchartdetail",{"id":-1,"time":$scope.currentTime});
        }
      }
      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };
    }]);
