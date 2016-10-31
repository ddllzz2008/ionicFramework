/**
 * Created by ddllzz on 16/8/29.
 */
angular.module('registerCtrl', [])

  .controller('registerCtrl',['$scope','$rootScope', '$ionicHistory','$ionicPopup', '$timeout', '$state',  '$data',
    function ($scope, $rootScope,$ionicHistory,$ionicPopup, $timeout, $state, $data) {
    $scope.css_btncode="btncodeenable";

/*生命周期*/
      $scope.$on('$ionicView.beforeEnter', function() {
        $rootScope.viewColor = '#347aea';
      });

    $scope.getcode=function (){
      $scope.css_btncode="btncodedisable";
    };

      /*back*/
      $scope.goback=function () {
        $ionicHistory.goBack();
      };

  }]);
