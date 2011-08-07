exports.sandbox = function(opts){
  return {
    api: (opts.cert) ? 'api.sandbox.paypal.com' : 'api-3t.sandbox.paypal.com',
    site: 'www.sandbox.paypal.com'
  }
}
exports.live = function(opts){
  return {
    api: (opts.cert) ? 'api.paypal.com' : 'api-3t.paypal.com',
    site: 'www.paypal.com'
  }
}
