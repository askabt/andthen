/*
 *  This file comes from the documentation of Kris Kowal's Q library.
 */
"use strict";

var defer = function () {
    var pending = [], value;
	
	if(arguments.length !== 0) {
		var result = defer();
		result.resolve.apply(result, arguments);
		return result.promise;
	}
	
    return {
        resolve: function (_value) {
            if (pending) {
                value = ref(_value);
				if(pending.length === 0 && value._error)
					value.then(null, function(reason) {
						throw reason;
					});
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    value.then.apply(value, pending[i]);
                }
                pending = undefined;
            }
        },
        promise: {
            then: function (_callback, _errback) {
                var result = defer(), self = this;
                _callback = _callback || function (value) {
                    return value;
                };
                _errback = _errback || function (reason) {
                    return reject(reason);
                };
                var callback = function (value) {
                    var reso;
                    try {
						reso = self._compound? _callback.apply(null, value):
							_callback(value);
					}
                    catch(reason) { reso = reject(reason); }
                    
                    if(reso && reso.then && reso._compound) {
                        //console.log("DEFERRED", reso, "was compound; changing result.");
                        result.promise._compound = true;
                    }

                    result.resolve(reso);
                };
                var errback = function (reason) {
                    result.resolve(_errback(reason));
                };
                if (pending) {
                    pending.push([callback, errback]);
                } else {
                    process.nextTick(function () {
                        value.then(callback, errback);
                    });    
                }
                return result.promise;
            },
            and: function(promise) {
                var result = defer();
                result.promise._compound = true;
                
                var val0, val1, res0=false, res1=false;
                var self = this;
                
                function callback() {
                    if(!res0 || !res1) return;
					val0 = [].splice.call(val0, 0);
                    var val = val0.concat(val1);
                    result.resolve(val);
                }
                
                function errback(reason) {
                    result.resolve(defer.reject(reason));
                }
                
                this.then(function(value) {
                    if(!self._compound) val0 = [value];
					else val0 = arguments;
                    res0 = true;
                    callback();
                }, errback);
                
                promise.then(function(value) {
                    if(!promise._compound) val1 = [value];
					else val1 = arguments;
                    res1 = true;
                    callback();
                }, errback);
                
                return result.promise;
            }
        }
    };
};

var ref = function (value) {
    if (value && value.then)
        return value;
    return {
        then: function (callback) {
            var result = defer();
            process.nextTick(function () {
                result.resolve(callback(value));
            });
            return result.promise;
        }
    };
};

var reject = function (reason) {
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
module.exports = defer;