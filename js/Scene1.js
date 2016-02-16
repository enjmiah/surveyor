"use strict";
SURVEYOR.Scene1 = function() {
	const SELF_MAX_SIZE = 210,
				SELF_MIN_SIZE = 125,
				CIRCLE_RADIUS = 1.5,
				FFLY_ANG_SPEED = 1,
				FFLY_MAX_SIZE = 140,
				FFLY_MIN_SIZE = 60,
				STARS_ROTATION_SPEED = 0.0002;
	var canvas = document.getElementById("scene1-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = SURVEYOR.viewportWidth / 2,
			mouseY = SURVEYOR.viewportHeight / 2,
			x = mouseX, y = mouseY, i,
			dialogDisplayed = false,
			selfSize = 175,
			dSelfSize = 1.5,
			followers = 0,
			skyGradient = ctx.createLinearGradient(0, 0, 0, SURVEYOR.viewportHeight);
	skyGradient.addColorStop(0, "transparent");
	skyGradient.addColorStop(1, "rgba(203, 170, 237, 0.8)");
	var starsImg = new Image();
	starsImg.src = DIR + "stars.gif";
	var starsRotation = 0,
			fireflies = [
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 105, 60),
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 140, 120),
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 60, 180),
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 90, 240),
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 75, 300),
				new SURVEYOR.Firefly((SURVEYOR.viewportWidth - 16) * Math.random() + 8,
						(SURVEYOR.viewportHeight - 16) * Math.random() + 8, 130, 0)
			],
			reed1Frames = new Array(86),
			reed2Frames = new Array(87),
			carsFrames = new Array(41);
	for (i = 1; i <= 41; i++)
		carsFrames[i-1] = new SURVEYOR.Sprite.Frame(DIR + "cars/cars" + zeroFill(i, 2) + ".gif", i * 33.333);
	for (i = 0; i < 86; i++) {
		reed1Frames[i] = new SURVEYOR.Sprite.Frame(DIR + "reeds/reed1" + zeroFill(i, 2) + ".png", i * 33.333);
		reed2Frames[i] = new SURVEYOR.Sprite.Frame(DIR + "reeds/reed2" + zeroFill(i, 2) + ".png", i * 33.333);
	}
	reed2Frames[86] = new SURVEYOR.Sprite.Frame(DIR + "reeds/reed286.png", 86 * 33.333);
	var bgSprites =	[new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "rocks.png",
																		 blendmode: "destination-over"}),
									 new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "streetlights.png",
																		 blendmode: "destination-over"}),
									 new SURVEYOR.Sprite(0, 0, {frames: carsFrames,
																		 length: 5200,
																		 blendmode: "destination-over"})],
			lightedSprites = [new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "lighted.png",
																					shadowImgSrc: DIR + "lighted-shadow.png"})],
			fgSprites = [new SURVEYOR.Sprite(0, 0, {frames: reed1Frames, length: 86 * 33.333}),
									 new SURVEYOR.Sprite(0, 0, {frames: reed2Frames, length: 87 * 33.333}),
									 new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "grass.png"})];

	/** Animates everything and deals with logic.
	*		Pauses when entire element is offscreen. */
	this.tick = function() {
		if (SURVEYOR.isVisible[1]) {
			ctx.clearRect(0, 0, SURVEYOR.viewportWidth, SURVEYOR.viewportHeight);

			var i,
					len = fireflies.length;
			for (i = 0; i < len; i++)
				this.renderFirefly(fireflies[i]);
			this.renderSelf();

			len = lightedSprites.length;
			for (i = 0; i < len; i++)
				this.renderSprite(lightedSprites[i]);
			len = bgSprites.length;
			for (i = 0; i < len; i++)
				this.renderSprite(bgSprites[i]);

			ctx.globalCompositeOperation = "destination-over";
			ctx.fillStyle = skyGradient;
			ctx.fillRect(0, 0, SURVEYOR.viewportWidth, SURVEYOR.viewportHeight);

			ctx.translate(SURVEYOR.viewportWidth / 2, SURVEYOR.viewportHeight / 2);
			ctx.rotate(starsRotation);
			ctx.drawImage(starsImg, -SURVEYOR.viewportWidth * 1.5, -SURVEYOR.viewportHeight * 1.5,
										SURVEYOR.viewportWidth * 3, SURVEYOR.viewportHeight * 3);
			starsRotation += STARS_ROTATION_SPEED;

			ctx.setTransform(1, 0, 0, 1, 0, 0);

			followers = 0;
			len = fireflies.length;
			for (i = 0; i < len; i++) {
				this.renderFirefly(fireflies[i]);
				this.tickFirefly(fireflies[i]);

				if (fireflies[i].follow)
					followers++;
			}

			this.renderSelf();
			this.tickSelf();

			len = fgSprites.length;
			for (i = 0; i < len; i++)
				this.renderSprite(fgSprites[i]);

			if (followers === 6) {
				if (!dialogDisplayed) {
					dialogDisplayed = true;
					SURVEYOR.DialogManager.displayDialog(1, "dialog1-1");
				}
			} else if (dialogDisplayed) {
				dialogDisplayed = false;
				SURVEYOR.DialogManager.restoreDialog(1);
			}
		}
	};

	/** Renders you, the lead firefly. */
	this.renderSelf = function() {
		var fireflyImg = ctx.createRadialGradient(x, y, 0, x, y, selfSize / 2);
		fireflyImg.addColorStop(0, "rgb(204, 204, 160)");
		fireflyImg.addColorStop(0.1, "rgba(77, 77, 68, 0.5)");
		fireflyImg.addColorStop(0.33, "rgba(66, 66, 66, 0.3)");
		fireflyImg.addColorStop(1, "transparent");
		ctx.globalCompositeOperation = "screen";
		ctx.fillStyle = fireflyImg;
		ctx.fillRect(x - selfSize / 2, y - selfSize / 2, selfSize, selfSize);
	};

	/** Renders a firefly onto the canvas. */
	this.renderFirefly = function(ffly) {
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

		if (ffly.x > SURVEYOR.viewportWidth)
			ffly.x = SURVEYOR.viewportWidth;
		else if (ffly.x < 0)
			ffly.x = 0;
		if (ffly.y > SURVEYOR.viewportHeight)
			ffly.y = SURVEYOR.viewportHeight;
		else if (ffly.y < 0)
			ffly.y = 0;
	};

	/** Renders an sprite onto the canvas. */
	this.renderSprite = function(spr) {
		ctx.scale(SURVEYOR.wScaleFactor, SURVEYOR.wScaleFactor);
		if (spr.img !== undefined) {
			if (spr.shadow !== undefined) { //TODO
				ctx.globalCompositeOperation = "source-atop";
				ctx.drawImage(spr.img, 2000 - spr.img.width - spr.x,
											2000*SURVEYOR.viewportHeight/SURVEYOR.viewportWidth - spr.img.height - spr.y);
				ctx.globalCompositeOperation = "destination-over";
				ctx.drawImage(spr.shadow, 2000 - spr.img.width - spr.x,
											2000*SURVEYOR.viewportHeight/SURVEYOR.viewportWidth - spr.img.height - spr.y);
			} else {
				ctx.globalCompositeOperation = spr.blendmode;
				ctx.drawImage(spr.img, 2000 - spr.img.width - spr.x,
											2000*SURVEYOR.viewportHeight/SURVEYOR.viewportWidth - spr.img.height - spr.y);
			}
		} else if (spr.frames !== undefined) {
			ctx.globalCompositeOperation = spr.blendmode;
			var img = spr.getFrame(SURVEYOR.timeElapsed).img;
			ctx.drawImage(img, 2000 - img.width - spr.x,
										2000*SURVEYOR.viewportHeight/SURVEYOR.viewportWidth - img.height - spr.y);
		} else {
			ctx.scale(1 / SURVEYOR.wScaleFactor, 1 / SURVEYOR.wScaleFactor);
			throw new TypeError("A sprite in the scene must be regular, lighted, or animated.");
		}
		ctx.scale(1 / SURVEYOR.wScaleFactor, 1 / SURVEYOR.wScaleFactor);
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
	};

	/** Handles window resizing (and basically anything else which requires
	* 	redrawing) */
	this.forceRedraw = function() {
		ctx.canvas.width = SURVEYOR.viewportWidth;
		ctx.canvas.height = SURVEYOR.viewportHeight;
		skyGradient = ctx.createLinearGradient(0, 0, 0, SURVEYOR.viewportHeight);
		skyGradient.addColorStop(0, "transparent");
		skyGradient.addColorStop(1, "rgba(203, 170, 237, 0.8)");
	};

	this.init = function() {
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		this.forceRedraw();
		document.getElementById("scene1")
			.addEventListener("mousemove", this.handleMouse, false);
	};
};