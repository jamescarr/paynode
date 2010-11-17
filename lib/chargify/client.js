require.paths.unshift(__dirname+'/../');

var http = require ('http'),
    events = require ('events'),
    querystring = require ('querystring');

exports.createClient = function (opts) {
  var httpClient = new SimpleHttpClient(opts.key, opts.password, opts.site+'.chargify.com')
  return new Client(httpClient)
}

exports._Client = Client

function Client (httpClient) {
  var callback = function (emitter) {
    return function (status, response) {
      if (status >= 200 && status < 300)
       emitter.emit('success', JSON.parse(response)) 
     else
       emitter.emit('failure', JSON.parse(response))
    }
  };
  
  var emit = function (cb) {
    return function () {
      var emitter = new events.EventEmitter()
      cb.apply(emitter, arguments)
      return emitter
    }
  };
  
  this.coupons = {
    find: emit(function (familyId, couponId) {
      httpClient.get('/product_families/' + familyId + '/coupons/' + couponId + '/find.json', '', callback(this));      
    }),
    
    get: emit(function (familyId, couponId) {
      httpClient.get('/product_families/' + familyId + '/coupons/' + couponId + '.json', '', callback(this));
    })
  };
  
  this.customers = {
    create: emit(function (customer) {
      httpClient.post('/customers.json', JSON.stringify(customer), callback(this));
    }),
  
    edit: emit(function (id, customer) {
      httpClient.put('/customers/' + id + '.json', JSON.stringify(customer), callback(this));
    }),
  
    delete: emit(function (id) {
      httpClient.delete('/customers/' + id + '.json', '', callback(this));
    }),
    
    get: emit(function (id) {
      httpClient.get('/customers/' + id + '.json', '', callback(this));
    }),
  
    getByReference: emit(function (ref) {
      httpClient.get('/customers/lookup.json?' + querystring.encode({ reference:ref }), "", callback(this));
    }),
  
    list: emit(function (opts) {
      var path = '/customers.json' + (opts? '?page='+opts.page:'');
      httpClient.get(path, '', callback(this));
    })
  };
  
  this.subscriptions = {
    create: emit(function (sub) {
      httpClient.post('/subscriptions.json', JSON.stringify(sub), callback(this));
    }),
  
    get: emit(function (sub) {
      httpClient.get('/subscriptions/' + sub.id + '.json', '', callback(this));
    }),
    
    list: emit(function (opts) {
      var path = '/subscriptions.json' + (opts ? '?' + querystring.encode(opts) : '');
      httpClient.get(path, '', callback(this));
    }),
  
    listByCustomer: emit(function (customer) {
      httpClient.get('/customers/' + customer.id + '/subscriptions.json', '', callback(this));
    }),
  
    update: emit(function (sub) {
      httpClient.post('/subscriptions.json', JSON.stringify(sub), callback(this));
    })
  };
  
  this.products = {
    get: emit(function (id) {
      httpClient.get('/products/' + id + '.json', '', callback(this));
    }),
    
    getHandle: emit(function (handle) {
      httpClient.get('/products/handle/' + handle + '.json', '', callback(this));
    }),
    
    list: emit(function () {
      httpClient.get('/products.json', '', callback(this))
    }),
  };
  
  this.refunds = {
    create: emit(function (refund) {
      httpClient.post('/subscriptions/' + subscription.id + '/refunds.json', JSON.stringify(refund), callback(this));
    })
  };

  this.transactions = {
    list: emit(function (params) {
      httpClient.get('/transactions.json' + (params? '?'+querystring.encode(params):''), "", callback(this))
    }),
    
    listForSubscription: emit(function (subscription, params) {
      httpClient.get('/subscriptions/' + subscription.id + '/transactions.json' + (params ? '?' + querystring.encode(params) : ''), '', callback(this));
    })
  };

  this.usage = {
    create: emit(function (subscription, component, usage) {
      httpClient.post('/subscriptions/' + subscription.id + '/components/' + component.id + '/usages.json', JSON.stringify(usage), callback(this));
    })
  };
};

function SimpleHttpClient(username, password, host){
  var auth = 'Basic ' + base64.encode(username + ':' + password);
  var createClient = function(){
    return http.createClient(443, host, true)
  };
  
  var self = this;
  
  ['delete', 'get', 'post', 'put'].forEach(function(method){
    self[method] = function(path, body, cb){
      makeRequest(method.toUpperCase(), path, body, cb)
    }
  });  

  var makeRequest = function(method, path, body, cb) {
    var req =createClient().request(method, path, {host:host,
      'Content-Length':body.length,
      'Content-Type':'application/json',
      'Authorization':auth})
    req.end(body)
    req.on('response', function(resp){ 
      var buffer = ""
      resp.on('data', function(data){
        buffer += data.toString()
      })
      resp.on('end', function(){
        cb(resp.headers.status, buffer)
      })
    })
  };
};

var base64 = { encode: function(str){
  return new Buffer(str).toString('base64')
}}
