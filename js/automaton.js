window.Automaton = (window.Automaton || {});

(function bindAutomaton() {
  "use strict";

  var Automaton = this;
  var addresser = function addresser(neighborDirection) {
    var vOffset = 0, hOffset = 0;
    if (neighborDirection.indexOf("N") >= 0) { vOffset = -1; }
    if (neighborDirection.indexOf("S") >= 0) { vOffset =  1; }
    if (neighborDirection.indexOf("E") >= 0) { hOffset =  1; }
    if (neighborDirection.indexOf("W") >= 0) { hOffset = -1; }
    return function address(v, h, grid) {
      return grid[v+vOffset][h+hOffset];
    };
  };

  Automaton.addresses = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];
  Automaton.addresses.forEach(function (dir) {
    Automaton[dir] = addresser(dir);
  });
  Automaton.self = function (v, h, grid) { return grid[v][h]; };
}.call(window.Automaton));
