var EventEmitter = require('events').EventEmitter,
    GatewayClient = require('../gateway-client').GatewayClient,
    response = require('./response-parser')

exports.createClient = function(options, netClient){
  var conn = netClient || new GatewayClient({
                            host:options.level
                            ,path:'/gateway/transact.dll'
                            ,contentType:'text/keyvalue',
                            responseParser:response})
  
  return new Client(options, conn)
}

exports.levels = require('./levels').levels

function Client(options, netClient){
  var addOptionAttributes = function(req){
    req.x_login= options.login
    req.x_tran_key=options.tran_key
    req.x_version= "3.1"
    req.x_delim_data= "TRUE"
    req.x_delim_char= "|"
    req.x_relay_response= "FALSE"
    return req
  }
  this.performAimTransaction = function(request){
    var emitter = new EventEmitter()
    netClient.request(addOptionAttributes(request), function(response){
      emitter.emit(response.responsecode == 1?'success':'failure', null, response)
    })
    return emitter
  }
  
}
