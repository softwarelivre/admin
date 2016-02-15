(function() {
  "use strict";

  angular
    .module("segue.admin.accounts.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Accounts", function(Restangular, $q) {
      var self = {};
      var accounts = Restangular.service('admin/accounts');

      self.lookup = function(query) {
        if (query.needle) {
          return accounts.getList({ q: query.needle });
        }
        return $q.when([]);
      };

      self.get = function(id) {
        return accounts.one(id).get();
      };
      self.getByPurchase = function(purchaseId) {
        return accounts.one('holder-of').one(purchaseId).get();
      };

      self.createOne = function(account) {
        console.log(account.id);
        return accounts.post(account);
      };
      self.saveOne = function(account) {
        return account.save();
      };
      self.getDisabilityTypes = function() {
        return [ 'none', 'physical', 'hearing', 'visual', 'mental'];
      };
      self.getOccupationTypes = function() {
        return [
          'student', 'private_employee', 'public_employee', 'businessman', 'freelancer'
        ]
      };
      self.getEducationTypes = function() {
        return [
          'post_graduation_stricto',
          'post_graduation_lato',
          'graduation',
          'graduation_incomplete',
          'secondary',
          'secondary_incomplete',
        ];
      };

      return self;
    });

})();
