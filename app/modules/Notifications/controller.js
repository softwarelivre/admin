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
    .controller("NotificationController", function($scope, $stateParams, notifications) {
      $scope.notifications = notifications;
      $scope.kind = $stateParams.kind;
      $scope.statusName = $stateParams.statusName;
    });
})();
