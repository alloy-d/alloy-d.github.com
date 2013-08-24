(function (root, maker) {
  if (typeof(define) === "function" && define.amd) {
    define(["automaton/automaton"], maker);
  } else {
    root.AutomatonArtist = maker(Automaton);
  }
}(this, function (Automaton) {
  var AutomatonArtist = function AutomatonArtist(canvasID, gridWidth, gridHeight, settings, colors) {
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
        null,
        "#000856"
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

  AutomatonArtist.prototype = (function () {
    var drawGridLines = function drawGridLines() {
      var ctx, sz = this.settings.cellSize;
      if (typeof this.gridLines === "undefined") {
        this.gridLines = document.createElement("canvas");
        this.gridLines.width = this.gridWidth * sz;
        this.gridLines.height = this.gridHeight * sz;

        ctx = this.gridLines.getContext("2d");

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

      this.context.drawImage(this.gridLines, 0, 0);
    }

    var draw = function draw(grid) {
      var sz = this.settings.cellSize;
      var ctx = this.context;
      var v, h, hs;

      ctx.fillStyle = this.settings.background;
      ctx.fillRect(0, 0, this.gridWidth * sz, this.gridHeight * sz);

      if (this.colors.length === 2 && this.colors[0] === null) { // optimized case
        ctx.fillStyle = this.colors[1];
        for (v = 0; v < this.gridHeight; v += 1) {
          for (h = 0; h < this.gridWidth; h += 1) {
            if (grid[v][h] === 0) { continue }
            hs = 1;
            while (h + hs < this.gridWidth && grid[v][h+hs] === 1) {
              hs += 1;
            }
            ctx.fillRect(h * sz, v * sz, sz * hs, sz);
            h += hs - 1;
          }
        }
      } else { // Drawin' every color...
        for (v = 0; v < this.gridHeight; v += 1) {
          for (h = 0; h < this.gridWidth; h += 1) {
            ctx.fillStyle = this.colors[grid[v][h]];
            ctx.fillRect(h * sz, v * sz, sz, sz);
          }
        }
      }

      this.drawGridLines();
    };

    return {
      drawGridLines: drawGridLines,
      draw: draw
    };
  }());

  return AutomatonArtist;
}));
