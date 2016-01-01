/**
* A sprite to be drawn, with (or without) lighting effects.
* @param imgSrc String containing the source location of the image.
* @param shadowImgSrc String containing the source location of the image
* 	in shadow. Set to null if not needed.
* @param x The x position, from the right.
* @param y The y position, from the bottom.
* @param blendmode String containing the blendmode to use for rendering.
*		Not required for lighted sprites or sprites with "normal" blending.
*/
function ImgSprite(imgSrc, shadowImgSrc, x, y, blendmode) {
	var img = new Image();
	img.src = imgSrc;
	this.img = img;
	if (shadowImgSrc !== null) {
		var shadowImg = new Image();
		shadowImg.src = shadowImgSrc;
		this.shadow = shadowImg;
	} else
		this.shadow = null;
	this.x = x;
	this.y = y;
	this.blendmode = blendmode;
}

/**
* An animated sprite.
* @param {Array<Frame>} frames An ORDERED array of the animation's frames.
* @param {Int} length Total duration of the animation before it loops.
*/
function AnimSprite(frames, length, posX, posY) {
	this.frames = frames;
	this.length = length;
	this.x = posX;
	this.y = posY;
	/**
	* Gets the frame at the time specified.
	*/
	this.getFrame = function(time) {
		time %= this.length;
		var previous = this.frames[0],
				i;
		for (i=0; i < this.frames.length; i++) {
			var frame = this.frames[i];
			if (time > frame.timestamp)
				previous = frame;
			else if (time === frame.timestamp)
				return frame;
			else
				break;
		}
		return previous;
	};
}

/**
* A sprite with parallax.
* @param {String} imgSrc The source of the image.
* @param {Num} x The x-pos when camera is centred.
* @param {Num} y The y-pos when camera is centred.
* @param {Num} depth The depth of the sprect. More depth indicates less movement.
*/
function ParallaxSprite(imgSrc, x, y, depth) {
	this.x = x;
	this.y = y;
	this.depth = depth;
	var img = new Image();
	img.src = imgSrc;
	this.img = img;
}
