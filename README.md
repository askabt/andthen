And Then...
===========

there was a minimal CommonJS promises library with useful things like parallel execution, fulfilments and exception handling, without losing the beautiful simplicity of .then().

Questions and Feedback
----------------------
Chat with me about andthen **right now** - I hang out on http://askabt.com/andthen. &lt;shameless-plug> Askabt is like an IRC channel, but prettier, easier and works via the web and your XMPP account. Sign in with your Github account to join the communities around your repos and the languages you use. &lt;/shameless-plug>

.and()
------------
Parallel execution is like saying, "Do this ***and*** that, ***then*** do the other thing." With andthen, you can express it like:

```javascript
	doThis().and(doThat()).then(function(thisResult, thatResult) {
		return doOther();
	});
```

Exceptions
----------
Exceptions thrown in a .then() callback are caught and turned into promise rejections so they can be handled by subsequent errback's.

```javascript
	promise.then(function() {
		throw new Error('Boo!');
	}).then(null, function(err) {    // Passing an error callback.
		console.log(err.message);    // Boo!
	});
```

If there's a chain of promises where you forgot to add an error callback, andthen will turn promise rejections into errors that are then thrown. This will alert you to problems that, with other libraries, might go undetected.

Installation
------------
If you want to use it in Node.js

	npm install and-then

To use on the client side, just download andthen.js (or andthen.min.js) from Github.

Usage
-----
Include andthen using CommonJS require(), AMD require, or simple &lt;script> tags. Usage is pretty close to other deferred libraries:

```
	function promiseMaker() {
		var result = andthen();
		
	}
```

### Parallel Execution
Call `.and()` on Promise A and pass it a Promise B to obtain a new promise C. When both A and B have returned, promise C will resolve into ***both*** values, i.e. a `.then()` callback attached on C will be called with two arguments.

You can chain .and()'s. The resolution values of both A and B are passed as arguments to the .then() callback on promise C. For example:

```javascript
	getA().and(getB()).then(function(a, b) {
		// ...
	});
	
	getA().and(getB()).and(getC()).then(function(a, b, c) {
		// ...
	});
```


### Fulfilment
Sometimes you want a promise that's already resolved - for example you need to pass it to a function that expects a promise. You can save some keystrokes using the `andthen(value)` syntax.

You can also pre-fulfil the multi-valued promises that .and() generates, like `andthen(val1, val2, val3)`. 

Credit
------
Loosely based on the documentation of [kriskowal's q library][Q].

[Q]: http://documentup.com/kriskowal/q


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
