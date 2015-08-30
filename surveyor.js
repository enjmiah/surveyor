/*jslint plusplus: true*/
/*jshint latedef: nofunc*/
/*jshint strict: false*/
/*jshint -W117 */

var viewportWidth = viewport().width,
    viewportHeight = viewport().height,
    wScaleFactor = viewportWidth / 2000,
    hScaleFactor = viewportHeight / 1000,
    START_TIME = Date.now(),
    timeElapsed = 0,
    DIR = "assets/",
    NUM_STRIPS = 4, //TODO: update this num
    dialogManager = new DialogManager(),
    strip1 = new Strip1(),
    strip2 = new Strip2(),
    strip3 = new Strip3();

/**   ---------------------------   STRIP 1   ---------------------------
      ----------------------       fireflies       ----------------------   */
function Strip1() {
  var canvas = document.getElementById("strip1-fg"),
      ctx = canvas.getContext("2d"),
      mouseX = viewportWidth / 2,
      mouseY = viewportHeight / 2,
      x = mouseX, y = mouseY, i,
      dialogDisplayed = false,
      selfSize = 175,
      dSelfSize = 1.5,
      SELF_MAX_SIZE = 210,
      SELF_MIN_SIZE = 125,
      CIRCLE_RADIUS = 1.5,
      FFLY_ANG_SPEED = 1,
      FFLY_MAX_SIZE = 140,
      FFLY_MIN_SIZE = 60,
      followers = 0,
      skyGradient = ctx.createLinearGradient(0, 0, 0, viewportHeight);
  skyGradient.addColorStop(0, "transparent");
  skyGradient.addColorStop(1, "rgba(203, 170, 237, 0.8)");
  var starsImg = new Image();
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
      reed2Frames = [],
      carsFrames = [];
  for (i = 1; i <= 41; i++)
    carsFrames.push(new Frame(DIR + "cars" + zeroFill(i, 2) + ".gif", i * 33.333));
  for (i = 0; i < 4; i++)
    reed1Frames.push(new Frame("reed/" + "reed1" + zeroFill(i, 2) + ".png", i * 33.333));
  reed1Frames.push(new Frame("reed/" + "reed1" + "04" + ".png", 100));
  for (i = 0; i <= 33; i++) {
    reed1Frames.push(new Frame("reed/" + "reed1" + zeroFill(i, 2) + ".png",
                               (i - 1) * 33.333 + 100));
  }
  reed2Frames.push(new Frame("reed/" + "reed2" + "00" + ".png", 300));
  for (i = 1; i < 22; i++) {
    reed2Frames.push(new Frame("reed/" + "reed2" + zeroFill(i, 2) + ".png",
                               (i - 1) * 33.333 + 300));
  }
  reed2Frames.push(new Frame("reed/" + "reed2" + "22" + ".png", 100));
  for (i = 23; i <= 54; i++) {
    reed2Frames.push(new Frame("reed/" + "reed2" + i + ".png",
                               (i - 2) * 33.333 + 300 + 100));
  }
  var bgSprites =	[new Sprite(0, 0, {imgSrc: DIR + "rocks.png",
                                     blendmode: "destination-over"}),
                   new Sprite(0, 0, {imgSrc: DIR + "streetlights.png",
                                     blendmode: "destination-over"}),
                   new Sprite(0, 0, {frames: carsFrames,
                                     length: 5200,
                                     blendmode: "destination-over"})],
      lightedSprites = [new Sprite(0, 0, {imgSrc: DIR + "lighted.png",
                                          shadowImgSrc: DIR + "lighted-shadow.png"})],
      fgSprites = [new Sprite(0, 0, {frames: reed1Frames, length: 38 * 33.333 + 100}),
                  new Sprite(0, 0, {frames: reed2Frames, length: 52 * 33.333 + 400}),
                  new Sprite(0, 0, {imgSrc: DIR + "grass.png"})];

  /** Animates everything and deals with logic.
  *		Pauses when entire element is offscreen. */
  this.tick = function() {
    if (isVisible(1)) {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

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
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);

      ctx.translate(viewportWidth / 2, viewportHeight / 2);
      ctx.rotate(starsRotation);
      ctx.drawImage(starsImg, -viewportWidth * 1.5, -viewportHeight * 1.5,
                    viewportWidth * 3, viewportHeight * 3);
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
          dialogManager.displayDialog(1, "dialog1-1");
        }
      } else if (dialogDisplayed) {
        dialogDisplayed = false;
        dialogManager.restoreDialog(1);
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
    ctx.scale(wScaleFactor, wScaleFactor);
    if (spr.img !== undefined) {
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
    } else if (spr.frames !== undefined) {
      ctx.globalCompositeOperation = spr.blendmode;
      var img = spr.getFrame(timeElapsed).img;
      ctx.drawImage(img, 2000 - img.width - spr.x,
                    2000*viewportHeight/viewportWidth - img.height - spr.y);
    } else {
      ctx.scale(1 / wScaleFactor, 1 / wScaleFactor);
      throw new TypeError("A sprite in the scene must be regular, lighted, or animated.");
    }
    ctx.scale(1 / wScaleFactor, 1 / wScaleFactor);
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
    ctx.canvas.width = viewportWidth;
    ctx.canvas.height = viewportHeight;
    skyGradient = ctx.createLinearGradient(0, 0, 0, viewportHeight);
    skyGradient.addColorStop(0, "transparent");
    skyGradient.addColorStop(1, "rgba(203, 170, 237, 0.8)");
  };

  this.init = function() {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
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
      mouseY = viewportHeight / 2,
      x = mouseX,
      y = mouseY,
      fire1Frames = [],
      fire2Frames = [], i;
  for (i = 0; i < 173; i++) {
    fire1Frames.push(new Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                               i * 33.333));
  }
  for (i = 87; i < 173; i++) {
    fire2Frames.push(new Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                              (i - 87) * 33.333));
  }
  for (i = 0; i < 87; i++) {
    fire2Frames.push(new Frame(DIR + "fire/fire" + zeroFill(i, 3) + ".png",
                              (i + 86) * 33.333));
  }
  var FIRE1_SPRITE = new Sprite(1235, "0.61", {frames: fire1Frames, length: 6233.271,
                                               depth: 70}),
      FIRE2_SPRITE = new Sprite(1235, "0.61", {frames: fire2Frames, length: 6233.271,
                                               depth: 70, name: "fire"}),
      FIRE1_INDEX = 7,
      FIRE2_INDEX = 8,
      sprites = [new Sprite("0.5", "0.5", {imgSrc: DIR + "2mountains.png",
                                           depth: 10000}),
                 new Sprite("0.5", "0.5", {imgSrc: DIR + "2trees2.png", depth: 150}),
                 new Sprite("0.5", "0.5", {imgSrc: DIR + "2trees1.png", depth: 90}),
                 new Sprite("0.5", "0.5", {imgSrc: DIR + "2bank.png", depth: 70}),
                 new Sprite("0.5", "0.5", {imgSrc: DIR + "2onbank.png", depth: 70}),
                 new Sprite(822, "0.78", {imgSrc: DIR + "2radio.png", depth: 70,
                                          name: "radio"}),
                 new Sprite(1615, "0.64", {imgSrc: DIR + "2noah.png", depth: 70,
                                           name: "noah"}),
                 null,
                 null,
                 new Sprite("0.5", "0.5", {imgSrc: DIR + "2overhang.png", depth: 5})],
      interactiveSpriteIndices = [5, 6];

  /** Ticks everything. */
  this.tick = function() {
    if (isVisible(2)) {
      var difference = mouseX - x,
          i,
          len = sprites.length;
      if (Math.abs(difference) >= 1) {
        x += difference / 4;
        x = ~~(x + 0.5);
      }
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      for (i = 0; i < len; i++)
        this.renderSprite(sprites[i]);
    }
  };

  /** Renders a sprite onto the canvas. */
  this.renderSprite = function(spr) {
    if (spr !== null) {
      var img;
      ctx.scale(hScaleFactor, hScaleFactor);

      if (spr.img !== undefined)
        img = spr.img;
      else if (spr.frames !== undefined)
        img = spr.getFrame(timeElapsed).img;

      if (img === undefined) {
        ctx.scale(1 / hScaleFactor, 1 / hScaleFactor);
        throw new TypeError("Sprite must have an image or frames.");
      }

      if (spr.depth !== undefined) {
        var imgX = (typeof spr.x === "string" ? 
                    parseFloat(spr.x) * viewportWidth :
                    viewportWidth / 2 + (spr.x - 1250) * hScaleFactor),
            imgY = (typeof spr.y === "string" ?
                    parseFloat(spr.y) * viewportHeight :
                    spr.y * hScaleFactor);

        ctx.drawImage(img,
                      Math.round((imgX + 800 * (viewportWidth/2 - x) /
                                 (spr.depth * viewportWidth)) /
                                 hScaleFactor - img.width / 2),
                      Math.round(imgY / hScaleFactor - img.height / 2));
      } else {
        ctx.scale(1 / hScaleFactor, 1 / hScaleFactor);
        throw new TypeError("Sprite must have parallax fields be defined.");
      }

      ctx.scale(1 / hScaleFactor, 1 / hScaleFactor);
    }
  };
  
  /** Changes scene to night time. */
  this.changeToNight = function() {
    setOverlay(2, '#000000', {duration: 400, opacity: 1, callback: function() {
      sprites[FIRE1_INDEX] = FIRE1_SPRITE;
      sprites[FIRE2_INDEX] = FIRE2_SPRITE;
      interactiveSpriteIndices.push(FIRE2_INDEX);
    }});
    dialogManager.setOverlay(2, '#020204', {opacity: 0, duration: 400});
    $("#strip2").animate({backgroundColor: "#000000"}, 12000, "linear");
    dialogManager.setOverlay(2, '#020204', {opacity: 0.6, duration: 12000});
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
    mouseY -= viewportHeight;
    if (strip2.checkClicked(mouseX, mouseY) !== null) {
      document.body.style.cursor = "pointer";
    } else
      document.body.style.cursor = "default";
  };

  /** Handles clicks on the canvas. */
  this.handleClick = function(e) {
    var clickX = e.pageX,
        clickY = e.pageY - viewportHeight,
        i;
    console.log("click@ " + clickX + ", " + clickY + ", return: " + strip2.checkClicked(clickX, clickY));
    switch (strip2.checkClicked(clickX, clickY)) {
      case "radio":
        dialogManager.displayDialog(2, "radio");
        break;
      case "noah":
        dialogManager.displayDialog(2, "noah");
        break;
    } 
  };

  /** Checks to see if user's MouseEvent is over a sprite.
  * Returns name of element hit if the element has a name, otherwise returns null. */
  this.checkClicked = function(x, y) {
    for (i = 0; i < interactiveSpriteIndices.length; i++) {
      var spr = sprites[interactiveSpriteIndices[i]],
          imgX = (typeof spr.x === "string" ? 
                  parseFloat(spr.x) * viewportWidth :
                  viewportWidth / 2 + (spr.x - 1250) * hScaleFactor),
          imgY = (typeof spr.y === "string" ?
                  parseFloat(spr.y) * viewportHeight :
                  spr.y * hScaleFactor);
      
      if (spr.name !== undefined && spr.img !== undefined &&
          x > (imgX + 800 * (viewportWidth/2 - x) /
               (spr.depth * viewportWidth)) - spr.img.width * hScaleFactor / 2 &&
          x < (imgX + 800 * (viewportWidth/2 - x) /
               (spr.depth * viewportWidth)) + spr.img.width * hScaleFactor / 2 &&
          y > spr.y * viewportHeight - spr.img.height * hScaleFactor / 2 &&
          y < spr.y * viewportHeight + spr.img.height * hScaleFactor / 2 &&
          $('.dialog:hover').length === 0) {
        return spr.name;
      }
    }
    return null;
  };

  /** Handles window resizing (and basically anything else which requires
  * 	redrawing) */
  this.forceRedraw = function() {
    ctx.canvas.width = viewportWidth;
    ctx.canvas.height = viewportHeight;
  };

  this.init = function() {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.forceRedraw();
    document.getElementById("strip2")
      .addEventListener("mousemove", strip2.handleMouse, false);
    document.getElementById("strip2")
      .addEventListener("click", strip2.handleClick, false);
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
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    this.forceRedraw();
    document.getElementById("strip3")
      .addEventListener("mousemove", strip3.handleMouse, false);
  };

}


