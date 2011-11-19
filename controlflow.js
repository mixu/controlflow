/*
 * Control flow pattern #1:
 * Series - an asynchronous for loop
 *
 * Characteristics:
 *
 * - Runs a number of operations sequentially
 * - Only starts one async operation at a time (no concurrency)
 * Ensures that the async function complete in order
 */

function series(callbacks, last) {
  var results = [];
  function next() {
    var callback = callbacks.shift();
    if(callback) {
      callback(function() {
        results.push(Array.prototype.slice.call(arguments));
        next();
      });
    } else {
      last && last(results);
    }
  }
  next();
}

/*
 * Control flow pattern #2:
 * Full parallel - an asynchronous, parallel for loop
 * Characteristics:
 *
 * Runs a number of operations in parallel</li>
 * - Starts all async operations in parallel (full concurrency)
 * No guarantee of order, only that all the operations have been completed
 */

function fullParallel(callbacks, last) {
  var results = [];
  var result_count = 0;
  callbacks.forEach(function(callback, index) {
    callback( function() {
      results[index] = Array.prototype.slice.call(arguments);
      result_count++;
      if(result_count == callbacks.length) {
        last(results);
      }
    });
  });
}

/*
 * Control flow pattern #3:
 * Limited parallel - an asynchronous, parallel, concurrency limited for loop
 *
 * Characteristics:
 *
 * - Runs a number of operations in parallel
 * - Starts a limited number of operations in parallel (partial concurrency, full concurrency control)
 * No guarantee of order, only that all the operations have been completed
 */

function limited(limit, callbacks, last) {
  var results = [];
  var running = 1;
  var task = 0;
  function next(){
    running--;
    if(task == callbacks.length && running == 0) {
      last(results);
    }
    while(running < limit && callbacks[task]) {
      var callback = callbacks[task];
      (function(index) {
        callback(function() {
          results[index] = Array.prototype.slice.call(arguments);
          next();
        });
      })(task);
      task++;
      running++;
    }
  }
  next();
}

module.exports = {
  series: series,
  parallel: fullParallel,
  limited: limited
};
