require.paths.unshift(__dirname);

exports.use = function(name){
  return require(__dirname + '/'+name+'/client')
}
