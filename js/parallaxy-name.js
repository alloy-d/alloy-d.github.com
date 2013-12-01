define(["domReady!"], function () {
  "use strict";

  // As #name scrolls out of view, the .parallaxy-name things move down
  // so that once #name is fully out of view, they are sitting at the top of the screen.
  //
  // At some point I should make this less shamefully single-purpose.
  var repositionParallaxyThings = (function () {
    var scrollingSection = document.querySelector("#name");
    var scrollingSectionHeight = scrollingSection.offsetHeight;

    var affectedElements = document.querySelectorAll("h1.parallaxy-name");
    var elementsTopPadding = parseInt(window.getComputedStyle(affectedElements[0]).paddingTop);

    var finalOffset = scrollingSectionHeight - elementsTopPadding;
    Array.prototype.forEach.call(affectedElements, function (elem) {
      elem.style.position = "fixed";
    });

    return function () {
      var percentHidden, newOffset;
      if (window.pageYOffset > scrollingSectionHeight) {
        // No recalculation if the whole section has scrolled out of view.
        Array.prototype.forEach.call(affectedElements, function (elem) {
          elem.style.top = -elementsTopPadding + "px";
        })
        return;
      }

      percentHidden = (scrollingSectionHeight - window.pageYOffset)/scrollingSectionHeight;
      newOffset = -((1-percentHidden)*elementsTopPadding) + "px";
      Array.prototype.forEach.call(affectedElements, function (elem) {
        elem.style.top = newOffset;
      });
    };
  }());

  repositionParallaxyThings();
  window.addEventListener("scroll", repositionParallaxyThings);
});
