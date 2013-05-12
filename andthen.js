(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /*jshint strict: false, -W117*/

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the API and when
    // executed as a simple <script>, it creates an 'andthen' global.

    // CommonJS
     if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // <script>
    } else {
        andthen = definition();
    }

}(function () {
	"use strict";
	
	var defer = function () {
		var pending = [], resolution;
		
		if(arguments.length !== 0) {
			var result = defer();
			result.resolve.apply(result, arguments);
			return result.promise;
		}
		
		function ref(args) {
			if(args.length === 1 && args[0] && args[0].then) {
				return args[0];
			}
			return {
				then: function(callback) {
					var result = defer();
					process.nextTick(function() {
						result.resolve(callback.apply(null, args));
					});
					return result.promise;
				}
			};
		}
		
		return {
			resolve: function () {
				if (pending) {
					resolution = ref(arguments);
					if(pending.length === 0 && resolution._error) {
						resolution.then(null, function(reason) {
							throw reason;
						});
					}
					for (var i = 0, ii = pending.length; i < ii; i+=1) {
						// Pending[i] will be arrays of [callback, errback].
						resolution.then.apply(resolution, pending[i]);
					}
					pending = undefined;
				}
			},
			promise: {
				then: function (cb, eb) {
					var result = defer();
					cb = cb || function (value) {
						return value;
					};
					eb = eb || function (reason) {
						return reject(reason);
					};
					var callback = function () {
						var reso;
						try {
							reso = cb.apply(null, arguments);
						}
						catch(reason) { reso = reject(reason); }
						
						result.resolve(reso);
					};
					var errback = function (reason) {
						result.resolve(eb(reason));
					};
					if (pending) {
						pending.push([callback, errback]);
					} else {
						process.nextTick(function () {
							resolution.then(callback, errback);
						});
					}
					return result.promise;
				},
				and: function(promise) {
					var result = defer();
					var val0, val1;
					
					function callback() {
						if(val0 && val1) {
							result.resolve.apply(result, val0.concat(val1));
						}
					}
					
					function errback(reason) {
						result.resolve(defer.reject(reason));
					}
					
					this.then(function() {
						val0 = [].splice.call(arguments,0);
						callback();
					}, errback);
					
					promise.then(function(value) {
						val1 = [].splice.call(arguments,0);
						callback();
					}, errback);
					
					return result.promise;
				}
			}
		};
	};
	
	var reject = function (reason) {
		if(reason && reason.then && reason._error) {
			return reason;
		}
		return {
			_error: true,
			then: function (callback, errback) {
				var result = defer();
				process.nextTick(function () {
					result.resolve(errback(reason));
				});
				return result.promise;
			}
		};
	};
	
	defer.reject = reject;
	return defer;
}));