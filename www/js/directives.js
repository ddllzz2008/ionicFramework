/**
 * Created by lifangchao on 2015/9/14.
 */
angular.module('iot365.directives',[])

    .directive('hello',['$data',function($data){
        return {
            restrict:"E",
            templateUrl:"templates/data-list.html",
            replace:true,
            link:function(scope,element,attr){
                element.bind("mouseenter",function(){
                    $data.all(attr.datasource);
                    scope.datas = $data.datas;
                });
            }
        }
    }]);
