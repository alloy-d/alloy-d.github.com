define(["automaton/grid"], function (Grid) {
  "use strict";

  var treeColors = [1,2,3,4,5,6];
  var snowGeneratorColors = [7, 8, 9];
  var lightColors = [12, 13, 14, 15, 16, 17];
  var treeWidth = 100;

  var treeShaped = function addTree(grid, callback) {
    var gridHeight = grid.height();
    var gridCenter = parseInt(grid.width() / 2);
    var treeHeight = parseInt(gridHeight * 0.9);
    var treeTop = gridHeight - treeHeight;
    var r, o, width, color;

    console.log("tree top:", treeTop);

    for (r = treeTop; r < gridHeight; r += 1) {
      width = parseInt((r-treeTop)/treeHeight * treeWidth/2);
      callback(r, gridCenter, width);
    }
  };

  var addTree = function addTree(grid) {
    treeShaped(grid, function (row, center, amplitude) {
      var o, color;
      for (o = 0; o <= amplitude; o += 1) {
        color = treeColors[parseInt((o/amplitude+1/9)*(treeColors.length-1))];  // TODO: reexamine wonky math
        grid.set(center-o, row, color);
        grid.set(center+o, row, color);
      }
    });
  };

  var addLights = function addLights(grid) {
    function drawLight(x, y, color) {
      var i, j;
      for (i = x-1; i <= x+1; i+=1) {
        grid.set(i, y, color);
      }
      for (j = y-1; j <= y+1; j+=1) {
        grid.set(x, j, color);
      }
    }
    function randomColor() {
      var index = parseInt(Math.random() * lightColors.length);
      return lightColors[index];
    }
    treeShaped(grid, function(row, center, amplitude) {
      var bendiness = 50;
      var o, r, color, shift;
      if (row % 20) { return };
      shift = 9-parseInt(Math.random()*18);
      for (o = 0; o <= amplitude*2; o += 1) {
        if (o % 10) { continue };
        r = row - parseInt(Math.pow(o/treeWidth, 1.8) * bendiness);
        drawLight(center+o+shift, r, randomColor());
        drawLight(center-o+shift, r, randomColor());
      }
    });
  }

  var snipExtraLights = function snipExtraLights(grid) {
    treeShaped(grid, function (row, center, amplitude) {
      var i;
      for (i = 0; i < center-amplitude; i += 1) {
        grid.set(i, row, 0);
      }
      for (i = center+amplitude+1; i < grid.width(); i += 1) {
        grid.set(i, row, 0);
      }
    });
  };

  var addSnow = function addSnow(grid) {
    var gridWidth = grid.width();
    var i;

    for (i = 0; i < gridWidth; i += 1) {
      if (Math.round(Math.random()/1.2)) {
        grid.set(i, 0, snowGeneratorColors[parseInt(Math.random() * snowGeneratorColors.length)]);
      }
    }
  };

  return function (grid) {
    grid = new Grid(grid);

    addTree(grid);

    addLights(grid);

    snipExtraLights(grid);

    addSnow(grid);

    return grid.grid;
  };
});