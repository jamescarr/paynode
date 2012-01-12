var vows = require('vows');
var assert = require('assert');
var paynode = require('../../lib/paynode');


vows.describe('modules').addBatch({
  'braintree':{
    topic:function(){
      return paynode.use('braintree');
    },
    'should have expected braintree methods':function(result){
      assert.isFunction(result.connect);
    }
  }

}).export(module);
