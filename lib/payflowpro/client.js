require.paths.unshift(__dirname)

var EventEmitter = require('events').EventEmitter,
    PaypalNetworkClient = require('paypal-network-client').PaypalNetworkClient,
    requestBuilder = require("request-builder")

exports.levels = require('levels')

exports.createClient = function(options){
  options.version='63.0'
  var client = options.cert?
    new PaypalNetworkClient(options.level(options), {cert:options.cert, key:options.key})
    :
    new PaypalNetworkClient(options.level(options))
      
  return new Client(options, client)  
}



function Client(options, paypal){
  options.__defineGetter__('pwd', function(){ return options.password})
  var self = this
  ;['transactionSearch','getBalance', 'getTransactionDetails','addressVerify', 'doDirectPayment', 
    'setExpressCheckout', 'getExpressCheckoutDetails', 'doExpressCheckoutPayment'].forEach(function(name){
    self[name] = function(){
      var req = {method:name}
      for(var i =0; i < arguments.length; i++){
        merge(req, arguments[i])
      }
      requestBuilder.buildRequest(merge(req, options))
      
      var emitter = new EventEmitter()
      paypal.request(req, function(data){
        emitter.emit(data.ack.toLowerCase(), data)
      });
      return emitter  
    }
  })
}

function merge(a, b){
  var no = ['cert', 'key', 'password', 'level']
  Object.keys(b).filter(function(s){ return no.indexOf(s) ==-1}).forEach(function(k){
    a[k] = b[k]
  })
  return a
}
