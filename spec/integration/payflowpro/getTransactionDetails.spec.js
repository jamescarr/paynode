var vows = require('vows'),
    one = require('../../helpers/prenuptials').one,
    fail = require('../../helpers/prenuptials').failWithDump,
    assert = require('assert'),
    transactions = require("../../helpers/transactions"),
    clients = require('../../helpers/clients'),
   payflow = require('../../../lib/paynode').use('payflowpro')
    
    
var client = clients.signatureAuth(payflow);
vows.describe('getTransactionDetails').addBatch({
  'return transaction details for transaction id':{
    topic:function(){ 
      client.getTransactionDetails({transactionid:'21G76576KY3293906'})
        .on('success', this.callback)
        .on('failure', fail)
    },
    'should contain customer name':one(function(result){
      assert.equal('John', result.firstname)
      assert.equal('Doe', result.lastname)      
    }),
    'should have no errors':one(function(result){
      assert.isUndefined(result.errors)
    })
  }, 
  'return errors for invalid transactionid': {
   topic:function(){ 
    client.getTransactionDetails({transactionid:'INVALIDTRANSACTION'})
      .on('success', fail)
      .on('failure', this.callback)
    },
    'should have populated errors element':one(function(result){
      assert.deepEqual(result.errors[0], {
            errorcode: '10004',
            shortmessage: 'Transaction refused because of an invalid argument. See additional error messages for details.',
            longmessage: 'The transaction id is not valid',
            severitycode: 'Error'
        })
    })
  }
}).export(module)
