"use strict";
/**
* SURVEYOR Scene II
*/
SURVEYOR.Scene2 = function() {
  var self = this,
      canvas = document.getElementById("scene2-fg"),
      ctx = canvas.getContext("2d"),
      mouseX = SURVEYOR.viewportWidth / 2,
      mouseY = SURVEYOR.viewportHeight / 2,
      x = mouseX,
      fire1Frames = new Array(173),
      fire2Frames = new Array(173),
      jarFrames = new Array(111), i;
  // Load all the frames
  for (i = 0; i < 173; i++)
    fire1Frames[i] =
      new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                                i * 33.333);

  for (i = 87; i < 173; i++)
    fire2Frames[i-87] =
      new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                                (i - 87) * 33.333);

  for (i = 0; i < 87; i++) {
    fire2Frames[i+86] =
      new SURVEYOR.Sprite.Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                                (i + 86) * 33.333);
  }
  for (i = 0; i < 111; i++) {
    jarFrames[i] =
      new SURVEYOR.Sprite.Frame(DIR + "2jarfirefly-ss.png",
                                i * 33.333, i * 122, 0, 122, 109);
  }
  var FIRE1_SPRITE = new SURVEYOR.Sprite(1235, "0.61", {
        frames: fire1Frames,
        length: 173 * 33.33333,
        depth: 70
      }),
      FIRE2_SPRITE = new SURVEYOR.Sprite(1235, "0.61", {
        frames: fire2Frames,
        length: 173 * 33.33333,
        depth: 70,
        name: "fire"
      }),
      FIRE1_INDEX = 7,
      FIRE2_INDEX = 8,
      FIREFLIES_INDEX = 9,
      JAR_INDEX = 10,
      sprites = [
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2mountains.png",
          depth: 10000
        }),
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2trees2.png",
          depth: 150
        }),
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2trees1.png",
          depth: 90
        }),
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2bank.png",
          depth: 70
        }),
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2onbank.png",
          depth: 70
        }),
        new SURVEYOR.Sprite(822, "0.78", {
          imgSrc: DIR + "2radio.png",
          depth: 70,
          name: "radio"
        }),
        new SURVEYOR.Sprite(1615, "0.64", {
          imgSrc: DIR + "2noah.png",
          depth: 70,
          name: "noah"
        }),
        null,
        null,
        new SURVEYOR.Sprite(1775, "0.785", {
          frames: jarFrames,
          depth: 70,
          length: 110 * 33.333,
          scale: 0.667
        }),
        new SURVEYOR.Sprite(1820, "0.79", {
          imgSrc: DIR + "2jar.png",
          depth: 70,
          name: "jar"
        }),
        new SURVEYOR.Sprite("0.5", "0.5", {
          imgSrc: DIR + "2overhang.png",
          depth: 5
        })
      ],
      FIREFLIES_AFTER_SPRITE = new SURVEYOR.Sprite(1750, "0.66", {
        frames: jarFrames,
        depth: 70,
        length: 110 * 33.333
      }),
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
    if (spr === null) return;

    var img, sx, sy, swidth, sheight,
        hSF = SURVEYOR.hScaleFactor;

    if (spr.img !== undefined) {
      img = spr.img;
    } else if (spr.frames !== undefined) {
      var frame = spr.getFrame(SURVEYOR.timeElapsed);
      img = frame.img;
      if (frame.isClipped) {
        sx = frame.sx;
        sy = frame.sy;
        swidth = frame.swidth;
        sheight = frame.sheight;
      }
    }

    if (!img)
      throw new TypeError("Sprite must have an image or frames.");
    else if (spr.depth === undefined)
      throw new TypeError("Sprite must have parallax field be defined.");

    var loc = this.computeLocation(spr.x, spr.y, spr.depth),
        imgX = loc.x,
        imgY = loc.y;
    if (sx === undefined) {
      ctx.drawImage(img, ~~(imgX - img.width * hSF / 2),
                    ~~(imgY - img.height * hSF / 2),
                    img.width * spr.scale * hSF, img.height * spr.scale * hSF);
    } else {
      ctx.drawImage(img, sx, sy, swidth, sheight,
                    ~~(imgX - swidth * hSF / 2), ~~(imgY - sheight * hSF / 2),
                    swidth * spr.scale * hSF, sheight * spr.scale * hSF);
    }
  };

  /**
  * Computes the location of a sprite (useful for rendering and collisions)
  *   For descriptions of x, y @see Sprite.js
  * @param {(number|string)} x x-coordinate
  * @param {(number|string)} y y-coordinate
  * @param {number} depth
  * @return {Object} With x and y fields, representing location relative to screen
  */
  this.computeLocation = function(sprX, sprY, depth) {
    var vW = SURVEYOR.viewportWidth,
        hSF = SURVEYOR.hScaleFactor;
    var imgX = (typeof sprX === "string" ?
                parseFloat(sprX) * vW :
                vW / 2 + (sprX - 1250) * hSF),
        imgY = (typeof sprY === "string" ?
                parseFloat(sprY) * SURVEYOR.viewportHeight :
                sprY * hSF);
    imgX = (imgX + 800 * (vW/2 - x) / (depth * vW));

    return {
      x: imgX,
      y: imgY
    };
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

    document.body.style.cursor =
      (self.checkClicked(mouseX, mouseY) !== null ? "pointer" : "default");
  };

  /** Handles clicks on the canvas. */
  this.handleClick = function(e) {
    var clickX = e.pageX,
        clickY = e.pageY - SURVEYOR.viewportHeight;
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
          location = this.computeLocation(spr.x, spr.y, spr.depth),
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
    document.getElementById("scene2")
      .addEventListener("mousemove", this.handleMouse, false);
    document.getElementById("scene2")
      .addEventListener("click", this.handleClick, false);
  };

};
