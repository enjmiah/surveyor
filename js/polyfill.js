// jshint -W041
"use strict";

/**
* requestAnimationFrame shim by Paul Irish
* http://paulirish.com/2011/requestanimationframe-for-smart-animating
*/
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();


/**
* Array.fill polyfill
* http://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
*/
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value) {

    // Steps 1-2.
    if (this == null) {
      throw new TypeError('this is null or not defined');
    }

    var O = Object(this);

    // Steps 3-5.
    var len = O.length >>> 0;

    // Steps 6-7.
    var start = arguments[1];
    var relativeStart = start >> 0;

    // Step 8.
    var k = relativeStart < 0 ?
      Math.max(len + relativeStart, 0) :
      Math.min(relativeStart, len);

    // Steps 9-10.
    var end = arguments[2];
    var relativeEnd = end === undefined ?
      len : end >> 0;

    // Step 11.
    var final = relativeEnd < 0 ?
      Math.max(len + relativeEnd, 0) :
      Math.min(relativeEnd, len);

    // Step 12.
    while (k < final) {
      O[k] = value;
      k++;
    }

    // Step 13.
    return O;
  };
}


/**
* Object.create polyfill
* http://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create
*/
if (typeof Object.create != 'function') {
  Object.create = (function() {
    var Temp = function() {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw new TypeError('Argument must be an object');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}


/**
* Like drawImage() but with support for different anchors.
* @param {Image} img The image to draw onscreen.
* @param {Num} x The x-position of the anchor.
* @param {Num} y The y-position of the anchor.
* @param {String} anchorX Accepts "left", "center", or "right".
* 	Is "left" by default.
* @param {String} anchorY Accepts "top", "center", or "bottom".
* 	Is "top" by default.
*/
CanvasRenderingContext2D.prototype.drawImg = function(img, x, y, anchorX, anchorY) {
  var imgX,
      imgY;
  switch (anchorX) {
    case undefined:
      imgX = x; break;
    case "left":
      imgX = x; break;
    case "center":
      imgX = x - img.width / 2; break;
    case "right":
      imgX = x - img.width; break;
    default:
      throw new Error("anchorX was not acceptable.");
  }
  switch (anchorY) {
    case undefined:
      imgY = y; break;
    case "top":
      imgY = y; break;
    case "center":
      imgY = y - img.height / 2; break;
    case "bottom":
      imgY = y - img.height; break;
    default:
      throw new Error("anchorY was not acceptable.");
  }

  this.drawImage(img, imgX, imgY);
};
