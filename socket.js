var net = require('net');


var server = net.createServer(function(socket){
  console.log('Client Connected');

  socket.on('connect', function(){
    console.log('connect');
      setInterval(function writeFakeFace(){
        socket.write(JSON.stringify( makeFakeFace() ));
    }, 1000)
  });

  socket.on('data', function(data){
    console.log('Server Socket Data', JSON.parse(data.toString()));
    socket.write(JSON.stringify( makeFakeFace() ));
  });

  socket.on('error', function(err){
    console.log(err);
  });

  socket.on('end', function(){
    console.log('Server Socket end');
    // socket.end();
  });

}).listen(8132, function(e){
  console.log('Server Listening');
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

console.log(makeFakeFace())



function randPercent(){
  return Math.round( Math.random() * 100 )/100;
}

function randRange(num){
  return Math.round(Math.random() * num);
}