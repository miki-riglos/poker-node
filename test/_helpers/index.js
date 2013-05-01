var inspect = require("util").inspect;

// Helpers for testing/debugging
Object.defineProperties(Object.prototype, {
  "toInspect": {
    value: function(message, depth) {
      console.log("\n", message ? message + "\n " : "",
                  inspect(this, {showHidden: false, depth: depth || 4, colors: true}), "\n");
    },
    enumerable: false
  },
  "stringify": {
    value: function() {
      var exclusions = Array.prototype.slice.call(arguments);
      return JSON.stringify(this, function(key, value) { return exclusions.indexOf(key) != -1 ? undefined : value }, 2);
    },
    enumerable: false
  }
});
