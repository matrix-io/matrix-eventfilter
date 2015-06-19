'use strict';

/**
 * Creates filter objects for event streams.
 * @author Sean Canton <sean@rokk3rlabs.com>
 * @example
 * var E = require(this);
 * var e = new E.streamFilter( );
 * e.on('face').is('age', 20).is('gender','male').then(function(out){});
 * {
 *   token: 'abc123',
 *   face: [{ age: 20 }, {gender: 'male'}]
 * }
 *
 * .then() fires off the socket and returns the filter object
 */

 var net = require('net');
 var socket = new net.Socket()

 var events = require('events');
 var e = new events.EventEmitter();
 var request = require('request');

 var filterCollection = [];
 var authToken;

var _ = require('lodash');

 var EventFilter = function( label ) {
  this.eventName = label;
  var obj = {};
  this.filters = [];

  if ( filterCollection.filter(function(v){ return v.eventName === label }).length > 0 ){
    console.warn('Multiple filters named ', label, '\nBehavior unstable.')
  }

  filterCollection.push(this);

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
    if ( arguments.length === 1 ){
      // boolean
      var value = true;
    }
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

  this.val = function getValue(){
    return { filters: this.filters, eventName: this.eventName };
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

  this.and = this;

  return this;
}


var hasExtender = function (self, factor){

  var obj = {};

  this.between = function(min,max){
    obj[factor] = {'$gte':min, '$lte':max};
    self.filters.push(obj);
    return self;
  }

  this.within = function(value){
    obj[factor] = value;
    self.filters.push(obj);
    return self;
  }

  this.after =
  this.over =
  this.above = function(value){
    obj[factor] = {'$gte' : value};
    self.filters.push(obj);
    return self;
  }

  this.before =
  this.under =
  this.below = function(value){
    obj[factor] = {'$lte' : value};
    self.filters.push(obj);
    return self;
  }

  this.not = function(value){
    obj[factor] = {'not' : value};
    self.filters.push(obj);
    return self;
  }

  this.of = function(value){
    obj[factor] = value;
    self.filters.push(obj);
    return self;
  }



  return this;
}




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

      // TODO: Handle Incoming Sockets, emit events
      cb();
    });
}


module.exports = {
  StreamFilter : EventFilter,
  init : authStream,
  // testSocket : testSocket,
  token : authToken
};

function testSocket(){
  var socket = new net.Socket();
  var BASELINE = 100;
var STORE_ENTRY_CAMS = [ 10, 11, 12 ];
var face = new EventFilter('face');
face.has('age').between(10,35).and.is('sex', 1)


  // face.has('age').between(13,24)
  // .is({ grumpy: BASELINE })
  // .has('gender').of('female')
  // .has('device').within(STORE_ENTRY_CAMS)
  // .then(function(out){
  //   // console.log(require('util').inspect(out, {depth:10}));
  // });


  socket.connect(8132, function(){
    console.log('Connected to Socket');

      socket.write('{ "pissant" : false }');
    setInterval(function writeFakeFace(){
      socket.write('{ "pissant" : true }');
    }, 5000)
  });

  socket.on('data', function(data) {
    var dataObj = JSON.parse(data.toString());

    console.log('Socket ->', applyFilter(face.val(), dataObj),'\n----------');
  });

  socket.on('error', function(err){
    console.error(err);
  })
}

function applyFilter( filter, object ){
  var pass = false;
  console.log('Filter', filter, object );
  if ( object.type === filter.eventName) {
  for (var k in object){
    // filter object

    var objValue = object[k];
    // the specific filter
    var f = _.filter(filter.filters, function(f){
      return _.has( f, k );
    })[0];


    if ( k !== 'type' && typeof f !== 'undefined' ){
    console.log('=', k, f);

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

            console.log('====', f, '|', fa, '::', fav);
            if (fa == '$lte') {
              subpass.push(!!(objValue <= fav))
            }
            if (fa === '$gte') {
              subpass.push(!!(objValue >= fav))
            }
          }

          if ( subpass.length > 0 ){
            console.log('==== subpass', subpass);
            pass = _.reduce(subpass, function(o, v) {
              return (o && v);
            });
            console.log('==== pass', pass);
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
            console.log('===', testValue, '<=>', objValue )
            pass = ( testValue == objValue );
          } else {


          }

        }
        //
      }
    }

  }
}

  console.log('pass', pass);
  return (pass) ? object : null;
}
testSocket();
