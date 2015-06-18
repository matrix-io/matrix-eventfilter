'use strict';

/**
 * Creates filter objects for event streams.
 * @author Sean Canton <sean@rokk3rlabs.com>
 * @example
 * var E = require(this);
 * var e = new E.streamFilter( );
 * e.on('face').is('age', 20).is('gender','male');
 * {
 *   token: 'abc123',
 *   face: [{ age: 20 }, {gender: 'male'}]
 * }
 *
 */

var net = require('net');
var socket = new net.Socket()

var events = require('events');
var e = new events.EventEmitter();
var request = require('request');

var filterCollection = [];
var authToken;


var EventFilter = function( label ) {
  this.eventName = label;
  this.filters = [];
  var obj = {};

  if ( filterCollection.filter(function(v){ return v.eventName === label }).length > 0 ){
    console.warn('Multiple filters named ', label, '\nBehavior unstable.')
  }

  filterCollection.push(this);

  this.has =
  this.on = function EventOn( event ) {
    obj[ event ] = [];
    // makes { event: [] }
    this.filters = obj[ event ];
    obj.token = authToken;
    return this;
  }

  this.contains = function EventContains( stack, needle ) {
    var obj = {};
    obj[stack] = { '$match' : needle };
    this.filters.push(obj);
    return this;
  }

  this.not = function EventNot( factor, value ){
    var obj = {};
    obj[factor] = { '$not' : value };
    this.filters.push(obj);
    return this;
  }

  this.like =
  this.is = function EventIs( factor, value ) {
    var obj = {};
    if (typeof factor === 'object'){
      // multiple declarations
      for (var k in factor){
        obj = {};
        obj[k] = factor[k];
        this.filters.push(obj);
      }
    } else {
      // single declaration
      obj[factor] = value;
      this.filters.push(obj);
    }

    return this;
  }

  this.near = function EventNear( point, range ){
    var obj = {};
    obj.location = { point: point, range: range};
    this.filters.push(obj);
    return this;
  }

  this.then = function( cb ){
    console.log('.then() listening for ', this.eventName)

    // setup listener for deferred handling of events
    // e.on( this.eventName, cb );
    // send filter to socket
    // socket.write( JSON.stringify({ filters: filters, eventName: eventName } ) );
    cb( { filters: this.filters, eventName: this.eventName } );
    return this;
  }

  this.enable = function( cb ){
    console.log('Enabling', eventName)
  }

  this.disable = function(cb){
    //e.removeListener(this.name, cb)
  }

  this.getFilters = function(){
    return this.filters;
  }

  this.getEventName = function(){
    return eventName;
  }

  this.has = function(factor){
    return new hasExtender(this, factor);
  }

  this.hasExtender = function(self, factor){
    this.between = function(min,max){
      var obj = {};
      obj[factor] = {'$gt':min, '$lt':max}
      this.filters.push(obj);
      return self;
    }

    return
  }



  return this;
}


var hasExtender = function (self, factor){

  this.between = function(min,max){
    var obj = {};
    obj[factor] = {'$gt':min, '$lt':max};

    self.filters.push(obj);
    return self;
  }

  return this;
}

var face = new EventFilter('face');

face.has('age').between(10,20).then(function(out){
    console.log(require('util').inspect(out, {showHidden: true, depth:10}));
});


function authStream(id, secret, cb){
    var url;
    if ( process.env.NODE_ENV === 'development' ){
      url = 'http://dev-demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'stage' ) {
      url = 'http://demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'productofnion') {
      url = 'https://api.admobilize.com';
    } else {
      console.error('No Node Environment Set! Derp');
      url = 'https://api.admobilize.com';
    }
    request({
      method: 'POST',
      url: url + '/v1/oauth2/client/token',
      form:
        {
          client_id : id,
          client_secret: secret,
          grant_type :'client_credentials'
        }
      },
      function(err, response, body){
      if (err) console.error(new Error('Token Retrieval Failure : ' + err));
      if (response.statusCode !== 200){
        console.error('Event Token Error: ', body);
      } else {
        authToken = JSON.parse(body).results.access_token;
        module.exports.token = authToken;
      }
      // TODO: Initialize Socket Connection
      // socket.connect(xxxx, function(){})
      // TODO: Handle Incoming Sockets, emit events
      cb();
    });
  }


module.exports = {
  StreamFilter : EventFilter,
  init : authStream,
  token : authToken
};


// var p = new S('body');
// //TODO: Handle multiple s's for return events
// // Prevent Overlap

// //bootstrap
// function boot() {
//   //socket here
// }

// function trackFaces() {
//   var s = new S('face');

//   s.has('anger').between(20,40).is({gender: undefined})
//   has('gender').then();
//   has('stupid').under(20)
//   s.has('stupid').under(20)
//   s.has('rich').above(100000);

//   s.is({ age: { '$gt' : 20, '$lt': 40 }, gender: 'male'}).then(function(data){
//     // throw alert
//   });
// }

// p.is().is().then(function(){

// });



// console.log(s);