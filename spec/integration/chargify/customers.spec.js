require.paths.unshift(__dirname+'/../../../lib/');
var vows = require('vows');
var assert = require('assert');
var paynode = require('paynode').use('chargify');


var client = paynode.createClient({
      site:'starfish-prime'
      ,key:'EjZSRtt75wHA2NVpIRLX'
      ,password:'test12345'})

vows.describe('module').addBatch({
  'Given I have tried to create a customer with missing info':{
    topic:function(){
      client.customers.create({}).on('failure', this.callback)
    },
    'it should contain an errors array':function(result, ign){
      assert.isArray(result.errors)
    }
  },
  'Given I have customer data':{
    topic:function(){
      client.customers.create({
        customer:{
          first_name:'Joe',
          last_name:'Blow',
          email:'joe.blow@example.com'
        }
      }).on('success', this.callback);
    },
    'should get response with same details sent':function(response, ignore){
      assert.equal(response.customer.first_name, 'Joe')
    },
    'should have populated an id':function(response, ignored){
      assert.isNotNull(response.customer.id)
    }
    
  },
  'listing customers':{
    topic:function(){
      client.customers.list().on('success', this.callback)
    },
    'should be an array':function(response, ign){
      assert.isArray(response)
    },
    'contain at least one customer object':function(response, ign){
      assert.equal(response[0].customer.first_name, 'Joe')
    }
  }
}).export(module);
