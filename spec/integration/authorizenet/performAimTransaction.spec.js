var vows = require('vows'),
    assert = require('assert'),
    clients = require('../../helpers/clients'),
    authorizenet = require('../../../lib/paynode').use('authorizenet')

var client = authorizenet.createClient({
  level:authorizenet.levels.sandbox
  ,login:'9N8T3NK4q6vk'
  ,tran_key:'2jmpG96xM59QAJ4d'
})

var invalidAuthClient = authorizenet.createClient({
  level:authorizenet.levels.sandbox
  ,login:'Bad'
  ,tran_key:'Login'
})

var goodTransaction = {
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
      "x_zip": "98004"}


vows.describe('AIM Transaction').addBatch({
  'minimum successful transaction':{
    topic:function(){
      client.performAimTransaction(goodTransaction)
        .on('success', this.callback)
    },
    'should complete successfull':function(err, result){
      assert.equal(result.responsecode, 1)
    },
    'should have no error':function(err, result){
      assert.isNull(err)
    }
  },
  'invalid authentication information':{
    topic:function(){
      invalidAuthClient.performAimTransaction(goodTransaction)
        .on('failure', this.callback)
    },
    'should report that the login or password is incorrect':function(err, result){
      assert.equal(result.responsereasontext, 'The merchant login ID or password is invalid or the account is inactive.')
    }
  },
  'a failed transaction due to invalid card':{
    topic:function(){
      client.performAimTransaction({
      "x_type": "AUTH_CAPTURE",
      "x_method": "CC",
      "x_card_num": "4111111111111111",
      "x_exp_date": "0105",

      "x_amount": "19.99",
      "x_description": "Sample Transaction",

      "x_first_name": "John",
      "x_last_name": "Doe",
      "x_address": "1234 Street",
      "x_state": "WA",
      "x_zip": "98004"
      }).on('failure', this.callback)
     },
    'has error message':function(err, result){
      assert.equal(result.responsereasontext, '(TESTMODE) The credit card has expired.')
    }
  }
}).export(module)
