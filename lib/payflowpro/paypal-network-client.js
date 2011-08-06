var GatewayClient = require('../gateway-client').GatewayClient,
    paypalResponse = require('response-parser');

function PaypalNetworkClient(host, authInfo){

  var client = new GatewayClient({
    host: host,
    contentType: 'text/namevalue',
    path: '/nvp',
    responseParser: paypalResponse
  }, authInfo);

  this.request = client.request;
}

exports.PaypalNetworkClient = PaypalNetworkClient;