'use strict';

/**
 * @ngdoc service
 * @name sigfoxCoverageApp.country
 * @description
 * # country
 * Factory in the sigfoxCoverageApp.
 */
angular.module('sigfoxCoverageApp')
  .factory('country', ['turf', function(turf ) {
    
    var obj = {};
    
    // Sets the default header with base64 encoded Authorization
    obj.testInCountry= function(lat, lng, countryCode) {
        return true;
    };
        
    // Sets the credential and then get api/devicetypes 
    obj.distanceToFrontier = function (lat, lng, countryCode) {
        
        return true;
    };
      
    ///////////////////////////////////
    // Initialisation of the factory //   
    ///////////////////////////////////
    
      
    return obj;
  }]);
