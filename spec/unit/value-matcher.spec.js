var vows = require('vows');
var assert = require('assert');
var val = require('../../lib/value-matcher').val;


vows.describe('Value Matcher').addBatch({
  'String is one of any of the provided values':{
    topic:function(){
      return val("Foo").isOneOf("Bar", "Foo", "Baz")
    },
    'should return true since value matchers one':function(result){
      assert.isTrue(result)
    }
  },
  'String is not one of the provided values':{
    topic:function(){
      return val("Foo").isOneOf("A", "B", "C");
    },
    'should return false':function(result){
      assert.isFalse(result);
    }
  }

}).export(module);
