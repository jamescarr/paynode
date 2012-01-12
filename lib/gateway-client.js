var qs = require('querystring'),
    https = require('https');

function GatewayClient(opts, authInfo){
  verifyRequiredArguments(opts);

  this.request = function(request, callback){
    var requestString = qs.stringify(request);

    var options = {
        host: opts.host,
        path: opts.path,
        port: 443,
        method: 'POST',
        headers: {
            'Host': opts.host,
            'Content-Type': opts.contentType,
            'Content-Length': requestString.length
        }
    };

    if (authInfo) {
      options.cert = authInfo.cert;
      options.key = authInfo.key;
    }

    var req = https.request(options);
    req.end(requestString);
    req.on('response', function(res){
        res.on('data', function(data){
          // TODO add error handling
          callback(opts.responseParser.parseResponse(requestString, data.toString(), opts.responseOptions))
        })
    })
  }
}

exports.GatewayClient = GatewayClient;

function verifyRequiredArguments(opts){
  var required = [ 'host', 'path', 'contentType', 'responseParser' ]
  if(!opts) throw new Error("Required fields missing. Need an option containing configuration details.")
  var missingFields = required.filter(function(s){ return !(s in opts) || !opts[s] })
  if(missingFields.length > 0){
    throw new Error("GatewayClient ctor is missing required fields " + missingFields.join(','))
  }
}

