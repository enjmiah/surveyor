"use strict";
SURVEYOR.Scene3 = function() {
	var canvas = document.getElementById("scene3-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = SURVEYOR.viewportWidth / 2,
			mouseY = SURVEYOR.viewportHeight / 2,
			journeyman = {
				x: 0,
				dx: 2,
				sprite: new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "test2.png"}),
				render: function() {
					ctx.drawImage(this.sprite.img, (SURVEYOR.viewportWidth - this.sprite.img.width) / 2 ,
												SURVEYOR.viewportHeight / 2);
				}
			},
			dog = {
				sprite: new SURVEYOR.Sprite(0, 0, {imgSrc: DIR + "test1.png"}),
				render: function() {
					ctx.drawImage(this.sprite.img, (SURVEYOR.viewportWidth - this.sprite.img.width) / 2,
												SURVEYOR.viewportHeight / 2);
				}
			},
			bgSprites = [new SURVEYOR.Sprite(30, 95, {imgSrc: DIR + "test4.png"}),
									new SURVEYOR.Sprite(100, 95, {imgSrc: DIR + "test3.png"}),
									new SURVEYOR.Sprite(160, 95, {imgSrc: DIR + "test2.png"}),
									new SURVEYOR.Sprite(220, 95, {imgSrc: DIR + "test1.png"}),
									new SURVEYOR.Sprite(320, 95, {imgSrc: DIR + "test4.png"}),
									new SURVEYOR.Sprite(440, 95, {imgSrc: DIR + "test3.png"}),
									new SURVEYOR.Sprite(500, 95, {imgSrc: DIR + "test2.png"}),
									new SURVEYOR.Sprite(710, 95, {imgSrc: DIR + "test1.png"}),
									new SURVEYOR.Sprite(900, 95, {imgSrc: DIR + "test3.png"}),
									new SURVEYOR.Sprite(999, 95, {imgSrc: DIR + "test2.png"})],
			sceneWidth = 1000,
			sprites = [];

	/** Ticks everything. */
	this.tick = function() {
		if (SURVEYOR.isVisible[3]) {
			ctx.clearRect(0, 0, SURVEYOR.viewportWidth, SURVEYOR.viewportHeight);

			if (mouseX < SURVEYOR.viewportWidth / 2) {
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
		var i,
				len = bgSprites.length;
		for (i = 0; i < len; i++)
			this.renderSprite(bgSprites[i]);
		journeyman.render();
		dog.render();
	};

	/** Renders a sprite onto the canvas.
	* @param {Sprite} spr The sprite you want to render. */
	this.renderSprite = function(spr) {
		if (spr.img !== undefined) {
			if (journeyman.x - 300 < spr.x && spr.x < journeyman.x + 1200) {
				ctx.drawImage(spr.img, spr.x - journeyman.x, spr.y);
			}
			if (journeyman.x - 300 < spr.x + sceneWidth &&
					spr.x + sceneWidth < journeyman.x + 1200) {
				ctx.drawImage(spr.img, spr.x + sceneWidth - journeyman.x, spr.y);
			}
			if (journeyman.x - 300 < spr.x + sceneWidth &&
					spr.x - sceneWidth < journeyman.x) {
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

	/**
	* Handles window resizing (and basically anything else which requires
	* 	redrawing)
	*/
	this.forceRedraw = function() {
		ctx.canvas.width = SURVEYOR.viewportWidth;
		ctx.canvas.height = SURVEYOR.viewportHeight;

		journeyman.sprite.x = SURVEYOR.viewportWidth / 2;
		journeyman.sprite.y = SURVEYOR.viewportHeight / 2;
		dog.sprite.x = SURVEYOR.viewportWidth / 2;
		dog.sprite.y = SURVEYOR.viewportHeight / 2;
	};

	this.init = function() {
		ctx.mozImageSmoothingEnabled = 
			ctx.webkitImageSmoothingEnabled = 
			ctx.msImageSmoothingEnabled = 
			ctx.imageSmoothingEnabled = false;
		this.forceRedraw();
		document.getElementById("scene3")
			.addEventListener("mousemove", this.handleMouse, false);
	};

};