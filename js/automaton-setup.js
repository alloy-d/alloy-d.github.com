curl("underscore", function (_) {
  "use strict";

  window.maxCellsWide = 40;
  window.maxCellsHigh = 40;
  var winh = window.innerHeight;
  var winw = window.innerWidth;

  var cellSize = Math.ceil(_.max([window.innerHeight / window.maxCellsHigh, window.innerWidth / window.maxCellsWide]));
  var width = Math.ceil(winw / cellSize), height = Math.ceil(winh / cellSize);
  var v, h;
  var ch = parseInt(width / 2);
  var cv = parseInt(height / 2);

  window.grid = new Array(height);
  for (v = 0; v < height; v += 1) {
    grid[v] = new Array(width);
    for (h = 0; h < width; h += 1) {
      grid[v][h] = Math.floor(Math.random() * 0);
    }
  }

  cv = height - 5;
  ch = width - 10;
  window.grid[cv][ch-2] = 1;
  window.grid[cv][ch-1] = 1;
  window.grid[cv][ch] = 1;
  window.grid[cv][ch+1] = 1;
  window.grid[cv][ch+2] = 1;

  curl(["automaton/artist"], function (Artist) {
    function makeNewArtist() {
      window.artist = new Artist("automaton", width, height, {cellSize: cellSize});
      artist.draw(grid);
    }
    makeNewArtist();
    window.onresize = makeNewArtist();

    // Conway's Game of Life
    // window.rules = [
    //   "1: moore(1) == 3",
    //   "1: 1 && moore(1) == 2",
    //   "0"
    // ]

    // Seeds:
    window.rules = [
      "1: 0 && moore(1) == 2",
      "0"
    ]

    function debugGrid(grid) {
      var height = grid.length;
      var width = grid[0].length;
      var v, h;
      console.group("grid");
      for (v = 0; v < height; v += 1) {
        console.log(grid[v].join("\t"));
      }
      console.groupEnd();
    }

    var updateWorker = new Worker("js/automaton/update-worker.js");
    window.TIME_IS_FROZEN = false;
    updateWorker.onmessage = _.throttle(function (event) {
      if (event.data.type === "new grid") {
        grid = event.data.grid;
        if (!window.TIME_IS_FROZEN) {
          updateWorker.postMessage({type: "updateGrid", grid: grid});
        }
        artist.draw(grid);
      }
    }, 50);
    updateWorker.onerror = function (error) {
      console.log(error);
    }
    updateWorker.postMessage({type: "updateRules", rules: rules})
    updateWorker.postMessage({type: "updateGrid", grid: grid});
  });
});
