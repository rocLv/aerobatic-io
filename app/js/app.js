// Mixin underscore.string with lodash
_.mixin(_.str.exports());

// Use mustache style delimiters for the _.template function
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};

angular.module('services', []);
angular.module('controllers', ['services']);
angular.module('directives', ['services']);
angular.module('aerobatic-io', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'duScroll', 
  'Aerobatic', 'services', 'controllers', 'directives', 'templates']);

angular.module('aerobatic-io').config(function($routeProvider, $locationProvider, aerobaticProvider) {
  // Use the bang prefix for Google ajax crawlability
  // https://developers.google.com/webmasters/ajax-crawling/docs/specification?csw=1
  $locationProvider.html5Mode(true);

  function templateUrl(path) {
    if (aerobaticProvider.config.buildType === 'debug')
      return aerobaticProvider.config.cdnUrl + '/' + path;
    else
      return path;
  }

  $routeProvider
    .when('/', {
      controller: 'IndexCtrl',
      templateUrl: templateUrl('partials/index.jade')
    })
    .when('/docs/:article?', { 
      controller: 'DocsCtrl',
      templateUrl: templateUrl('partials/docs.jade')
    })
    .when('/blog/:year?/:month?/:day?/:title?', { 
      templateUrl: templateUrl('partials/blog.jade'),
      controller: 'BlogCtrl'
    })
    .when('/contact', {
      templateUrl: templateUrl('partials/contact.jade') 
    })
    .when('/pricing', {
      templateUrl: templateUrl('partials/pricing.jade') 
    })
    .when('/gallery', {
      templateUrl: templateUrl('partials/gallery.jade')
    })
    .otherwise({ 
      redirectTo: '/' 
    });
});

angular.module('aerobatic-io').run(function ($log, $rootScope, $location, analytics, content, aerobatic) {
  $log.info("Angular app aerobatic-io run event");
  analytics.initialize();
  content.initialize();

  // Preserve the querystring during HTML5 view navigations when in simulator
  // mode. This way when livereload forces the browser to refresh we won't lose
  // the fact we are in simulator mode designeated by the "sim=1" in the querystring.
  var originalQuery = $location.search();
  $rootScope.$on('$routeChangeStart', function() {
    for (var key in originalQuery) {
      $location.search(key, originalQuery[key]);
    }
  });
});
