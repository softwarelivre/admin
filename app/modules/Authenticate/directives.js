(function() {
  "use strict";

  angular
    .module('segue.admin.authenticate.directive',[
      'segue.admin.authenticate.service'
    ])
    .directive("loggedAs", function(Auth) {
      return {
        templateUrl: 'modules/Authenticate/logged-as.html',
        controller: function($scope) {
          $scope.credentials = Auth.glue($scope,'credentials');
          $scope.logout  = Auth.logout;
        }
      };
    });
})();
