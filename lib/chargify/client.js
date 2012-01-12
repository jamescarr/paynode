var https = require ('https'),
    events = require ('events'),
    querystring = require ('querystring');

exports.createClient = function (opts) {
  var httpClient = new SimpleHttpClient(opts.key, opts.password, opts.site+'.chargify.com')
  return new Client(httpClient)
}

exports._Client = Client

function tryParse (data) {
  try { return JSON.parse(data) }
  catch (ex) { return null }
}

function Client (httpClient) {
  var callback = function (emitter) {
    return function (status, response) {
      if (status >= 200 && status < 300) {
        emitter.emit('success', tryParse(response));
      }
      else {
        emitter.emit('failure', tryParse(response));
      }
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
    }),
    
    listAll: emit(function () {
      var self = this, results = [];
      function getPage (page) {
        var path = '/customers.json?page=' + page;
        httpClient.get(path, '', function (status, response) {
          if (status >= 200 && status < 300) {
            var pageResults = tryParse(response);
            if (pageResults && pageResults.length > 0) {
              results = results.concat(pageResults);
              getPage(++page);
            }
            else {
              self.emit('success', results);
            }
          }
          else {
            self.emit('failure', tryParse(response));
          }
        }); 
      }
      
      getPage(1);
    })
  };
  
  this.subscriptions = {
    component: emit(function (sub, component) {
      httpClient.get('/subscriptions/' + sub.id + '/components/' + component.id + '.json', '', callback(this));
    }),
    
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
  
    listAll: emit(function () {
      var self = this, results = [];
      function getPage (page) {
        var path = '/subscriptions.json?page=' + page;
        httpClient.get(path, '', function (status, response) {
          if (status >= 200 && status < 300) {
            var pageResults = tryParse(response);
            if (pageResults && pageResults.length > 0) {
              results = results.concat(pageResults);
              getPage(++page);
            }
            else {
              self.emit('success', results);
            }
          }
          else {
            self.emit('failure', tryParse(response));
          }
        }); 
      }
      
      getPage(1);
    }),
    
    update: emit(function (id, sub) {
      httpClient.put('/subscriptions/' + id + '.json', JSON.stringify(sub), callback(this));
    })
  };
  
  this.products = {
    create: emit(function (pfid, product) {
      httpClient.post('/product_families/' + pfid + '/products.json', JSON.stringify(product), callback(this));
    }),
    
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
  
  this.components = {
    list: emit(function (pfid) {
      httpClient.get('/product_families/' + pfid + '/components.json', '', callback(this));
    })
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
  var auth = 'Basic ' + base64.encode(username + ':' + password),
      self = this;
  
  ['delete', 'get', 'post', 'put'].forEach(function(method){
    self[method] = function(path, body, cb){
      makeRequest(method.toUpperCase(), path, body, cb)
    }
  });  

  var makeRequest = function(method, path, body, cb) {
    var options = {
      host: host,
      method: method,
      path: path,
      port: 443,
      headers: {
        host:host,
        'Content-Length': body.length,
        'Content-Type': 'application/json',
        'Authorization': auth
      }
    }
    
    var req = https.request(options, function (res) {
      var buffer = ""
      
      res.on('data', function(data){
        buffer += data.toString()
      });
      
      res.on('end', function(){
        cb(res.headers.status, buffer)
      });
    });
    
    req.end(body);
  };
};

var base64 = { encode: function(str){
  return new Buffer(str).toString('base64')
}}
