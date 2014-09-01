define(function () {
  return {
    register: function register(context) {
      context.updateWorker.onmessage = function (event) {
        var slowdownOffset = context.container.clientHeight / 3;
        var amountVisibleWhenPaused = 200;
        var baseTimeout = 100;
        var maxSlowdown = 940;
        var currentOffset;
        var timeout = baseTimeout;
        var scrollListener = function () {
          if (window.pageYOffset > context.container.clientHeight - amountVisibleWhenPaused) {
            return;
          } else {
            context.updateWorker.postMessage({type: "updateGrid", grid: context.grid});
            window.removeEventListener("scroll", scrollListener);
          }
        };
        if (event.data.type === "new grid") {
          context.grid = event.data.grid;
          if (!window.TIME_IS_FROZEN) {
            timeout = baseTimeout;
            currentOffset = window.pageYOffset;
            if (currentOffset < context.container.clientHeight - amountVisibleWhenPaused) {
              if (currentOffset > slowdownOffset) {
                timeout += maxSlowdown * (currentOffset-slowdownOffset) / (context.container.clientHeight-amountVisibleWhenPaused);
              }
              window.setTimeout(function () {
                context.updateWorker.postMessage({type: "updateGrid", grid: context.grid});
              }, timeout);
            } else {
              window.addEventListener("scroll", scrollListener);
            }
          }
          context.artist.draw(context.grid);
        }
      }
    }
  };
});
