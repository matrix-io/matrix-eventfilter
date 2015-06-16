'use strict';

/**
 * Creates filter objects for event streams.
 * @author Sean Canton <sean@rokk3rlabs.com>
 * @example
 * var E = require(this);
 * var e = new E.streamFilter( <EventStream> )
 * {
 *   token: 'abc123',
 *   face: [{ age: 20 }, {gender: 'male'}],
 *   stream: <EventStream>
 * }
 *
 */

var request = require('request');

var authToken;

var S = function( EventStream ) {
  var filters;
  var obj = { stream: EventStream };
  var token;

  this.on = function EventOn( eventName ) {
    obj[ eventName ] = [];
    // makes { eventname: [] }
    filters = obj[ eventName ];
    obj.token = module.exports.token;
    return this;
  }

  this.contains = function EventContains( stack, needle ) {
    var obj = {};
    obj[stack] = { '$match' : needle };
    filters.push(obj);
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
        filters.push(obj);
      }
    } else {
      // single declaration
      obj[factor] = value;
      filters.push(obj);
    }
    return this;
  }

  this.near = function EventNear( point, range ){
    var obj = {};
    obj.location = { point: point, range: range};
    filters.push(obj);
    return this;
  }

  this.then = function( cb ){
    cb( obj );
  }

  return this;
}

function authStream(id, secret, cb){
    var url;
    if ( process.env.NODE_ENV === 'development' ){
      url = 'http://dev-demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'stage' ) {
      url = 'http://demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'production') {
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
      cb();
    });
  }

// var s = new S();

// s.on('poop')
// .is('smelly', true)
// .is('fun', false)
// .is({ ohmy: true, mally: false})
// .is('quantity', { $gt: 12 })
// .like('yay', false)
// .near([25,80], 1)
// .then(function(out){
//   // return object to filter
// });

// s.on('vehicle')
// .is('truck', true)
// .then(function() {});

module.exports = {
  StreamFilter : S,
  init : authStream,
  token : authToken
};