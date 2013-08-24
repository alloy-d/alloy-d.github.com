(function (root, maker) {
  if (typeof(define) === "function" && define.amd) {
    define(maker);
  } else {
    root.Automaton = maker();
  }
}(this, function () {
  "use strict";

  var Automaton = {};
  var addresser = function addresser(neighborDirection) {
    var vOffset = 0, hOffset = 0;
    if (neighborDirection.indexOf("N") >= 0) { vOffset = -1; }
    if (neighborDirection.indexOf("S") >= 0) { vOffset =  1; }
    if (neighborDirection.indexOf("E") >= 0) { hOffset =  1; }
    if (neighborDirection.indexOf("W") >= 0) { hOffset = -1; }
    return function address(v, h, grid) {
      v += vOffset; h += hOffset;
      if (v < 0 || h < 0 || v >= grid.length || h >= grid[0].length) { return 0; }
      return grid[v][h];
    };
  };

  Automaton.addresses = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  Automaton.addresses.forEach(function (dir) {
    Automaton[dir] = addresser(dir);
  });
  Automaton.self = function (v, h, grid) { return grid[v][h]; };

  Automaton.vonNeumannAddresses = ["N", "S", "E", "W"];
  Automaton.mooreAddresses = Automaton.vonNeumannAddresses.concat("NE", "NW", "SE", "SW");

  var counter = function counter(addresses) {
    return function counterForState(state) {
      return function (v, h, grid) {
        var count = 0;
        for (var i in addresses) {
          if (Automaton[addresses[i]](v,h,grid) === state) {
            count += 1;
          }
        }
        return count;
      };
    };
  };
  Automaton.counters = {
    "moore": counter(Automaton.mooreAddresses),
    "vonNeumann": counter(Automaton.vonNeumannAddresses)
  };

  Automaton.update = function (grid, ruleSet) {
    var height = grid.length;
    var width = grid[0].length;
    var v, h, rule, newVal;

    var result = new Array(height);
    for (v = 0; v < height; v += 1) { result[v] = new Array(width); }

    for (v = 0; v < height; v += 1) {
      for (h = 0; h < width; h += 1) {
        for (rule = 0; rule < ruleSet.length; rule += 1) {
          newVal = ruleSet[rule](v, h, grid)
          if (typeof newVal !== "undefined") {
            result[v][h] = newVal; break;
          }
        }
      }
    }
    return result;
  };

  return Automaton;
}));
