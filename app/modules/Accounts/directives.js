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
      $scope.display = false;
      $scope.query = { needle: '' };
      $scope.result = [];
      $scope.selectedIndex = 0;

      $scope.classes = function($index) {
        return { selected: $scope.selectedIndex == $index };
      };

      $scope.select = function() {
        if (!$scope.result.length) return;
        $scope.query.needle = '';
        $scope.display = false;
        $scope.onSelected($scope.result[$scope.selectedIndex].plain());
      };

      $scope.moveDown = function() {
        $scope.selectedIndex = ($scope.selectedIndex + 1) % $scope.result.length;
      };
      $scope.moveUp = function() {
        $scope.selectedIndex = Math.abs($scope.selectedIndex - 1) % $scope.result.length;
      };
      $scope.focus = function() {
        $scope.display = true;
      };
      $scope.blur = function() {
        $scope.display = false;
      };

      $scope.register = function() {
        $scope.display = false;
        $scope.onRegister();
      };

      $scope.perform = function(event) {
        return Accounts.lookup($scope.query).then(function(data) {
          $scope.selectedIndex = 0;
          $scope.display = data.length > 0;
          $scope.result = data;
        });
      };
    });
})();
