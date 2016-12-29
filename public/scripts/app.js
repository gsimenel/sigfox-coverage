'use strict';

/**
 * @ngdoc overview
 * @name sigfoxCoverageApp
 * @description
 * # sigfoxCoverageApp
 *
 * Main module of the application.
 */
angular
  .module('sigfoxCoverageApp', [
    // 'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    // 'ngTouch',
    'ngMap',
    'base64',
    'restangular',
    'ngFileSaver'
  ])

  .config( function ($routeProvider) {
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
    .run(['$cookies', 'sigfox', function( $cookies, sigfox) {
        
        // At initialization it is mandatory to set the sigfox credentials with the cookie values that might have been saved before. 
        sigfox.setCredentials($cookies.get('sigfoxUsername'), $cookies.get('sigfoxPassword')); 
    }]);