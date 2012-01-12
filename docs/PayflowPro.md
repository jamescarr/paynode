# Payflow Pro API
This is a node based wrapper for Paypal's Payflow Pro API (https://cms.paypal.com/us/cgi-bin/?cmd=_render-content&content_ID=developer/howto_gateway_payflowpro). The plan will be to implement all of the API methods available as well as the many authentication modes. 

All fields returned by the API are represented as object properties in the result object, with the exception of list elements (keys prefixed by L_) which will be located in a hash representative of the fields (errors for error name-value pairs, balances for balance related NVPs). 

More to come, but please feel free to make suggestions!


## Supported Authentication Methods
 - 3 Token
 - Certificate based auth
 
## Supported API methods
  - doDirectPayment
  - refundTransaction
  - doVoid
  - createRecurringPaymentsProfile
  - billOutstandingAmount
  - doAuthorization
  - doCapture
  - doNonReferencedCredit
  - doReauthorization
  - doReferenceTransaction
  - getBillingAgreementCustomerDetails
  - getTransactionDetails
  - getRecurringPaymentsProfileDetails
  - manageRecurringPaymentsProfileStatus
  - managePendingTransactionStatus
  - massPayment
  - updateRecurringPaymentsProfile
  - setExpressCheckout
  - getExpressCheckoutDetails
  - doExpressCheckoutPayment 

See https://cms.paypal.com/us/cgi-bin/?&cmd=_render-content&content_ID=developer/howto_api_reference for required fields for each API method.
## Examples

### Creating a client using SSL Certificate based Auth:
    var client = payflow.createClient({level:payflow.levels.sandbox
      , user:'username'
      , password:'LXLDUTRFGA39YR25'
      , cert:'string representing your cert'
      , key:'key representing your key'
    })

### DoDirectPayment
Process a payment

    var payflow = require('paynode').use('payflowpro');

    var client = payflow.createClient({level:payflow.levels.sandbox
      , user:'username'
      , password:'password'
      , signature: 'signature'
    })

    client.doDirectPayment({amt:'99.06'
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
      }).on('success', function(result){
        // do something based on a succesful transaction
      }).on('failure', function(result){
        // do something based on a failed transaction
        result.errors.forEach(function(err){
          /**
           * { errorcode: '10527'
           * , shortmessage: 'Invalid Data'
           * , longmessage: 'This transaction cannot be processed. Please enter a valid credit card number and type.'
           * , severitycode: 'Error'
           * }
           **/
      })
    })

### GetBalance
Get the balances of your account
    
    var payflow = require('paynode').use('payflowpro');

    var client = payflow.createClient({level:payflow.levels.sandbox
      , user:'username'
      , password:'password'
      , signature: 'signature'
    })
    client.getBalance().on('success', function(result){
      result.balances.forEach(function(balance){
        console.log(balance.amt)
        console.log(balance.currencycode)
      })
    })  
 
## TransactionSearch
To do a transaction search by transaction id:

        client.transactionSearch({
          startdate:'2010-09-05T08:15:30-05:00',
          transactionid:details.transactionid,
          transactionclass:'All'
        }).on('success', function(response){
          response.results.forEach(function(transaction){
            /**
              each transaction maps to l_ fields in API docs
              for example: 
            {
            timestamp: transactionDetails.timestamp,
            timezone: 'GMT',
            type: 'Payment',
            name: 'John Doe',
            transactionid: transactionDetails.transactionid,
            status: 'Completed',
            amt: '99.06',
            currencycode: 'USD',
            feeamt: '-3.17',
            netamt: '95.89'
            }
            ****/ 
          });
        });

See the Paypal API docs for explicit details.


## Contribute
All code is written BDD style using vowsjs. I've included a few sh scripts to run all specs, unit-specs, and integration-specs. 

## License 

(The MIT License)

Copyright (c) 2010 James Carr <james.r.carr@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

