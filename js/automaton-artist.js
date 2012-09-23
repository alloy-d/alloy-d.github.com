Automaton.Artist = (Automaton.Artist || {});

Automaton.Artist = function (canvasID, gridWidth, gridHeight, colors, settings) {
  this.settings = {
    background: "#000000",
    gridColor: "#000",
    gridThickness: 2,
    cellSize: _.max([window.innerHeight / gridHeight, window.innerWidth / gridWidth]),
  };
  if (typeof colors !== "undefined") {
    this.colors = colors;
  } else {
    this.colors = [
      "black",
      "#2233aa"
    ];
  }
  if (typeof settings !== "undefined") {
    this.settings = _.extend(this.settings, settings);
  }
  this.canvas = document.getElementById(canvasID);
  this.context = this.canvas.getContext("2d")
  this.gridWidth = gridWidth;
  this.gridHeight = gridHeight;

  this.canvas.width = gridWidth * this.settings.cellSize;
  this.canvas.height = gridHeight * this.settings.cellSize;
};

(function bindAutomatonArtistFunctions() {
  this.draw = function drawGrid(grid) {
    var sz = this.settings.cellSize;
    var ctx = this.context;
    var v, h;

    ctx.fillStyle = this.settings.background;
    ctx.fillRect(0, 0, this.gridWidth * sz, this.gridHeight * sz);

    for (v = 0; v < this.gridHeight; v += 1) {
      for (h = 0; h < this.gridWidth; h += 1) {
        ctx.fillStyle = this.colors[grid[v][h]];
        ctx.fillRect(h * sz, v * sz, sz, sz);
      }
    }

    ctx.strokeStyle = this.settings.gridColor;
    ctx.lineWidth = this.settings.gridThickness;
    ctx.beginPath();
    for (v = 1; v < this.gridHeight; v += 1) {
      ctx.moveTo(0, v * sz);
      ctx.lineTo(this.canvas.width, v * sz);
    }
    for (h = 1; h < this.gridWidth; h += 1) {
      ctx.moveTo(h * sz, 0);
      ctx.lineTo(h * sz, this.canvas.height);
    }
    ctx.stroke();
    ctx.closePath();
  }
}.call(Automaton.Artist.prototype));
