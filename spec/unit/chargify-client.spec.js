var vows = require('vows');
var assert = require('assert');
var Client = require('../../lib/paynode').use('chargify')._Client;

/// -- example data
var exampleSubscription = {"subscription":{
        "product_handle":"[@product.handle]",
        "customer_attributes":{
          "first_name":"Joe",
          "last_name":"Blow",
          "email":"joe@example.com"
        },
        "credit_card_attributes":{
          "full_number":"1",
          "expiration_month":"10",
          "expiration_year":"2020"
        }
      }
}
var client = new Client(new RecordingSimpleHttpClient())

vows.describe('client api').addBatch({
  'Products':{
    'list': calls(function(){
          return client.products.list()
        }).andExpects({
          method:'get',
          path:'/products.json',
          body:''
        }),
    'read / show':calls(function(){
      return client.products.get(12345)
      }).andExpects({
        method:'get',
        path:'/products/12345.json',
        body:''
      }),
    'get via handle':
      calls(function(){
        return client.products.getHandle('product-handle')
      }).andExpects({
        method:'get', 
        path:'/products/handle/product-handle.json',
        body:''
      })
  },
  'Customers':{
    'list':{
      'no page param':calls(function(){
        return client.customers.list()
      }).andExpects({
        method:'get', 
        path:'/customers.json',
        body:''
      }),
      'with page argument':calls(function(){
        return client.customers.list({page:3})
      }).andExpects({
        method:'get', 
        path:'/customers.json?page=3',
        body:''
      })
    },
    'get':calls(function(){
      return client.customers.get(23)
    }).andExpects({
      method:'get',
      path:'/customers/23.json',
      body:''
    }),
    'get by reference':calls(function(){
      return client.customers.getByReference("reference Code")
    }).andExpects({
      method:'get',
      path:'/customers/lookup.json?reference=reference%20Code',
      body:''
    }),
    'create':calls(function(){
      return client.customers.create(
        {first_name:'James', last_name:'Carr', email:'james.r.carr@example.com'}
      )
    }).andExpects({
      method:'post',
      path:'/customers.json',
      body: JSON.stringify({first_name:'James', last_name:'Carr', email:'james.r.carr@example.com'})
    }),
    'edit / update':calls(function(){
      return client.customers.edit(1234, {first_name:'Joseph'})
    }).andExpects({
      method:'put',
      path:'/customers/1234.json',
      body:JSON.stringify({first_name:'Joseph'})
    }),
    'delete':calls(function(){
      return client.customers.delete(123)
    }).andExpects({
      method:'delete',
      path:'/customers/123.json',
      body:''
    })
  },
  'Subscriptions':{
    'list':{
      'no options':calls(function(){
        return client.subscriptions.list()
      }).andExpects({
        method:'get',
        path:'/subscriptions.json',
        body:''
      }),
      'with options':calls(function(){
        return client.subscriptions.list({per_page:10, page:2})
      }).andExpects({
        method:'get',
        path:'/subscriptions.json?per_page=10&page=2',
        body:''
      })
    },
    'list by customer':calls(function(){
      return client.subscriptions.listByCustomer({id:34})
    }).andExpects({
      method:'get',
      path:'/customers/34/subscriptions.json',
      body:''
    }),
    'create':calls(function(){
      return client.subscriptions.create(exampleSubscription)
    }).andExpects({
      method:'post',
      path:'/subscriptions.json',
      body:JSON.stringify(exampleSubscription)
    }),
    'get':calls(function(){
      return client.subscriptions.get({id:93})
    }).andExpects({
      method:'get',
      path:'/subscriptions/93.json',
      body:''
    })
  },
  'Transactions':{
    
    'list':{
      'with no params':calls(function(){
        return client.transactions.list()
      }).andExpects({
        method:'get',
        path:'/transactions.json',
        body:''
      }),
      'with optional params':calls(function(){
        return client.transactions.list({kinds:['credit', 'charge'], max_id:22})
      }).andExpects({
        method:'get',
        path:'/transactions.json?kinds%5B%5D=credit&kinds%5B%5D=charge&max_id=22',
        body:''
      })
    },
    'list transactions for a subscription':{
      'with no params':calls(function(){
        return client.transactions.listForSubscription({id:33})
      }).andExpects({
        method:'get',
        path:'/subscriptions/33/transactions.json',
        body:''
      }),
      'with optional params':calls(function(){
        return client.transactions.listForSubscription({id:33}, {kinds:['charge'], page:2})
      }).andExpects({
        method:'get',
        path:'/subscriptions/33/transactions.json?kinds%5B%5D=charge&page=2',
        body:''
      })
    },
    'Usage':{
      'create':calls(function(){ 
        return client.usage.create({id:43}, {id:30}, {
          usage:{
            quantity:5,
            memo:'Five gigs used'
          }
        })  
      }).andExpects({
        method:'post',
        path:'/subscriptions/43/components/30/usages.json',
        body:JSON.stringify({usage:{quantity:5, memo:'Five gigs used'}})   
      })
    }
  }
  
}).export(module);


function RecordingSimpleHttpClient(){
  var self = this
  this.called = []
  ;['post', 'get', 'delete', 'put'].forEach(function(method){
    self[method] = function(path, body, cb){
      process.nextTick(function(){
        cb(200, JSON.stringify({method:method, path:path, body:body}))
      })
    }
  })
}

function calls(fn){
  return {andExpects:function(expectations){
      return {
        topic: function(){
          fn().on('success', this.callback)
        },
        'called the expected path':function(request, ignored){
          assert.equal(request.path, expectations.path)
        },
        'called the expected method':function(request, ignored){
          assert.equal(request.method, expectations.method)
        },
        'called with expected body':function(request, ignored){
          assert.equal(request.body, expectations.body)
        }
      }
    }
  }
}

