/*jslint plusplus: true*/
/*jshint latedef: nofunc*/
/*jshint strict: false*/
/*jshint -W117 */

var viewportWidth = viewport().width,
		viewportHeight = viewport().height,
		scaleFactor = viewportWidth / 2000,
		START_TIME = new Date().getTime(),
		timeElapsed = 0,
		DIR = "assets/";

/**   ---------------------------   STRIP 1   ---------------------------
			----------------------       fireflies       ----------------------   */
function Strip1() {
	var canvas = document.getElementById("strip1-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = viewportWidth / 2,
			mouseY = viewportHeight / 2,
			x = mouseX, y = mouseY, i,
			selfSize = 175,
			dSelfSize = 1.5,
			SELF_MAX_SIZE = 210,
			SELF_MIN_SIZE = 125,
			CIRCLE_RADIUS = 1.5,
			FFLY_ANG_SPEED = 1,
			FFLY_MAX_SIZE = 140,
			FFLY_MIN_SIZE = 60,
			starsImg = new Image();
	starsImg.src = DIR + "stars.gif";
	var starsRotation = 0,
			STARS_ROTATION_SPEED = 0.0002,
			fireflies = [new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 105, 60),
									 new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 140, 120),
									 new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 60, 180),
									 new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 90, 240),
									 new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 75, 300),
									 new Firefly((viewportWidth - 16) * Math.random() + 8,
															 (viewportHeight - 16) * Math.random() + 8, 130, 0)],
			reed1Frames = [],
			streetsFrames = [];
	for (i = 1; i < 41; i++) {
		streetsFrames.push(new Frame(DIR + "cars_00" + (40 - i).toString() +
																 "_Layer-" + i.toString() + ".png",
																 (i - 1) * 33.33));
	}
	for (i = 0; i <= 37; i++) {
		reed1Frames.push(new Frame("reed/" + "reed1" + i + ".png", i * 33.33));
	}
	var bgSprites =	[new Sprite(0, 0, {imgSrc: DIR + "rocks.png",
																		 blendmode: "destination-over"}),
									 new Sprite(0, 0, {imgSrc: DIR + "streetlights.png",
																		 blendmode: "destination-over"}),
									 new Sprite(0, 0, {frames: streetsFrames,
																		 length: 5200,
																		 blendmode: "destination-over"})],
			lightedSprites = [new Sprite(0, 0, {imgSrc: DIR + "lighted.png",
																					shadowImgSrc: DIR + "lighted-shadow.png"})],
			fgSprites = [new Sprite(0, 0, {frames: reed1Frames, length: 37 * 33.33})];

	/** Animates everything and deals with logic.
	*		Pauses when entire element is offscreen. */
	this.tick = function() {
		if (isVisible(1)) {
			ctx.clearRect(0, 0, viewportWidth, viewportHeight);

			var i;
			for (i = 0; i < fireflies.length; i++)
				this.renderFirefly(fireflies[i]);
			this.renderSelf();

			for (i = 0; i < lightedSprites.length; i++)
				this.renderSprite(lightedSprites[i]);
			for (i = 0; i < bgSprites.length; i++)
				this.renderSprite(bgSprites[i]);

			ctx.save();
			ctx.globalCompositeOperation = "destination-over";
			var skyGradient = ctx.createLinearGradient(0, 0, 0, viewportHeight);
			skyGradient.addColorStop(0, "transparent");
			skyGradient.addColorStop(1, "rgba(203, 170, 237, 0.8)");
			ctx.fillStyle = skyGradient;
			ctx.fillRect(0, 0, viewportWidth, viewportHeight);

			ctx.translate(viewportWidth / 2, viewportHeight / 2);
			ctx.rotate(starsRotation);
			ctx.drawImage(starsImg, -viewportWidth * 1.5, -viewportHeight * 1.5,
										viewportWidth * 3, viewportHeight * 3);
			starsRotation += STARS_ROTATION_SPEED;
			ctx.restore();

			for (i = 0; i < fireflies.length; i++) {
				this.renderFirefly(fireflies[i]);
				this.tickFirefly(fireflies[i]);
			}
			this.renderSelf();
			this.tickSelf();

			for (i = 0; i < fgSprites.length; i++)
				this.renderSprite(fgSprites[i]);
		}
	};

	/** Renders you, the lead firefly. */
	this.renderSelf = function() {
		ctx.save();
		var fireflyImg = ctx.createRadialGradient(x, y, 0, x, y, selfSize / 2);
		fireflyImg.addColorStop(0, "rgb(204, 204, 160)");
		fireflyImg.addColorStop(0.1, "rgba(77, 77, 68, 0.5)");
		fireflyImg.addColorStop(0.33, "rgba(66, 66, 66, 0.3)");
		fireflyImg.addColorStop(1, "transparent");
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = fireflyImg;
		ctx.fillRect(x - selfSize / 2, y - selfSize / 2, selfSize, selfSize);
		ctx.restore();
	};

	/** Ticks you, the lead firefly. */
	this.tickSelf = function() {
		if (Math.abs(mouseX - x) > 1 || Math.abs(mouseY - y) > 1) {
			var difference = mouseX - x,
					displacement = difference / 8;
			x += displacement;
			difference = mouseY - y;
			displacement = difference / 8;
			y += displacement;
		}

		if (selfSize > SELF_MAX_SIZE || selfSize < SELF_MIN_SIZE)
			dSelfSize *= -1;
		selfSize += dSelfSize;
	};

	/** Renders a firefly onto the canvas. */
	this.renderFirefly = function(ffly) {
		ctx.save();
		var fireflyImg =
				ctx.createRadialGradient(ffly.x, ffly.y, 0, ffly.x, ffly.y, ffly.size/2);
		fireflyImg.addColorStop(0, "rgb(153, 153, 153)");
		fireflyImg.addColorStop(0.1, "rgba(61, 61, 61, 0.5)");
		fireflyImg.addColorStop(0.33, "rgba(40, 40, 40, 0.3)");
		fireflyImg.addColorStop(1, "transparent");
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = fireflyImg;
		ctx.fillRect(ffly.x - ffly.size/2, ffly.y - ffly.size/2,
								 ffly.size, ffly.size);
		ctx.restore();
	};

	/** Calculates next position of an npc firefly. */
	this.tickFirefly = function(ffly) {
		var differenceX = x - ffly.x,
				differenceY = y - ffly.y,
				absDifferenceX = Math.abs(differenceX),
				absDifferenceY = Math.abs(differenceY);

		if (ffly.size > FFLY_MAX_SIZE || ffly.size < FFLY_MIN_SIZE)
			ffly.dsize *= -1;
		ffly.size += ffly.dsize;

		if (absDifferenceX < 60 && absDifferenceY < 60)
			ffly.follow = true;
		else if (absDifferenceX > 90 || absDifferenceY > 90)
			ffly.follow = false;

		if (ffly.follow) {
			if (absDifferenceX > 8 || absDifferenceY > 8) {
				var displacement = differenceX / 14;
				if (displacement > 10)
					displacement = 10;
				ffly.x += displacement;
				displacement = differenceY / 14;
				if (displacement > 10)
					displacement = 10;
				ffly.y += displacement;
			}
		}
		ffly.angle += FFLY_ANG_SPEED * Math.PI / 180;
		ffly.x += CIRCLE_RADIUS * Math.cos(ffly.angle);
		ffly.y += CIRCLE_RADIUS * Math.sin(ffly.angle);

		if (ffly.x > viewportWidth)
			ffly.x = viewportWidth;
		else if (ffly.x < 0)
			ffly.x = 0;
		if (ffly.y > viewportHeight)
			ffly.y = viewportHeight;
		else if (ffly.y < 0)
			ffly.y = 0;
	};

	/** Renders an sprite onto the canvas. */
	this.renderSprite = function(spr) {
		if (spr.img !== undefined) {
			ctx.save();
			ctx.scale(scaleFactor, scaleFactor);
			if (spr.shadow !== undefined) { //TODO
				ctx.globalCompositeOperation = "source-atop";
				ctx.drawImage(spr.img, 2000 - spr.img.width - spr.x,
											2000*viewportHeight/viewportWidth - spr.img.height - spr.y);
				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(spr.shadow, 2000 - spr.img.width - spr.x,
											2000*viewportHeight/viewportWidth - spr.img.height - spr.y);
			} else {
				ctx.globalCompositeOperation = spr.blendmode;
				ctx.drawImage(spr.img, 2000 - spr.img.width - spr.x,
											2000*viewportHeight/viewportWidth - spr.img.height - spr.y);
			}
			ctx.restore();
		} else if (spr.frames !== undefined) {
			ctx.save();
			ctx.scale(scaleFactor, scaleFactor);
			ctx.globalCompositeOperation = spr.blendmode;
			var img = spr.getFrame(timeElapsed).img;
			ctx.drawImage(img, 2000 - img.width - spr.x,
										2000*viewportHeight/viewportWidth - img.height - spr.y);
			ctx.restore();
		} else
			throw new TypeError("A sprite in the scene must be regular, lighted, or animated.");
	};

	/** Updates the mouse coordinates	*/
	this.handleMouse = function(e) {
		if (e.pageX !== undefined && e.pageY !== undefined) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		} else {
			mouseX = e.clientX +
				document.body.scrollLeft + document.documentElement.scrollLeft;
			mouseY = e.clientY +
				document.body.scrollTop + document.documentElement.scrollTop;
		}
		mouseX -= canvas.offsetLeft;
		mouseY -= canvas.offsetTop;
	};

	/** Handles window resizing (and basically anything else which requires
	* 	redrawing) */
	this.forceRedraw = function() {
		ctx.canvas.width = viewportWidth;
		ctx.canvas.height = viewportHeight;
	};

	this.init = function() {
		this.forceRedraw();
		document.getElementById("strip1")
			.addEventListener("mousemove", strip1.handleMouse, false);
	};
}

