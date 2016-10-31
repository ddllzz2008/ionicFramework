/**
 * Created by ddllzz on 16/8/29.
 */
angular.module('loginCtrl', ['ngCordova'])

.factory('loginFactory',
  function ($http,$ionicPopup,$state,$ionicLoading,$cordovaFile,$logicHttp) {

  var factory = {};
  //用户名密码登录
  factory.loginWithUserName = function (username,password,success) {
    var state = checkConnection();
    // var state = true;
    if(!state){
      showMessage('网络异常,请检查网络状态',$ionicPopup);
      hiddenLoading($ionicLoading);
      return false;
    }else{
      var postData = {
        "UserName": username,
        "Password": password,
        "IMEI": device.uuid,
        // "IMEI":'123',
        "Version": currentVersion,
        "Platform": device.platform,
        // "Platform": "chrome"
        "isMD5" : false
      };

      $http.post(createService("api/account/login"),postData)
        .success(function(response)
        {
          try{
            if(response!=undefined&&response!=null){
              if(response.Code=="100"){

                var isnew = factory.compareVersion(response.Data.MobileVersion);

                if(isnew){
                  showMessage('当前版本太低,请升级到新版本',$ionicPopup);
                  if(isAndroid){
                    window.location.href=urlforandroid;
                  }else{
                    window.location.href=urlforios;
                  }
                  return;
                }

                postData.Password = response.Data.Password;
                postData.isMD5 = true;

                createAndWriteFile(dbplatformInfo,JSON.stringify(postData),$cordovaFile);
                var userinfo = JSON.stringify(response.Data);
                currentUser = response.Data;
                createAndWriteFile(dbUserInfo,userinfo,$cordovaFile);
                $logicHttp.downloadBasicInfo(postData);
                if(success){
                  success();
                }

                try{
                  cordova.plugins.keyboard.close();
                }catch(exkeyboard){

                }

                if(currentUser.IsDriver==1){
                  $state.go("app.tab.mytask");
                }else{
                  $state.go("app.tab.main");
                }

                //记录最后时间
                var lastLoginDate = new Date();
                currentUpdateTime = lastLoginDate.Format('yyyy/MM/dd HH:mm:ss');
                createAndWriteFile(staticLastLoginTime,lastLoginDate.Format('yyyy/MM/dd HH:mm:ss'),$cordovaFile);

              }else{
                showMessage(response.Message,$ionicPopup);
              }
            }else{
              showMessage("登录失败",$ionicPopup);
            }
          }catch(ex){
            hiddenLoading($ionicLoading);
          }finally{
            hiddenLoading($ionicLoading);
          }
        })
        .error(function (data) {
          try{
            showMessage(data.Message,$ionicPopup);
          }catch (ex){
            hiddenLoading($ionicLoading);
          }finally {
            hiddenLoading($ionicLoading);
          }
        });
    }
  };
  //获取手机验证码
    factory.getsms=function (telphone,success) {
      // var postData = {mobile:telphone};
      $http.post(createService("api/sms/GenerateSmsCode?mobile="+telphone))
        .success(function(response)
        {
          try{
            if(response!=undefined&&response!=null){
              if(response.Code=="100"){
                if(success){
                  success();
                }
              }else{
                showMessage(response.Message,$ionicPopup);
              }
            }else{
              showMessage("获取验证码失败",$ionicPopup);
            }
          }catch(ex){
            showMessage("获取验证码失败",$ionicPopup);
          }
        })
        .error(function (data) {
          try{
            showMessage("获取验证码失败",$ionicPopup);
          }catch (ex){

          }
        });
    }
  //手机号验证码登录
  factory.loginWithCode = function (telphone,code,success) {
    var state = checkConnection();
    // var state = true;
    if(!state){
      showMessage('网络异常,请检查网络状态',$ionicPopup);
      hiddenLoading($ionicLoading);
      return false;
    }else{
      var postData = {
        "UserName": telphone,
        "SmsCode": code,
        "IMEI": device.uuid,
        "Version": currentVersion,
        "Platform": device.platform
      };

      $http.post(createService("api/Account/SmsLogin"),postData)
        .success(function(response)
        {
          try{
            if(response!=undefined&&response!=null){
              if(response.Code=="100"){

                var isnew = factory.compareVersion(response.Data.MobileVersion);

                if(isnew){
                  showMessage('当前版本太低,请升级到新版本',$ionicPopup);
                  if(isAndroid){
                    window.location.href=urlforandroid;
                  }else{
                    window.location.href=urlforios;
                  }
                  return;
                }

                var userinfo = JSON.stringify(response.Data);

                var postData = {
                  "UserName": response.Data.Code,
                  "Password": response.Data.Password,
                  "IMEI": device.uuid,
                  "Version": currentVersion,
                  "Platform": device.platform,
                  "isMD5":true
                };

                createAndWriteFile(dbplatformInfo,JSON.stringify(postData),$cordovaFile);

                currentUser = response.Data;
                createAndWriteFile(dbUserInfo,userinfo,$cordovaFile);
                $logicHttp.downloadBasicInfo(postData);

                if(success){
                  success();
                }

                try{
                  cordova.plugins.keyboard.close();
                }catch(exkeyboard){

                }

                if(currentUser.IsDriver==1){
                  $state.go("app.tab.mytask");
                }else{
                  $state.go("app.tab.main");
                }

                //记录最后时间
                var lastLoginDate = new Date();
                currentUpdateTime = lastLoginDate.Format('yyyy/MM/dd HH:mm:ss');
                createAndWriteFile(staticLastLoginTime,lastLoginDate.Format('yyyy/MM/dd HH:mm:ss'),$cordovaFile);

              }else{
                showMessage(response.Message,$ionicPopup);
              }
            }else{
              showMessage("登录失败",$ionicPopup);
            }
          }catch(ex){
            hiddenLoading($ionicLoading);
          }finally{
            hiddenLoading($ionicLoading);
          }
        })
        .error(function (data) {
          try{
            showMessage(data.Message,$ionicPopup);
          }catch (ex){
            hiddenLoading($ionicLoading);
          }finally {
            hiddenLoading($ionicLoading);
          }
        });
    }
  };
    //修改密码
    factory.modifyPwd=function (password,newpassword,success,error) {
      readFile(dbplatformInfo, function (data) {
        try {
          var postData = JSON.parse(data);
          postData.NewPassword=newpassword;
          postData.isMD5=true;
          $http.post(createService("api/Account/ModifyPassword"),postData)
            .success(function(response)
            {
              try{
                if(response!=undefined&&response!=null) {
                  if (response.Code == "100") {
                    var postData = {
                      "UserName": response.Data.Code,
                      "Password": response.Data.Password,
                      "IMEI": device.uuid,
                      "Version": currentVersion,
                      "Platform": device.platform,
                      "isMD5":true
                    };
                    createAndWriteFile(dbplatformInfo,JSON.stringify(postData),$cordovaFile);
                    success();
                  }else{
                    error(response.Message);
                  }
                }else{
                  error(errormessage);
                  createAndWriteFile(errorInfo, data.toString(), $cordovaFile);
                }
              }catch(ex){
                error(errormessage);
                createAndWriteFile(errorInfo, ex.toString(), $cordovaFile);
              }
            })
            .error(function (data) {
              error(errormessage);
              createAndWriteFile(errorInfo, data.toString(), $cordovaFile);
            });
        }catch(ex){
          error(errorsystem);
        }
      });
    };

    //版本号比较
    factory.compareVersion=function (version) {
      try{
        var isNew = false;
        var newversionList = version.split('.');
        var oldversionList = currentVersion.split('.');
        for(var i=0;i<newversionList[i].length;i++){
          if(parseInt(newversionList[i])>parseInt(oldversionList[i])){
            isNew = true;
            break;
          }
        }
        return isNew;
      }catch(ex){
        return false;
      }
    };
  return factory;
})

