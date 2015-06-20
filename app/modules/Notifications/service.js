(function() {
  "use strict";

  angular
    .module("segue.admin.notifications.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Notifications", function(Restangular) {
      var self = {};
      var notifications = Restangular.service('admin/notifications');

      self.listByStatus = function(kind, statusName) {
        if (!statusName) { return []; }
        return notifications.one(kind).one(statusName).getList();
      };

      return self;
    });

})();
