var _ = require('lodash');

var vm = require("vm");
var fs = require("fs");

var geo = require('geo-distance');

module.exports = function( filter, object ){
  var pass = false;
  if ( arguments.length !== 2){
    console.error('apply needs 2 arguments (filter, object)')
    return false;
  }
  if ( !_.has(object, 'type') ){
    console.error('Object needs type property')
    return false;
  }
  if ( !_.has(filter, 'type')){
    console.error('Filter needs type property')
    return false;
  }
  // console.log('Filter', filter, object );
  if ( object.type === filter.type) {
  for (var k in object){
    // filter object

    var objValue = object[k];
    // the specific filter
    var f = _.filter(filter.filters, function(f){
      return _.has( f, k );
    })[0];


    if ( k !== 'type' && typeof f !== 'undefined' ){
      // console.log('=', k, f);

      var filterValue = f[k];
      // console.log('===', f, k)
      // console.log('===', objValue, '<=>', filterValue );
      // a filter exists
      if ( _.isPlainObject(filterValue)){
        //complex filter
        for (var fk in f) {
          var subpass = [];
          var actions = f[fk];

          for (var fa in actions) {
            //filter action value
            var fav = actions[fa];


            // console.log('====', f, '|', fa, '::', fav);
            if (fa === '$lte') {
              subpass.push((objValue <= fav))
            }

            if (fa === '$gte') {
              subpass.push((objValue >= fav))
            }

            if (fa === '$match') {
              subpass.push((objValue.search(new RegExp(fav)) > -1))
            }

            if (fa === '$near'){
              var filterLocation = fav.point;
              var distance = geo.between({
                  lat: filterLocation[0],
                  lon: filterLocation[1]
                },
                {
                  lat: objValue[1],
                  lon: objValue[2]
                });

                subpass.push( ( Math.round(distance * 1000) <= fav.range ) );

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
        // for has().within
        if ( _.isArray(filterValue)) {
          pass = ( filterValue.indexOf( objValue ) !== -1 );
        }

        //simple filter
        if ( !isNaN( objValue ) ){
          // numerical object value
          if ( objValue < 1 && objValue > 0){
            // normalize percentage confidence
            objValue *= 100;
          }

          if ( !isNaN( filterValue )){
            //filter looking for an integer
            // console.log('===', filterValue, '<=>', objValue )
            pass = ( filterValue == objValue );
          } else {


          }

        }
        //
      }
    }

  }
}

  // console.log('pass', pass);
  if (pass) return object;
  else return false;
}