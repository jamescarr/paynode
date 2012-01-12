var http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    qs = require('querystring')
    
var transaction = {user:'cert_1279865159_biz_api1.gmail.com'
  ,pwd:'LXLDUTRFGA39YR25'
  ,amt:'99.06'
  ,version:'58.0'
  ,paymentaction:'Sale'
  ,ipaddress:'1.1.1.1'
  ,creditcardtype:'Visa'
  ,acct:'4834907016040081'
  ,expdate:'032011'
  ,cvv2:'000'
  ,firstname:'John'
  ,lastname:'Doe'
  ,street:'123 test st'
  ,city: 'omaha'
  ,state: 'NE'
  ,countrycode:'US'
  ,zip:'68102'
  ,method:'doDirectPayment'
}    
var host = 'api.sandbox.paypal.com'
    
function start(key, cert){
  var requestString = qs.stringify(transaction)
  var streetCred = crypto.createCredentials({key:key, cert:cert})

  var client = http.createClient(443, host, true, streetCred)
  var req = client.request('POST', '/nvp', {host:host
              ,'Content-Length':requestString.length
              ,'Content-Type':'text/namevalue'})

  req.end(requestString)
  
  req.on('response', function(res){
    res.on('data', function(data){
      console.dir(qs.parse(data));
    })
  })
}

fs.readFile(__dirname+'/spec/certs/public-key.pem', 'ascii', function(err, pub){
  fs.readFile(__dirname+'/spec/certs/private-key.pem', 'ascii', function(err, priv){
    start(priv.replace(/\n$/, ""), pub.replace(/\n$/, ""))
  })
})
  /*
  
  function PaypalNetworkClient(host){
  this.request = function(request, callback){
    var requestString = qs.stringify(request)
    var client = http.createClient(443, host, true)
    var req = client.request('POST', '/nvp', {host:host
                  ,'Content-Length':requestString.length
                  ,'Content-Type':'text/namevalue'})
    req.end(requestString)
    req.on('response', function(res){
      res.on('data', function(data){
        callback(responseParser.parseResponse(data))
      })
    })
  }
}
*/

