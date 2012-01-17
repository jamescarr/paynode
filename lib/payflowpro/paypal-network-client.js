var GatewayClient = require('../gateway-client').GatewayClient,
    paypalResponse = require('./response-parser');

function PaypalNetworkClient(level, authInfo){

  var client = new GatewayClient({
    host: level.api,
    contentType: 'text/namevalue',
    path: '/nvp',
    responseParser: paypalResponse,
    responseOptions: level
  }, authInfo);

  this.request = client.request;
}

exports.PaypalNetworkClient = PaypalNetworkClient;