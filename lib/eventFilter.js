module.exports =
  function( label ) {
  this.eventName = label;
  var obj = {};
  this.filters = [];

  // if ( filterCollection.filter(function(v){ return v.eventName === label }).length > 0 ){
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

  this.clear = function(){
    this.filters = [];
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