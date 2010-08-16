var qs = require('querystring'),
    crypto = require('crypto'),
    sys = require('sys'),
    http_module = require('http')
    
function GatewayClient(opts, authInfo){
  verifyRequiredArguments(opts)
  var http = http_module
  
  var createClient = !authInfo?
    function(){ return http.createClient(443, opts.host, true) }
    :
    function(){
      var cred = crypto.createCredentials({cert:authInfo.cert, key:authInfo.key})
      return http.createClient(443, opts.host, true, cred)
    }
    
  this.request = function(request, callback){
    console.log(sys.inspect(opts))
    var requestString = qs.stringify(request)
    var req = createClient().request('POST', opts.path, {host:opts.host
                  ,'Content-Length':requestString.length
                  ,'Content-Type':opts.contentType})
    req.end(requestString)
    req.on('response', function(res){
      res.on('data', function(data){
        callback(opts.responseParser.parseResponse(data.toString()))
      })
    })
  }
}

exports.GatewayClient = GatewayClient

function verifyRequiredArguments(opts){
  var required = ['host', 'path', 'contentType', 'responseParser']
  if(!opts) throw new Error("Required fields missing. Need an option containing configuration details.")
  var missingFields = required.filter(function(s){ return !(s in opts) || !opts[s]})
  if(missingFields.length > 0){
    throw new Error("GatewayClient ctor is missing required fields " + missingFields.join(','))
  }
}

