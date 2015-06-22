module.exports = function (url, id, secret, cb){
  return cb();

  if ( typeof url === "undefined"){
    if ( process.env.NODE_ENV === 'development' ){
      url = 'http://dev-demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'stage' ) {
      url = 'http://demo.admobilize.com';
    } else if ( process.env.NODE_ENV === 'productofnion') {
      url = 'https://api.admobilize.com';
    } else {
      console.error('No Node Environment Set! Derp');
      url = 'https://api.admobilize.com';
    }
  }

  request({
    method: 'POST',
    url: url + '/v1/oauth2/client/token',
    form:
    {
      client_id : id,
      client_secret: secret,
      grant_type :'client_credentials'
    }
  },
  function(err, response, body){
    if (err) console.error(new Error('Token Retrieval Failure : ' + err));
    if (response.statusCode !== 200){
      console.error('Event Token Error: ', body);
    } else {
      authToken = JSON.parse(body).results.access_token;
      module.exports.token = authToken;
    }
      // TODO: Initialize Socket Connection

      // TODO: Handle Incoming Sockets, emit events
      cb();
    });
}