var vows = require('vows'),
    one = require('../../helpers/prenuptials').one,
    fail = require('../../helpers/prenuptials').failWithDump,
    assert = require('assert'),
    transactions = require("../../helpers/transactions"),
    certuser = require('../../helpers/clients').certuser,
    levels = require('../../../lib/payflowpro/levels')
    
var  PaypalNetworkClient = require('../../../lib/payflowpro/paypal-network-client').PaypalNetworkClient;

(function(){    
  var client = new PaypalNetworkClient(levels.sandbox({}))
    ,certClient = new PaypalNetworkClient(levels.sandbox({ cert: true }), {cert:certuser.cert, key:certuser.key})
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
