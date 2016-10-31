/**
 * Created by ddllzz on 16/9/12.
 */
var currentVersion = "1.6.0";
var apiservice = "139.224.64.50";
var apiport = "8081";
// var apiservice = "139.196.215.187";
// var apiport = "8081";
var timerefresh = 5;//单位分钟
var requestTimeout = 20000;
var ionicPlatform;
var cordovaFile;
///
/*创建服务地址*/
///
function createService(apiurl){
  return "http://"+apiservice+":"+apiport+"/"+apiurl;
  // return "http://www.wisdomcar.cn/"+apiurl;
}

var isDebugMode = false;
var isAndroid = false;
var urlforandroidComment = "market://details?id=com.hbzpsoft.iot365"
var urlforandroid="www.wisdomcar.cn/app/iwisdomcar.apk";
var urlforiosComment = "itms-apps://ax.itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=1159545528"
var urlforios="itms-apps://itunes.apple.com/app/1159545528";
///
/*数据文件名*/
///
var errorInfo = "error.txt";
var dbplatformInfo = "platformInfo";
var dbUserInfo = "loginUserInfo";
var dbStaticData = "basicinfoStaticData";
var dbStaticDataTime = "basicinfoStaticDataTime"
var dbMyOrders = "myOrders";
var dbMyOrdersTime = "myOrdersTime";
var dbMyFees="myfees";
var dbMyFeesTime="myfeesTime";
var dbMyAudits = "myaudit";
var dbMyAuditsTime = "myauditTime";
var dbMyDispatches = "mydispatches";
var dbMyDriverReals="mydriverreals";
var dbMyDriverRealsTime="mydriverrealsTime";
var dbMyVehicleReals="myvehiclereals";
var dbMyVehicleRealsTime="myvehiclerealsTime";
var dbMyDispatchesTime = "mydispatchesTime";
var dbMyReturnComfirms = "myreturncomfirms";
var dbMyReturnComfirmsTime = "myreturncomfirmsTime";
var dbMyTasks = "mytask";
var dbMyTasksTime = "mytaskTime";

var staticWelcomeConfig ="staticwelcomeconfig";
var staticLastUpdateTime = "staticlastupdatetime";
var staticLastLoginTime = "staticlastlogintime";
///
/*是否需要刷新*/
///
var isdispatcherRefresh = false;
var istaskRefresh = false;
var isreturnRefresh = false;
///
/*公共对象*/
///
var $common_ionicLoading=null;
var currentUser = null;
var currentUpdateTime = "";
///
/*字典枚举数组*/
var dicApplyType = { 103: "保留车辆", 100: "应急保障", 101: "社会租赁" };
///
///
/*提示文本*/
var errormessage = "您的网络异常,请检查网络设置";
var errornetwork = "系统错误";
var errorsystem = "网络错误";
///
///
/*待开发提示*/
///
function showDevelop($ionicPopup){
  var alertPopup = $ionicPopup.alert({
    title: '提示',
    template: "我们的工程师正在努力开发中，敬请期待！"
  });
}
function showDevelopWarning($ionicPopup){
  var alertPopup = $ionicPopup.alert({
    title: '提示',
    template: "我们的工程师正在努力开发中，敬请期待！"
  });
}
///
/*不自动消失的错误信息提示框*/
///
function showMessage(message,$ionicPopup) {
  var alertPopup = $ionicPopup.alert({
    title: '提示',
    template: message
  });
}
///
/*自动消失的错误信息提示框*/
///
function showAutoHidden(message,$ionicLoading){
  $ionicLoading.show({
    template:'<p>'+message+'</p>',
    duration:2000
  });
}

///
/*加载等待框*/
///
function loadingShow(message,$ionicLoading) {
  $ionicLoading.show({
    template: '<ion-spinner></ion-spinner><p>'+message+'</p>'
  });
}
///
/*关闭等待框*/
///
function hiddenLoading($ionicLoading) {
  $ionicLoading.hide();
}
///
/*自动消失的加载等待框*/
///
function loadingAutoHidden(message,$ionicLoading) {
  $ionicLoading.show({
    template:'<ion-spinner></ion-spinner><p>'+message+'</p>',
    duration:5000
  });
}

