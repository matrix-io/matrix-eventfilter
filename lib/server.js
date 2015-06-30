var net = require('net');
var filter = require('./applyFilter');

module.exports = {
  start : function( processFn){


    net.createServer(function(socket){
      // console.log('Client Connected');

      socket.on('connect', function(){
        console.log('connect');
      });

      socket.on('data', function(data){
        socket.write(JSON.stringify( processFn( data )));
      });

      socket.on('error', function(err){
        console.log(err);
      });

      socket.on('end', function(){
        console.log('Server Socket end');
        // socket.end();
      });

    }).listen(8132);
  }
}


