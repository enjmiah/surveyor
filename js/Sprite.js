"use strict";
/**
* A sprite to be drawn, with a variety of effects. Allows four types of
*		non-mutually exclusive behaviour: normal, lighted, animated, parallax.
*   NOTE: Not all parameters are implemented in all scenes. Implementation is
*		completely scene-dependent, usually in the renderSprite method.
* @param {Num | String} x The x position, from a point of origin. In most
*   scenes you can use a string of a number ("0" : 0%; "1" : 100%) for 
*   positioning relative to SURVEYOR.viewportWidth.
* @param {Num | String} y The y position, from a point of origin. In most
*   scenes you can use a string of a number ("0" : 0%; "1" : 100%) for 
*   positioning relative to SURVEYOR.viewportHeight.
* @param {Object} options An object, with any of the following fields:
*		name: {String} A name, useful for identifying a sprite.
*		imgSrc: {String} Source location of the image.
*		shadowImgSrc: {String} Source location of the image in shadow.
* 	blendmode: {String} Blendmode to use for rendering.
*			"normal" if unspecified. Not used for lighted sprites.
*		frames: {Array<Frame>} An ORDERED array of the animation's frames. Requires
*			length to be defined.
* 	length: {Num} Total duration of the animation before it loops.
*		depth: {Num} Depth of the object, used for parallax.
*   scale: {Num} Scale factor to multiply by.
*   sx: {Int} x-coordinate to start clipping. Useful for spritesheets, overrides
*     frames clipping options if defined.
*   sy: {Int} y-coordinate to start clipping.
*   swidth: {Int} Width of clipped image.
*   sheight: {Int} Height of clipped image.
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
/** Gets the frame at the time specified. */
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
* @param {String} imgSrc The source for the frame.
* @param {Int} timestamp The time at which the animation switch to the frame.
* @param {Int} sx Optional. x-coordinate to start clipping. Useful for spritesheets.
* @param {Int} sy Optional. y-coordinate to start clipping.
* @param {Int} swidth Optional. Width of clipped image.
* @param {Int} sheight Optional. Height of clipped image.
*/
SURVEYOR.Sprite.Frame = function(imgSrc, timestamp, sx, sy, swidth, sheight) {
	if (timestamp === undefined)
		throw new TypeError("Define a timestamp for the frame!");

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