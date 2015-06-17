## Events SDK

#### Available Methods
* stream.start([Environment]);
* stream.on([Event]);
* stream.like([Key],[Value]);
* stream.is([Key],[Value]);
* stream.not([Key],[Value]);
* stream.contains([Key],[Value]);
* stream.near([Latitude,Longitude],[Radius]);

###Initialize Stream
```javascript
var adsdk = require('adsdk');
var stream = adsdk.stream;
var stream = stream.start(process.env.NODE_ENV);
```

###Face Detection
Acting on events should be easy. Trigger actions by using our event-filter methods.
```javascript
/** Scenario 1 **/ 
stream.on('face')
     .like('age',20)
     .like('age',40)
     .like('gender','male')
     .like('gender','female')
     .like('device',5)
     .then(function(out) { 
          //do something with output, like make a decision 
     });

/** Scenario 2 **/ 
stream.on('face')
     .not('age',20)
     .then(function(out) { 
          //do something with output, like make a decision 
     });
```

###Vehicle Detection
Acting on events should be easy. Trigger actions by using our event-filter methods.
```javascript
stream.on('vehicle')
     .like('truck', true)
     .near([25.0000,80.0000],1)
     .then(function(out) { 
          //do something with output, like make a decision 
     });
```

###Looking for a String
Acting on events should be easy. Trigger actions by using our event-filter methods.
```javascript
stream.on('alert')
     .contains('message', 'foo')
     .near([25.0000,80.0000],1)
     .then(function(out) { 
          //do something with output, like make a decision 
     });
```