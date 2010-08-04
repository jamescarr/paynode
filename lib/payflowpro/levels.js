exports.sandbox = function(opts){return (opts.cert)? 'api.sandbox.paypal.com' : 'api-3t.sandbox.paypal.com'}
exports.live =function(opts){ return (opts.cert)? 'api.paypal.com' : 'api-3t.paypal.com'}
