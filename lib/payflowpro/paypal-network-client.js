var qs = require('querystring'),
    https = require("https"),
    paypalResponse = require('response-parser');
    
function PaypalNetworkClient(host, authInfo){
  this.request = function(request, callback) {
      var requestString = qs.stringify(request)
      var options = {
        host: host,
        port: 443,
        path: '/nvp',
        method: 'POST',
        headers: {
            "content-type":'application/x-www-form-urlencoded',
            "content-length": requestString.length,
        }
      };
      console.log(options);
      var req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(data) {
            console.log(" " + data);
            //callback(paypalResponse.parseResponse(request, data.toString()));
        });
      });
      req.end(requestString);

      req.on('error', function(e) {
        console.error(e);
      });
  }  
}

exports.PaypalNetworkClient = PaypalNetworkClient
