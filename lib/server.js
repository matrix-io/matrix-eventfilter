var net = require('net');



var filter = require('./applyFilter');

module.exports = {
  start : function(processFn){
    var server = net.createServer(function(socket){
      console.log('Client Connected');

      socket.on('connect', function(){
        console.log('server socket connected');
      });

      socket.on('data', function(data){
        // send to provided process fn
        socket.write(JSON.stringify( processFn( data )));
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


