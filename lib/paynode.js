require.paths.unshift(__dirname);

[{name:'payflowProGateway', location:'payflowpro/client'}
 ,{name:'authorizeNetGateway', location:'authorizenet/client'}
].forEach(function(module){
  exports.__defineGetter__(module.name, function(){
    return require(module.location)
  })
})

