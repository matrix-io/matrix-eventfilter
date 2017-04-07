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
  apply: require('./lib/applyFilter'),
  checkVersion: checkVersion,
  EventFilter : require('./lib/eventFilter')
};

/**
 * Compares the current isntalled version against the lastest remote version available
 * @param {Function} cb Returns the following:
 * {Error} err Error details
 * {Object} version object that contains the following parameters:
 *   - {String} local The version of the installed module
 *   - {String} remote The latest version available of the module
 *   - {bool} updated Boolean indicating wether the version is up to date or not
 */
function checkVersion(cb) {
  var info = JSON.parse(require('fs').readFileSync(__dirname + '/package.json'));
  var currentVersion = info.version;
  require('https').get(
    'https://raw.githubusercontent.com/matrix-io/matrix-eventfilter/master/package.json',
    function (res) {
      var write = '';
      res.on('data', function (c) {
        write += c;
      });
      res.on('end', function (e) {
        var remoteVersion = JSON.parse(write).version;
        var msg = '';
        if (currentVersion === remoteVersion) {
          module.exports.current = true;
          msg = '(current)'.grey;
        } else {
          module.exports.current = false;
          msg = '(can upgrade to '.yellow + remoteVersion + ')'.yellow
        }
        debug('🚷  [ MATRIX ] EventFilter v'.green + currentVersion.grey, msg)
        cb(undefined, { local: currentVersion, remote: remoteVersion, updated: currentVersion === remoteVersion });
      });
    }).on('error', function (e) {
      var errorMessage;
      if (e.code === 'ENOTFOUND') errorMessage = 'Event Filter version check failed, unable to reach module repository';
      else errorMessage = 'Event Filter upgrade check error: ' + e.message;
      cb(errorMessage);
    }) 
}

