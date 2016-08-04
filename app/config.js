(function() {
  "use strict";

  angular
    .module('segue.admin')
    .constant('Config', {
      API_HOST: 'http://backend.segue.org',
      API_PATH: '/api',
      PROPOSAL_LANGUAGES: [
        { abbr: 'pt', name: 'português' },
        { abbr: 'es', name: 'espanhol' },
        { abbr: 'en', name: 'inglês' },
      ],
      PROPOSAL_LEVELS: [ "beginner", "advanced" ],
      TIMEZONE: '-0300',
      EVENT_DAYS: ["2016-07-13","2016-07-14","2016-07-15","2016-07-16"],
      HOURS: [10,11,12,13,14,15,16,17,18,19 ]
    });

})();
