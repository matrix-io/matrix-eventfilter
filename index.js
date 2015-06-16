'use strict';


var eventObj = {};

var S = function() {
  var chainObj;
  var obj = {};
  this.on = function EventOn( eventName ) {
    obj[ eventName ] = [];
    chainObj = obj[ eventName ];
    return this;
  }

  this.contains = function EventContains( stack, needle ) {
    var obj = {};
    obj[stack] = { '$match' : needle };
    chainObj.push(obj);
    return this;
  }

  this.like =
  this.is = function EventLikes( factor, value ) {
    var obj = {};
    if (typeof factor === 'object'){
      // multiple declarations
      for (var k in factor){
        obj[k] = factor[k];
      }
    } else {
      // single declaration
      obj[factor] = value;
    }
    chainObj.push(obj);
    return this;
  }

  this.near = function EventNear( point, range ){
    var obj = {};
    obj.location = { point: point, range: range};
    chainObj.push(obj);
    return this;
  }

  this.then = function( cb ){
    console.log(obj);
    cb( obj );
  }

  return this;
}


var s = new S();

s.on('poop')
.is('smelly', true)
.is('fun', false)
.is({ ohmy: true, mally: false})
.is('quantity', { $gt: 12 })
.like('yay', false)
.near([25,80], 1)
.then(function(out){

});

module.exports = {
  Stream : S,
  init : function(key){

  }
};