/** Stores chosen dialog paths and deals with displaying dialog functionality. */
function DialogManager() {
  var SHOW_ANIM_DURATION = 140,
      HIDE_ANIM_DURATION = 160,
      SHOW_TEXT_ANIM_DURATION = 1500,
      animQueue = $({}),
      history = {},
      stripStates = {},
      overlayAnimProgress = {}, i;
  for (i = 1; i <= NUM_STRIPS; i++) {
    stripStates[i] = false;
    overlayAnimProgress[i] = false;
  }

  /**
  * Stores a dialog choice.
  * @param {String} k A key to store a value.
  * @param {String | Boolean} v The value to store.
  */
  this.putChoice = function(k, v) {
    history[k] = v;
    refreshConditionalDisplay(k);
  };

  /**
  * Retrieves a dialog choice.
  * @param {String} k The key.
  */
  this.getChoice = function(k) {
    return history[k];
  };

  /**
  * Displays a dialog box for the strip specified.
  * @param {Num} strip The strip on which the dialog box should appear.
  * @param {Num} id The div id of the dialog box which should appear.
  */
  this.displayDialog = function(strip, id) {
    if (stripStates[strip] !== id) {
      var callback = function() {
        $("#" + id).slideDown(SHOW_ANIM_DURATION);
      },
          state = stripStates[strip];
      
      if (state !== false) {
        animQueue.finish().queue("fx", function() {
          $("#" + state).fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
        });
      } else {
        animQueue.finish().queue("fx", function() {
          $("#strip" + strip + "-text").fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
        });
      }
      stripStates[strip] = id;
      
      /*
      this.hideDialog(strip);

      animQueue.finish().queue("fx", function() {
        $("#" + id).slideDown(SHOW_ANIM_DURATION).dequeue();
      });*/
    }
  };

  /**
  * Hides dialog box for the strip specified.
  * @param {Num} strip The strip on which the dialog box should be cleared.
  */
  this.hideDialog = function(strip) {
    var state = stripStates[strip];
    
    if (state !== false) {
      animQueue.finish().queue("fx", function() {
        $("#" + state).fadeOut(HIDE_ANIM_DURATION).dequeue();
      });
    } else {
      animQueue.finish().queue("fx", function() {
        $("#strip" + strip + "-text").fadeOut(HIDE_ANIM_DURATION).dequeue();
      });
    }
  };

  /**
  * Restores initial text for the strip specified.
  * @param {Num} strip The strip which should be restored.
  */
  this.restoreDialog = function(strip) {
    var callback = function() {
      $("#strip" + strip + "-text").fadeIn(SHOW_TEXT_ANIM_DURATION);
    },
        state = stripStates[strip];
    
    if (state !== false) {
      animQueue.finish().queue("fx", function() {
        $("#" + state).fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
      });
    } else {
      animQueue.finish().queue("fx", function() {
        $("#strip" + strip + "-text").fadeOut(HIDE_ANIM_DURATION, callback).dequeue();
      });
    }
    /*
    this.hideDialog(strip);
    animQueue.finish().queue("fx", function() {
      $("#strip" + strip + "-text").fadeIn(SHOW_TEXT_ANIM_DURATION).dequeue();
    });
    */
    stripStates[strip] = false;
  };
  
  /**
  * Changes the overlay colour of a strip. Technically should be in a different
  * class, maybe.
  * @param strip {Num} The strip's overlay to animate.
  * @param colour {String} The colour to change it to.
  * @param options {Object} An object with any of the fields:
  *   opacity: {Num} Opacity (from 0 to 1).
  *   duration: {Num} Animation duration in ms. Defaults to 10000.
  *   callback: {Function} Function to call when animation completes.
  */
  this.setOverlay = function(strip, colour, options) {
    var duration = (options.duration === undefined ? 10000 : options.duration),
        opacity = (options.opacity === undefined ?
                   $("overlay" + strip).css("opacity") : options.opacity),
        callback = options.callback;
    
    if (!overlayAnimProgress[strip]) {
      if (duration < 1001)
        overlayAnimProgress[strip] = true;
      $("#overlay" + strip).finish().animate(
        {backgroundColor: colour, opacity: opacity}, duration, "linear",
        function() {callback(); overlayAnimProgress[strip] = false;}
      );
    } else {
      $("#overlay" + strip).animate(
        {backgroundColor: colour, opacity: opacity}, duration, "linear", callback
      );
    }
  };
}

