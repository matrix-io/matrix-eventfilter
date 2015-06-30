EventFilter = require('lib/eventFilter');

module.exports = {
  makeNewFilter: function(type){
    return new EventFilter(type);
  }
}