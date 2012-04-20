var vows = require('vows'),
    one = require('../../helpers/prenuptials').one,
    assert = require('assert'),
    transactions = require("../../helpers/transactions"),
    payflow = require('../../../lib/paynode').use('payflowpro'),
    clients = require('../../helpers/clients')
    
function examplesUsing(client){
  return {
    'Successful Transaction':{
      topic: function () {
        client.doDirectPayment(transactions.valid)
          .on('success', this.callback)
          .on('failure', function(res){ console.dir(res) })
      },  
      'emits a successful result': function (result, ignore){
        assert.equal('Success', result.ack)
      },
      'contains expected response fields':function(result, ignored){
        ['timestamp', 'correlationid', 'ack', 
         'version', 'amt', 'transactionid',
         'cvv2match', 'avscode'].forEach(function(k){
          assert.isNotNull(result[k])
        })
      }
    },
    'Missing Card Number':{
      topic:function(){
        client.doDirectPayment(transactions.missingCardNumber)
          .on('success', function(){ throw new Exception("should not get called")})
          .on('failure', this.callback)
      }, 
      'emits a failure result': one(function(result){
        assert.equal("Failure", result.ack)
      }),
      'contains error messages in an array':one(function(result){
        assert.isArray(result.errors)
        assert.equal(1, result.errors.length)
      }),
      'error object contains associated information':one(function(result){
        result.errors.forEach(function(err){
          ['errorcode', 'shortmessage', 'longmessage', 'severitycode'].forEach(function(property){
            assert.isString(err[property])
          })
        })
      }),
      'should remove l prefixed properties': one(function(result){
        var errorProps = Object.keys(result).filter(function(s){ return s.match(/^l_/) })
        assert.isEmpty(errorProps)
      })
    }
  }
}

vows.describe('doDirectPayment')
  .addBatch(examplesUsing(clients.signatureAuth(payflow)))
  //.addBatch(examplesUsing(clients.certAuth(payflow)))
  .export(module);
