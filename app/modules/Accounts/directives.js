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
      $scope.query = { needle: '' };

      $scope.select = function(item) {
        $scope.onSelected(item);
      };

      $scope.perform = function() {
        return Accounts.lookup($scope.query).then(function(data) {
          return data;
        });
      }
    });
})();
