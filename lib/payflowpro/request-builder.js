var props = Object.keys

function startsWith(arr){
  return function(s){
    return arr.some(function(a){ return s.indexOf(a) > -1 })
  }
}

exports.buildRequest = function(req){
  var nestedProperties = props(req).filter(startsWith(['paymentrequest', 'paymentinfo']))
  var request = req
  nestedProperties.forEach(function(key){
    req[key].forEach(function(sub, i){
      props(sub).forEach(function(k){
        if(k == 'items'){
          sub.items.forEach(function(item, n){
            props(item).forEach(function(itemAttr){
              request["l_"+key+"_"+i+"_"+itemAttr+n] = item[itemAttr]
            })
          })
        }else{
          request[key+"_"+i+"_"+k] = sub[k]
        }
      })
    })
    delete request[key]
  })
  
  if(request.shippingoption){
    request.shippingoption.forEach(function(item, index){
      Object.keys(item).forEach(function(name){
        request['l_shippingoption'+name+index] = request.shippingoption[index][name]
      })
    })
  }
  if(request.items){
    request.items.forEach(function(item, i) {
      props(item).forEach(function(itemAttr){
        request["l_"+itemAttr+i] = item[itemAttr];
      })
    })
    delete request.items;
  }
  return request
}



