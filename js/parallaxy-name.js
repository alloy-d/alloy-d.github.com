define(["domReady!"], function () {
  "use strict";

  // As #name scrolls out of view, the .parallaxy-name things move down
  // so that once #name is fully out of view, they are sitting at the top of the screen.
  //
  // At some point I should make this less shamefully single-purpose.
  var repositionParallaxyThings = (function () {
    var scrollingSection = document.querySelector("#name");
    var scrollingSectionHeight = scrollingSection.offsetHeight;
    var scrollingSectionShown = scrollingSectionHeight * 0.32; // FIXME: get a better number
    var scrollingSectionHidden = scrollingSectionHeight - scrollingSectionShown;

    var affectedElements = document.querySelectorAll("h1.parallaxy-name");
    var initialOffset = parseInt(window.getComputedStyle(affectedElements[0]).top);

    var finalOffset = scrollingSectionShown*0.90;
    var deltaOffset = finalOffset - initialOffset;
    Array.prototype.forEach.call(affectedElements, function (elem) {
      elem.style.position = "fixed";
    });

    return function () {
      var percentHidden, newOffset;
      if (window.pageYOffset > scrollingSectionHidden) {
        // No recalculation if the whole section has scrolled out of view.
        Array.prototype.forEach.call(affectedElements, function (elem) {
          elem.style.top = finalOffset + "px";
        })
        return;
      }

      percentHidden = window.pageYOffset/scrollingSectionHidden;
      newOffset = initialOffset + percentHidden*deltaOffset + "px";
      Array.prototype.forEach.call(affectedElements, function (elem) {
        elem.style.top = newOffset;
      });
    };
  }());

  repositionParallaxyThings();
  window.addEventListener("scroll", repositionParallaxyThings);
});
