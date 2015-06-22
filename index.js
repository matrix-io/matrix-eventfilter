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

 var EventFilter = require('./lib/filter');





function authStream(url, id, secret, cb){
  return cb();
  var url;

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

var applyFilter = require('./lib/applyFilter.js')

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
    }, 10000)
  });

  socket.on('data', function(data) {
    var dataObj = JSON.parse(data.toString());

    console.log('Socket ->', applyFilter(face.val(), dataObj),'\n----------');
  });

  socket.on('error', function(err){
    console.error(err);
  })
}

// testSocket();
