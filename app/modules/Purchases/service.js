(function() {
  "use strict";

  angular
    .module('segue.admin.purchase.service',[
      'segue.admin',
      'restangular',
    ])
    .factory('Purchases', function(Restangular) {
      var service = Restangular.service('admin/purchases');
      var extensions = {};

      extensions.lookup = function(query) {
          return service.getList(query);
      };

      extensions.confirmStudentDocument = function (purchaseId) {
        return service.one(purchaseId).one('confirm_student_document').get();
      };

      extensions.confirmGovDocument = function (purchaseId) {
        return service.one(purchaseId).one('confirm_gov_document').get();
      };

      extensions.getADempiereReport = function (initial_date, end_date) {
        var query = {
          initial_date: initial_date,
          end_date: end_date
        };

        return service.one('adempiere_report').get(query);
      };



      return _.extend(service, extensions);
    })
    .factory('Promocodes', function(Restangular, Auth) {
      var service = Restangular.service('promocodes');
      var extensions = {};

      extensions.getOwnedByCredentials = function() {
        var credentials = Auth.credentials();
        if (!credentials) { return; }
        return service.getList({ creator_id: credentials.id });
      };

      return _.extend(service, extensions);
    });
})();
