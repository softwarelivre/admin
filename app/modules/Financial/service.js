(function() {
  "use strict";

  angular
    .module("segue.admin.financial.service", [
      'segue.admin',
      'restangular',
    ])
    .service("Financial", function(Restangular, $q) {
      var self = {};

      return self;
    });

})();
