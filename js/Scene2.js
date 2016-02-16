"use strict";
SURVEYOR.Scene2 = function() {
	var self = this,
			canvas = document.getElementById("scene2-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = SURVEYOR.viewportWidth / 2,
			mouseY = SURVEYOR.viewportHeight / 2,
			x = mouseX,
			y = mouseY,
			fire1Frames = new Array(173),
			fire2Frames = new Array(173),
			jarFrames = new Array(111), i;
	for (i = 0; i < 173; i++)
		fire1Frames[i] =
			new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png", i * 33.333);

	for (i = 87; i < 173; i++)
		fire2Frames[i-87] =
			new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png", (i - 87) * 33.333);

	for (i = 0; i < 87; i++) {
		fire2Frames[i+86] =
			new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png", (i + 86) * 33.333);
	}
	for (i = 0; i < 111; i++) {
		jarFrames[i] =
			new SURVEYOR.Sprite.Frame(DIR + "2jarfirefly-ss.png", i * 33.333, i * 122, 0, 122, 109);
	}
	var FIRE1_SPRITE = new SURVEYOR.Sprite(1235, "0.61", {frames: fire1Frames, length: 173*33.333,
																							 depth: 70}),
			FIRE2_SPRITE = new SURVEYOR.Sprite(1235, "0.61", {frames: fire2Frames, length: 173*33.333,
																							 depth: 70, name: "fire"}),
			FIRE1_INDEX = 7,
			FIRE2_INDEX = 8,
			FIREFLIES_INDEX = 9,
			JAR_INDEX = 10,
			sprites = [new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2mountains.png",
																					 depth: 10000}),
								 new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2trees2.png", depth: 150}),
								 new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2trees1.png", depth: 90}),
								 new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2bank.png", depth: 70}),
								 new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2onbank.png", depth: 70}),
								 new SURVEYOR.Sprite(822, "0.78", {imgSrc: DIR + "2radio.png", depth: 70,
																					name: "radio"}),
								 new SURVEYOR.Sprite(1615, "0.64", {imgSrc: DIR + "2noah.png", depth: 70,
																					 name: "noah"}),
								 null,
								 null,
								 new SURVEYOR.Sprite(1775, "0.785", {frames: jarFrames, depth: 70,
																					 length: 110 * 33.333, scale: 0.667}),
								 new SURVEYOR.Sprite(1820, "0.79", {imgSrc: DIR + "2jar.png", depth: 70,
																					 name: "jar"}),
								 new SURVEYOR.Sprite("0.5", "0.5", {imgSrc: DIR + "2overhang.png", depth: 5})],
			FIREFLIES_AFTER_SPRITE = new SURVEYOR.Sprite(1750, "0.66", {frames: jarFrames, depth: 70,
																												 length: 110 * 33.333}),
			interactiveSpriteIndices = [5, 6, JAR_INDEX];

	/** Ticks everything. */
	this.tick = function() {
		if (SURVEYOR.isVisible[2]) {
			var difference = mouseX - x,
					i,
					len = sprites.length;
			if (Math.abs(difference) >= 1) {
				x += difference / 4;
				x = ~~(x + 0.5);
			}
			ctx.clearRect(0, 0, SURVEYOR.viewportWidth, SURVEYOR.viewportHeight);

			for (i = 0; i < len; i++)
				this.renderSprite(sprites[i]);
		}
	};

	/** Renders a sprite onto the canvas. */
	this.renderSprite = function(spr) {
		if (spr !== null) {
			var img, sx, sy, swidth, sheight;
			ctx.scale(SURVEYOR.hScaleFactor, SURVEYOR.hScaleFactor);

			if (spr.img !== undefined)
				img = spr.img;
			else if (spr.frames !== undefined) {
				var frame = spr.getFrame(SURVEYOR.timeElapsed);
				img = frame.img;
				if (frame.isClipped) {
					sx = frame.sx;
					sy = frame.sy;
					swidth = frame.swidth;
					sheight = frame.sheight;
				}
			}

			if (img === undefined) {
				ctx.scale(1 / SURVEYOR.hScaleFactor, 1 / SURVEYOR.hScaleFactor);
				throw new TypeError("Sprite must have an image or frames.");
			}

			if (spr.depth !== undefined) {
				var imgX = (typeof spr.x === "string" ? 
										parseFloat(spr.x) * SURVEYOR.viewportWidth :
										SURVEYOR.viewportWidth / 2 + (spr.x - 1250) * SURVEYOR.hScaleFactor),
						imgY = (typeof spr.y === "string" ?
										parseFloat(spr.y) * SURVEYOR.viewportHeight :
										spr.y * SURVEYOR.hScaleFactor);

				if (sx === undefined) {
					ctx.drawImage(img,
												~~((imgX + 800 * (SURVEYOR.viewportWidth/2 - x) /
														(spr.depth * SURVEYOR.viewportWidth)) /
													 SURVEYOR.hScaleFactor - img.width / 2),
												~~(imgY / SURVEYOR.hScaleFactor - img.height / 2),
												img.width * spr.scale, img.height * spr.scale);
				} else {
					ctx.drawImage(img, sx, sy, swidth, sheight,
												~~((imgX + 800 * (SURVEYOR.viewportWidth/2 - x) /
														(spr.depth * SURVEYOR.viewportWidth)) /
													 SURVEYOR.hScaleFactor - swidth / 2),
												~~(imgY / SURVEYOR.hScaleFactor - sheight / 2),
												swidth * spr.scale, sheight * spr.scale);
				}
			} else {
				ctx.scale(1 / SURVEYOR.hScaleFactor, 1 / SURVEYOR.hScaleFactor);
				throw new TypeError("Sprite must have parallax fields be defined.");
			}

			ctx.scale(1 / SURVEYOR.hScaleFactor, 1 / SURVEYOR.hScaleFactor);
		}
	};

	/** Changes scene to night time and lights the fire. */
	this.changeToNight = function() {
		SURVEYOR.DialogManager.setOverlay(2, '#000000',
														 {duration: 400, opacity: 1, callback: function() {
			sprites[FIRE1_INDEX] = FIRE1_SPRITE;
			sprites[FIRE2_INDEX] = FIRE2_SPRITE;
			interactiveSpriteIndices.push(FIRE2_INDEX);
		}});
		SURVEYOR.DialogManager.setOverlay(2, '#020204', {opacity: 0, duration: 400});
		$("#scene2").animate({backgroundColor: "#000000"}, 12000, "linear");
		SURVEYOR.DialogManager.setOverlay(2, '#020204', {opacity: 0.6, duration: 12000});
	};

	/** Change scene to reflect jar opening state. */
	this.openJar = function() {
		SURVEYOR.DialogManager.setOverlay(2, '#000000',
														 {duration: 400, opacity: 1, callback: function() {
			sprites[FIREFLIES_INDEX] = FIREFLIES_AFTER_SPRITE;
		}});
		SURVEYOR.DialogManager.setOverlay(2, '#020204', {opacity: 0, duration: 400});
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
		mouseY -= SURVEYOR.viewportHeight;
		if (self.checkClicked(mouseX, mouseY) !== null)
			document.body.style.cursor = "pointer";
		else
			document.body.style.cursor = "default";
	};

	/** Handles clicks on the canvas. */
	this.handleClick = function(e) {
		var clickX = e.pageX,
				clickY = e.pageY - SURVEYOR.viewportHeight,
				i;
		console.log("click@", clickX + ",", clickY + ", return:", self.checkClicked(clickX, clickY));
		switch (self.checkClicked(clickX, clickY)) {
			case "radio":
				SURVEYOR.DialogManager.displayDialog(2, "radio");
				break;
			case "noah":
				SURVEYOR.DialogManager.displayDialog(2, "noah");
				break;
			case "jar":
				SURVEYOR.DialogManager.displayDialog(2, "jar");
				break;
			case "fire":
				SURVEYOR.DialogManager.displayDialog(2, "fire");
				break;
		} 
	};

	/** Checks to see if user's MouseEvent is over a sprite.
	* Returns name of element hit if the element has a name, otherwise returns null. */
	this.checkClicked = function(x, y) {
		for (i = 0; i < interactiveSpriteIndices.length; i++) {
			var spr = sprites[interactiveSpriteIndices[i]],
					img = spr.img || spr.getFrame(0).img,
					imgX = (typeof spr.x === "string" ? 
									parseFloat(spr.x) * SURVEYOR.viewportWidth :
									SURVEYOR.viewportWidth / 2 + (spr.x - 1250) * SURVEYOR.hScaleFactor),
					imgY = (typeof spr.y === "string" ?
									parseFloat(spr.y) * SURVEYOR.viewportHeight :
									spr.y * SURVEYOR.hScaleFactor);

			if (spr.name !== undefined &&
					x > (imgX + 800 * (SURVEYOR.viewportWidth/2 - x) /
							 (spr.depth * SURVEYOR.viewportWidth)) - img.width * SURVEYOR.hScaleFactor / 2 &&
					x < (imgX + 800 * (SURVEYOR.viewportWidth/2 - x) /
							 (spr.depth * SURVEYOR.viewportWidth)) + img.width * SURVEYOR.hScaleFactor / 2 &&
					y > spr.y * SURVEYOR.viewportHeight - img.height * SURVEYOR.hScaleFactor / 2 &&
					y < spr.y * SURVEYOR.viewportHeight + img.height * SURVEYOR.hScaleFactor / 2 &&
					$('.dialog:hover').length === 0) {
				return spr.name;
			}
		}
		return null;
	};

	/** Handles window resizing (and basically anything else which requires
	* 	redrawing) */
	this.forceRedraw = function() {
		ctx.canvas.width = SURVEYOR.viewportWidth;
		ctx.canvas.height = SURVEYOR.viewportHeight;
	};

	this.init = function() {
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		this.forceRedraw();
		document.getElementById("scene2")
			.addEventListener("mousemove", this.handleMouse, false);
		document.getElementById("scene2")
			.addEventListener("click", this.handleClick, false);
	};

};