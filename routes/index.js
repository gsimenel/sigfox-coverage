var express = require('express');
var router = express.Router();
var RateLimiter = require('request-rate-limiter'); // https://github.com/eventEmitter/request-rate-limiter  based on https://www.npmjs.com/package/request 

// Rate limiting the access to Sigfox Backend @ 10 request / min
var limiter = new RateLimiter(10);

router.get('/api/coverages/redundancy', function(req, res) {
// This will catch the authorization header from the requestor and pass it on to Sigfox backend
    
/* Request
GET https://backend.sigfox.com/api/coverages/redundancy?lat={lat}&lng={lng}&mode={mode}
Parameters:
    lat: the latitude.
    lng: the longitude.
    mode: the coverage mode (UNDERGROUND, INDOOR, OUTDOOR). This parameter is optional, default is INDOOR.
        OUTDOOR: max link budget
        INDOOR: link budget with dB margin
        UNDERGROUND: link budget with dB margin
Response
    {
    "redundancy":3
    }
*/     
    var lat = req.query.lat || '0';
    var lng = req.query.lng || '0';
    var mode = req.query.mode || 'OUTDOOR';
    
    
    // Grab the auth header from inbound request
    authHeader = req.get('Authorization') || '0'; 
    console.log("Auth header: " +  authHeader);
    
    if (lat == '' || lng == '') {
        res.json({error : "Empty lat/lng"});    
    }
    else {
        limiter.request( {
                url : 'https://backend.sigfox.com/api/coverages/redundancy?lat=' + lat + '&lng=' + lng + '&mode=' + mode, 
                method : 'get',
                headers: {
                    'Authorization': authHeader
                }
            }, 
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    function tryCatchJsonParse(str) {
                        try{
                            return JSON.parse(str);
                        } catch (ex) {
                            return null;
                        }
                    }
                    res.json(tryCatchJsonParse(response.body));
                }
                else {
                    res.status(response.statusCode).send({error : error});    
                }
            }
        );
    }
});

router.get('/api/devicetypes', function(req, res) {
//GET https://backend.sigfox.com/api/devicetypes
/* Parameters:

None
Optionally, the request can also have the following parameter:

includeSubGroups: true if you need also device types from child groups.
Response

{
  "data" : [ {
    "id" : "4d3091a05ee16b3cc86699ab",
    "name" : "SIGFOX test device",
    "group" : "4d39a4c9e03e6b3c430e2188",
    "description" : "Little things in the black boxes",
    "keepAlive" : 7200,
    "payloadType" : "None",
    "contract" : "523b1d10d777d3f5ae038a02"
  }, {
    "id" : "4d52cde8b4e81b6a0db3a00e",
    "name" : "Geolocated device",
    "group" : "4dc11c1a2f0f0590ce6d4879",
    "description" : "A device with a GPS",
    "keepAlive" : 0,
    "payloadType" : "Geolocation",
    "contract" : "547eab8a9336a3d6150ec144"
  } ]
}*/ 
    // Grab the auth header from inbound request
    authHeader = req.get('Authorization') || '0'; 
    console.log("Auth header: " +  authHeader);
    limiter.request( {
            url : 'https://backend.sigfox.com/api/devicetypes', 
            method : 'get',
            headers: {
                'Authorization': authHeader
            }
        }, 
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                function tryCatchJsonParse(str) {
                    try{
                        return JSON.parse(str);
                    } catch (ex) {
                        return null;
                    }
                }
                res.json(tryCatchJsonParse(response.body));
            }
            else {
                res.status(response.statusCode).send({error : error});        
            }
        }
    );
});



module.exports = router;


