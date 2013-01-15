var defer = require("../lib/defer");

function longOp(num) {
    var result = defer();
    setTimeout(function() { result.resolve(num); }, 1000);
    return result.promise;    
}

longOp(1).
and(longOp(2)).
and(longOp(3)).
then(function(first, second, third) {
   console.log("Results", first, second, third, arguments); 
});