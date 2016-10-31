/**
 * Created by ddllzz on 16/8/29.
 */

angular.module('mytaskmapCtrl',['ngCordova'])
  .controller('mytaskmapCtrl',['$scope','$stateParams','$rootScope','$ionicHistory', '$ionicLoading','$ionicPopup','$logicHttp','mytaskFactory',
    function($scope, $stateParams,$rootScope,$ionicHistory,$ionicLoading,$ionicPopup
      ,$logicHttp,mytaskFactory) {

      /*私有变量*/
      $scope.source = new Object();
      /*ui数据*/

      /*生命周期*/
      $scope.$on('$ionicView.loaded', function() {
        //定位
        var map = new BMap.Map("mapcontainer");

        var point = new BMap.Point(114.31, 30.52);
        map.centerAndZoom(point, 15);

        function myFun(result) {
          var cityName = result.name;
          //map.centerAndZoom(cityName,15);

        }

        var myCity = new BMap.LocalCity();
        myCity.get(myFun);

        document.addEventListener("deviceready", function () {
          //ios平台和android平台不同定位方式
          if (!isAndroid) {
            var onSuccess = function (position) {
              try {

                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                var ggPoint = new BMap.Point(long,lat);

                var convertor = new BMap.Convertor();
                var pointArr = [];
                pointArr.push(ggPoint);
                convertor.translate(pointArr, 1, 5, function (data) {
                  if(data.status === 0) {
                    var point = data.points[0];  // 创建点坐标
                    map.setCenter(point);

                    //创建定位
                    var myIcon = new BMap.Icon("http://www.wisdomcar.cn/location.png", new BMap.Size(25, 25));
                    var marker2 = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                    map.addOverlay(marker2);              // 将标注添加到地图中
                  }
                })

              } catch (ex) {
                showAutoHidden('定位失败,', $ionicLoading);
              }
            };
            function onError(error) {
              showAutoHidden('定位失败,', $ionicLoading);
            }
            var posOptions = {timeout: 30000, enableHighAccuracy: false};
            navigator.geolocation.getCurrentPosition(onSuccess, onError, posOptions);
          }else{

            try{

            }catch(ex) {
              baidu_location.getCurrentPosition(function (position) {
                try {
                  var lat = position.latitude;
                  var long = position.lontitude;
                  var ggPoint = new BMap.Point(long,lat);

                  map.setCenter(ggPoint);

                  //创建定位
                  var myIcon = new BMap.Icon("http://www.wisdomcar.cn/location.png", new BMap.Size(25, 25));
                  var marker2 = new BMap.Marker(ggPoint, {icon: myIcon});  // 创建标注
                  map.addOverlay(marker2);              // 将标注添加到地图中

                  // var convertor = new BMap.Convertor();
                  // var pointArr = [];
                  // pointArr.push(ggPoint);
                  // convertor.translate(pointArr, 1, 5, function (data) {
                  //   if(data.status === 0) {
                  //     var point = data.points[0];  // 创建点坐标
                  //     map.setCenter(point);
                  //
                  //     //创建定位
                  //     var myIcon = new BMap.Icon("http://www.wisdomcar.cn/location.png", new BMap.Size(25, 25));
                  //     var marker2 = new BMap.Marker(point, {icon: myIcon});  // 创建标注
                  //     map.addOverlay(marker2);              // 将标注添加到地图中
                  //   }
                  // })

                } catch (ex) {
                  showAutoHidden('定位失败,', $ionicLoading);
                }
              },function (error) {

              });
            }
          }

        });
      });

      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';

        //初始化数据
        $common_ionicLoading = $ionicLoading;

        var code = $stateParams.id;

        mytaskFactory.getDetail(code,function (model) {

          try{
            $scope.source = model;

            if(model.ApplicationStatus==29){
              mytaskmap_confirm.style.backgroundColor = "#fab807";
              mytaskmap_confirm.innerText = "开始"
            }else if(model.ApplicationStatus==30){
              mytaskmap_confirm.style.backgroundColor = "";
              mytaskmap_confirm.innerText = "结束"
            }
          }catch(ex){

          }
          hiddenLoading($ionicLoading);
        },function () {
          hiddenLoading($ionicLoading);
        });

      });

      $scope.$on("stateChangeSuccess", function () {
      });

      $scope.$on('$ionicView.enter',function () {

      });

      /*构造*/

      /*交互事件*/
      $scope.showdetail=function () {
        var mytaskmap_content = document.getElementById("mytaskmap_content");
        var mytaskmap_popup = document.getElementById("mytaskmap_popup");
        var mytaskmap_confirm = document.getElementById("mytaskmap_confirm");
        var mytaskmap_rightbutton=document.getElementById("mytaskmap_rightbutton");
        if(mytaskmap_content.style.display=='none'){
          mytaskmap_content.style.display='block';
          mytaskmap_popup.style.display='block';
          // mytaskmap_confirm.style.backgroundColor = "";
          mytaskmap_rightbutton.innerText = "收起";
          // mytaskmap_confirm.innerText = "结束"
        }else{
          mytaskmap_content.style.display='none';
          mytaskmap_popup.style.display='none';
          // mytaskmap_confirm.style.backgroundColor = "#fab807";
          mytaskmap_rightbutton.innerText = "展开";
          // mytaskmap_confirm.innerText = "开始"
        }
      };

      //构造日期数据

      //日期控件下拉

      /*业务事件*/
      $scope.changeStatus=function () {
        var source = $scope.source;

        var model = new Object();
        //初始化数据
        loadingShow('提交中...',$ionicLoading);
        model.ApplyCode = source.ApplyCode;
        model.Driver_ID = currentUser.Id;
        model.Service_Type=source.status;
        mytaskFactory.changeTaskStatus(model,function (result) {
          if(result){
            if(source.status==2){
              mytaskmap_confirm.style.backgroundColor = "";
              mytaskmap_confirm.innerText = "结束"
              source.status = 3;
              istaskRefresh = true;
              hiddenLoading($ionicLoading);
            }else if(source.status==3){
              hiddenLoading($ionicLoading);
              istaskRefresh = true;
              $ionicHistory.goBack();
            }
          }else{
            hiddenLoading($ionicLoading);
          }
        },function (error) {
          hiddenLoading($ionicLoading);
        });

        return;

        // 自定义弹窗
        var myPopup = $ionicPopup.show({
          template: '<input id="mytaskmap_remark_input" type="text">',
          title: '备注',
          subTitle: '',
          scope: $scope,
          buttons: [
            { text: '关闭' },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                var dom = document.getElementById("mytaskmap_remark_input");
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
        });
      }
      /*跳转*/
      /*back*/
      $scope.goback=function () {
        $ionicHistory.clearCache();
        $ionicHistory.goBack();
      };
    }]);
