(function() {
  const app = angular.module('acmKiosk', ['ngRoute', 'ngResource']);

  require('./factories');
  require('./directives');
  require('./controllers');
  require('./routes');
})();
