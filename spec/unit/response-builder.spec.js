var vows = require('vows');
var assert = require('assert');
var r = require('../../lib/payflowpro/response-parser');


vows.describe('building a response').addBatch({
  'constructing multiple list items':{
    topic:function(){
      return r.build({l_name0:'James', l_name1:'Than', l_amt0:200.00,
      l_amt1:300.00})
    },
    'should place both under specific indexes':function(result){
      assert.deepEqual(result[0], {name:'James', amt: 200.00});
      assert.deepEqual(result[1], {name:'Than', amt:300.00});
    }
  }

}).export(module);
