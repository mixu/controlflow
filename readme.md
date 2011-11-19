# Control flow functions from book.mixu.net

For a more detailed discussion of control flow patterns in Node.js see, http://book.mixu.net/ch7.html

Example usage:

    var flow = require('controlflow');

    # execute tasks as a series
    series([
      function(next) { async(1, next); },
      function(next) { async(2, next); },
      function(next) { async(3, next); },
    ], console.log('Done'); );

    # execute all tasks in parallel
    parallel([
      function(next) { async(1, next); },
      function(next) { async(2, next); },
      function(next) { async(3, next); },
    ], console.log('Done'); );

    # execute tasks two at a time
    limited(2, [
      function(next) { async(1, next); },
      function(next) { async(2, next); },
      function(next) { async(3, next); },
    ], console.log('Done'); );

