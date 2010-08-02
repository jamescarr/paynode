exports.signatureAuth = function(payflow){
  return payflow.createClient({level:payflow.levels.sandbox
    , user:'webpro_1279778538_biz_api1.gmail.com'
    , password:'1279778545'
    , signature: 'AiPC9BjkCyDFQXbSkoZcgqH3hpacA0hAtGdCbvZOkLhMJ8t2a.QoecEJ'
  })
}

exports.certAuth = function(payflow){
  return payflow.createClient({level:payflow.levels.sandbox
    , user:'cert_1279865159_biz_api1.gmail.com'
    , password:'LXLDUTRFGA39YR25'
    , cert:cert
    , key:key})
}



var fs = require('fs')
var cert = fs.readFileSync(__dirname+"/../certs/public-key.pem", 'ascii').replace(/\n$/, '')

var key = fs.readFileSync(__dirname+"/../certs/private-key.pem", 'ascii').replace(/\n$/, '')

exports.cert = cert
exports.key = key

exports.certuser = {user:'cert_1279865159_biz@gmail.com'
    ,password:'LXLDUTRFGA39YR25'
    ,cert:cert
    ,key:key
}
