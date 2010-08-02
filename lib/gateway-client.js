var http = require('http'),
    qs = require('querystring'),
    crypto = require('crypto'),
    sys = require('sys')
    
function GatewayClient(opts, authInfo){
  var createClient = !authInfo?
    function(){ return http.createClient(443, opts.host, true) }
    :
    function(){
      var cred = crypto.createCredentials({cert:authInfo.cert, key:authInfo.key})
      return http.createClient(443, opts.host, true, cred)
    }
  this.request = function(request, callback){
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
