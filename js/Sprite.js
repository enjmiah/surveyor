"use strict";
/**
* A sprite to be drawn, with a variety of effects. Allows four types of
*		non-mutually exclusive behaviour: normal, lighted, animated, parallax.
*   NOTE: Not all parameters are implemented in all scenes. Implementation is
*		completely scene-dependent, usually in the renderSprite method.
* @param {(number|string)} x The x position, from a point of origin. In most
*   scenes you can use a string of a number ("0" : 0%; "1" : 100%) for
*   positioning relative to SURVEYOR.viewportWidth.
* @param {(number|string)} y The y position, from a point of origin. In most
*   scenes you can use a string of a number ("0" : 0%; "1" : 100%) for
*   positioning relative to SURVEYOR.viewportHeight.
* @param {Object} options An object, with any of the below fields.
* @param {string} options.name A name, useful for identifying a sprite.
*	@param {string} options.imgSrc  Source location of the image.
*	@param {string} options.shadowImgSrc  Source location of the image in shadow.
* @param {string="normal"} options.blendmode Blendmode to use for rendering.
*		"normal" if unspecified. Not used for lighted sprites.
*	@param {Array.<Frame>} options.frames An ORDERED array of the animation's
*		frames. Requires length to be defined.
* @param {number} options.length Total duration of the animation before it loops.
*	@param {number} options.depth Depth of the object, used for parallax.
* @param {number=1} options.scale Scale factor to multiply by.
* @param {number} options.sx x-coordinate to start clipping. Useful for
*		spritesheets, overrides frames' clipping options if defined.
* @param {number} options.sy y-coordinate to start clipping.
* @param {number} options.swidth Width of clipped image.
* @param {number} options.sheight Height of clipped image.
* @throws {TypeError} if it seems like you want an animated Sprite but didn't
*		define all the necessary fields
*/
SURVEYOR.Sprite = function(x, y, options) {
  this.x = x;
  this.y = y;
  var img;
  if (options.imgSrc !== undefined) {
    img = new Image();
    img.src = options.imgSrc;
    this.img = img;
  }
  if (options.shadowImgSrc !== undefined) {
    img = new Image();
    img.src = options.shadowImgSrc;
    this.shadow = img;
  }
  this.name = options.name;
  this.frames = options.frames;
  this.length = options.length;
  this.depth = options.depth;
  this.blendmode = options.blendmode || "normal";
  this.scale = options.scale || 1;
  this.sx = options.sx;
  this.sy = options.sy;
  this.swidth = options.swidth;
  this.sheight = options.sheight;
  if (this.frames !== undefined && this.length === undefined)
    throw new TypeError("Define a duration for the animation!");
};
/**
* Gets the frame at the time specified.
* @param {number} time
* @returns {Frame} Returns the frame that should be displayed at the given time.
*		Returns null if Sprite is not a valid animated Sprite.
*/
SURVEYOR.Sprite.prototype.getFrame = function(time) {
  if (this.frames !== undefined && this.length !== undefined) {
    time %= this.length;
    var previous = this.frames[0],
        i,
        len = this.frames.length;
    for (i = 0; i < len; i++) {
      var frame = this.frames[i];
      if (time > frame.timestamp)
        previous = frame;
      else if (time === frame.timestamp)
        return frame;
      else
        break;
    }
    return previous;
  } else
    return null;
};


/**
* A frame, to be used in an AnimSprite.
* @param {string} imgSrc The source for the frame.
* @param {number} timestamp The time at which the animation switch to the frame.
* @param {number} [sx] x-coordinate to start clipping. Useful for spritesheets.
* @param {number} [sy] y-coordinate to start clipping.
* @param {number} [swidth] Width of clipped image.
* @param {number} [sheight] Height of clipped image.
*/
SURVEYOR.Sprite.Frame = function(imgSrc, timestamp, sx, sy, swidth, sheight) {
  var img = new Image();
  img.src = imgSrc;
  this.img = img;
  this.isClipped = sx !== undefined;
  if (this.isClipped) {
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
  }
  this.timestamp = timestamp;
};