.controller('loginCtrl',['$scope', '$ionicPopup','$ionicScrollDelegate','$ionicHistory','$timeout', '$state','$data','$ionicLoading','$cordovaFile','loginFactory',
  function ($scope, $ionicPopup,$ionicScrollDelegate,$ionicHistory, $timeout, $state, $data,$ionicLoading,$cordovaFile,loginFactory) {
  $scope.css_imgPoint="pointimgnormal";
  $scope.css_ispasswordlogin="cssblock";
  $scope.css_iscodelogin="csshidden";
  $scope.css_btncode="btncodeenable";

  /*UI相关*/
  $scope.userOrPhone = 1;

    /*业务相关*/
    $scope.txtusername={text:""};
    $scope.txtpassword={text:""};
    $scope.codebutton={text:"获取验证码"};
    $scope.codeform ={tel:"",code:""};
  /*生命周期*/
    $scope.$on('$ionicView.loaded', function() {

    });

  $scope.$on('$ionicView.beforeEnter', function() {

    readFile(staticWelcomeConfig,function (success) {
      if(success=="true"){
        document.getElementById("welcomediv").style.opacity=0;
        document.getElementById("welcomediv").style.overflow="hidden";
        document.getElementById("welcomediv").style.width="0px";
        document.getElementById("welcomediv").style.height="0px";
      }else{
        document.getElementById("welcomediv").style.opacity=1;
        document.getElementById("welcomediv").style.width="100%";
        document.getElementById("welcomediv").style.height="100%";
      }
    },$cordovaFile);

    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e){
      $ionicScrollDelegate.scrollTop(true);
    }

    readFile(dbplatformInfo,function (result) {
      try{
        var userinfo = JSON.parse(result);
        $scope.txtusername.text = userinfo.UserName;
      }catch(ex){

      }
    },$cordovaFile);

  });

  /*移动箭头,切换登录方式*/
  $scope.changeLogin=function(type){

    $scope.css_imgPoint=type==0?"pointimgright":"pointimgnormal";
    if(type==1)
    {
      $scope.css_ispasswordlogin="cssblock";
      $scope.css_iscodelogin="csshidden";
    }
    else
    {
      $scope.css_ispasswordlogin="csshidden";
      $scope.css_iscodelogin="cssblock";
    }

    $scope.userOrPhone = type;

    console.log('111');
  };

  /*获取验证码*/
  $scope.getcode=function(){
    if(leasttime==60){
      if($scope.codeform.tel==""||$scope.codeform.tel.trim()==""){
        showMessage('请输入手机号码',$ionicPopup);
        return;
      }
      loginFactory.getsms($scope.codeform.tel,function () {
        if(leasttime==60){
          $scope.css_btncode="btncodedisable";
          getcodeBackground();
        }else{
          return;
        }
      });
    }else{
      return;
    }
  };

    var leasttime = 60;
    function getcodeBackground() {
      if(leasttime==0){
        $scope.css_btncode="btncodeenable";
        leasttime = 60;
        $scope.codebutton={text:"获取验证码"};
      }else{
        $scope.codebutton={text:leasttime+"秒后重新发送"};
        leasttime--;
        $timeout(getcodeBackground,1000);
      }
    }

  /*登录*/
  $scope.login=function(){

    if(isDebugMode) {
      $state.go("app.tab.mytask");
      return;
    }
    try{

      $ionicHistory.clearCache().then(function(){
        //do something
      });

      switch($scope.userOrPhone){
        case 0:
          if($scope.codeform.tel.trimSpace()==""){
            showMessage('请输入手机号码',$ionicPopup);
            return;
          }
          if($scope.codeform.code.trimSpace()==""){
            showMessage('请输入验证码',$ionicPopup);
            return;
          }
          loadingShow('登录中...',$ionicLoading);
          loginFactory.loginWithCode($scope.codeform.tel,$scope.codeform.code,function () {
            leasttime = 0;
            $scope.txtpassword.text="";
            $scope.codeform ={tel:"",code:""};
          });
          break;
        case 1:
          if($scope.txtusername.text.trimSpace()==""){
            showMessage('请输入用户名',$ionicPopup);
            return;
          }
          if($scope.txtpassword.text.trimSpace()==""){
            showMessage('请输入密码',$ionicPopup);
            return;
          }
          loadingShow('登录中...',$ionicLoading);
          loginFactory.loginWithUserName($scope.txtusername.text,$scope.txtpassword.text,function () {
            $scope.txtpassword.text="";
            $scope.codeform ={tel:"",code:""};
          });
          break;
      }
    }catch(ex){
      hiddenLoading($ionicLoading);
      createAndWriteFile('error.txt',ex);
      showMessage('操作异常',$ionicPopup);
    }finally{
    }
  };

  /*跳转*/
  $scope.gotopassword=function(){
    showDevelopWarning($ionicPopup)
  };

  $scope.gotoregister=function(){
    showDevelopWarning($ionicPopup)
  };

    $scope.autoLogin=function () {
      createAndWriteFile(staticWelcomeConfig,"true",$cordovaFile);
      document.getElementById("welcomediv").style.opacity=0;
      document.getElementById("welcomediv").style.width="0px";
      document.getElementById("welcomediv").style.height="0px";
    };
}]);
