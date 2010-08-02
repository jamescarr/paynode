require.paths.unshift(__dirname+'/../../helpers/')
require.paths.unshift(__dirname+'/../../../lib/')

var vows = require('vows'),
    assert = require('assert'),
    clients = require('clients'),
    authorizenet = require('authorizenet/client'),
    levels = require('authorizenet/levels').levels,
    sys = require('sys')

var client = authorizenet.createClient({
  level:levels.sandbox
  ,login:'9N8T3NK4q6vk'
  ,tran_key:'2jmpG96xM59QAJ4d'
})


vows.describe('AIM Transaction').addBatch({
   'minimum successful transaction':{
    topic:function(){
      client.performAimTransaction({
      "x_type": "AUTH_CAPTURE",
      "x_method": "CC",
      "x_card_num": "4111111111111111",
      "x_exp_date": "0115",
      
      "x_amount": "19.99",
      "x_description": "Sample Transaction",

      "x_first_name": "John",
      "x_last_name": "Doe",
      "x_address": "1234 Street",
      "x_state": "WA",
      "x_zip": "98004"
      }).on('success', this.callback)
    },
    'should complete successfull':function(err, result){
      assert.equal(result.responsecode, 1)
    },
    'should have no error':function(err, result){
      assert.isNull(err)
    }
   }
}).export(module)
