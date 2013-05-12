"use strict";
var defer = require("../lib/andthen"),
    assert = require("assert");

var startTime = new Date().getTime();

function op(num) {
    var result = defer();
    setTimeout(function() {
        result.resolve(num);
    }, 100);
    return result.promise;
}

function thrower(e) {
    throw e;
}

function noop() {};

op(1).
then(function(n) {
    return op(n).and(op(2).and(op(3)));
}).then(function(a, b, c) {
   assert(a === 1);
   assert(b === 2);
   assert(c === 3);
});

op(1).then(thrower).then(noop, function(e) {
    assert(e === 1);
});

/* Uncomment the following line to ensure that an error is thrown
 * asynchronously when no error callback is attached.
// op(1).then(thrower);
