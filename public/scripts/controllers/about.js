'use strict';

/**
 * @ngdoc function
 * @name sigfoxCoverageApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sigfoxCoverageApp
 */
angular.module('sigfoxCoverageApp')
  .controller('AboutCtrl', [ '$scope', '$cookies', 'sigfox', function ( $scope, $cookies, sigfox) {
    
    // Default values for credential testing alerts
    $scope.alertCredentialOK = false;
    $scope.alertNoGoogleMaps = false;
    $scope.alertSigfoxError = false;
    $scope.alertGoogleMapsError = false;
    
    // Read the past values from cookies
    $scope.sigfoxUsername = $cookies.get('sigfoxUsername');
    $scope.sigfoxPassword = $cookies.get('sigfoxPassword');
    $scope.googleMapKey = $cookies.get('googleMapKey');
    
    $scope.testCredentials = function(){
        // Function will test the Sigfox credentials and the Google Maps key
        console.log("Controllers about.js Start testCredentials");
        // reset defaults 
        $scope.alertCredentialOK = false;
        $scope.alertNoGoogleMaps = false;
        $scope.alertSigfoxError = false;
        $scope.alertGoogleMapsError = false;

        // Stores the credential values
        $cookies.put('sigfoxUsername', $scope.sigfoxUsername);
        $cookies.put('sigfoxPassword', $scope.sigfoxPassword);
        $cookies.put('googleMapKey', $scope.googleMapKey);
        
        // Test if googleMap key was provided
        if ( typeof($scope.googleMapKey) == 'undefined' || $scope.googleMapKey == '' ) {
            $scope.alertNoGoogleMaps = true;
        } else {
            // TODO Test google Map key here
            
            
        }
        
        // Test Sigfox credentials Asynchroniously
        sigfox.testCredentials($scope.sigfoxUsername, $scope.sigfoxPassword).then(
            function(res) {
                $scope.alertCredentialOK = true;
                $scope.alertSigfoxError = false;
            }, function(error) {
                $scope.alertCredentialOK = false;
                $scope.alertSigfoxError = true;
        });

        console.log("Controllers about.js End testCredentials");
        return true;
    };
    
  }] );