/**
* A sprite to be drawn, with a variety of effects. Allows four types of
*		non-mutually exclusive behaviour: normal, lighted, animated, parallax.
* @param {Num | String} x The x position, from a point of origin. In most
*   strips you can use a string of a number ("0" : 0%; 1 : "100%") for 
*   positioning relative to viewportWidth.
* @param {Num | String} y The y position, from a point of origin. In most
*   strips you can use a string of a number ("0" : 0%; 1 : "100%") for 
*   positioning relative to viewportHeight.
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
  this.name = options.name;
  this.frames = options.frames;
  this.length = options.length;
  this.depth = options.depth;
  this.blendmode = options.blendmode === undefined ? "normal" : options.blendmode;
  if (this.frames !== undefined && this.length === undefined)
    throw new TypeError("Define a duration for the animation!");

  /** Gets the frame at the time specified. */
  this.getFrame = function(time) {
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
  if (timestamp === undefined)
    throw new TypeError("Define a timestamp for the frame!");
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

/** Resizes all the strips mainly. Calls forceRedraw() on each strip. */
function forceRedraw() {
  viewportWidth = viewport().width;
  viewportHeight = viewport().height;
  wScaleFactor = viewportWidth / 2000;
  hScaleFactor = viewportHeight / 1000;
  strip1.forceRedraw();
  strip2.forceRedraw();
  strip3.forceRedraw();
  //TODO: call forceRedraw() on all strips
}

/** Initialization code */
strip1.init();
strip2.init();
strip3.init();
/* strip4.init(); */
//TODO: call init() on all strips
window.addEventListener("resize", forceRedraw, false);
refreshConditionalDisplay();

function tickAll() {
  setTimeout(function() {
    window.requestAnimFrame(tickAll);
    timeElapsed = Date.now() - START_TIME;
    //strip1.tick();
    strip2.tick();
    //strip3.tick();
    //TODO: call tick() on all strips
  }, 1000 / 30);
}
tickAll();


/**   ----------------------------- HELPERS -----------------------------
      -------------------------------------------------------------------   */

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

/**
* requestAnimationFrame() shim by Paul Irish
* http://paulirish.com/2011/requestanimationframe-for-smart-animating
*/
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

/**
* Determine if a certain strip is visible in the viewport and should be ticked.
* @param {Int} Strip # to be evaluated. First strip is 1.
*/
function isVisible(strip) {
  var scroll = (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop,
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
* Pads a number with leading zeros. Useful for filenames generated automatically
*   by Adobe Photoshop. Source: http://gist.github.com/andrewrk/4382935
* @param {Int} number The number to be padded.
* @param {Int} size The size you want the number to be padded to.
*/
function zeroFill(number, size) {
  number = number.toString();
  while (number.length < size) number = "0" + number;
  return number;
}

/** Allows shorter method for calling dialogManager.displayDialog() */
function displayDialog(strip, id) {
  dialogManager.displayDialog(strip, id);
}

/** Allows shorter method for calling dialogManager.restoreDialog() */
function restoreDialog(strip) {
  dialogManager.restoreDialog(strip);
}

/** Allows shorter method for calling dialogManager.setOverlay() */
function setOverlay(strip, colour, opacity) {
  dialogManager.setOverlay(strip, colour, opacity);
}

/** Allows shorter method for calling dialogManager.putChoice() */
function putChoice(k, v) {
  dialogManager.putChoice(k, v);
  //TODO:
  console.log("Set " + k + " to " + dialogManager.getChoice(k));
}

/** Allows shorter method for calling dialogManager.getChoice() */
function getChoice(k) {
  return dialogManager.getChoice(k);
}

/**
* Makes sure all conditional displays are displaying or hiding properly.
* @param {String} cl The conditional display class to update. Leave empty to
*   update all.
*/
function refreshConditionalDisplay(cl) {
  console.log("Refreshed conditional text display!");
  if (cl === "needToLightFire" || cl === undefined) {
    $(".needToLightFire").toggle(getChoice("needToLightFire") === true);
    $(".notNeedToLightFire").toggle(getChoice("needToLightFire") !== true);
  }
  if (cl === "radioListen1" || cl === undefined) {
    $(".slept").toggle(getChoice("radioListen1") !== undefined);
    $(".notSlept").toggle(getChoice("radioListen1") === undefined);
    if (typeof cl === "string") return;
  }
  if (cl === "jarOpened" || cl === undefined) {
    $(".jarOpened").toggle(getChoice("jarOpened") === true);
    $(".notJarOpened").toggle(getChoice("jarOpened") !== true);
    if (typeof cl === "string") return;
  }
  if (cl === "fireLit" || cl === undefined) {
    $(".fireLit").toggle(getChoice("fireLit") === true);
    $(".notFireLit").toggle(getChoice("fireLit") !== true);
    if (typeof cl === "string") return;
  }
}

// TODO: remove in final code
function debug() {
  setInterval(function() {
    var str = "";
    if(isVisible(1))
      str += "1 ";
    if(isVisible(2))
      str += "2 ";
    if(isVisible(3))
      str += "3 ";
    if(isVisible(4))
      str += "4 ";
    //console.log("VISIBLE: " + str);
    //console.log("VW: " + viewportWidth + " VH: " + viewportHeight);
    //console.log(getChoice("radioListen1"));
  }, 3000);
}
//debug();


/**
* Like drawImage() but with support for different anchors.
* @param {Image} img The image to draw onscreen.
* @param {Num} x The x-position of the anchor.
* @param {Num} y The y-position of the anchor.
* @param {String} anchorX Accepts "left", "center", or "right".
* 	Is "left" by default.
* @param {String} anchorY Accepts "top", "center", or "bottom".
* 	Is "top" by default.
*/
//CanvasRenderingContext2D.drawImg = function(img, x, y, anchorX, anchorY) {
//  var imgX,
//      imgY;
//  switch (anchorX) {
//    case undefined:
//      imgX = x; break;
//    case "left":
//      imgX = x; break;
//    case "center":
//      imgX = x - img.width / 2; break;
//    case "right":
//      imgX = x - img.width; break;
//    default:
//      throw new Error("anchorX was not acceptable.");
//  }
//  switch (anchorY) {
//    case undefined:
//      imgY = y; break;
//    case "top":
//      imgY = y; break;
//    case "center":
//      imgY = y - img.height / 2; break;
//    case "bottom":
//      imgY = y - img.height; break;
//    default:
//      throw new Error("anchorY was not acceptable.");
//  }
//
//  CanvasRenderingContext2D.drawImage(img, imgX, imgY);
//};
