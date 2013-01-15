vow
===

A minimal CommonJS Promises/A library with a twist.

Loosely based on the documentation of [kriskowal's q library](http://documentup.com/kriskowal/q).

Standard stuff
--------------
You want to do a bunch of things in series without nested callbacks:
```javascript
longOperation(1).
then(function(firstResult) {
  return longOperation(2);
}).then(function(secondResult) {
  return longOperation(3);
}).then(function(thirdResult) {
  console.log("Woo!");
})
```

The twist
---------
What if you want to do them in parallel, but wait for all of them to be done?
```javascript
longOperation(1).
and(longOperation(2)).
and(longOperation(3)).
then(function(firstResult, secondResult, thirdResult) {
  console.log("Awesome!");
})
```

Mix 'em up
----------
If you use Gantt charts to model control flow.
```javascript
longOperation(1).and(
  longOperation(2).and(longOperation(3)).
  then(function(secondResult, thirdResult) {
    return someOperation(secondResult, thirdResult);
  })
).then(function(firstResult, resultOfOperation) {
  console.log("All done!");
});
```

License
-------
(The MIT License)

Copyright (c) 2009-2011 Askabt

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the 'Software'), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
