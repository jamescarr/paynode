var vows = require('vows'),
    assert = require('assert'),
    response = require('../../../lib/authorizenet/response-parser')

    
vows.describe('Authorize.net Response Parser').addBatch({
  'Mapping response to appropriate field names':{
    topic:function(){
      var responseFromAuthorize = '1|2|3|(TESTMODE) This transaction has been approved.|000000|P|0|INV223|Sample Transaction|19.99|CC|auth_capture|2222|John|Doe|IBM|1234 Street|Seattle|WA|98004|US|5555555555|5555555556|foo@example.com|John|Dohl|Cisco|4321 Street|St.Louis|MO|68972|US|23.11|1.11|2.33|true|po123|ACF9270B0D46F4900B01115DA202E67F|M|3|||||||||||XXXX1111|Visa||||||||||||||||'
      return response.parseResponse({}, responseFromAuthorize)
    },
    'should be parsed into the expected fields':function(result){
      assert.deepEqual(result, {
        responsecode:1
        ,responsesubcode:2
        ,responsereasoncode:3
        ,responsereasontext:'(TESTMODE) This transaction has been approved.'
        ,authorizationcode:'000000'
        ,avsresponse:'P'
        ,transactionid:'0'
        ,invoicenumber:'INV223'
        ,description:'Sample Transaction'
        ,amount:'19.99'
        ,method:'CC'
        ,transactiontype:'auth_capture'
        ,customerid:'2222'
        ,firstname:'John'
        ,lastname:'Doe'
        ,company:'IBM'
        ,address:'1234 Street'
        ,city:'Seattle'
        ,state:'WA'
        ,zipcode:'98004'
        ,country:'US'
        ,phone:'5555555555'
        ,fax:'5555555556'
        ,email:'foo@example.com'
        ,shiptofirstname:'John'
        ,shiptolastname:'Dohl'
        ,shiptocompany:'Cisco'
        ,shiptoaddress:'4321 Street'
        ,shiptocity:'St.Louis'
        ,shiptostate:'MO'
        ,shiptozipcode:'68972'
        ,shiptocountry:'US'
        ,tax:'23.11'
        ,duty:'1.11'
        ,freight:'2.33'
        ,taxexempt:'true'
        ,purchaseordernumber:'po123'
        ,md5hash:'ACF9270B0D46F4900B01115DA202E67F'
        ,cardresponsecode:'M'
        ,cavvresponse:'3'
        ,accountnumber:'XXXX1111'
        ,cardtype:'Visa'
      })
    }
  }
}).export(module)
    
