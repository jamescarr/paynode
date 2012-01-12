exports.one = function(fn){
  return function(err, result) { fn(err) }
}

exports.failWithDump = function(){
  console.dir(arguments)
}
