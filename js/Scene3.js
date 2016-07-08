"use strict";
/**
 * SURVEYOR Scene III
 */
SURVEYOR.Scene3 = function() {
  const DIR = "assets/3/";
  var canvas = document.getElementById("scene3-fg"),
      ctx = canvas.getContext("2d"),
      mouseX = SURVEYOR.viewportWidth / 2,
      mouseY = SURVEYOR.viewportHeight / 2,
      self = this,
      bgSprites = [
//				new SURVEYOR.Sprite(30, 180, {imgSrc: DIR + "test4.png"}),
//				new SURVEYOR.Sprite(100, 180, {imgSrc: DIR + "test3.png"}),
//				new SURVEYOR.Sprite(160, 180, {imgSrc: DIR + "test2.png"}),
//				new SURVEYOR.Sprite(220, 180, {imgSrc: DIR + "test1.png"}),
//				new SURVEYOR.Sprite(320, 180, {imgSrc: DIR + "test4.png"}),
//				new SURVEYOR.Sprite(440, 180, {imgSrc: DIR + "test3.png"}),
//				new SURVEYOR.Sprite(500, 180, {imgSrc: DIR + "test2.png"}),
//				new SURVEYOR.Sprite(710, 180, {imgSrc: DIR + "test1.png"}),
//				new SURVEYOR.Sprite(900, 180, {imgSrc: DIR + "test3.png"}),
//				new SURVEYOR.Sprite(999, 180, {imgSrc: DIR + "test2.png"})
      ],
      sprites = [
        new SURVEYOR.Sprite("0.5", "0.5", {
          name: "telephone",
          imgSrc: "assets/test2.png"
        })
      ],
      interactiveSpriteIndices = [0];

  /** Ticks everything. */
  this.tick = function() {
    if (SURVEYOR.isVisible[3]) {
      this.render();
    }
  };

  /** Renders all items. */
  this.render = function() {
    for (var i = 0, len = bgSprites.length; i < len; i++)
      this.renderSprite(bgSprites[i]);
    for (i = 0, len = sprites.length; i < len; i++)
      this.renderSprite(sprites[i]);
  };

  /**
   * Renders a sprite onto the canvas.
   * @param {Sprite} spr The sprite you want to render.
   */
  this.renderSprite = function(spr) {
    if (spr === null) return;

    var hSF = SURVEYOR.hScaleFactor,
        img,
        location = this.computeLocation(spr.x, spr.y),
        imgX = location.x,
        imgY = location.y;
    if (spr.frames === undefined) {
      img = spr.img;
      ctx.drawImage(img, ~~(imgX - img.width * hSF / 2),
                    ~~(imgY - img.height * hSF / 2),
                    img.width * spr.scale * hSF, img.height * spr.scale * hSF);
    } else {
      var frame = spr.getFrame(SURVEYOR.timeElapsed),
          sx, sy, swidth, sheight;
      img = frame.img;
      sx = frame.sx;
      sy = frame.sy;
      swidth = frame.swidth || frame.width;
      sheight = frame.sheight || frame.height;
      ctx.drawImage(img, sx, sy, swidth, sheight,
                    ~~(imgX - img.width * hSF / 2),
                    ~~(imgY - img.height * hSF / 2),
                    img.width * spr.scale * hSF, img.height * spr.scale * hSF);
    }
  };

  /**
   * Computes the location of a sprite (useful for rendering and collisions)
   *   For descriptions of x, y @see Sprite.js
   * @param {(number|string)} x x-coordinate
   * @param {(number|string)} y y-coordinate
   * @return {Object} With x and y fields, representing location relative to screen
   */
  this.computeLocation = function(sprX, sprY) {
    var vW = SURVEYOR.viewportWidth,
        hSF = SURVEYOR.hScaleFactor,
        imgX = (typeof sprX === "string" ?
                parseFloat(sprX) * vW :
                vW / 2 + (sprX - 1250) * hSF),
        imgY = (typeof sprY === "string" ?
                parseFloat(sprY) * SURVEYOR.viewportHeight :
                sprY * hSF);

    return {
      x: imgX,
      y: imgY
    };
  };

  /** Updates mouseX based on mouse movement. */
  this.handleMouse = function(e) {
    if (e.pageX !== undefined && e.pageY !== undefined) {
      mouseX = e.pageX;
      mouseY = e.pageY - SURVEYOR.viewportHeight * 2;
    } else {
      mouseX = e.clientX +
        document.body.scrollLeft + document.documentElement.scrollLeft;
      mouseY = e.clientY +
        document.body.scrollTop + document.documentElement.scrollTop;
    }
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;

    document.body.style.cursor =
      (self.checkClicked(mouseX, mouseY) !== null ? "pointer" : "default");
  };

  /** Handles clicks on the canvas. */
  this.handleClick = function(e) {
    var clickX = e.pageX,
        clickY = e.pageY - SURVEYOR.viewportHeight * 2;
    console.log("click@", clickX + ",", clickY +
                ",return:", self.checkClicked(clickX, clickY));
    switch (self.checkClicked(clickX, clickY)) {
      case "telephone":
        SURVEYOR.DialogManager.displayDialog(3, "telephone");
        break;
    }
  };

  /**
   * Checks to see if user's MouseEvent is over a sprite.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate relative to scene
   * @return {string} Name of element hit if the element has a name, otherwise
   *		returns null.
   */
  this.checkClicked = function(x, y) {
    var hSF = SURVEYOR.hScaleFactor;
    for (var i = interactiveSpriteIndices.length - 1; i >= 0; i--) {
      var spr = sprites[interactiveSpriteIndices[i]],
          img = spr.img || spr.getFrame(0).img,
          location = this.computeLocation(spr.x, spr.y),
          imgX = location.x - img.width * hSF / 2,
          imgY = location.y - img.height * hSF / 2;
      if (spr.name !== undefined &&
          x > imgX &&	x < imgX + img.width * hSF &&
          y > imgY && y < imgY + img.height * hSF &&
          $('.dialog:hover').length === 0) {
        return spr.name;
      }
    }
    return null;
  };

  /**
   * Handles window resizing (and basically anything else which requires
   * 	redrawing)
   */
  this.forceRedraw = function() {
    ctx.canvas.width = SURVEYOR.viewportWidth;
    ctx.canvas.height = SURVEYOR.viewportHeight;
  };

  /**
   * Initializes scene.
   */
  this.init = function() {
    ctx.mozImageSmoothingEnabled =
      ctx.webkitImageSmoothingEnabled =
      ctx.msImageSmoothingEnabled =
      ctx.imageSmoothingEnabled = false;
    this.forceRedraw();
    document.getElementById("scene3")
      .addEventListener("mousemove", this.handleMouse, false);
    document.getElementById("scene3")
      .addEventListener("click", this.handleClick, false);
  };

};
