/**
 * Created by lifangchao on 2015/9/14.
 */
angular.module('iot365.services',[])

    .factory('$data',function($http){
        return {
            findAll  : function(tableName,requestParams){
                 var url =config.basePath+tableName+"/findAll.do?callback=JSON_CALLBACK";
                 return $http.jsonp(url,{params:requestParams});

            },
            findAllByPage : function(tableName,requestParams){
                var url =config.basePath+tableName+"/findAllByPage.do?callback=JSON_CALLBACK";
                return $http.jsonp(url,{params:requestParams});

            },
            login : function(tableName,requestParams){
                var url =config.basePath+tableName+"/login.do?phoneNumber="+requestParams.phoneNumber+"&password="+requestParams.password+"&callback=JSON_CALLBACK";
                return $http.jsonp(url);
            },
            register : function(tableName,requestParams){
                var url =config.basePath+tableName+"/register.do?callback=JSON_CALLBACK";
                return $http.jsonp(url,{params:requestParams});
            },
            modifyPassword : function(tableName,requestParams){
                var url =config.basePath+tableName+"/modifyPassword.do?callback=JSON_CALLBACK";
                return $http.jsonp(url,{params:requestParams});
            },
            getCheckCode : function(tableName){
                var url =config.basePath+tableName+"/getCheckCode.do?callback=JSON_CALLBACK";
                return $http.jsonp(url);
            },

            findById : function(tableName, id){
                var url =config.basePath+tableName+"/findById.do?id="+id+"&callback=JSON_CALLBACK";
                return $http.jsonp(url);

            },
            findByConditions : function(tableName,requestParams){
                var url =config.basePath+tableName+"/findByConditions.do?callback=JSON_CALLBACK";
                return $http.jsonp(url,{params:requestParams});
            },

            remove : function(twzx){
                twzxs.splice(twzxs.indexOf(twzx),1);
            },

            add : function(tableName,postData){
                var url =config.basePath+tableName+"/add.do?callback=JSON_CALLBACK";
               return $http.jsonp(url,{params:postData});
            }
        }

    })
  .factory('$logicHttp',function ($http,$cordovaFile,$ionicLoading) {
    return{
      downloadBasicInfo:function (pdata) {

          try{

            $http.post(createService("api/BasicInfo/StaticData"),pdata)
              .success(function(response)
              {
                try{
                  if(response!=undefined&&response!=null){
                    if(response.Code=="100"){
                      createAndWriteFile(dbStaticData,JSON.stringify(response.Data),$cordovaFile);
                      var lastDate = new Date();
                      createAndWriteFile(staticLastUpdateTime,lastDate.Format('yyyy-MM-dd HH:mm:ss'),$cordovaFile);
                    }else{
                      showAutoHidden(response.Message,$ionicLoading);
                    }
                  }else{
                    showAutoHidden("下载基础数据失败",$ionicLoading);
                  }
                }catch(ex){

                }finally{

                }
              })
              .error(function (data) {
                try{
                  hiddenLoading($ionicLoading);
                  showAutoHidden('下载基础数据失败',$ionicLoading);
                }catch (ex){

                }finally {

                }
              });

          }catch(ex){
            createAndWriteFile(errorInfo,ex.toString(),$cordovaFile);
          }
      },
      translateLocation:function (lat,long,success) {
        //坐标转换
        var getUrl = 'http://api.map.baidu.com/geocoder/v2/?'+ 'ak=KHAdOtN52mA1jLssFFrm4BpPzlgnlEGW&location='
          +lat+ ',' + long + '&output=json&pois=0';
        $http.get(getUrl)
          .success(function (data) {
            if (data['status'] == '0') {

              if(success){
                success(data.result);
              }

            } else {
              showAutoHidden('定位失败,', $ionicLoading);
            }
          }).error(function () {
          showAutoHidden('网络异常,', $ionicLoading);
        });

      }
    }
  })
  .factory('commonService',function ($cordovaFile) {
    return {
      getCurrentUser: function (success) {
        if (currentUser != null) {
          success(currentUser);
        } else {
          readFile(dbUserInfo, function (result) {
            try {
              if (result != null) {
                currentUser = JSON.parse(result);
                success(currentUser);
              }
            } catch (ex) {
              success(null);
            }
          }, $cordovaFile);
        }
      },
      getPlatInfo: function (success) {
        readFile(dbplatformInfo, function (result) {
          try {
            if (result != null) {
              var platinfo = JSON.parse(result);
              success(platinfo);
            }
          } catch (ex) {
            success(null);
          }
        }, $cordovaFile);
      }
    }
  });
