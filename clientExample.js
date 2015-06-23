var net = require('net')
var socket = new net.Socket();
var EventFilter = require('./lib/eventFilter')
var face = new EventFilter('face');


face.has('age').between(10,50).then(function(out){
  console.log('Then Out', out);
})


  // face.has('age').between(13,24)
  // .is({ grumpy: BASELINE })
  // .has('gender').of('female')
  // .has('device').within(STORE_ENTRY_CAMS)
  // .then(function(out){
  //   // console.log(require('util').inspect(out, {depth:10}));
  // });


socket.connect(8132, function(){
  console.log('Connected to Socket');

  setInterval(function writeFilterFace(){
    face.write(JSON.stringify(face.val()));
  }, 1000)

  face.send(socket);
});

socket.on('data', function(data) {
  var dataObj = JSON.parse(data.toString());

  console.log('Socket ->', dataObj,'\n----------');
});

socket.on('error', function(err){
  console.error(err);
})
