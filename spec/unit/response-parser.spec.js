var vows = require('vows'),
    one = require('../helpers/prenuptials').one,
    assert = require('assert'),
    response = require('../../lib/payflowpro/response-parser')
    
    
vows.describe('Response Parser').addBatch({
  'Parsing your average response': {
    topic: response.parseResponse({}, "CCV2=A&ACK=Success&CORRELATIONID=111")
    ,
    'should lowercase each key': function(topic){
      assert.deepEqual(['ccv2', 'ack', 'correlationid'], Object.keys(topic))
    },
    'should parse each value as a string': function(topic){
      assert.equal('A', topic.ccv2)
      assert.equal('Success', topic.ack)
      assert.equal('111', topic.correlationid)            
    }
  }, 'Parsing error details': {
    topic: response.parseResponse({}, 'ACK=Fail&L_ERRORCODE0=12345&L_SHORTMESSAGE0=Epic Fail'),
    'should parse in side a nested array':function(topic){
      assert.isArray(topic.errors)
    },
    'should remove original error elements':function(topic){
      assert.deepEqual(['ack', 'errors'], Object.keys(topic))
    },
    'should populate object in array':function(topic){
      var error = topic.errors[0]
      
      assert.deepEqual({errorcode:'12345', shortmessage:'Epic Fail'}, error)

    },
  },'Parse multiple error details':{
    topic:response.parseResponse({}, 'L_ERRORCODE0=100&L_SHORTMESSAGE0=Epic Fail&L_ERRORCODE1=200&L_SHORTMESSAGE1=Whale Fail'),
      'should parse as individual entries in the array in order':function(topic){
      var errors = topic.errors
      
      assert.deepEqual({errorcode:'100', shortmessage:'Epic Fail'}, errors[0])
      assert.deepEqual({errorcode:'200', shortmessage:'Whale Fail'}, errors[1])        
      },
      'should only have 2 error elements':function(topic){
        assert.equal(2, topic.errors.length)
      }
  },'More list items than error details': {
    topic: response.parseResponse({method:'getBalance'}, 'ACK=Fail&L_ERRORCODE0=12345&L_SHORTMESSAGE0=Epic Fail&L_AMT0=22.33&L_LONGMESSAGE0=long msg&L_SEVERITYCODE0=9&L_CURRENCYCODE0=USD'),

    'should parse only relevant error fields for error':function(topic){
      assert.deepEqual(['errorcode', 'shortmessage', 'longmessage', 'severitycode'], Object.keys(topic.errors[0]))
    },
    'should parse currency code and amt for balance': function(topic){
      assert.deepEqual(topic.balances, [{amt:'22.33', currencycode:'USD'}])
    }
  },
  'create nested structure for paymentinfo':{
    topic:
      response.parseResponse({}, 'paymentrequest_0_amt=22.00&paymentrequest_1_taxamt=4.67&paymentrequest_1_amt=22.91&paymentrequest_0_taxamt=2.67')
    ,
    'should create array of paymentrequest':function(topic){
      assert.isArray(topic.paymentrequest)
    },
    'should populate the correct values for the first index':function(topic){
      assert.deepEqual(topic.paymentrequest[0], {amt:22.00, taxamt:2.67})
    },
    'should populate the correct values for the second index':function(topic){
      assert.deepEqual(topic.paymentrequest[1], {amt:22.91, taxamt:4.67})
    },
    'should remove original keys':function(topic){
      assert.isUndefined(topic.paymentrequest_0_amt)
    }
    
  }
}).export(module)
