var _ = require('lodash');

module.exports = function( filter, object ){
  var pass = false;
  // console.log('Filter', filter, object );
  if ( object.type === filter.eventName) {
  for (var k in object){
    // filter object

    var objValue = object[k];
    // the specific filter
    var f = _.filter(filter.filters, function(f){
      return _.has( f, k );
    })[0];


    if ( k !== 'type' && typeof f !== 'undefined' ){
      // console.log('=', k, f);

      var testValue = f[k];
      // console.log('===', f, k)
      // console.log('===', objValue, '<=>', testValue );
      // a filter exists
      if ( _.isPlainObject(testValue)){
        //complex filter
        for (var fk in f) {
          var subpass = [];
          var actions = f[fk];

          for (var fa in actions) {
            var fav = actions[fa];

            //filter action value

            // console.log('====', f, '|', fa, '::', fav);
            if (fa == '$lte') {
              subpass.push((objValue <= fav))
            }
            if (fa === '$gte') {
              subpass.push((objValue >= fav))
            }
            if (fa === '$match') {
              subpass.push((objValue.search(new RegExp(fav)) > -1))
            }
            if (fa === '$not'){
              if ( isNaN(fav) ){
                // for strings, might extend to objects
                subpass.push(( objValue.search(new RegExp(fav)) === -1 ));
              } else {
                // for integers
                subpass.push(( objValue !== fav ));
              }
            }

          }

          if ( subpass.length > 0 ){
            // console.log('==== subpass', subpass);
            pass = _.reduce(subpass, function(o, v) {
              return (o && v);
            });
            // console.log('==== pass', pass);
          }
        }
      } else {
        //simple filter
        if ( !isNaN( objValue ) ){
          if ( objValue < 1 && objValue > 0){
            // confidence
            objValue *= 100;
          }
          // numerical object value
          if ( !isNaN( testValue )){
            //filter looking for an integer
            // console.log('===', testValue, '<=>', objValue )
            pass = ( testValue == objValue );
          } else {


          }

        }
        //
      }
    }

  }
}

  // console.log('pass', pass);
  return (pass) ? object : null;
}