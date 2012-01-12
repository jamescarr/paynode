var vows = require('vows'),
    assert = require('assert'),
    Client = require('../../lib/gateway-client').GatewayClient
    
var returnExceptionFrom = function(fn){
  return function(){
    try{
      fn()
      return "no exception"
    }catch(e){
      return e
    }
  }
}

vows.describe('gateway client').addBatch({
  'throws error when called with no arguments':{ 
    topic:returnExceptionFrom(function(){
        new Client()
    }),
    'throws an exception when calling ctor with no args':function(err){
      assert.throws(function(){  new Client() }, Error)
    },
    'should indicate required fields':function(err){
      assert.include(err.message, "Required fields missing. Need an option containing configuration details.")
    }
    
  },
  'specifies which required options are missing':{
    topic:returnExceptionFrom(function(){
        new Client({})
    }),
    'should include host, path, and contentType as required':function(err){
      assert.include(err.message, 'host')
      assert.include(err.message, 'path')
      assert.include(err.message, 'contentType')
    }
  },
  'complain if the required fields are present, but null':{
    topic:returnExceptionFrom(function(){
      new Client({host:null, contentType:''})
    }),
    'should include host, path, and content':function(err){
      assert.include(err.message, 'host')
      assert.include(err.message, 'path')
      assert.include(err.message, 'contentType') 
      assert.include(err.message, 'responseParser') 
      
    }
  },
  'created with correct ctor parameters':{
    topic:function(){
      var client = new Client({host:'test.authorize.net'
        ,path:'/gateway/transact.dll'
        ,contentType:'text/keyvalue'
        ,responseParser:{
          parseResponse:function(req, res){
            return res
          }
        }
      })
      client.request({foo:'22'}, this.callback)
    },
    'should make the request and get a response':function(result, ignore){
      assert.isTrue(result.length > 1)
    }
  }
}).export(module)


