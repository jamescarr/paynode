var sys = require('sys')

exports.one = function(fn){
  return function(err, result) { fn(err) }
}

exports.failWithDump = function(){
  sys.puts(sys.inspect(arguments))
}
