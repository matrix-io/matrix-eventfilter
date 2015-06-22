var should = require('should');
var EventFilter = require('./lib/eventFilter');
var applyFilter = require('./lib/applyFilter');
var connect = require('./lib/connect');


var StreamFilter = new EventFilter('test');
describe('EventFilter', function() {

  before(function(done) {
    this.timeout = 10000;
    process.env.NODE_ENV = "development";
    done();
    // connect.init('',"L04BU70GJU5S49JLNR783UK4UZSYWK0L", "Y7SRP3J1TDOQ49H4GP6AE3C35WXYN9OQ", done);
  });


  describe('instance methods', function(){

    beforeEach(function(done) {
      StreamFilter.clear();
      done();
    })

    it('should make thing', function(done) {
      (StreamFilter.eventName).should.ok;
      done();
    });

    it.skip('should initialize and have a token', function(done) {
      StreamFilter.token.should.ok;
      done();
    });

    it('should do is() or like() to add filters', function(done) {
      StreamFilter.is('dog', true).like('cat', false)
      StreamFilter.filters.should.containDeep([{
        dog: true
      }]);
      done();
    });


    it('should support object constructors', function(done) {
      StreamFilter.is({
        crime: false,
        falselyAccused: true,
        yearsFacing: 10
      })
      StreamFilter.filters.should.length(3);
      done();
    });
  });

  describe('conditional objects', function() {

    it('should support contains', function(done) {
      StreamFilter.contains('name', 'docker')
      StreamFilter.filters.should.containDeep([{
        name: {
          '$match': 'docker'
        }
      }]);
      done();
    });

    it('should support not', function(done) {
      StreamFilter.not('age', 20);
      StreamFilter.filters.should.containDeep([{
        age: {
          '$not': 20
        }
      }]);
      done();
    });

    it('should support near', function(done) {
      StreamFilter.near([25, 80], 1);
      StreamFilter.filters.should.containDeep([{
        location: {
          point: [25, 80],
          range: 1
        }
      }]);
      done();
    });

  });




  describe('supports has()', function() {
    it('has().between()', function(done) {
      StreamFilter.has('age').between(18,25);
      StreamFilter.filters.should.containDeep([{age: {'$gte':18,'$lte':25}}]);
      done();
    });

    it('has().within()', function (done) {
      StreamFilter.has('age').within([ 18,25,32 ]);
      StreamFilter.filters.should.containDeep([{age: [18,25,32]}]);
      done();
    });

    it('has().over()', function (done) {
      StreamFilter.has('age').over(18);
      StreamFilter.filters.should.containDeep([{age: {'$gte':18}}]);
      done();
    });

    it('has().under()', function (done) {
      StreamFilter.has('age').under(25);
      StreamFilter.filters.should.containDeep([{age: {'$lte':25}}]);
      done();
    });

    it('has().not()', function (done) {
      StreamFilter.has('age').not(20);
      StreamFilter.filters.should.containDeep([{age: {'$not':20}}]);
      done();
    });

    it('has().of()', function (done) {
      StreamFilter.has('age').of(18);
      StreamFilter.filters.should.containDeep([{age: 18 }]);
      done();
    });
  });


  describe('filter stream objects', function(){
    var streamObj;
    before(function(done){
      streamObj = {
        type: 'test',
        age: 18,
        glasses: 0.55,
        beard: 0.23,
        sex: 1,
        name: 'Goat'
      }
      done();
    });

    beforeEach(function(done){
      StreamFilter.clear();
      done();
    })

    it('should filter direct integer matches', function(done){
      var filter = StreamFilter.is('age', 18).val()
      applyFilter(filter, streamObj).should.property('type');
      done();
    });

    it('should filter less / over / between', function(done) {
      var filter = StreamFilter.has('age').between(10,20).val();
      applyFilter(filter, streamObj).should.property('type');
      done();
    });

    it('should filter direct matches', function(done){
      var filter = StreamFilter.contains('name','Goat').val();
      applyFilter(filter, streamObj).should.property('type');
      done();
    });

    it('should filter not', function(done){
      var filter = StreamFilter.not('name','Swan').val();
      applyFilter(filter, streamObj).should.property('type');
      done();
    });

  });

});