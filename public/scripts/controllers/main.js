'use strict';

/**
 * @ngdoc function
 * @name sigfoxCoverageApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sigfoxCoverageApp
 */
angular.module('sigfoxCoverageApp')


// Drop Target directive : catches dragover and drop events    
.directive('dropTarget', function(){
    return function($scope, $element){
    
    // Dragover handler     
    $element.bind('dragover', function(e){
        // Prevent default behaviour when dragging over (before drop)
        e.preventDefault();
      });
    
    // Drop handler
    $element.bind('drop', function(e){
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        
        var dt = e.originalEvent.dataTransfer;
        $scope.fileList = []; // reset the list of file names to empty array
        if (dt.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i=0; i < dt.items.length; i++) {
                if (dt.items[i].kind == "file") {
                    var f = dt.items[i].getAsFile();
                    $scope.fileList.push(f.name);
                    console.log("DataTransferItemList file[" + i + "].name = " + f.name);
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (var i=0; i < dt.files.length; i++) {
                $scope.fileList[0] = 'test';
                
                //$scope.fileList.push(dt.files[i].name);
                console.log("DataTransfer file[" + i + "].name = " + dt.files[i].name);
            }  
        }

    });
    }
})
    
.controller('MainCtrl', [ '$scope', 'NgMap', 'GeoCoder', '$cookies', 'sigfox', 'FileSaver', 'Blob', 
        function ($scope, NgMap, GeoCoder, $cookies, sigfox, FileSaver, Blob) {
    
    // Main variable 
    if (typeof $scope.results == 'undefined') {
        $scope.results = [];    
    };    
    
    if (typeof $scope.markers == 'undefined') {
        $scope.markers = [];    
    };
    
    // Function calling Google geocode and Sigfox API to compute results
    $scope.sigfoxCoverage = function(addr) {
        return;
    }
    
    // Variable controlling the UI alerts
    $scope.addressTextEmpty = false;
    $scope.geocodeError = false; 
    
    if (typeof $scope.showResults == 'undefined') {
        $scope.showResults = false;
    } 
    
    // Variables for the map usage
    if (typeof $scope.googleMapKey == 'undefined') {
        $scope.googleMapKey = $cookies.get('googleMapKey');
    }
     
    // googleMapsUrl is used for the lazy load 
    if ( typeof $scope.googleMapKey == 'undefined') {
        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js";
    } else {
        $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=" + $scope.googleMapKey;
    }
    
    // Functions launched from the UI 
    $scope.launchTest = function(addr) {
        $scope.addressTextEmpty = false;
        $scope.geocodeError = false; 
    
        if ( typeof(addr) == 'undefined') { $scope.addressTextEmpty = true; return false;}
        console.log("Start geocode :" + addr);
        GeoCoder.geocode({address: addr}).then(function(result) {
            console.log("Geocoder results:", result);
            
            if (typeof result != 'undefined' && result.length > 0) {
                var lat = result[0].geometry.location.lat(); 
                var lng = result[0].geometry.location.lng(); 
                
                sigfox.testCoverage(lat, lng, 'OUTDOOR').then(
                    function(sigfoxRes) {
                        // Add a new result in the array
                        $scope.results.push( {
                            requestedAddress : addr,
                            formattedAddress : result[0].formatted_address,
                            lat : lat,
                            lng : lng,
                            precision : result[0].geometry.location_type,
                            redundancy : sigfoxRes.redundancy
                        });
                        
                        // The label is simply the ID of the result in the array
                        var label = $scope.results.length - 1;

                        // We get our map
                        NgMap.getMap().then(function(map) {
                            
                            // First we set the pin color based on redundancy returned
                            var pinColor; 
                            switch( sigfoxRes.redundancy ) {
                                case 0 : 
                                    pinColor = 'f44242';
                                    break;
                                case 1 : 
                                    pinColor = 'f48942';
                                    break;
                                case 2 : 
                                    pinColor = 'f4eb42';
                                    break;
                                case 3 : 
                                    pinColor = '65f442';
                                    break;
                                default : 
                                    pinColor = 'b642f4'; 
                            }
                            
                            // pin image is coming from Google charts API
                            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+ label.toString() +"|" + pinColor,
                                new google.maps.Size(21, 34),
                                new google.maps.Point(0,0),
                                new google.maps.Point(0, 34));
                                
                            // Create a new marker
                            var marker = new google.maps.Marker({
                                position: {
                                    lat: result[0].geometry.location.lat(), 
                                    lng: result[0].geometry.location.lng()
                                },
                                map: map,
                                icon : pinImage
                            }); 
                            marker.setMap(map);

                            // Get the current Bounds of the map and extend it to fit the new marker
                            var bounds = map.getBounds();
                            bounds.extend(marker.position);
                            map.fitBounds(bounds);


                        }, function(error){
                            console.log("NgMap error", error);
                        });

                        // In case it was not on already, display results.
                        $scope.showResults = true;
                        
                    }, function(sigfoxError) {
                        console.log("Sigfox coverage returned error", sigfoxError);    
                    }
                );
                
                
            }
        }, function(error) {
            // Geocoding returns error
            console.log("Geocoding returned error", error);
            $scope.geocodeErrorCode = error;
            $scope.geocodeError = true;
        });
        
    }
    
    $scope.download = function(dataJson) {
        console.log("launch download");
        /* var data = new Blob([ JSON.stringify(dataJson) ], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(data, Date.now() + '_results.json');
        
        */
    };
    
  }]);
