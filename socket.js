var net = require('net');

net.createServer(function(socket){
  console.log('Client Connected');

  socket.on('data', function(data){
    console.log('Server Socket Data', JSON.parse(data.toString()));
    socket.write(data);
  });

  socket.on('error', function(err){
    console.log(err);
  });

  socket.on('end', function(){
    console.log('Server Socket end');
    socket.end();
  });

}).listen(8132, function(e){
  console.log('Server Listening');
});
