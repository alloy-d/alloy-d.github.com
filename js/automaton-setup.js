curl(["underscore", "automaton/artist"], function (_, Artist) {
  "use strict";

  // Returns the height and width of a grid that fits the given cell
  // dimensions and covers a canvas of the provided canvas dimensions.
  //
  // If `minimal` is true, then the dimensions returned are contained
  // by the provided cell dimensions.  If `minimal` is false, then the
  // dimensions returned *contain* the provided cell dimensions.
  //
  // Also returns the size, in canvas units, of each square cell.
  var calculateGridDimensions = function calculateGridDimensions(cellsWide, cellsHigh, canvasWidth, canvasHeight, minimal) {
    var cellSize;
    if (minimal) {
      cellSize = Math.ceil(_.max([canvasHeight / cellsHigh, canvasWidth / cellsWide]));
    } else {
      cellSize = Math.floor(_.min([canvasHeight / cellsHigh, canvasWidth / cellsWide]));
    }

    return {
      cellSize: cellSize,
      height: Math.ceil(canvasHeight / cellSize),
      width: Math.ceil(canvasWidth / cellSize)
    };
  };

  // Creates an initialized grid of the specified width and height.
  //
  // If a state is given, that state is assigned to each cell as the default.
  // If `state` is a function, it is called to initialize each cell with
  //   the following arguments: (cell x, cell y, grid width, grid height).
  // If a default state is not given, then state 0 is assumed.
  var createGrid = function createGrid(width, height, state) {
    var v,h;

    // If no default state is given, state 0 becomes the default.
    if (!state) { state = 0 }

    var grid = new Array(height);
    for (v = 0; v < height; v += 1) {
      grid[v] = new Array(width);
      for (h = 0; h < width; h += 1) {
        if (typeof(state) === "function") {
          grid[v][h] = state(h, v, width, height);
        } else {
          grid[v][h] = state;
        }
      }
    }
    return grid;
  }

  var grid, artist;
  var updateWorker = new Worker("js/automaton/update-worker.js");
  window.TIME_IS_FROZEN = false;
  window.toggleAutomaton = function toggleAutomaton() {
    window.TIME_IS_FROZEN = !window.TIME_IS_FROZEN;
    if (!window.TIME_IS_FROZEN) {
      updateWorker.postMessage({type: "updateGrid", grid: grid});
    }
  };
  updateWorker.onmessage = _.throttle(function (event) {
    if (event.data.type === "new grid") {
      grid = event.data.grid;
      if (!window.TIME_IS_FROZEN) {
        updateWorker.postMessage({type: "updateGrid", grid: grid});
      }
      artist.draw(grid);
    }
  }, 60);
  updateWorker.onerror = function (error) {
    console.error("Error in automaton worker:", error);
  }

  // This is loaded separately in the interest of eventually making
  // it easily swappable with other "presets".
  curl("automaton/presets/default", function (preset) {
    var canvas = document.getElementById("automaton");
    var container = canvas.parentElement;
    var dimensions = calculateGridDimensions(50, 50, container.scrollWidth, container.scrollHeight, true);
    grid = createGrid(dimensions.width+1, dimensions.height+1, function () { return parseInt(Math.random() * Math.random() * 2) });

    var makeNewArtist = function makeNewArtist() {
      var newDimensions = calculateGridDimensions(dimensions.width, dimensions.height, container.scrollWidth, container.scrollHeight);
      artist = new Artist("automaton",
        dimensions.width+1,
        dimensions.height+1,
        _.extend(preset.artistSettings, {cellSize: newDimensions.cellSize}));
      artist.draw(grid);

      // Adjust positioning so that the canvas's overflow is equal on the sides.
      canvas.style.left = "-" + ((parseInt(canvas.style.width) - container.offsetWidth) / 2) + "px";
    }
    makeNewArtist();

    window.addEventListener("resize", makeNewArtist);

    updateWorker.postMessage({type: "updateRules", rules: preset.rules});
    updateWorker.postMessage({type: "updateGrid", grid: preset.seed(grid)});
  });
});
