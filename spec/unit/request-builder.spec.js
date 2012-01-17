var vows = require('vows'),
    assert = require('assert'),
    builder = require('../../lib/payflowpro/request-builder')
    
var exampleRequest = {maxamt:1000.00,
  paymentrequest:[
    {amt:500.00,
     itemamt:455,
     shippingamt:40.00,
     insuranceamt:5.00,
     items:[
      {name:'kindle', desc:'ebook reader', amt:200.00, qty:2},
      {name:'kindle cover', desc:'Cover for kindle', amt:20.00, qty:2},    
      {name:'Infinite Crisis', desc:'comic book', amt:15.00, qty:1, ebayitemnumber:10}
     ]
    },
    {amt:200.00,
     itemamt:252,
     shippingamt:40.00,
     insuranceamt:2.00,
     items:[
      {name:'box', desc:'cardboard container', amt:100.00, qty:2},
      {name:'bubble wrap', desc:'plastic fun for popping', amt:20.00, qty:2},    
      {name:'Final Crisis', desc:'comic book', amt:15.00, qty:1, ebayitemnumber:10}
     ]
    }
  ],
  shippingoption:[
    {isdefault:true, name:'Air', amount:200.00},
    {isdefault:false, name:'Ground', amount:20.00}    
  ],
  paymentinfo:[
    {feeamt:234},
    {feeamt:111}
  ]
}    

    
vows.describe('request builder').addBatch({
 'Create Flat result for nested keys':{
  topic:function(){
    return builder.buildRequest(exampleRequest)
  },
  'should keep non-nested properties':function(result){
    assert.equal(result.maxamt, '1000.00')
  },
  'should flatten to the form paymentrequest_n_name for top level elements':function(result){
      assert.equal(result.paymentrequest_0_amt, 500.00)
      assert.equal(result.paymentrequest_1_amt, 200.00)
      assert.equal(result.paymentrequest_0_insuranceamt, 5.00)
      assert.equal(result.paymentrequest_1_insuranceamt, 2.00)
  },
  'should not contain original nested element':function(result){
    assert.isUndefined(result.paymentrequest)
  },
  'should coerce nested items element to the form l_paymentrequest_n_name':function(result){
    assert.equal(result.l_paymentrequest_1_name2, 'Final Crisis')
    assert.equal(result.l_paymentrequest_0_desc1, 'Cover for kindle')
  },
  'should flatten shipping options to form l_shippingoptionNAME':function(result){
    assert.equal(result.l_shippingoptionisdefault0, true)
    assert.equal(result.l_shippingoptionname1, 'Ground')
    assert.equal(result.l_shippingoptionamount0, 200.00)
  },
  'should flatten paymentinfo':function(result){
    assert.equal(result.paymentinfo_0_feeamt, 234)
    assert.equal(result.paymentinfo_1_feeamt, 111)
      
  }
 }
}).export(module)
    
   
