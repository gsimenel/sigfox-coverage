'use strict';

/**
 * @ngdoc service
 * @name sigfoxCoverageApp.sigfox
 * @description
 * # sigfox
 * Factory in the sigfoxCoverageApp.
 */
angular.module('sigfoxCoverageApp')
  .factory('sigfox', ['$cookies', '$http', '$base64', 'Restangular', function($cookies, $http, $base64, Restangular) {
    
    var obj = {};
    
    // Sets the default header with base64 encoded Authorization
    obj.setCredentials = function(login, password) {
        console.log('Services sigfox.js setCredentials:' + login + ' : '+password);

        var encoded = $base64.encode(login+':'+password);
        Restangular.setDefaultHeaders({'Authorization' : 'Basic ' + encoded});
        return true;
    };
        
    // Sets the credential and then get api/devicetypes 
    obj.testCredentials = function (login, password) {
        // Set the auth headers first
        obj.setCredentials(login, password);
        // Return the promise for the test
        return Restangular.one('/devicetypes').get(); 
    };
        
    /*Get base station redundancy for a given latitude and longitude.
    GET https://backend.sigfox.com/api/coverages/redundancy?lat={lat}&lng={lng}&mode={mode}
    Parameters:
        lat: the latitude.
        lng: the longitude.
        mode: the coverage mode (UNDERGROUND, INDOOR, OUTDOOR). This parameter is optional, default is INDOOR.
            OUTDOOR: max link budget
            INDOOR: link budget with dB margin
            UNDERGROUND: link budget with dB margin
    */ 
    obj.testCoverage = function(lat, lng, mode) {
        return Restangular.one('/coverages/redundancy?lat=' + lat + '&lng=' + lng + '&mode=' + mode).get();    
    };
      
    ///////////////////////////////////
    // Initialisation of the factory //   
    ///////////////////////////////////
    
    Restangular.setBaseUrl('http://localhost:3000/api');
    Restangular.setDefaultHeaders({
        'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    });
      
    return obj;
  }]);
