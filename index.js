'use strict';

/**
 * Creates filter objects for event streams.
 * @author Sean Canton <sean@rokk3rlabs.com>
 * @example
 * var E = require(this);
 * var e = new E.EventFilter( );
 * e.on('face').is('age', 20).is('gender','male').then(function(out){});
 * {
 *   token: 'abc123',
 *   face: [{ age: 20 }, {gender: 'male'}]
 * }
 *
 * .then() fires off the socket and returns the filter object
*/



module.exports = {
  EventFilter : require('./lib/eventFilter'),
  apply: require('./lib/applyFilter')
};


var msg;
var info = JSON.parse(require('fs').readFileSync(__dirname + '/package.json'));
var currentVersion = info.version;
require('https').get(
  'https://raw.githubusercontent.com/matrix-io/matrix-eventfilter/master/package.json',
function (res) {
  var write = "";
  res.on('data', function (c) {
    write += c;
  });
  res.on('end', function (e) {
    var remoteVersion = JSON.parse(write).version;
    var msg = "";
    if (currentVersion === remoteVersion) {
      module.exports.current = true;
      msg = '(current)'.grey;
    } else {
      module.exports.current = false;
      msg = '(can upgrade to '.yellow+ remoteVersion +')'.yellow
    }
    debug( '🚷  [ MATRIX ] EventFilter v'.green + currentVersion.grey, msg )
  });
}).on('error', function (e) {
  console.error('Upgrade Check Error: ', e)
})
