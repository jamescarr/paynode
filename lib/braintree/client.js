for(var x in require('braintree')){
  exports[x] = require('braintree')[x]
}
