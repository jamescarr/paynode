require.paths.unshift(__dirname+'../../../lib/')
require.paths.unshift(__dirname+'/../../helpers/')
var vows = require('vows');
var assert = require('assert');
var clients = require('clients');
var transactions = require ('transactions');

var client = clients.signatureAuth(require('paynode').use('payflowpro'));

// promise for transaction execution
function executeTransaction () {
  return {
    then:function (cb) {
      client.doDirectPayment(transactions.valid)
        .on('success', function(details){
          cb(details);
      })
      .on('failure', function(){
        throw new Error("fail");
      });
    }
  }
}
var transactionDetails = {}

vows.describe('Transaction related operations').addBatch({
  'TransactionSearch':{
    'Search by transaction id':{
      topic:function(){
        var self = this;
        executeTransaction().then(function(details){
          transactionDetails = details
          client.transactionSearch({
            startdate:'2010-09-05T08:15:30-05:00',
            transactionid:details.transactionid,
            transactionclass:'All'
           }).on('success', self.callback);
         });
      },
      'should have the results enumartated in an array marked results':function(result, ignored){
        console.log(require('sys').inspect(result))
        assert.deepEqual(result.results, 
          [
            {
              timestamp: transactionDetails.timestamp,
              timezone: 'GMT',
              type: 'Payment',
              name: 'John Doe',
              transactionid: transactionDetails.transactionid,
              status: 'Completed',
              amt: '99.06',
              currencycode: 'USD',
              feeamt: '-3.17',
              netamt: '95.89'
            }
          ]
        );
      }
    },
  },
  'RefundTransaction':{
    topic:function(){
        var self = this;
        executeTransaction().then(function(details){
          transactionDetails = details
          client.refundTransaction({
            transactionid:details.transactionid,
            refundtype:'Partial',
            amt:20.00
           }).on('success', self.callback);
         });
    },
    'should include refund details':function(result, err){
      assert.isNotNull(result.refundtransactionid);
      assert.equal(result.grossrefundamt, 20.00);
      assert.equal(result.feerefundamt, 0.58);
      assert.equal(result.netrefundamt, 19.42);
    }
  }
}).export(module);
