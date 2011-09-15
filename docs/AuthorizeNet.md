#Authorizenet

This client provides functionality for interacting with Authorize.net. Certificate based authentication is not yet supported.

## Suported Methods
 * AIM
 
 
## Usage

Here's an example using the minimal fields needed to process a payment.

      var authorizenet = require('paynode').use('authorizenet');
      
      var client = authorizenet.createClient({
        level:authorizenet.levels.sandbox
        ,login:'<yourlogin>'
        ,tran_key:'<yourtran_key>'
      })

      client.performAimTransaction({
        "x_type": "AUTH_CAPTURE",
        "x_method": "CC",
        "x_card_num": "4111111111111111",
        "x_exp_date": "0115",
        
        "x_amount": "19.99",
        "x_description": "Sample Transaction",

        "x_first_name": "John",
        "x_last_name": "Doe",
        "x_address": "1234 Street",
        "x_state": "WA",
        "x_zip": "98004"})
        .on('success', function(err, result){
          // do something to handle a successful transaction
        })
        .on('failure', function(err, result){
          // do something to handle a failed transaction
        })
  
## Notes
Currently the callbacks for these methods use function(err, result). However, this format will be reverted and a new event named 'exception' will be fired when an exceptional case is reached (DNS resolution failure, 500 error from host, etc). 
 
 

