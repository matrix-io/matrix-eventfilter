var events = require('events');
var e = new events.EventEmitter();

module.exports = function( label ) {

  this.type = label;

  var deferred;
  var theSocket;
  this.filters = [];

  // if ( filterCollection.filter(function(v){ return v.type === label }).length > 0 ){
  //   console.warn('Multiple filters named ', label, '\nBehavior unstable.')
  // }

  // filterCollection.push(this);

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
    obj.location = {'$near' : { point: point, range: range }};
    this.filters.push(obj);
    return this;
  }



  this.then = function( cb ){
    // console.log('.then() listening for ', this.type)

    deferred = cb;

    return this;

  }

  function getDeferred(){
    return deferred;
  }

  this.send = function(socket){
    // console.log('Filter Send', socket);
    theSocket = socket;
    socket.on('data',function(data){
      var response = JSON.parse(data.toString());
      if ( response.hasOwnProperty('type') ){
        var cb = getDeferred();
        cb(response);
      }
    });
    socket.write(JSON.stringify(this.val()));
  }

  this.write = function(){
    if ( typeof theSocket === 'undefined' ){
      console.error('Socket needs to be set up with .send(socket) before write can be used');
    } else {
      theSocket.write(JSON.stringify(this.val()));
    }
  }

  this.val = function getValue(){
    return { filters: this.filters, type: this.type };
  }

  this.json = function getJSON(){
    return JSON.stringify( this.val() );
  }

  this.enable = function( cb ){
    console.log('Enabling', type)
  }

  this.disable = function(cb){
    //e.removeListener(this.name, cb)
  }

  this.getFilters = function(){
    return this.filters;
  }

  this.gettype = function(){
    return type;
  }

  this.has = function(factor){
    return new hasExtender(this, factor);
  }

  this.clear = function(){
    this.filters = [];
  }

  this.and = this;

  return this;
}


var hasExtender = function (self, factor){

  factor = factor || 'value';

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
    obj[factor] = {'$not' : value};
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
