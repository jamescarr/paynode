var fieldDefinitions = { 
  0:'responsecode'
  ,1: 'responsesubcode'
  ,2: 'responsereasoncode'
  ,3: 'responsereasontext'
  ,4: 'authorizationcode'
  ,5: 'avsresponse'
  ,6: 'transactionid'
  ,7: 'invoicenumber'
  ,8: 'description'
  ,9: 'amount'
  ,10: 'method'
  ,11: 'transactiontype'
  ,12: 'customerid'
  ,13: 'firstname'
  ,14: 'lastname'
  ,15: 'company'
  ,16: 'address'
  ,17: 'city'
  ,18: 'state'
  ,19: 'zipcode'
  ,20: 'country'
  ,21: 'phone'
  ,22: 'fax'
  ,23: 'email'
  ,24: 'shiptofirstname'
  ,25: 'shiptolastname'
  ,26: 'shiptocompany'
  ,27: 'shiptoaddress'
  ,28: 'shiptocity'
  ,29: 'shiptostate'
  ,30: 'shiptozipcode'
  ,31: 'shiptocountry'
  ,32: 'tax'
  ,33: 'duty'
  ,34: 'freight'
  ,35:'taxexempt'
  ,36:'purchaseordernumber'
  ,37: 'md5hash'
  ,38:'cardresponsecode'
  ,39:'cavvresponse'
  ,50:'accountnumber'
  ,51:'cardtype'
}


exports.parseResponse = function(request, response){
  var result = {}
  response.split('|').forEach(function(value, index){
    var key = fieldDefinitions[index]
    if(key != undefined)
      result[key] = value
  })
  
  return result
}
