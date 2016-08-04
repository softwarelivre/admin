(function() {
  "use string";

  angular
    .module("segue.admin.accounts.directives",[
      'ui.keypress'
    ])
    .directive("accountLookup", function() {
      return {
        scope: {
          onSelected: '=',
          onRegister: '=',
          focusLabel: '@'
        },
        templateUrl: 'modules/Accounts/accounts.lookup.html',
        controller: 'AccountLookupController'
      };
    })
    .controller("AccountLookupController", function($scope, Accounts) {
      $scope.query = {};

      
      $scope.select = function(item) {
        $scope.onSelected(item);
      };

      $scope.perform = function(value) {
        var query = {
          name: value
        };
        return Accounts.lookup(query).then(function(data) {
          return data;
        });
      }
    });
})();
