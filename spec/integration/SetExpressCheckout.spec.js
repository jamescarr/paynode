require.paths.unshift(__dirname+'/../helpers/')
require.paths.unshift(__dirname+'/../../lib/')

var vows = require('vows'),
    one = require('prenuptials').one,
    assert = require('assert'),
    transactions = require("transactions"),
    clients = require('clients'),
    payflow = require('payment-paypal-payflowpro'),
    sys = require('sys')
    
vows.describe('SetExpressCheckout').addBatch({
  'successful transaction':{
    topic: function(){
      clients.signatureAuth(payflow).setExpressCheckout({
        returnurl:'http://www.example.com/continue'
        ,cancelurl:'http://www.example.com/cancel'
        ,paymentrequest:[
          {amt:'234.00'}
        ]
      }).on('success', this.callback)
    },
    'should contain a token':one(function(result){
      assert.isString(result.token)
    })
  }
}).export(module)
