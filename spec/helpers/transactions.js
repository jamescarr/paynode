exports.valid={amt:'99.06'
   ,version:'58.0'
   ,paymentaction:'Sale'
   ,ipaddress:'1.1.1.1'
   ,creditcardtype:'Visa'
   ,acct:'4834907016040081'
   ,expdate:'032015'
   ,cvv2:'000'
   ,firstname:'John'
   ,lastname:'Doe'
   ,street:'123 test st'
   ,city: 'omaha'
   ,state: 'NE'
   ,countrycode:'US'
   ,zip:'68102',
  }
exports.missingCardNumber = {amt:'99.06'
   ,version:'58.0'
   ,paymentaction:'Sale'
   ,ipaddress:'1.1.1.1'
   ,creditcardtype:'Visa'
   ,expdate:'032011'
   ,cvv2:'000'
   ,firstname:'John'
   ,lastname:'Doe'
   ,street:'123 test st'
   ,city: 'omaha'
   ,state: 'NE'
   ,countrycode:'US'
   ,zip:'68102'
  }
  
var doDirectPaymentSigUser = {user:'webpro_1279778538_biz_api1.gmail.com'
  ,pwd:'1279778545'
  ,signature: 'AiPC9BjkCyDFQXbSkoZcgqH3hpacA0hAtGdCbvZOkLhMJ8t2a.QoecEJ'
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
exports.fullDoDirectPaymentRequestWithSignature = doDirectPaymentSigUser

var f = {user:'cert_1279865159_biz_api1.gmail.com'
  ,pwd:'LXLDUTRFGA39YR25'
}

Object.keys(doDirectPaymentSigUser).filter(isNot(['user', 'pwd', 'signature'])).forEach(function(k){
  f[k] = doDirectPaymentSigUser[k]
  
})

exports.fullDoDirectPaymentRequestWithCert = f

function isNot(keys){
  return function(s){
    return keys.indexOf(s) == -1
  }  
}
