require.paths.unshift(__dirname+'/../../helpers/')
require.paths.unshift(__dirname+'/../../../lib/')

var vows = require('vows'),
    one = require('prenuptials').one,
    fail = require('prenuptials').failWithDump,
    assert = require('assert'),
    transactions = require("transactions"),
    clients = require('clients'),
   payflow = require('paynode').use('payflowpro')
    
    
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
