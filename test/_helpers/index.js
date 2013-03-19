var inspect = require("util").inspect;

// Helpers for testing/debugging
Object.defineProperties(Object.prototype, {
  "toInspect": {
    value: function(message, showHidden, depth) {
      console.log("\n", message ? message + "\n " : "", inspect(this, showHidden, depth, true /* colors */), "\n");
    },
    enumerable: false
  },
  "stringify": {
    value: function(exclusions) {
      exclusions = exclusions || [];
      return JSON.stringify(this, function(key, value) { return exclusions.indexOf(key) != -1 ? undefined : value }, 2);
    },
    enumerable: false
  }
});
