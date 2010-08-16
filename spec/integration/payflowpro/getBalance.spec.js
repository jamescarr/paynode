require.paths.unshift(__dirname+'/../../helpers/')
require.paths.unshift(__dirname+'/../../../lib/')

var vows = require('vows'),
    one = require('prenuptials').one,
    assert = require('assert'),
    transactions = require("transactions"),
    clients = require('clients')
 
var client = clients.signatureAuth(require('paynode').use('payflowpro'));

vows.describe('getBalance').addBatch({
  'get single balances': {
    topic: function(){
      client.getBalance().on('success', this.callback)
    },
    'should pass an array of balances back': one(function(result){
      assert.equal(1, result.balances.length)
    }),
    'amt is populated':one(function(result){
      assert.isString(result.balances[0].amt)
    }),
    'currencycode is populated':one(function(result){
      assert.equal('USD', result.balances[0].currencycode)
    })
  }
}).export(module)
