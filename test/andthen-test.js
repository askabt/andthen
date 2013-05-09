"use strict";
var defer = require("../lib/andthen");

function longOp(num) {
    var result = defer();
    console.log("Queue", num);
    setTimeout(function() {
        console.log("Dequeue", num);
        result.resolve(num);
    }, 100);
    return result.promise;
}

longOp(1).
then(function(n) {
    console.log("First", n);
    return defer(n).and(longOp(2).and(longOp(3)));
}).then(function(first, second, third) {
   console.log("Results", first, second, third, arguments);
});