/**   ---------------------------   STRIP 2   ---------------------------
			----------------------         woods         ----------------------   */
function Strip2() {
	var canvas = document.getElementById("strip2-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = viewportWidth / 2,
			x = mouseX,
			animFrames = [new Frame(DIR + "test1.png", 0), new Frame(DIR + "test2.png", 500),
									 new Frame(DIR + "test3.png", 1000), new Frame(DIR + "test4.png", 1500)],
			sprites = [new Sprite(0.3, 420, {imgSrc: DIR + "test2.png", depth:100}),
								 new Sprite(0.59, 98, {imgSrc: DIR + "test3.png", depth:50}),
								 new Sprite(0.66, 281, {frames: animFrames, length: 2000, depth: 28}),
								 new Sprite(0.1, 10, {imgSrc: DIR + "test1.png", depth:25}),
								 new Sprite(0.9, 600, {imgSrc: DIR + "test3.png", depth:20}),
								 new Sprite(0.42, 105, {imgSrc: DIR + "test4.png", depth:10}),
								 new Sprite(0.81, 580, {imgSrc: DIR + "test1.png", depth:5}),
								 new Sprite(0.5, 230, {imgSrc: DIR + "test2.png", depth:1})];

	/** Ticks everything. */
	this.tick = function() {
		if (isVisible(2)) {
			var difference = mouseX - x,
					i;
			if (Math.abs(difference) > 1) {
				x += difference / 4;
				x = ~~(x + 0.5);
			}
			ctx.clearRect(0, 0, viewportWidth, viewportHeight);

			for (i = 0; i < sprites.length; i++)
				this.renderSprite(sprites[i]);
		}
	};

	/** Renders a sprite onto the canvas. */
	this.renderSprite = function(spr) {
		var img;
		if (spr.img !== undefined)
			img = spr.img;
		else if (spr.frames !== undefined) {
			img = spr.getFrame(timeElapsed).img;
		}

		if (img === undefined)
			throw new TypeError("Sprite must have an image or frames.");

		if (spr.depth !== undefined) {
			ctx.drawImage(img, spr.x * viewportWidth + (viewportWidth/2 - x) / spr.depth, spr.y);
		} else
			throw new TypeError("Sprite must have parallax fields be defined.");
	};

	/** Updates mouseX based on mouse movement. */
	this.handleMouse = function(e) {
		if (e.pageX !== undefined && e.pageY !== undefined) {
			mouseX = e.pageX;
		} else {
			mouseX = e.clientX +
				document.body.scrollLeft + document.documentElement.scrollLeft;
		}
		mouseX -= canvas.offsetLeft;
	};

	/** Handles window resizing (and basically anything else which requires
	* 	redrawing) */
	this.forceRedraw = function() {
		ctx.canvas.width = viewportWidth;
		ctx.canvas.height = viewportHeight;
	};

	this.init = function() {
		this.forceRedraw();
		document.getElementById("strip2")
			.addEventListener("mousemove", strip2.handleMouse, false);
	};

}

/**   ---------------------------   STRIP 3   ---------------------------
			----------------------      journeyman       ----------------------   */
function Strip3() {
	var canvas = document.getElementById("strip3-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = viewportWidth / 2,
			mouseY = viewportHeight / 2,
			journeyman = {
				x: 0,
				dx: 2,
				sprite: new Sprite(0, 0, {imgSrc: DIR + "test2.png"}),
				render: function() {
					ctx.drawImage(this.sprite.img, (viewportWidth - this.sprite.img.width) / 2 ,
												viewportHeight / 2);
				}
			},
			dog = {
				sprite: new Sprite(0, 0, {imgSrc: DIR + "test1.png"}),
				render: function() {
					ctx.drawImage(this.sprite.img, (viewportWidth - this.sprite.img.width) / 2,
												viewportHeight / 2);
				}
			},
			bgSprites = [new Sprite(30, 95, {imgSrc: DIR + "test4.png"}),
									new Sprite(100, 95, {imgSrc: DIR + "test3.png"}),
									new Sprite(160, 95, {imgSrc: DIR + "test2.png"}),
									new Sprite(220, 95, {imgSrc: DIR + "test1.png"}),
									new Sprite(320, 95, {imgSrc: DIR + "test4.png"}),
									new Sprite(440, 95, {imgSrc: DIR + "test3.png"}),
									new Sprite(500, 95, {imgSrc: DIR + "test2.png"}),
									new Sprite(710, 95, {imgSrc: DIR + "test1.png"}),
									new Sprite(900, 95, {imgSrc: DIR + "test3.png"}),
									new Sprite(999, 95, {imgSrc: DIR + "test2.png"})],
			sceneWidth = 1000,
			sprites = [];

	/** Ticks everything. */
	this.tick = function() {
		if (isVisible(3)) {
			ctx.clearRect(0, 0, viewportWidth, viewportHeight);

			if (mouseX < viewportWidth / 2) {
				if (journeyman.dx > 0) {
					journeyman.dx *= -1;
				}
			} else {
				if (journeyman.dx < 0) {
					journeyman.dx *= -1;
				}
			}

			journeyman.x += journeyman.dx;
			if (journeyman.x > 0) {
				journeyman.x %= sceneWidth;
			} else {
				journeyman.x += sceneWidth;
			}

			this.render();
		}
	};

	/** Renders all items. */
	this.render = function() {
		var i;
		for (i = 0; i < bgSprites.length; i++)
			this.renderSprite(bgSprites[i]);
		journeyman.render();
		dog.render();
	}

	/** Renders a sprite onto the canvas.
	* @param {Sprite} spr The sprite you want to render. */
	this.renderSprite = function(spr) {
		if (spr.img !== undefined) {
			if (journeyman.x - 300 < spr.x && spr.x < journeyman.x + 1200) {
				ctx.drawImage(spr.img, spr.x - journeyman.x, spr.y);
			}
			if (journeyman.x - 300 < spr.x + sceneWidth
								 && spr.x + sceneWidth < journeyman.x + 1200) {
				ctx.drawImage(spr.img, spr.x + sceneWidth - journeyman.x, spr.y);
			}
			if (journeyman.x - 300 < spr.x + sceneWidth
								 && spr.x - sceneWidth < journeyman.x) {
				ctx.drawImage(spr.img, spr.x - sceneWidth - journeyman.x, spr.y);
			}
		}
	};

	/** Updates mouseX based on mouse movement. */
	this.handleMouse = function(e) {
		if (e.pageX !== undefined && e.pageY !== undefined) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		} else {
			mouseX = e.clientX +
				document.body.scrollLeft + document.documentElement.scrollLeft;
			mouseY = e.clientY +
				document.body.scrollTop + document.documentElement.scrollTop;
		}
		mouseX -= canvas.offsetLeft;
		mouseY -= canvas.offsetTop;
	};

	/** Handles window resizing (and basically anything else which requires
	* 	redrawing) */
	this.forceRedraw = function() {
		ctx.canvas.width = viewportWidth;
		ctx.canvas.height = viewportHeight;

		journeyman.sprite.x = viewportWidth / 2;
		journeyman.sprite.y = viewportHeight / 2;
		dog.sprite.x = viewportWidth / 2;
		dog.sprite.y = viewportHeight / 2;
	};

	this.init = function() {
		this.forceRedraw();
		document.getElementById("strip3")
			.addEventListener("mousemove", strip3.handleMouse, false);
	};

}

/**
* A sprite to be drawn, with a variety of effects. Allows four types of
*		non-mutually exclusive behaviour: normal, lighted, animated, parallax.
* @param {Num} x The x position, from a point of origin.
* @param {Num} y The y position, from a point of origin.
* @param {Object} options An object, with any of the following fields:
*		imgSrc: {String} Source location of the image.
*		shadowImgSrc: {String} Source location of the image in shadow.
* 	blendmode: {String} Blendmode to use for rendering.
*			"normal" if unspecified. Not used for lighted sprites.
*		frames: {Array<Frame>} An ORDERED array of the animation's frames. Requires
*			length to be defined.
* 	length: {Num} Total duration of the animation before it loops.
*		depth: {Num} Depth of the object, used for parallax.
*/
function Sprite(x, y, options) {
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
	this.frames = options.frames;
	this.length = options.length;
	this.depth = options.depth;
	this.blendmode = options.blendmode === undefined ? "normal" : options.blendmode;

	/** Gets the frame at the time specified. */
	this.getFrame = function(time) {
		if (this.frames !== undefined && this.length !== undefined) {
			time %= this.length;
			var previous = this.frames[0],
					i;
			for (i = 0; i < this.frames.length; i++) {
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
}

/**
* A frame, to be used in an AnimSprite.
* @param {String} imgSrc The source for the frame.
* @param {Int} timestamp The time at which the animation switch to the frame.
*/
function Frame(imgSrc, timestamp) {
	var img = new Image();
	img.src = imgSrc;
	this.img = img;
	this.timestamp = timestamp;
}

/** An npc firefly. */
function Firefly(x, y, size, angle) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.dsize = Math.random() < 0.5 ? -1 : 1;
	this.angle = angle * Math.PI / 180;
	this.follow = false;
}


/** Calculates viewport size */
function viewport() {
	var strip = $("#strip1");
	var height = strip.height();
	var width = strip.width();
	return {
		width: width,
		height: height
	};
}

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

/** Resizes all the strips mainly. Calls forceRedraw() on each strip. */
function forceRedraw() {
	viewportWidth = viewport().width;
	viewportHeight = viewport().height;
	scaleFactor = viewportWidth / 2000;
	strip1.forceRedraw();
	strip2.forceRedraw();
	strip3.forceRedraw();
	//TODO: call forceRedraw() on all strips
}

/** Initialization code */
var strip1 = new Strip1(),
		strip2 = new Strip2(),
		strip3 = new Strip3();
strip1.init();
strip2.init();
strip3.init();
/* strip4.init(); */
//TODO: call init() on all strips
window.addEventListener("resize", forceRedraw, false);

function tickAll() {
	setTimeout(function() {
		window.requestAnimFrame(tickAll);
		timeElapsed = new Date().getTime() - START_TIME;
		strip1.tick();
		strip2.tick();
		strip3.tick();
		//TODO: call tick() on all strips
	}, 1000 / 30);
}
tickAll();

// TODO: remove in final code
function debug() {
	setInterval(function() {
		var str = "";
		/* if($('#strip1-fg').visible(true))
			str += "1f ";
		if($("#strip1").visible(true))
			str += "1 ";
		if($("#strip2-fg").visible(true))
			str += "2f ";
		if($("#strip2").visible(true))
			str += "2 ";
		if($("#strip3-fg").visible(true))
			str += "3f ";
		if($("#strip3").visible(true))
			str += "3 ";
		if($("#strip4-fg").visible(true))
			str += "4f ";
		if($("#strip4").visible(true))
			str += "4 ";
		if($('#title').visible(true))
			str += "t "; */

		if(isVisible(1))
			str += "1 ";
		if(isVisible(2))
			str += "2 ";
		if(isVisible(3))
			str += "3 ";
		if(isVisible(4))
			str += "4 ";
		console.log("VISIBLE: " + str);
		//console.log("VW: " + viewportWidth + " VH: " + viewportHeight);
	}, 1000);
}
debug();

/**
* Determine if a certain strip is visible in the viewport and should be ticked.
* @param {Int} Strip # to be evaluated. First strip is 1.
*/
function isVisible(strip) {
	var scroll = (document.documentElement && document.documentElement.scrollTop)
								|| document.body.scrollTop,
			stripHeight = viewport().height,
			values = [false, false, false, false, false];

	if (scroll === 0)
		values[0] = true;
	else if (scroll < stripHeight)
		values[0] = values[1] = true;
	else if (scroll === stripHeight)
		values[1] = true;
	else if (scroll < 2 * stripHeight)
		values[1] = values[2] = true;
	else if (scroll === 2 * stripHeight)
		values[2] = true;
	else if (scroll < 3 * stripHeight)
		values[2] = values[3] = true;
	else if (scroll >= 3 * stripHeight)
		values[3] = true;

	return values[strip - 1];
}

/**
* Pads a number
*/
function zeroPad(number, size) {
	number = number.toString();
	while (number.length < size) number = "0" + number;
	return number;
}

