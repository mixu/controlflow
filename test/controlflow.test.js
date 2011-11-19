var flow = require('../controlflow.js');
var http = require('http');
// list of tasks and input
var tasks = [];
var urls = [
  'www.google.com',
  'www.twitter.com',
  'www.flickr.com',
  'github.com',
  ];

// add a tasks
urls.forEach(function(url) {
  tasks.push(function(next) {
    console.log('  Getting:', url);
    http.get({ host: url,  path: '/'}, function(res){
      console.log('  [', url ,'] Got response: ' + res.statusCode);
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        console.log('  [', url ,'] Response length', data.length);
        // start next task
        next();
      });
    }).on('error', function(e) {
      console.log('  [', url ,'] Got error: ' + e.message);
    });
  });
});

console.log('Limited:');
// run tasks
flow.limited(2, tasks, function() {
  console.log('Tasks completed.');
});


