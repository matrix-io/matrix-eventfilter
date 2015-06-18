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

var S = function( label ) {
  var eventName = label;
  var filters = [];
  var obj = {};

  if ( filterCollection.filter(function(v){ return v.eventName === label }).length > 0 ){
    console.warn('Multiple filters named ', label, '\nBehavior unstable.')
  }

  filterCollection.push(this);

  this.on = function EventOn( event ) {
    obj[ event ] = [];
    // makes { event: [] }
    filters = obj[ event ];
    obj.token = authToken;
    return this;
  }

  this.contains = function EventContains( stack, needle ) {
    var obj = {};
    obj[stack] = { '$match' : needle };
    filters.push(obj);
    return this;
  }

  this.not = function EventNot( factor, value ){
    var obj = {};
    obj[factor] = { '$not' : value };
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
    console.log('Listening for ', eventName)

    // setup listener for deferred handling of events
    // e.on( this.eventName, cb );
    // send filter to socket
    // socket.write( JSON.stringify({ filters: filters, eventName: eventName } ) );
    cb( obj );
    return this;
  }

  this.enable = function( cb ){
    console.log('Enabling', eventName)
  }

  this.disable = function(cb){
    //e.removeListener(this.name, cb)
  }

  this.getFilters = function(){
    return filters;
  }

  this.getEventName = function(){
    return eventName;
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
      // TODO: Initialize Socket Connection
      // socket.connect(xxxx, function(){})
      // TODO: Handle Incoming Sockets, emit events
      cb();
    });
  }


module.exports = {
  StreamFilter : S,
  init : authStream,
  token : authToken
};

var s = new S('');
//TODO: Handle multiple s's for return events
// Prevent Overlap

s.on('face').is({ age: { '$gt' : 20, '$lt': 40 }, gender: 'male'}).then(function(out){console.log(require('util').inspect(out, true, 10));});

s.on('').is().is().then().then()
console.log(s);