define(function () {
  var Grid = function Grid(grid) {
    this.grid = grid;
  };

  Grid.prototype.at = function at(x, y) {
    return this.grid[y][x];
  };
  Grid.prototype.set = function set(x, y, value) {
    this.grid[y][x] = value;
  };

  Grid.prototype.height = function height() {
    return this.grid.length;
  };
  Grid.prototype.width = function width() {
    return this.grid[0].length;
  }

  Grid.prototype.center = function center() {
    return {
      x: parseInt(this.width() / 2),
      y: parseInt(this.height() / 2)
    };
  };

  Grid.prototype.debug = function debug() {
    var height = this.height();
    var y;

    console.group("grid");
    for (y = 0; y < height; y += 1) {
      console.log(this.grid[y].join("\t"));
    }
    console.groupEnd();
  };

  return Grid;
});