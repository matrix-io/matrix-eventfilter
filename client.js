var net = require('net');
var client = new net.Socket()
var events = require('events');
var e = new events.EventEmitter();


  // CLIENT
  client.connect(8132, function(){
    console.log('Client Socket Connected');
  });

  client.on('data', function(data){
    console.log('Socket ->', JSON.parse( data.toString() ));
    var data = JSON.parse( data.toString() );
    if ( data.name ) {
      e.emit(data.name);
    }
  });
  var obj = {poop : true, name: 'kill'};
  console.log('->Socket ', obj);
  client.write(JSON.stringify(obj));


   socket.connect(8132, function(){})

      socket.on('data', function handleIncomingEvent(data){

      });
  // client.end();



  e.on('kill', function(){
    console.log('kill Event Emitted from server');
  });
