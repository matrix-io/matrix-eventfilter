var server = require('./lib/server');
var filter = require('./lib/applyFilter');

server.start( function processFn(input){
  var inputFilter  = JSON.parse(input.toString());
  console.log('Server Socket Data', inputFilter);
  var face = makeFakeFace();
  var result = filter(inputFilter, face );
  if ( typeof result === 'undefined'){
    return { 'ok':false, 'msg':'No face to match filter'};
  } else {
    return face;
  }
});

function makeFakeFace(){
  return {
    type: 'face',
    age: randRange(20) + 28,
    glasses: randPercent(),
    beard: randPercent(),
    sex: Math.floor(Math.random()*2)
  }
};

function randPercent(){
  return Math.round( Math.random() * 100 )/100;
}

function randRange(num){
  return Math.round(Math.random() * num);
}
