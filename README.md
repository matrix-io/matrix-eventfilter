/*
Title: Streaming API on Device & Server
Sort: 1
*/

# Instance Methods

**Initialize With**

```
var StreamFilter = require('ad-events').StreamFilter;
var face = new StreamFilter('face');
var vehicle = new StreamFilter('vehicle');
```

## Example Usage

### Requires Then to Activate
```
// starts stream and queues callback 
face.then(function(results, filter){})
```

### Basic Filters
#### is / like
```
// single declaration
face.is('age', 23)

// object declaration
face.is({ 'age' : 24, gender:'male' })

// ranges
face.is({'age': {'$lte': 24, '$gte': 18}})
```

#### not

Negation

`face.not('device')`

#### contains

String match

`vehicle.contains('make', 'Mustang')`

#### near

Point and range.

`vehicle.near([25,80], 1)`

### Complex Filters
#### Has
Has enables a subset of filters

##### Between
```
face.has('age').between(18,25);
```

##### Within
```
face.has('device').within([12,13,14,16]);
```

##### After (Aliases: Over, Above)
```
vehicle.has('year').after(1960);
```

##### Before (Aliases: Under, Below)
```
vehicle.has('year').under(2000)
```

##### Of
```
vehicle.has('color').of('red')
```

### Real-World Examples
Vehicles traveling at high speeds.
```
vehicle.has('year').before(1960).has('speed').above(70).then(function(response) {
  console.log('Car is unsafe to drive at these speeds.');
});
```