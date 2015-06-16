var should = require('should');
var events = require('./');


var StreamFilter;
describe('filters', function(){

  before(function(done){
    this.timeout = 10000;
    process.env.NODE_ENV = "development";
    events.init("L04BU70GJU5S49JLNR783UK4UZSYWK0L", "Y7SRP3J1TDOQ49H4GP6AE3C35WXYN9OQ", done);
  });

  it('should make thing', function(done){
    StreamFilter = new events.StreamFilter();
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
  })
})