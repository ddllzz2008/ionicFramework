angular.module('iot365', ['ionic', 'iot365.controllers', 'iot365.services','iot365.directives','iot365.filters','ngCordova'])

  .filter('to_trusted',['$sce',function ($sce) {
    return function (text) {
      return $sce.trustAsHtml(text);
    }
  }])

  .run(function($ionicPlatform,$state,$cordovaFile,$ionicLoading,$rootScope,$location,$ionicPopup,$ionicHistory) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      window.addEventListener('native.keyboardhide', keyboardHideHandler);
      function keyboardHideHandler(e){

        document.body.scrollTop=0;
        document.documentElement.scrollTop = 0;//兼容不同版本的浏览器
        window.pageYOffset = 0;
      }
      // for form inputs)
      ionicPlatform = $ionicPlatform;
      cordovaFile = $cordovaFile;

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        if (!isAndroid) {
          cordova.plugins.Keyboard.disableScroll(true);
        }
        else {
          cordova.plugins.Keyboard.disableScroll(true);
        }

        // cordova.plugins.Keyboard.disableScroll(false);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

      //登录页面禁止返回
      $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();

        function showConfirm() {
          var confirmPopup = $ionicPopup.confirm({
            title: '<strong>退出应用?</strong>',
            template: '你确定要退出应用吗?',
            okText: '退出',
            cancelText: '取消'
          });

          confirmPopup.then(function (res) {
            if (res) {
              ionic.Platform.exitApp();
            } else {
              // Don't close
            }
          });
        }
        // Is there a page to go back to?
        if ($location.path() == '/login') {
          showConfirm();
        }else if ($ionicHistory.backView()) {
          $ionicHistory.goBack();
        }

        return false;
      }, 101);

    });

    document.addEventListener("pause",function () {
      console.log("app be paused");
      try{
        hiddenLoading($ionicLoading);
      }catch(ex){

      }
    });
    document.addEventListener("resume",function () {
      readFile(staticLastLoginTime,function (result) {
        try{
          if(result!=""&&result!=undefined){
            var lastDate = new Date(((new Date(result)).Format('yyyy/MM/dd')+" 00:00:00"));
            var currentDate = new Date(((new Date()).Format('yyyy/MM/dd')+" 00:00:00"));
            var day = lastDate.GetDateDiff('d',currentDate);
            if(day>=1){
              $state.go("login");
            }
          }
        }catch(ex){
        }
      },$cordovaFile);
    });
  })

  .factory('TokenInterceptor', ['$q', function($q) {

    return {
      request: function (config) {

        config.timeout = "30000";
        config.headers = config.headers || {};

        config.headers['Content-Type'] = "application/json";

        return config || $q.when(config);
      },

      response: function(response) {
        return response || $q.when(response);
      }
    };

  }])

  .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

    $httpProvider.interceptors.push('TokenInterceptor');

    $ionicConfigProvider.scrolling.jsScrolling(true);

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.text('');

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

    $stateProvider
    //setup an abstract state for the tabs directive
    //   .state('welcome',{
    //     url:'/welcome',
    //     templateUrl:'templates/welcome.html',
    //     controller:'welcomeCtrl'
    //   })
      .state('login',{
        url:'/login',
        templateUrl:'templates/login.html',
        controller:'loginCtrl'
      })

      .state('forgetpassword',{
        url:'/forgetpassword',
        templateUrl:'templates/forgetpassword.html',
        controller:'forgetpasswordCtrl'
      })
      .state('register',{
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'registerCtrl'
      })
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'menuCtrl'
      })
      .state('app.tab', {
        url: "/tab",
        abstract: true,
        views:{
          'side-menu':{
            templateUrl:'templates/tabs.html',
            controller:'tabCtrl'
          }
        }
      })
      .state('app.tab.main', {
        url: "/main",
        // abstract: true,
        views:{
          'tab-main':{
            templateUrl:'templates/tab-main.html',
            controller:'mainCtrl'
          }
        }
      })
      .state('mainrequest', {
        url: "/tab-mainrequest",
        templateUrl:'templates/tab-mainrequest.html',
        controller:'mainrequestCtrl'
      })
      .state('modifypwd',{
        url:'/modifypwd',
        templateUrl:'templates/modifypwd.html',
        controller:'modifypwdCtrl'
      })
      .state('feedback',{
        url:'/feedback',
        templateUrl:'templates/feedback.html',
        controller:'feedbackCtrl'
      })
      .state('about',{
        url:'/about',
        templateUrl:'templates/about.html',
        controller:'aboutCtrl'
      })
      .state('mainprocess', {
        url: "/tab-mainprocess",
        templateUrl:'templates/tab-mainprocess.html',
        controller:'mainprocessCtrl'
      })
      .state('maincomment', {
        url: "/tab-maincomment/:id",
        templateUrl:'templates/tab-maincomment.html',
        controller:'maincommentCtrl'
      })
      .state('mainchart', {
        url: "/tab-mainchart",
        templateUrl:'templates/tab-mainchart.html',
        controller:'mainchartCtrl'
      })
      .state('mainchartdetail', {
        url: "/tab-mainchartdetail/:id:time",
        templateUrl:'templates/tab-mainchartdetail.html',
        controller:'mainchartdetailCtrl'
      })
      .state('app.tab.audit', {
        url: "/audit",
        // abstract: true,
        views:{
          'tab-audit':{
            templateUrl:'templates/tab-audit.html',
            controller:'auditCtrl'
          }
        }
      })
      .state('app.tab.myrequest', {
        url: "/myrequest",
        views:{
          'tab-myrequest':{
            templateUrl:'templates/tab-myrequest.html',
            controller:'myrequestCtrl'
          }
        }
      })
      .state('myrequestwait', {
        url: "/tab-myrequestwait",
        templateUrl:'templates/tab-myrequestwait.html',
        controller:'myrequestwaitCtrl'
      })
      .state('myrequestsend', {
        url: "/tab-myrequestsend/:id:type",
        templateUrl:'templates/tab-myrequestsend.html',
        controller:'myrequestsendCtrl'
      })
      .state('myrequestsendservice', {
        url: "/tab-myrequestsendservice",
        templateUrl:'templates/tab-myrequestsendservice.html',
        controller:'myrequestsendserviceCtrl'
      })
      .state('myrequestdriver', {
        url: "/tab-myrequestdriver/:type",
        templateUrl:'templates/tab-myrequestdriver.html',
        controller:'myrequestdriverCtrl'
      })
      .state('myrequestcar', {
        url: "/tab-myrequestcar/:type",
        templateUrl:'templates/tab-myrequestcar.html',
        controller:'myrequestcarCtrl'
      })
      .state('app.tab.mytask', {
        url: "/mytask",
        views:{
          'tab-mytask':{
            templateUrl:'templates/tab-mytask.html',
            controller:'mytaskCtrl'
          }
        }
      })
      .state('mytaskmap', {
        url: "/tab-mytaskmap/:id",
        templateUrl:'templates/tab-mytaskmap.html',
        controller:'mytaskmapCtrl'
      })
      .state('app.tab.returnaudit', {
        url: "/returnaudit",
        views:{
          'tab-returnaudit':{
            templateUrl:'templates/tab-returnaudit.html',
            controller:'returnauditCtrl'
          }
        }
      })
      .state('returncomfirm', {
        url: "/tab-returncomfirm/:id",
        templateUrl:'templates/tab-returncomfirm.html',
        controller:'returncomfirmCtrl'
      })
      // .state('tab.main.firstpage',{
      //   url:'/firstpage',
      //   views:{
      //     'side-menu':{
      //       templateUrl:'templates/tab-main.html',
      //       controller:'mainCtrl'
      //     }
      //   }
      //
      // })
      // .state('tab.audit', {
      //   url: "/audit",
      //   abstract: true,
      //   views:{
      //     'tab-audit':{
      //       templateUrl:'templates/menu.html',
      //       controller:'menuCtrl'
      //     }
      //   }
      // })
      // .state('tab.audit.secondpage',{
      //   url:'/secondpage',
      //   views:{
      //     'side-menu':{
      //       templateUrl:'templates/tab-audit.html',
      //       controller:'auditCtrl'
      //     }
      //   }
      //
      // })
  });
