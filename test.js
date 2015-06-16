var should = require('should');
var events = require('./');


var StreamFilter;
describe('filters', function(){

  before(function(done){
    this.timeout = 10000;
    process.env.NODE_ENV = "development";
    events.init("L04BU70GJU5S49JLNR783UK4UZSYWK0L", "Y7SRP3J1TDOQ49H4GP6AE3C35WXYN9OQ", done);
  });

  beforeEach(function(done){
    StreamFilter = new events.StreamFilter();
    done();
  })

  it('should make thing', function(done){
    (StreamFilter).should.have.any.keys('on', 'is', 'near', 'like', 'contains', 'then');
    done();
  });

  it('should initialize and have a token', function(done){
    StreamFilter.on('thing').then( function(out){
      (out.token).should.ok;
      done();
    });
  });

  it('should do is or like to add filters', function(done){
    StreamFilter.on('thing')
      .is('dog', true)
      .like('cat', false)
      .then(function(out){
        (out.thing).should.containDeep([{dog: true}]);
        (out.thing).should.containDeep([{cat: false}]);
        done();
      });
  });

  it('should support multiple event types', function(done){
    StreamFilter.on('otherThing').on('thing')
    .is('amazing', true)
    .then(function(out){
      (out).should.have.properties('thing', 'otherThing');
      done();
    })
  });

  it('should support object constructors', function(done){
    StreamFilter.on('UrHonorIObject')
    .is({ crime: false, falselyAccused: true, yearsFacing : 10})
    .then(function(out){
      (out.UrHonorIObject).should.length(3);
      done();
    });
  });

  it('should support contains', function(done){
    StreamFilter.on('boxy').contains('name', 'docker').then(function(out) {
      (out.boxy).should.containDeep([{name: { '$match': 'docker'}}]);
      done();
    });
  });


});