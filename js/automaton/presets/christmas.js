define([
  "automaton/seeds/christmas-tree"
], function (seed) {
  var shades = function (rgbStart, rgbEnd, steps) {
    var i;
    var colors = [];
    var rgbDelta = [0,1,2].map(function (color) {
      return rgbEnd[color] - rgbStart[color];
    });

    for (i = 0; i < steps; i += 1) {
      colors.push([0,1,2].map(function (color) {
        return rgbStart[color] + parseInt(rgbDelta[color] * i/(steps-1));
      }));
    }

    return colors.map(function (color) {
      return "rgb(" + color.join(",") + ")";
    });
  };
  var green = "#109030";
  var red = "#801010";
  var greens = [];
  var colors = [null];  // 0 == off
  // colors = colors.concat(shades([0, 100, 16], [16, 144, 64], 3))

  // add shades for the tree (states 1–6)
  colors = colors.concat(shades([16, 144, 64], [0, 100, 16], 6))

  // add snow (states 7–11)
  colors = colors.concat(["#ffffff", null, null, "#ffffff", "#ffffff"]);

  // add tree lights (states 12–17)
  colors = colors.concat(["#ff0000", "#00ff00", "#0000ff", "#00ffff", "#ff00ff", "#ffff00"]);

  // not enough snow...
  // colors = colors.concat(["#ffffff", "#ffffff", "#ffffff"]);
  colors = colors.concat([null, null, null]);
  console.log(colors);
  return {
    rules: [
      "1: 1", "2: 2", "3: 3", "4: 4", "5: 5", "6: 6",  // tree
      "13: 12", "14: 13", "15: 14", "16: 15", "17: 16", "12: 17",   // lights
      "8: 7", "9: 8", "18: 9", "19: 18", "20: 19", "7: 20", // snow generators
      "10: NW == 7 || NW == 11", "11: NE == 10", "0: 10", "0: 11",  // snow
      "0",
    ],
    seed: seed,
    artistSettings: {
      background: red,
      colors: colors,
      gridColor: red,
      gridThickness: 0
    },
    gridHeight: 5000,
    gridWidth: 300,
  };
});