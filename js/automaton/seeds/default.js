define(["automaton/grid"], function (Grid) {
  "use strict";

  return function (grid) {
    grid = new Grid(grid);

    var cx = grid.width() - 10;
    var cy = grid.height() - 5;

    grid.set(cx-2, cy, 1);
    grid.set(cx-1, cy, 1);
    grid.set(cx  , cy, 1);
    grid.set(cx+1, cy, 1);
    grid.set(cx+2, cy, 1);

    return grid.grid;
  };
});