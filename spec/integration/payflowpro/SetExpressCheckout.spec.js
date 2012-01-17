var vows = require('vows'),
    one = require('../../helpers/prenuptials').one,
    assert = require('assert'),
    transactions = require("../../helpers/transactions"),
    clients = require('../../helpers/clients'),
    payflow = require('../../../lib/paynode').use('payflowpro')
    
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
