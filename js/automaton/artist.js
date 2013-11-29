(function (root, maker) {
  if (typeof(define) === "function" && define.amd) {
    define(["automaton/automaton"], maker);
  } else {
    root.AutomatonArtist = maker(Automaton);
  }
}(this, function (Automaton) {
  var AutomatonArtist = function AutomatonArtist(canvasID, gridWidth, gridHeight, settings) {
    var canvasWidthInDips, canvasHeightInDips;
    this.settings = {
      background: "#000000",
      gridColor: "#000",
      gridThickness: 2,
      cellSize: _.max([window.innerHeight / gridHeight, window.innerWidth / gridWidth]),
      colors: [
        null,
        "#303030"
      ]
    };
    this.pixelsPerDip = 1;
    if (window.devicePixelRatio && window.devicePixelRatio > 1) {
      this.pixelsPerDip = window.devicePixelRatio;
    }

    if (typeof settings !== "undefined") {
      this.settings = _.extend(this.settings, settings);
    }
    this.canvas = document.getElementById(canvasID);
    this.context = this.canvas.getContext("2d")
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    canvasWidthInDips = gridWidth * this.settings.cellSize;
    canvasHeightInDips = gridHeight * this.settings.cellSize;
    this.canvas.width = canvasWidthInDips * this.pixelsPerDip;
    this.canvas.height = canvasHeightInDips * this.pixelsPerDip;
    this.canvas.style.width = canvasWidthInDips + "px";
    this.canvas.style.height = canvasHeightInDips + "px";
  };

  AutomatonArtist.prototype = (function () {
    var drawGridLines = function drawGridLines() {
      if (!this.settings.gridThickness || !this.settings.gridColor) { return }
      var ctx, sz = this.settings.cellSize * this.pixelsPerDip;
      if (typeof this.gridLines === "undefined") {
        this.gridLines = document.createElement("canvas");
        this.gridLines.width = this.canvas.width;
        this.gridLines.height = this.canvas.height;

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
      var sz = this.settings.cellSize * this.pixelsPerDip;
      var ctx = this.context;
      var v, h, hs;

      if (this.settings.background) {
        ctx.fillStyle = this.settings.background;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      if (this.settings.colors.length === 2 && this.settings.colors[0] === null) { // optimized case
        ctx.fillStyle = this.settings.colors[1];
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
            ctx.fillStyle = this.settings.colors[grid[v][h]];
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
