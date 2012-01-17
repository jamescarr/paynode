exports.use = function(name){
  return require(__dirname + '/'+name+'/client')
}
