var net = require('net');



var filter = require('./applyFilter');

module.exports = {
  start : function(){
    var server = net.createServer(function(socket){
      console.log('Client Connected');

      socket.on('connect', function(){
        console.log('connect');
        setInterval(function writeFakeFace(){
          socket.write(JSON.stringify( makeFakeFace() ));
        }, 1000)
      });

      socket.on('data', function(data){
        var inputFilter  = JSON.parse(data.toString());
        console.log('Server Socket Data', inputFilter);
        var face = makeFakeFace();
        var result = filter(inputFilter, face );
        if ( typeof result === "undefined"){
          socket.write('{ "ok":false, "msg":"No face to match filter"}');
        } else {
          socket.write(JSON.stringify( makeFakeFace() ));
        }
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
  }
}



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
