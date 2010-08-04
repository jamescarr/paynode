require.paths.unshift(__dirname+'/../../helpers/')
require.paths.unshift(__dirname+'/../../../lib/')
require.paths.unshift(__dirname+'/../../../lib/payflowpro')

var vows = require('vows'),
    one = require('prenuptials').one,
    fail = require('prenuptials').failWithDump,
    assert = require('assert'),
    transactions = require("transactions"),
    certuser = require('clients').certuser
    
var  PaypalNetworkClient = require('paypal-network-client').PaypalNetworkClient;

(function(){    
  var client = new PaypalNetworkClient('api-3t.sandbox.paypal.com')
    ,certClient = new PaypalNetworkClient('api.sandbox.paypal.com', {cert:certuser.cert, key:certuser.key})
  vows.describe('PaypalNetworkClient').addBatch({
    'signature auth': {
      topic:function(){
        client.request(transactions.fullDoDirectPaymentRequestWithSignature, this.callback);
      },
      'returns a successful result':one(function(result){
        assert.equal(result.ack, 'Success')
      })
    },
    'certificate auth':{
      topic:function(){
        certClient.request(transactions.fullDoDirectPaymentRequestWithCert, this.callback);
      },
      'returns a successful result':one(function(result){
        assert.equal(result.ack, 'Success')
      })
      // some kind of validation if the key and cert are undefined
    }
  }).export(module)

})();
