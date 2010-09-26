function val (value) {
  return {
    isOneOf: function(){
      for (var i = 0; i < arguments.length; i++) {
        if(arguments[i] == value)
          return true;
      }
      return false;
    }
  };
}

exports.val = val;
