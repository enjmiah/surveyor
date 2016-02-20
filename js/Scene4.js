"use strict";
/**
* SURVEYOR Scene IV
*/
SURVEYOR.Scene4 = function() {
	const SURVEYOR_ASCEND_DAMPING = 100;
	var canvas = document.getElementById("scene4-fg"),
			ctx = canvas.getContext("2d"),
			mouseX = SURVEYOR.viewportWidth / 2,
			mouseY = SURVEYOR.viewportHeight / 2,
			surveyor = new SURVEYOR.Sprite("0.5", ~~(SURVEYOR.viewportHeight * 1.65),
														{imgSrc: DIR + "test1.png"});

	this.tick = function() {
		if (SURVEYOR.isVisible[4]) {
			surveyor.y -= (surveyor.y - (SURVEYOR.viewportHeight / 2)) / SURVEYOR_ASCEND_DAMPING;
			surveyor.y = clamp(surveyor.y, SURVEYOR.viewportHeight / 2, SURVEYOR.viewportHeight * 2);

			this.render();
		}
	};

	this.render = function() {
		ctx.clearRect(0, 0, SURVEYOR.viewportWidth, SURVEYOR.viewportHeight);

		ctx.drawImg(surveyor.img, Number(surveyor.x) * SURVEYOR.viewportWidth,
								surveyor.y + 15 * Math.sin(SURVEYOR.timeElapsed / 1700),
								"center", "center");
	};

	this.handleMouse = function() {
		//TODO:
	};

	/**
	* Handles window resizing (and basically anything else which requires
	* 	redrawing)
	*/
	this.forceRedraw = function() {
		ctx.canvas.width = SURVEYOR.viewportWidth;
		ctx.canvas.height = SURVEYOR.viewportHeight;
	};

	this.init = function() {
		ctx.mozImageSmoothingEnabled = 
			ctx.webkitImageSmoothingEnabled = 
			ctx.msImageSmoothingEnabled = 
			ctx.imageSmoothingEnabled = false;
		this.forceRedraw();
		document.getElementById("scene4")
			.addEventListener("mousemove", this.handleMouse, false);
	};
};