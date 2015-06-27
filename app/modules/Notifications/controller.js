(function() {
  "use string";

  angular
    .module("segue.admin.notifications",[
      "segue.admin",
      'segue.admin.notifications.service',
      "segue.admin.notifications.controller"
    ])
    .config(function($stateProvider) {
      $stateProvider
        .state('notifications', {
          url: '^/notifications/:kind/:statusName',
          views: {
            header: { templateUrl: 'modules/common/nav.html' },
            main:   { templateUrl: 'modules/Notifications/notifications.list.html', controller: 'NotificationController' }
          },
          resolve: {
            notifications: function(Notifications, $stateParams) {
              return Notifications.listByStatus($stateParams.kind, $stateParams.statusName);
            }
          }
        });
    });

  angular
    .module("segue.admin.notifications.controller", [ ])
    .controller("NotificationController", function($scope, $filter, $stateParams, notifications) {
      $scope.notifications = notifications;
      $scope.kind = $stateParams.kind;
      $scope.statusName = $stateParams.statusName;
      $scope.currentFilter = null;

      $scope.setCurrentFilter = function(v) {
        $scope.currentFilter = v;
      };

      var slotStatuses = ['none','dirty','pending','declined','confirmed'];
      $scope.count = _.zipObject(slotStatuses, _.map(slotStatuses, function(st) {
        var filtered = $filter('filterByStatus')(notifications, st);
        return filtered.length;
      }));
    })
    .filter('filterByStatus', function() {
      function hasSlotWithStatus(desired) {
        return function(entity) {
          if (desired == 'none') { return entity.slots.length === 0; }
          return _(entity.slots).pluck('status').contains(desired);
        };
      }
      return function(entities, desired) {
        if (!desired) { return entities; }
        return _.filter(entities, hasSlotWithStatus(desired));
      };
    });
})();
