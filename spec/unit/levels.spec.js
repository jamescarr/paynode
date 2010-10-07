require.paths.unshift(__dirname+'/../../lib/')
var vows = require('vows'),
    assert = require('assert'),
    levels = require('paynode').use('payflowpro').levels
    
vows.describe('Environment Levels').addBatch({
  'sandbox url':{
    'for signature':{
      topic:function(){
        return {user:'someuser', password:'somepassword', signature:'sig'}
      },
      'should return correct sandbox url':function(opts){
        assert.equal('api-3t.sandbox.paypal.com', levels.sandbox(opts))
      },
      'should return the correct live url':function(opts){
       assert.equal('api-3t.paypal.com', levels.live(opts))
      }
    },
    'for cert':{
      topic:function(){
        return {user:'someuser', password:'somepassword', cert:'cert', key:'key'}
      },
      'should return correct sandbox url':function(opts){
        assert.equal('api.sandbox.paypal.com', levels.sandbox(opts))
      },
      'should return the correct live url':function(opts){
       assert.equal('api.paypal.com', levels.live(opts))
      }
    },
    'when both are present, use cert':{
      topic:function(){
        return {user:'someuser', password:'somepassword', cert:'cert', key:'key', signature:'sig'}
      },
      'should return correct sandbox url':function(opts){
        assert.equal('api.sandbox.paypal.com', levels.sandbox(opts))
      },
      'should return the correct live url':function(opts){
       assert.equal('api.paypal.com', levels.live(opts))
      }
    }
  }
}).export(module)

