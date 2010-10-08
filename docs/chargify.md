# Chargify API
This is an adapter for using [Chargify](http://www.chargify.com) payment gateway for subscription based and "metered" payments. Please see the API docs for request details.
As with the rest of the paynode api, clients are created using createClient and each API method has 'success' or 'failure' events that will be triggered whenever those
states are reached.

This is a rough cut... hopefully the full API will be implemented soon! Let me know if you have problems!


## Creating a client
	var chargify = require('paynode').use('chargify')

	var client = chargify.createClient({site:'yoursite', key:'api key', password:'password'})

## Creating a Customer
     client.customers.create(
       {first_name:'Joe', last_name:'Smokes', email:'joe_smokes@example.com'}
     ).on('success', function(resp){
      // succeeded!
     }).on('failure', function(resp){
      // damn, failed. Take a look at resp.errors (an array)
      resp.errors.forEach(function(err){  
        console.log("Error: " + err)
      })
     })

## Creating a Subscription
    client.subscriptions.create({
     "product_handle":"basic",
     "next_billing_at":"2010-08-29T12:00:00-04:00",
     "customer_attributes":{
       "first_name":"John",
       "last_name":"Doe",
       "email":"john.doe@example.com",
       "reference":"123",
       "organization":"Acme Widgets"
     },
     "payment_profile_attributes":{
       "vault_token":"12345",
       "customer_vault_token":"67890",
       "current_vault":"authorizenet",
       "expiration_year":"2020",
       "expiration_month":"12",
       "card_type":"visa",
       "last_four":"1111"
      }
    }).on('success', function(resp){
     // some response as defined on the chargify api docs site
    })


## Listing Products
	client.products.list().on('success', function(products){
	  products.forEach(function(product){
	    // something with each product, see the docs for structure
	  })
	})

## Transactions
(Coming Soon)

## Charges
(Coming Soon)

## Refunds
(Coming Soon)

## Credits
(Coming Soon)

## Metered Usage

### Recording a usage
Recording a usage is a matter of calling client.usage.create([subscription], [component], [usage]), where the subscription and component are objects representing both (although all that is needed is ids). This 
makes it convenient if you have references to a subscription and component on hand. Otherwise you can just do it literally:
	client.usage.create({id:33}, {id:22}, {usage:{quantity:10, memo:'databases in use'}})
	  .on('success', successHandler)
	  .on('failure', failureHandler)
	


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

