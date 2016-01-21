(function() {
  var app = angular.module('acmKiosk', ['ngRoute', 'ngResource']);

  require('./factories/factories');
  require('./directives/directives');
  require('./controllers/controllers');
  require('./routes');
})();
