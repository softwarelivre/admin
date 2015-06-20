(function() {
  "use strict";

  angular
    .module("segue.admin.calls.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Calls", function(Restangular) {
      var self = {};
      var calls = Restangular.service('admin/call');

      self.get = function(tournamentId, trackId) {
        if (!trackId) { return []; }
        return calls.one(tournamentId).one(trackId).getList();
      };

      return self;
    })
    .service("Notifications", function(Restangular) {
      var self = {};
      var notifications = Restangular.service('admin/notifications');

      self.listByStatus = function(statusName) {
        if (!statusName) { return []; }
        return notifications.getList(st);
      };

      return self;
    });

})();
