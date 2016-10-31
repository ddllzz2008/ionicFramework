/**
 * Created by lifangchao on 2015/9/23.
 */
angular.module('iot365.filters', [])
    .filter('phoneNumberFilter', function() {
        return function(input) {
            return input.replace(/tank/, "=====")
        };
    })
    .filter('dateConvert',function () {
      return function (dt) {
        try{
          var str = dt.replaceAll('-','/');
          return (new Date(str)).Format('MM-dd HH:mm');
        }catch(ex) {
          return dt;
        }
      };
    });
